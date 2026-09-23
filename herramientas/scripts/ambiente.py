#!/usr/bin/env python3
"""Construye una cama de ambiente con los silencios del propio montaje.

Cuando un bloque se monta sin voz, planos de recurso o una apertura, hace
falta algo debajo o el corte suena a mute. Si la pieza no lleva música, meter
una sólo en ese tramo suena a parche: lo que funciona es ambiente de la misma
grabación.

Se cogen los huecos entre frases, se encadenan en palíndromo (hacia delante y
hacia atrás) y se cruzan con fundidos, que es lo que evita el tic del bucle.

    python3 ambiente.py montaje.mp4 cama.wav 7.0  0.05,0.62 19.62,20.42

Los huecos hay que elegirlos midiendo, no de oído. En la pieza social en
español uno medía lo mismo que la voz y tenía un pico de 0,88: era una
respiración, y colada en la cama sonaba a que había alguien andando por la
habitación del hotel. Sirve el factor de cresta, pico entre rms: por debajo de
5 es ambiente, por encima hay algo dentro.
"""
import os
import shutil
import subprocess
import sys

import numpy as np

SR = 44100
CRUCE_S = 0.12
ENTRADA_S = 0.08


def binarios():
    """El ffmpeg completo. El de Remotion es una compilación recortada."""
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError:
        pass
    ff = shutil.which("ffmpeg")
    if ff:
        return ff
    aqui = os.path.dirname(os.path.abspath(__file__))
    cand = os.path.join(aqui, "..", "..", "video", "node_modules", "@remotion",
                        "compositor-linux-x64-gnu", "ffmpeg")
    if os.path.exists(cand):
        return cand
    sys.exit("no hay ffmpeg: pip install imageio-ffmpeg")


def pega(p, q, cruce):
    """Encadena dos trozos con un fundido cruzado."""
    n = min(cruce, len(p) // 2, len(q) // 2)
    r = np.linspace(0, 1, n)[:, None]
    return np.concatenate([p[:-n], p[-n:] * (1 - r) + q[:n] * r, q[n:]])


def cama(audio, huecos, segundos):
    trozos = [audio[int(x * SR):int(y * SR)] for x, y in huecos]
    cruce = int(CRUCE_S * SR)
    salida, i = trozos[0], 1
    while len(salida) < segundos * SR + 2 * cruce:
        t = trozos[i % len(trozos)]
        # Uno de cada dos va del revés: el ambiente no tiene dirección, y así
        # el bucle no se oye repetir.
        salida = pega(salida, t if i % 2 else t[::-1], cruce)
        i += 1
    salida = salida[:int(segundos * SR)].copy()

    n = int(ENTRADA_S * SR)
    salida[:n] *= np.linspace(0, 1, n)[:, None]
    salida[-n:] *= np.linspace(1, 0, n)[:, None]
    # Red de seguridad: un pico que se haya colado se dobla en vez de
    # recortarse, que es lo que suena a chasquido.
    return np.tanh(salida * 3.0) / 3.0


def main():
    if len(sys.argv) < 5:
        sys.exit("uso: ambiente.py entrada.mp4 cama.wav segundos x1,y1 x2,y2 ...")
    ff = binarios()
    src, destino, segundos = sys.argv[1], sys.argv[2], float(sys.argv[3])
    huecos = [tuple(float(v) for v in a.split(",")) for a in sys.argv[4:]]

    crudo = subprocess.run([ff, "-v", "error", "-i", src, "-ac", "2", "-ar", str(SR),
                            "-f", "f32le", "-"], capture_output=True).stdout
    a = np.frombuffer(crudo, np.float32).reshape(-1, 2)

    c = cama(a, huecos, segundos)
    print(f"cama de {segundos:.2f} s, pico {float(np.abs(c).max()):.4f}, "
          f"rms {float(np.sqrt((c ** 2).mean())):.5f}")
    subprocess.run([ff, "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2",
                    "-i", "-", "-c:a", "pcm_s16le", destino],
                   input=c.astype(np.float32).tobytes(), check=True)


if __name__ == "__main__":
    main()
