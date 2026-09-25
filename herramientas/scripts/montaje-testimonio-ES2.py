#!/usr/bin/env python3
"""Acorta el testimonio de la pareja y deja el archivo que usa la escena.

Son cambios que mueven la duracion, asi que no se pueden hacer con
sustituciones de imagen desde Remotion: hay que rehacer el archivo.

Se quitan tres tramos, los tres por las razones de la regla 7, y los tres
**cortando por el silencio entre frases**, no por donde interesaba:

1. **13,60 - 17,70.** "y nada, conforme llevamos", que se queda a medias y no
   dice nada. Deja "contactamos hace bastante tiempo" pegado a "Todo
   fenomenal".
2. **31,22 - 37,70.** "es facil que... y esperemos que no, tocaremos
   madera... pero es posible, tener eso es muy...". Es la broma de tocar
   madera y el titubeo que viene detras. Al quitarla queda "una peregrinacion
   requiere esfuerzos y" pegado a "bueno, nos da mucha tranquilidad", que es
   como se hablaria si no hubiera habido broma: "y bueno".
3. **57,46 - 59,95.** "contariamos con ellos", que es la misma idea que el
   "asi que contaremos con ellos" del final, seis segundos despues. Se queda
   el del final, que es el que cierra.

Son 13,07 s de 64,98. El montaje se queda en 51,91.

El audio de esta pieza **no lleva musica**: los seis huecos sin voz miden
entre -35,6 y -38,6 dB y lo que hay es viento y sala, sin cuerpo en medios.
Asi que las junturas no necesitan la rampa de nivel ni el cuadre de pulso de
la regla 17, que son para pistas con musica mezclada. Sí llevan fundido
cruzado de verdad, con material de los dos lados y ganancias en raiz: pegando
a hueso hay chasquido, y con ganancias lineales dos trozos de sala sin
correlacionar se restan y dejan un bache de 3 dB en mitad del cruce.

El lado que se apaga sale de **dentro del propio hueco**, no de detras del
corte: un fundido cruzado arranca ese lado a volumen entero, asi que tomarlo
de despues devolveria justo la frase que se acaba de quitar.

    python3 montaje-testimonio-ES2.py
"""
import os
import subprocess
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from ambiente import binarios  # noqa: E402

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.join(AQUI, "..", "..")
ENTRADA = os.path.join(RAIZ, "video", "public", "montajes", "testimonio-ES2.mp4")
SALIDA = os.path.join(RAIZ, "video", "public", "montajes", "testimonio-ES2-corto.mp4")

SR = 48000
FPS = 30

# (sale, vuelve). Los dos extremos caen dentro de un hueco sin voz.
CORTES = [(13.60, 17.70), (31.22, 37.70), (57.46, 59.95)]
FIN = 64.98
# El hueco mas corto de los tres mide 0,12 s, asi que el cruce cabe en todos.
CRUCE = 0.10


def pista(ff, ruta):
    crudo = subprocess.run([ff, "-v", "error", "-i", ruta, "-ac", "2",
                            "-ar", str(SR), "-f", "f32le", "-"],
                           capture_output=True).stdout
    return np.frombuffer(crudo, np.float32).reshape(-1, 2).copy()


def cruza(sale, entra):
    """Fundido cruzado a potencia constante."""
    n = min(len(sale), len(entra))
    r = np.linspace(0, 1, n)[:, None]
    return sale[:n] * np.sqrt(1 - r) + entra[:n] * np.sqrt(r)


def audio(ff):
    a = pista(ff, ENTRADA)
    m = lambda s: int(round(s * SR))  # noqa: E731
    n = m(CRUCE)

    trozos = []
    desde = 0.0
    for sale, vuelve in CORTES:
        trozos.append(a[m(desde):m(sale)])
        # El lado que se apaga, sacado del hueco que hay justo despues del
        # corte; el que entra, del hueco donde se retoma.
        trozos.append(cruza(a[m(sale):m(sale) + n], a[m(vuelve):m(vuelve) + n]))
        desde = vuelve + CRUCE
    trozos.append(a[m(desde):m(FIN)])
    return np.concatenate(trozos)


def video(ff, salida_audio):
    lista = os.path.join(os.path.dirname(SALIDA), "_trozos.txt")
    partes = []
    desde = 0.0
    for sale, vuelve in CORTES:
        partes.append((desde, sale))
        desde = vuelve
    partes.append((desde, FIN))

    temp = []
    for i, (x, y) in enumerate(partes):
        p = os.path.join(os.path.dirname(SALIDA), f"_p{i}.mp4")
        subprocess.run([ff, "-y", "-v", "error", "-ss", str(x), "-i", ENTRADA,
                        "-t", str(y - x), "-an", "-c:v", "libx264", "-crf", "20",
                        "-preset", "medium", "-pix_fmt", "yuv420p", p], check=True)
        temp.append(p)
    with open(lista, "w") as fh:
        for p in temp:
            fh.write(f"file '{os.path.basename(p)}'\n")

    subprocess.run([ff, "-y", "-v", "error", "-f", "concat", "-safe", "0",
                    "-i", lista, "-i", salida_audio, "-map", "0:v", "-map", "1:a",
                    "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
                    "-movflags", "+faststart", SALIDA], check=True)
    for p in temp + [lista]:
        os.remove(p)


def main():
    ff = binarios()
    a = audio(ff)
    wav = os.path.join(os.path.dirname(SALIDA), "_pista.wav")
    subprocess.run([ff, "-y", "-v", "error", "-f", "f32le", "-ar", str(SR),
                    "-ac", "2", "-i", "-", wav], input=a.astype(np.float32).tobytes(),
                   check=True)
    print(f"pista: {len(a) / SR:.2f} s")
    video(ff, wav)
    os.remove(wav)
    quitado = sum(v - s for s, v in CORTES)
    print(f"listo: {SALIDA}")
    print(f"  {FIN:.2f} s - {quitado:.2f} s = {FIN - quitado:.2f} s")


if __name__ == "__main__":
    sys.exit(main())
