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


def planos(ff, ruta):
    raw = subprocess.run([ff, "-v", "error", "-i", ruta, "-vf",
                          f"fps={FPS},scale=64:36,format=gray", "-f", "rawvideo", "-"],
                         capture_output=True).stdout
    a = np.frombuffer(raw, np.uint8).reshape(-1, 36 * 64).astype(np.float32)
    d = np.abs(np.diff(a, axis=0)).mean(1)
    return [0.0] + [(i + 1) / FPS for i, x in enumerate(d) if x > CORTE] + [len(a) / FPS]


def main():
    if len(sys.argv) < 3:
        sys.exit("uso: planos-visibles.py <escena.tsx> <base.mp4>")
    ff = binarios()
    base = planos(ff, sys.argv[2])
    fuente = open(sys.argv[1], encoding="utf-8").read()
    ins = sorted((float(x), float(y)) for x, y in
                 re.findall(r"desde: ([\d.]+), hasta: ([\d.]+)", fuente))

    libres, t = [], 0.0
    for x, y in ins:
        if x > t:
            libres.append((t, x))
        t = max(t, y)
    if t < base[-1]:
        libres.append((t, base[-1]))

    fallos = 0
    for x, y in libres:
        trozos = [c for c in base if x < c < y]
        for a0, b0 in zip([x] + trozos, trozos + [y]):
            # Menos de un fotograma no se ve: es que la inserción cuadra
            # justo con el límite de plano, que es lo que se busca.
            if 1 / FPS <= b0 - a0 < MINIMO:
                print(f"  PARPADEO  {a0:6.2f} - {b0:6.2f}   ({b0 - a0:.2f} s)")
                fallos += 1
    print("ningun parpadeo" if not fallos else f"{fallos} tramo(s) de menos de {MINIMO} s")
    return 1 if fallos else 0


if __name__ == "__main__":
    sys.exit(main())
