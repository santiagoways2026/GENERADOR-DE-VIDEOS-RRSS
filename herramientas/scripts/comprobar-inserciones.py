#!/usr/bin/env python3
"""Comprueba que cada plano de recurso llega hasta donde se le pide.

Un `OffthreadVideo` al que se le pide más metraje del que tiene no falla: se
queda congelado en el último fotograma. En la pieza social en español eso
dejó 0,72 s de imagen parada en el segundo 46, y al verlo parecía un corte
mal hecho. No hay manera de que Remotion avise, así que se mide aquí.

    python3 comprobar-inserciones.py video/src/SWSocialCaminoES.tsx

Lee el array `INSERCIONES` de la escena, cuenta los fotogramas de cada
archivo y compara. Devuelve 1 si alguno se queda corto, para poder colgarlo
de un `npm run` o de CI.
"""
import os
import re
import subprocess
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from ambiente import binarios  # noqa: E402

FPS = 30
AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.normpath(os.path.join(AQUI, "..", ".."))
PUBLICO = os.path.join(RAIZ, "video", "public")


def redondea(s):
    """`Math.round` de JavaScript: el .5 sube siempre, tambien en negativos.
    El `round` de Python usa la regla del par y no da lo mismo."""
    import math
    return math.floor(s * FPS + 0.5)


def fotogramas(ff, ruta):
    salida = subprocess.run([ff, "-hide_banner", "-i", ruta, "-map", "0:v",
                             "-f", "null", "-"], capture_output=True, text=True).stderr
    m = re.findall(r"frame=\s*(\d+)", salida)
    if not m:
        sys.exit(f"no se puede leer {ruta}")
    return int(m[-1])


def main():
    if len(sys.argv) < 2:
        sys.exit("uso: comprobar-inserciones.py <escena.tsx>")
    ff = binarios()
    fuente = open(sys.argv[1], encoding="utf-8").read()

    # Las constantes de carpeta que usa la escena, del tipo `const B = "..."`.
    carpetas = dict(re.findall(r'const (\w+)\s*=\s*"([^"]*/)"', fuente))
    bloque = re.search(r"const INSERCIONES[^=]*=\s*\[(.*?)\n\];", fuente, re.S)
    if not bloque:
        sys.exit("no encuentro el array INSERCIONES")

    base = re.search(r'const BASE\s*=\s*"([^"]+)"', fuente)
    base = base.group(1) if base else None

    fallos = 0
    for linea in re.finditer(r"\{([^{}]*)\}", bloque.group(1)):
        c = linea.group(1)
        def campo(n, por_defecto=None):
            m = re.search(rf"\b{n}:\s*([0-9.]+)", c)
            return float(m.group(1)) if m else por_defecto
        desde, hasta, origen = campo("desde"), campo("hasta"), campo("origen", 0.0)
        nombre = (re.search(r'nombre:\s*"([^"]*)"', c) or [None, "?"])[1]
        fu = re.search(r"fuente:\s*(\w+)\s*\+\s*\"([^\"]+)\"", c)
        rel = carpetas.get(fu.group(1), "") + fu.group(2) if fu else base
        if rel is None:
            continue

        ruta = os.path.join(PUBLICO, rel)
        if not os.path.exists(ruta):
            print(f"  FALTA EL ARCHIVO  {rel}   ({nombre})")
            fallos += 1
            continue

        pide = redondea(origen) + (redondea(hasta) - redondea(desde))
        tiene = fotogramas(ff, ruta)
        holgura = tiene - pide
        estado = "ok" if holgura >= 0 else f"SE CONGELA {(-holgura) / FPS:.2f} s"
        print(f"  {nombre[:44]:46s} pide {pide:4d}  tiene {tiene:4d}  "
              f"holgura {holgura:4d}  {estado}")
        fallos += holgura < 0

    print("todo cabe" if not fallos else f"{fallos} inserción(es) se quedan cortas")
    return 1 if fallos else 0


if __name__ == "__main__":
    sys.exit(main())
