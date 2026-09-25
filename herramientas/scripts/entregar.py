#!/usr/bin/env python3
"""Prepara un render de Remotion para entregarlo, y de paso le cuadra el audio.

**Un render de Remotion sale con el audio 43 ms por detras de la imagen.** Son
2048 muestras a 48 kHz, que es el retardo de arranque del codificador AAC, dos
tramas de 1024. Remotion no lo compensa y el contenedor no lo corrige: la
lista de edicion del mp4 no lo recoge, asi que decodificando con o sin ella el
desfase es el mismo.

Se midio comparando el render con su propio montaje de origen: la imagen casa
en el fotograma cero y el audio en +2048 muestras, exactamente igual en dos
piezas distintas. 43 ms es el umbral en el que un espectador entrenado empieza
a notar que el audio va detras (ITU-R BT.1359), asi que en un testimonio, que
es todo caras hablando, conviene quitarlo. Y sale gratis: basta tirar las 2048
primeras muestras, que son el propio arranque del codificador.

    python3 entregar.py render.mp4 [--crf 20]

Deja al lado el archivo con el audio cuadrado y una copia comprimida para
revisar, que el chat no admite mas de 30 MiB por archivo.
"""
import argparse
import os
import subprocess
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from ambiente import binarios  # noqa: E402

# 2048 muestras a 48 kHz: el arranque del codificador AAC, dos tramas de 1024.
RETARDO = 2048 / 48000


def main():
    p = argparse.ArgumentParser()
    p.add_argument("render")
    p.add_argument("--crf", type=int, default=20, help="calidad de la copia para revisar")
    p.add_argument("--sin-comprimir", action="store_true", help="solo cuadra el audio")
    a = p.parse_args()

    ff = binarios()
    raiz, ext = os.path.splitext(a.render)
    cuadrado = f"{raiz} (cuadrado){ext}"

    # Solo el audio se vuelve a codificar; la imagen se copia tal cual.
    subprocess.run([ff, "-y", "-v", "error", "-i", a.render, "-c:v", "copy",
                    "-af", f"atrim=start={RETARDO:.7f},asetpts=PTS-STARTPTS",
                    "-c:a", "aac", "-b:a", "256k", "-movflags", "+faststart",
                    cuadrado], check=True)
    print(f"audio adelantado {RETARDO * 1000:.1f} ms -> {cuadrado}")

    if a.sin_comprimir:
        return 0

    revision = f"{raiz} (comprimido){ext}"
    subprocess.run([ff, "-y", "-v", "error", "-i", cuadrado, "-c:v", "libx264",
                    "-crf", str(a.crf), "-preset", "slow", "-c:a", "aac",
                    "-b:a", "160k", "-movflags", "+faststart", revision], check=True)
    mib = os.path.getsize(revision) / 1024 / 1024
    print(f"copia para revisar: {revision} ({mib:.1f} MiB)"
          + ("   OJO: pasa de 30 MiB" if mib > 30 else ""))
    return 0


if __name__ == "__main__":
    sys.exit(main())
