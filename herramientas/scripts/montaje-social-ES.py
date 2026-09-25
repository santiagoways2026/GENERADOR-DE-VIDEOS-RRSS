#!/usr/bin/env python3
"""Rehace la base de la pieza social en español, `social-ES-v4.mp4`.

Una sola cosa que cambia la duración, y por eso va aquí y no en Remotion, que
sólo sustituye imagen: **se va el tramo 19,90-25,00 del montaje**. Ahí habla
un segundo peregrino al que no se ve en ningún momento, porque el plano que le
daba el montaje original cayó con el recorte anterior, y una voz sin cara suena
a error. Son 5,10 s.

El corte cae en silencio por los dos lados: la frase de antes acaba en 19,52 y
la de después empieza en 25,16. Aun así la juntura va con fundido cruzado de
potencia constante, que pegando a hueso hay chasquido.

## Por qué ya no hay camas de ambiente

Las versiones anteriores metían tres segundos de ambiente por delante y siete
en el hueco del alojamiento, sintetizados a partir de la huella espectral de
los silencios. **Sonaban a eco**, y con razón: sintetizar con fase aleatoria
dispersa la fase, que es literalmente lo que hace un reverberador.

Lo siguiente que se probó fue pegar silencios de verdad del master. No llega:
medidos con VAD y filtrados por factor de cresta, en los 57,3 s del limpio hay
**2,71 s** de ambiente aprovechable, y harían falta 10,3. Repetirlo cuatro
veces es el bucle que avisa la regla 11.

Así que no se rellena nada: los diez segundos sin voz se van, y la pieza dura
lo que dura el testimonio. Los planos de apertura y de alojamiento que antes
vivían en esos huecos siguen en la pieza, pero ya como inserciones de Remotion
sobre la voz, que es donde tenían que haber estado.

    python3 montaje-social-ES.py <carpeta con social-ES.mp4>
"""
import os
import subprocess
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from ambiente import SR, leer, binarios  # noqa: E402

FF = binarios()
AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.normpath(os.path.join(AQUI, "..", ".."))

CORTE_A = 19.90     # sale del montaje, dentro del silencio 19,52-20,45
CORTE_B = 25.00     # vuelve al montaje, dentro del silencio 24,92-25,16
FIN = 47.16
CRUCE = 0.12


def video(S):
    """Los dos tramos del montaje, pegados. Sin audio."""
    filtros = [
        f"[0:v]trim=0:{CORTE_A},setpts=PTS-STARTPTS,fps=fps=30,setsar=1,format=yuv420p[vA]",
        f"[0:v]trim={CORTE_B}:{FIN},setpts=PTS-STARTPTS,fps=fps=30,setsar=1,format=yuv420p[vB]",
        "[vA][vB]concat=n=2:v=1:a=0[v]",
    ]
    subprocess.run([FF, "-v", "warning", "-y", "-i", f"{S}/social-ES.mp4",
                    "-filter_complex", ";".join(filtros), "-map", "[v]",
                    "-c:v", "libx264", "-crf", "16", "-preset", "slow",
                    "-pix_fmt", "yuv420p", "-colorspace", "bt709",
                    "-color_primaries", "bt709", "-color_trc", "bt709",
                    "-an", f"{S}/_v.mp4"], check=True)


def audio(S):
    """Los dos tramos, con la juntura en fundido cruzado de potencia constante.

    En raíz y no lineal: los dos lados son ambiente distinto y no están
    correlacionados, asi que lo que se conserva es la potencia. Con ganancias
    lineales se restan en mitad del cruce y dejan un bache.
    """
    a = leer(FF, f"{S}/social-ES.mp4")
    canales = a.shape[1]

    def tramo(x, y):
        return a[int(x * SR):int(y * SR)]

    A, B = tramo(0.0, CORTE_A), tramo(CORTE_B, FIN)
    out = np.concatenate([A, B]).astype(np.float32)

    n = int(CRUCE * SR)
    r = np.linspace(0, 1, n)[:, None]
    i = len(A)
    # El lado que se apaga sale del ambiente de detrás del corte, que no se
    # usa para nada más y es la misma sala.
    sale = tramo(CORTE_A, CORTE_A + CRUCE)[:n]
    out[i:i + n] = sale * np.sqrt(1 - r) + B[:n] * np.sqrt(r)

    subprocess.run([FF, "-v", "error", "-y", "-f", "f32le", "-ar", str(SR),
                    "-ac", str(canales), "-i", "-", "-c:a", "pcm_s16le",
                    f"{S}/_a.wav"], input=out.tobytes(), check=True)
    return len(out) / SR


def main():
    S = sys.argv[1] if len(sys.argv) > 1 else os.path.join(RAIZ, "video", "public", "montajes")
    video(S)
    dura = audio(S)
    subprocess.run([FF, "-v", "error", "-y", "-i", f"{S}/_v.mp4", "-i", f"{S}/_a.wav",
                    "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
                    "-movflags", "+faststart", "-shortest",
                    f"{S}/social-ES-v4.mp4"], check=True)
    for t in ("_v.mp4", "_a.wav"):
        os.remove(f"{S}/{t}")
    print(f"listo: {S}/social-ES-v4.mp4  ({dura:.2f} s)")
    print(f"  fuera el tramo {CORTE_A:.2f}-{CORTE_B:.2f} del montaje, {CORTE_B - CORTE_A:.2f} s")


if __name__ == "__main__":
    main()
