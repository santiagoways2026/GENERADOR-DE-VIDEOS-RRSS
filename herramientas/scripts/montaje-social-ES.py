#!/usr/bin/env python3
"""Rehace la base de la pieza social en español, `social-ES-v3.mp4`.

Tres cosas que cambian la duración, y por eso van aquí y no en Remotion, que
sólo sustituye imagen:

1. Una apertura nueva de 3 s por delante. El plano con el que arrancaba es un
   bosque a contraluz velado, con un muro de hormigón al fondo.
2. Fuera el tramo 20,00-25,15 del montaje. Ahí habla un segundo peregrino al
   que no se ve en ningún momento: el montaje original le daba plano justo
   después, y ese plano cayó con el recorte anterior.
3. En su lugar, siete segundos de alojamiento. Es lo que el peregrino acaba de
   contar, «los dos alojamientos que llevamos», y no había imagen.

El audio se monta entero aquí, en memoria, y no con el filtro `concat`. El
motivo es la juntura: pegando a hueso, dos ruidos distintos dan un chasquido,
y fundiendo cada trozo a silencio se oye el bache. Lo que hace falta es un
fundido cruzado de verdad, y para eso hay que tener material de los dos lados
del corte a la vez. Los cortes caen todos en silencio entre frases, así que
hay de sobra.

    python3 montaje-social-ES.py <carpeta con social-ES.mp4>
"""
import os
import subprocess
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from ambiente import SR, huella, leer, sintetiza, binarios  # noqa: E402

FF = binarios()
AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.normpath(os.path.join(AQUI, "..", ".."))
B = os.path.join(RAIZ, "video", "public", "brutos")

# (archivo, entra, dura)
APERTURA = [(f"{B}/campo-flores.mp4", 0.03, 1.60),
            (f"{B}/contraluz.mp4", 0.00, 1.40)]
HOTELES = [(f"{B}/casa-rural.mp4", 0.03, 1.10),
           (f"{B}/habitacion.mp4", 0.10, 2.00),
           (f"{B}/testimonios/bano-ducha.mp4", 0.05, 1.10),
           (f"{B}/mesa-exterior.mp4", 0.10, 1.20),
           (f"{B}/terraza.mp4", 0.30, 1.60)]

DUR_AP = sum(d for _, _, d in APERTURA)      # 3,00
DUR_HO = sum(d for _, _, d in HOTELES)       # 7,00
CORTE_A = 20.00      # sale del montaje, dentro del silencio 19,55-20,49
CORTE_B = 25.15      # vuelve al montaje, dentro del silencio 24,92-25,19
FIN = 47.17

# Silencios del montaje con factor de cresta por debajo de 5: los que son
# ambiente de verdad. `ambiente.py --listar` los mide.
HUECOS = [(0.05, 0.62), (36.55, 36.84), (41.06, 41.29), (46.60, 47.10)]
CRUCE = 0.15


def video(S):
    """Concatena los planos nuevos y los dos tramos del montaje. Sin audio."""
    ent, filtros, vs = [], [], []
    i = 0
    for grupo in (APERTURA, HOTELES):
        for f, x, d in grupo:
            ent += ["-ss", f"{x}", "-t", f"{d}", "-i", f]
            filtros.append(
                f"[{i}:v]scale=1280:720:force_original_aspect_ratio=increase,"
                f"crop=1280:720,fps=fps=30,setsar=1,format=yuv420p[v{i}]")
            vs.append(f"[v{i}]")
            i += 1
    n = len(APERTURA)
    filtros.append("".join(vs[:n]) + f"concat=n={n}:v=1:a=0[vP]")
    filtros.append("".join(vs[n:]) + f"concat=n={len(HOTELES)}:v=1:a=0[vH]")

    m = i
    ent += ["-i", f"{S}/social-ES.mp4"]
    filtros += [
        f"[{m}:v]trim=0:{CORTE_A},setpts=PTS-STARTPTS,fps=fps=30,setsar=1,format=yuv420p[vA]",
        f"[{m}:v]trim={CORTE_B}:{FIN},setpts=PTS-STARTPTS,fps=fps=30,setsar=1,format=yuv420p[vB]",
        "[vP][vA][vH][vB]concat=n=4:v=1:a=0[v]",
    ]
    subprocess.run([FF, "-v", "warning", "-y"] + ent +
                   ["-filter_complex", ";".join(filtros), "-map", "[v]",
                    "-c:v", "libx264", "-crf", "16", "-preset", "slow",
                    "-pix_fmt", "yuv420p", "-colorspace", "bt709",
                    "-color_primaries", "bt709", "-color_trc", "bt709",
                    "-an", f"{S}/_v.mp4"], check=True)


