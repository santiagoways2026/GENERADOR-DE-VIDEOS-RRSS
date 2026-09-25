#!/usr/bin/env python3
"""Busca los tramos de la base que se ven menos de medio segundo.

`comprobar-inserciones.py` mide si cada plano llega hasta donde se le pide.
Esto mide lo contrario: qué se ve de la base **entre** inserción e inserción.
Un montaje de origen trae sus propios cortes, y al taparlo a trozos es muy
fácil dejar al aire el final de un plano o el principio del siguiente. A dos o
tres décimas eso no se lee como un plano, se lee como un parpadeo.

En la pieza social en español salieron tres: los 0,20 y 0,10 s de los dos
lados del corte del segundo peregrino, y 0,43 s entre dos planos de la
apertura. Los tres se arreglan igual, cuadrando la inserción con el límite de
plano de la base en vez de con un número redondo.

    python3 planos-visibles.py <escena.tsx> <base.mp4>

Los límites de plano de la base se detectan con la diferencia media entre
fotogramas consecutivos sobre una miniatura en gris: un corte pasa de 16 y el
movimiento normal no llega.

De paso compara cada inserción contra los planos de la base, que es el otro
error fácil: la biblioteca de recurso sale de estas mismas piezas, así que un
plano de `testimonios/` puede ser la toma que el montaje ya trae. En la pieza
social en español las maletas del portal eran la toma que la base volvía a
poner tres segundos después, 0,931 de parecido.
"""
import os
import re
import subprocess
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from ambiente import binarios  # noqa: E402

FPS = 30
CORTE = 16      # salto entre fotogramas que ya es un corte
MINIMO = 0.6    # por debajo de esto, parpadeo
IGUAL = 0.92    # de aqui arriba es la misma toma (regla 13)
DUDA = 0.85     # entre DUDA e IGUAL hay que mirarla


def planos(ff, ruta):
    raw = subprocess.run([ff, "-v", "error", "-i", ruta, "-vf",
                          f"fps={FPS},scale=64:36,format=gray", "-f", "rawvideo", "-"],
                         capture_output=True).stdout
    a = np.frombuffer(raw, np.uint8).reshape(-1, 36 * 64).astype(np.float32)
    d = np.abs(np.diff(a, axis=0)).mean(1)
    return [0.0] + [(i + 1) / FPS for i, x in enumerate(d) if x > CORTE] + [len(a) / FPS]


def firma(ff, ruta, ss=None, dura=None):
    """Mediana de nueve fotogramas: borra a la gente que cruza y deja el fondo."""
    cmd = [ff, "-v", "error"]
    if ss is not None:
        cmd += ["-ss", str(ss)]
    cmd += ["-i", ruta]
    if dura is not None:
        cmd += ["-t", str(dura)]
    cmd += ["-vf", "scale=48:27,format=gray", "-f", "rawvideo", "-"]
    raw = subprocess.run(cmd, capture_output=True).stdout
    a = np.frombuffer(raw, np.uint8).reshape(-1, 27 * 48).astype(np.float32)
    if not len(a):
        return None
    return np.median(a[np.linspace(0, len(a) - 1, min(9, len(a))).astype(int)], 0)


def parecido(a, b):
    a, b = a - a.mean(), b - b.mean()
    return float(a @ b / (np.linalg.norm(a) * np.linalg.norm(b) + 1e-9))


def repetidas(ff, escena, base, cortes, ins):
    """Cada inserción contra cada plano de la base."""
    planos_base = [(a, b, x) for a, b, x in
                   ((a, b, firma(ff, base, a, b - a))
                    for a, b in zip(cortes[:-1], cortes[1:]) if b - a >= 0.25)
                   if x is not None]
    if not planos_base:
        sys.exit(f"no se lee ningun plano de {base}")
    raiz = os.path.join(os.path.dirname(os.path.abspath(escena)), "..", "public")
    fallos = 0
    for desde, _hasta, fuente in ins:
        if not fuente:
            continue
        ruta = os.path.join(raiz, fuente)
        if not os.path.exists(ruta):
            # Callarse aqui deja el aviso mudo y parece que no hay repetidas.
            print(f"  SIN ARCHIVO  {desde:6.2f}  {fuente}")
            fallos += 1
            continue
        s = firma(ff, ruta)
        if s is None:
            continue
        p, a0, b0 = max((parecido(s, x), a, b) for a, b, x in planos_base)
        if p >= DUDA:
            aviso = "REPETIDA" if p >= IGUAL else "  DUDOSA"
            print(f"  {aviso}  {desde:6.2f}  {fuente}  ya esta en la base "
                  f"{a0:.2f}-{b0:.2f}  ({p:.3f})")
            fallos += p >= IGUAL
    return fallos


def main():
    if len(sys.argv) < 3:
        sys.exit("uso: planos-visibles.py <escena.tsx> <base.mp4>")
    ff = binarios()
    base = planos(ff, sys.argv[2])
    fuente = open(sys.argv[1], encoding="utf-8").read()
    rutas = dict(re.findall(r'^const (\w+) = "([^"]*/)";', fuente, re.M))
    ins = []
    for linea in re.findall(r"\{ desde:.*?\}", fuente):
        d = re.search(r"desde: ([\d.]+), hasta: ([\d.]+)", linea)
        f = re.search(r'fuente: (\w+) \+ "([^"]+)"', linea)
        ins.append((float(d.group(1)), float(d.group(2)),
                    rutas.get(f.group(1), "") + f.group(2) if f else None))
    ins.sort()

    libres, t = [], 0.0
    for x, y, _f in ins:
        if x > t:
            libres.append((t, x))
        t = max(t, y)
    if t < base[-1]:
        libres.append((t, base[-1]))

    fallos = repetidas(ff, sys.argv[1], sys.argv[2], base, ins)
    for x, y in libres:
        trozos = [c for c in base if x < c < y]
        for a0, b0 in zip([x] + trozos, trozos + [y]):
            # Menos de un fotograma no se ve: es que la inserción cuadra
            # justo con el límite de plano, que es lo que se busca.
            if 1 / FPS <= b0 - a0 < MINIMO:
                print(f"  PARPADEO  {a0:6.2f} - {b0:6.2f}   ({b0 - a0:.2f} s)")
                fallos += 1
    print("nada que arreglar" if not fallos else f"{fallos} aviso(s)")
    return 1 if fallos else 0


if __name__ == "__main__":
    sys.exit(main())
