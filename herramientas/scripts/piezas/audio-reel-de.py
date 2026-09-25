#!/usr/bin/env python3
"""Monta la pista del reel aleman: cuatro tramos y cama de ambiente al final.

El bruto son 83 segundos de testimonio y se queda en 50,6. Lo que se va es
lo que se dice dos veces o se queda a medias, que en una entrevista siempre
hay: "einerseits... andererseits" repite lo que ya habia dicho de reunirse,
"besteht immer die Moglichkeit... und spirituell zu bereiten" es una frase sin
terminar, "eine bessere Zusammenarbeit im Team" no viene a cuento, y el tramo
de "Leute kennenlernen, Orte kennenlernen" vuelve sobre lo mismo que ya se
dice mejor antes. Tambien se va "der hatte ein gutes Wetter", cortado.

**Esta pista no lleva musica.** Medido: entre frase y frase el nivel baja a
-44 dBFS y lo que queda es ambiente, no un tema. Asi que las tres junturas no
tienen que cuadrar con ningun pulso, solo con el ambiente.

**Y la placa de marca se queda en silencio.** La regla 11 dice que un tramo
sin voz lleva cama de ambiente, pero aqui no hay ambiente que imitar: esto es
un doblaje y lo que queda entre frase y frase no es una sala, es lo que dejo
el doblador. Medido, los huecos del master van de -40,7 dB a -25,9 segun el
trozo, con colores distintos. Contra eso, una cama sintetizada suena a
anadido se haga como se haga, y se probo dos veces. Lo que se hace es dejar
un segundo de ambiente de verdad, del hueco que mas se parece al final, y
bajarlo a cero. A partir de ahi la pieza termina en silencio, que sobre una
placa de marca quieta se lee como que la pieza ha acabado, no como un mute.

    python3 audio-reel-de.py <carpeta de trabajo>
"""
import os
import subprocess
import sys

import numpy as np

# `ambiente.py` vive un nivel arriba, con las herramientas de uso general.
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from ambiente import SR, binarios  # noqa: E402

FF = binarios()
RAIZ = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", ".."))
MASTER = os.path.join(RAIZ, "video", "public", "montajes", "testimonio-DE.mp4")

# Los cuatro tramos que se quedan, en segundos del bruto.
TRAMOS = [
    (1.20, 16.20),   # el grupo, los tres, la universidad, las familias
    (30.00, 42.30),  # lo que esperan: enriquecimiento y vinculo
    (47.55, 63.95),  # lo conseguido, el deporte, los amigos, descubrir
    (75.55, 82.45),  # los paisajes y el final en Santiago
]
CRUCE = 0.30      # las junturas caen en silencio, con ambiente a los dos lados
COLA0 = 73.10     # el hueco de un segundo que mas se parece al ambiente del final
COLA = 1.00       # lo que dura, antes de bajar a cero
CAIDA = 0.75      # lo que tarda en irse
FIN = 53.80       # la pieza entera: la placa se queda muda los ultimos dos segundos


def main():
    destino = sys.argv[1] if len(sys.argv) > 1 else "."
    crudo = subprocess.run([FF, "-v", "error", "-i", MASTER, "-map", "0:a", "-ac", "1",
                            "-ar", str(SR), "-f", "f32le", "-"], capture_output=True).stdout
    a = np.frombuffer(crudo, np.float32).copy()

    def t(x, y):
        return a[int(x * SR):int(y * SR)].copy()

    trozos = [t(x, y) for x, y in TRAMOS]
    duras = [len(x) / SR for x in trozos]
    fin = FIN
    out = np.zeros(int(fin * SR), np.float32)

    # 1 · los tramos, pegados, con la juntura en fundido de potencia constante
    pos = 0.0
    for i, x in enumerate(trozos):
        j = int(pos * SR)
        out[j:j + len(x)] = x[:len(out) - j]
        if i:
            n = int(CRUCE * SR)
            r = np.linspace(0, 1, n)
            # el lado que se apaga sale del ambiente de detras del corte
            desde = TRAMOS[i - 1][1]
            sale = t(desde, desde + CRUCE)[:n]
            out[j:j + n] = sale * np.sqrt(1 - r) + x[:n] * np.sqrt(r)
        pos += len(x) / SR

    # 2 · un segundo de ambiente de verdad y a cero. Nada sintetizado.
    cola = t(COLA0, COLA0 + COLA)
    hueco = t(TRAMOS[-1][1] - 0.55, TRAMOS[-1][1] - 0.37)   # ambiente del final
    cola *= (np.sqrt((hueco ** 2).mean()) + 1e-12) / (np.sqrt((cola ** 2).mean()) + 1e-12)
    n = int(CAIDA * SR)
    cola[-n:] *= np.linspace(1, 0, n)
    j = int(pos * SR)
    n = int(0.25 * SR)
    r = np.linspace(0, 1, n)
    out[j:j + n] = out[j:j + n] * np.sqrt(1 - r) + cola[:n] * np.sqrt(r)
    out[j + n:j + len(cola)] = cola[n:]

    n = int(0.30 * SR)
    out[:n] *= np.linspace(0, 1, n)

    salida = f"{destino}/reel-de.wav"
    subprocess.run([FF, "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "1",
                    "-i", "-", "-c:a", "pcm_s16le", salida], input=out.tobytes(), check=True)
    print(f"listo: {salida}  ({fin:.2f} s)")
    pos = 0.0
    for (x, y), d in zip(TRAMOS, duras):
        print(f"  tramo {x:6.2f}-{y:6.2f} del bruto  ->  {pos:6.2f}-{pos + d:6.2f} de la pieza")
        pos += d
    print(f"  cola de ambiente de verdad desde {pos:.2f}, a cero en {pos + COLA:.2f}")
    print(f"  la placa se queda muda del {pos + COLA:.2f} al {FIN:.2f}")


if __name__ == "__main__":
    main()