def cruza(salida, desde, a, b):
    """Escribe en `salida`, a partir del segundo `desde`, el paso de `a` a `b`."""
    n = min(int(CRUCE * SR), len(a), len(b))
    r = np.linspace(0, 1, n)[:, None]
    i = int(desde * SR)
    salida[i:i + n] = a[:n] * (1 - r) + b[:n] * r


def audio(S):
    """Monta la pista entera con fundidos cruzados en las tres junturas."""
    a = leer(FF, f"{S}/social-ES.mp4")
    canales = a.shape[1]
    h = huella(a, HUECOS)

    def rms(*ventanas):
        return float(np.median([np.sqrt((a[int(x * SR):int(y * SR)] ** 2).mean())
                                for x, y in ventanas]))

    def cama(seg, entra, sale=None):
        """El nivel no es el medio de la pieza: es el del ambiente con el que
        la cama empalma. La media sale 3 y 8 dB por encima, y una cama que
        entra mas alta que lo que viene detras se oye como un escalon.

        **Y empalma por los dos lados.** El ambiente de esta grabacion no es
        constante: el hueco del corte A esta a -33,4 dB y el del corte B a
        -25,4, ocho de diferencia. Con un solo nivel, la cama cuadraba al
        entrar y se quedaba ocho por debajo al salir, asi que al volver el
        testimonio parecia que el audio subia de golpe. Va con una rampa de
        un nivel al otro: ocho dB repartidos en siete segundos no se oyen
        como rampa, se oyen como que la sala era asi."""
        c = sintetiza(h, seg + CRUCE, canales)
        c *= entra / max(float(np.sqrt((c ** 2).mean())), 1e-9)
        if sale is not None:
            g = np.linspace(1.0, sale / entra, len(c))[:, None]
            c *= g
        return c

    camaP = cama(DUR_AP, rms((0.05, 0.62)))
    camaH = cama(DUR_HO, rms((19.62, 20.42)), rms((24.92, 25.19)))
    total = int((DUR_AP + CORTE_A + DUR_HO + (FIN - CORTE_B)) * SR)
    out = np.zeros((total, canales), np.float32)

    def mete(desde, x):
        i = int(desde * SR)
        out[i:i + len(x)] = x[:total - i]

    def tramo(x, y):
        return a[int(x * SR):int(y * SR)]

    # Los cuatro bloques, y encima los tres fundidos cruzados de 150 ms.
    mete(0.0, camaP[:int(DUR_AP * SR)])
    # La pieza abre con la cama: que no arranque de golpe.
    n = int(0.25 * SR)
    out[:n] *= np.linspace(0, 1, n)[:, None]
    mete(DUR_AP, tramo(0.0, CORTE_A))
    mete(DUR_AP + CORTE_A, camaH[:int(DUR_HO * SR)])
    mete(DUR_AP + DUR_HO + CORTE_A, tramo(CORTE_B, FIN))

    # 1 · la cama de apertura da paso al montaje
    cruza(out, DUR_AP, camaP[int(DUR_AP * SR):], tramo(0.0, CRUCE))
    # 2 · el montaje da paso a la cama de los hoteles
    cruza(out, DUR_AP + CORTE_A, tramo(CORTE_A, CORTE_A + CRUCE), camaH)
    # 3 · la cama da paso al montaje otra vez, justo antes de la juntura
    cruza(out, DUR_AP + CORTE_A + DUR_HO - CRUCE,
          camaH[int((DUR_HO - CRUCE) * SR):], tramo(CORTE_B - CRUCE, CORTE_B))

    subprocess.run([FF, "-v", "error", "-y", "-f", "f32le", "-ar", str(SR),
                    "-ac", str(canales), "-i", "-", "-c:a", "pcm_s16le",
                    f"{S}/_a.wav"], input=out.tobytes(), check=True)


def main():
    S = sys.argv[1] if len(sys.argv) > 1 else os.path.join(RAIZ, "video", "public", "montajes")
    video(S)
    audio(S)
    subprocess.run([FF, "-v", "error", "-y", "-i", f"{S}/_v.mp4", "-i", f"{S}/_a.wav",
                    "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
                    "-movflags", "+faststart", "-shortest",
                    f"{S}/social-ES-v3.mp4"], check=True)
    for t in ("_v.mp4", "_a.wav"):
        os.remove(f"{S}/{t}")
    print(f"listo: {S}/social-ES-v3.mp4")


if __name__ == "__main__":
    main()
