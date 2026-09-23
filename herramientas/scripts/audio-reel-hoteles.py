#!/usr/bin/env python3
"""Monta la pista del reel de hoteles: un corte por dentro y cola de musica.

Dos cosas que no se pueden hacer desde Remotion:

1. **El corte de 11,95 s.** Se van los "40 years younger than you" y "seeing
   people from all over the world", y con ellos la frase que los abria, que
   sola no se sostiene. Los dos extremos caen en silencio entre frases, pero
   la pista lleva voz y musica en el mismo canal, asi que la musica sí salta.
   Por eso la juntura va con fundido cruzado de verdad, usando material de
   los dos lados: se toma audio mas alla del corte, que no se usa para nada
   mas, y se mezcla con el arranque del tramo siguiente. Asi la longitud de
   cada tramo no cambia y la imagen no se descuadra.

2. **La cola.** El testimonio se acaba antes que la pieza, y la placa de
   marca no puede quedarse muda. La musica sale de los primeros segundos del
   master, que son de musica sola, y entra con otro fundido cruzado.

    python3 audio-reel-hoteles.py <carpeta de trabajo>
"""
import os
import subprocess
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from ambiente import SR, binarios  # noqa: E402

FF = binarios()
RAIZ = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))
MASTER = os.path.join(RAIZ, "video", "public", "montajes", "testimonios-EN.mp4")

A0, A1 = 15.30, 30.45      # el padre: lista de deseos, emocion, los 100 km
B0, B1 = 42.40, 70.80      # el equipaje y todo lo del hijo
COLA0, COLA1 = 1.50, 6.00  # musica sola del arranque del master
CRUCE = 0.40
CRUCE_COLA = 0.60
FIN = 47.55                # lo que dura la pieza entera


def main():
    destino = sys.argv[1] if len(sys.argv) > 1 else "."
    crudo = subprocess.run([FF, "-v", "error", "-i", MASTER, "-map", "0:a", "-ac", "2",
                            "-ar", str(SR), "-f", "f32le", "-"], capture_output=True).stdout
    a = np.frombuffer(crudo, np.float32).reshape(-1, 2)

    def t(x, y):
        return a[int(x * SR):int(y * SR)].copy()

    out = np.zeros((int(FIN * SR), 2), np.float32)

    def mete(desde, x):
        i = int(desde * SR)
        out[i:i + len(x)] = x[:len(out) - i]

    def cruza(desde, sale, entra, dur):
        n = min(int(dur * SR), len(sale), len(entra))
        r = np.linspace(0, 1, n)[:, None]
        i = int(desde * SR)
        out[i:i + n] = sale[:n] * (1 - r) + entra[:n] * r

    durA = A1 - A0
    durB = B1 - B0

    mete(0.0, t(A0, A1))
    mete(durA, t(B0, B1))
    mete(durA + durB - CRUCE_COLA, t(COLA0, COLA0 + (FIN - (durA + durB - CRUCE_COLA))))

    # 1 · el tramo del padre da paso al del equipaje
    cruza(durA, t(A1, A1 + CRUCE), t(B0, B0 + CRUCE), CRUCE)
    # 2 · el testimonio da paso a la musica de la cola
    cruza(durA + durB - CRUCE_COLA, t(B1 - CRUCE_COLA, B1),
          t(COLA0, COLA0 + CRUCE_COLA), CRUCE_COLA)

    # Entra y sale con un fundido corto: se empieza a mitad de la musica.
    n = int(0.45 * SR)
    out[:n] *= np.linspace(0, 1, n)[:, None]
    n = int(0.60 * SR)
    out[-n:] *= np.linspace(1, 0, n)[:, None]

    subprocess.run([FF, "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2",
                    "-i", "-", "-c:a", "pcm_s16le", f"{destino}/reel-hoteles.wav"],
                   input=out.tobytes(), check=True)
    print(f"listo: {destino}/reel-hoteles.wav  ({FIN:.2f} s)")
    print(f"  corte del padre al equipaje en {durA:.2f} s")
    print(f"  entra la musica de la cola en {durA + durB - CRUCE_COLA:.2f} s")


if __name__ == "__main__":
    main()
