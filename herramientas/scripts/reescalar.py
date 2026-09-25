#!/usr/bin/env python3
"""Sube un clip a la resolución de entrega, limpiándolo antes.

Los clips que vuelven de un editor online llegan a lo que les da la gana: el
primer short vino a 720x1280 y el segundo a 360x640 con 363 kb/s, que es una
novena parte del lienzo de entrega. Remotion los ampliaría igual, pero con el
escalado del navegador y sobre el bloqueo de la compresión.

**El orden importa y es este**: limpiar, ampliar, y sólo después afilar.

- `hqdn3d` va **antes** de ampliar. A bitrate bajo la imagen trae bloques de
  8x8 y ruido de cuantización; si se amplía primero, cada bloque pasa a medir
  24 píxeles y ya no hay filtro que lo distinga de la imagen. Limpiando antes,
  el filtro trabaja sobre el bloque a su tamaño real.
- `lanczos` para ampliar, que es el que mejor conserva el borde fino. Con el
  bicúbico por defecto las ramas de un árbol contra el cielo salen blandas.
- `unsharp` flojo y **después** de ampliar, sólo para devolver el filo que se
  come la interpolación. Subirlo saca a relucir lo que acaba de taparse.

Comprobado en el short de la duración: con `lanczos` a secas las ramas salían
blandas, y con `unsharp` solo, sin limpiar antes, aparecía el crujido de los
bloques. Con los tres en este orden sale lo mejor que da ese archivo.

**Esto no inventa detalle.** Ampliar tres veces se nota y hay que decirlo: si
aparece el original a más resolución, se rehace la base y la pieza gana sola.

    python3 reescalar.py entrada.mp4 salida.mp4
    python3 reescalar.py entrada.mp4 salida.mp4 --alto 1080 --ancho 1920
    python3 reescalar.py entrada.mp4              # sólo mide y dice qué haría
"""
import argparse
import os
import re
import subprocess
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from ambiente import binarios  # noqa: E402


def medidas(ff, src):
    """Ancho, alto y bitrate de vídeo del archivo, leídos del propio ffmpeg."""
    txt = subprocess.run([ff, "-hide_banner", "-i", src],
                         capture_output=True).stderr.decode()
    m = re.search(r"Video:.*?(\d{2,5})x(\d{2,5})", txt)
    if not m:
        sys.exit(f"no se puede leer el tamaño de {src}")
    ancho, alto = int(m.group(1)), int(m.group(2))
    b = re.search(r"Video:.*?(\d+) kb/s", txt)
    return ancho, alto, int(b.group(1)) if b else None


def main():
    p = argparse.ArgumentParser()
    p.add_argument("entrada")
    p.add_argument("salida", nargs="?")
    p.add_argument("--ancho", type=int, default=1080)
    p.add_argument("--alto", type=int, default=1920)
    p.add_argument("--crf", type=int, default=17)
    p.add_argument("--sin-limpiar", action="store_true",
                   help="salta el hqdn3d; para originales que ya vienen finos")
    a = p.parse_args()

    ff = binarios()
    ancho, alto, kbps = medidas(ff, a.entrada)
    factor = a.alto / alto
    print(f"  {ancho}x{alto}" + (f", {kbps} kb/s" if kbps else ""))
    print(f"  destino {a.ancho}x{a.alto}   factor {factor:.2f}")

    if abs(ancho / alto - a.ancho / a.alto) > 0.01:
        print("  OJO: la proporción no coincide, el destino deformaría la imagen")
    if factor <= 1.01:
        print("  no hace falta ampliar: el original ya llega")
    elif factor >= 2.5:
        print("  OJO: ampliación de más de dos veces y media. Se nota, y hay que")
        print("       decirlo. Si existe el original a más resolución, mejor ése")

    filtros = [] if a.sin_limpiar else ["hqdn3d=2:1:3:3"]
    filtros += [f"scale={a.ancho}:{a.alto}:flags=lanczos"]
    if factor > 1.01:
        filtros += ["unsharp=5:5:0.5:5:5:0.0"]
    cadena = ",".join(filtros)

    if not a.salida:
        print(f"\n  haría:  -vf \"{cadena}\"")
        return 0

    subprocess.run([ff, "-y", "-v", "error", "-i", a.entrada, "-vf", cadena,
                    "-c:v", "libx264", "-crf", str(a.crf), "-preset", "medium",
                    "-pix_fmt", "yuv420p", "-colorspace", "bt709",
                    "-color_primaries", "bt709", "-color_trc", "bt709",
                    "-c:a", "copy", "-movflags", "+faststart", a.salida],
                   check=True)
    n, _, _ = medidas(ff, a.salida)
    print(f"\n  {a.salida}  ({os.path.getsize(a.salida) / 1e6:.1f} MB)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
