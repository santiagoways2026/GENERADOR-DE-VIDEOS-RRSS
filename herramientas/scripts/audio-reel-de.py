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
-44 dBFS y lo que queda es ambiente de campo, no un tema. Asi que las tres
junturas no tienen que cuadrar con ningun pulso, solo con el ambiente, y la
cola de la placa de marca va con cama de ambiente sintetizada, no con una
cancion metida a ultima hora, que es lo que dice la regla 11 de CLAUDE.md.

    python3 audio-reel-de.py <carpeta de trabajo>
"""
import os
import subprocess
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from ambiente import SR, binarios  # noqa: E402

FF = binarios()
RAIZ = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))
MASTER = os.path.join(RAIZ, "video", "public", "montajes", "testimonio-DE.mp4")

# Los cuatro tramos que se quedan, en segundos del bruto.
TRAMOS = [
    (1.20, 16.20),   # el grupo, los tres, la universidad, las familias
    (30.00, 42.30),  # lo que esperan: enriquecimiento y vinculo
    (47.55, 63.95),  # lo conseguido, el deporte, los amigos, descubrir
    (75.55, 82.45),  # los paisajes y el final en Santiago
]
CRUCE = 0.30      # las junturas caen en silencio, con ambiente a los dos lados
# Los huecos sin voz de la pieza ya montada, en segundos de la pieza. Salen de
# la transcripcion, no de oido, y de ahi se saca el color de la cama del final.
HUECOS = [(6.80, 7.80), (14.85, 15.32), (19.08, 19.38), (22.47, 22.55),
          (26.90, 27.48), (29.02, 29.22), (32.72, 32.82), (38.08, 38.40),
          (43.52, 43.86), (48.08, 48.22)]
COLA = 4.00       # cama de ambiente bajo la placa de marca
FIN = None        # se calcula


def main():
    destino = sys.argv[1] if len(sys.argv) > 1 else "."
    crudo = subprocess.run([FF, "-v", "error", "-i", MASTER, "-map", "0:a", "-ac", "1",
                            "-ar", str(SR), "-f", "f32le", "-"], capture_output=True).stdout
    a = np.frombuffer(crudo, np.float32).copy()

    def t(x, y):
        return a[int(x * SR):int(y * SR)].copy()

    trozos = [t(x, y) for x, y in TRAMOS]
    duras = [len(x) / SR for x in trozos]
    fin = sum(duras) + COLA
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

    # 2 · la cama de ambiente de la cola, con la huella espectral de la pieza
    cama = ambiente(out[:int(pos * SR)], COLA)
    j = int((pos - 0.35) * SR)
    n = len(cama)
    r = np.linspace(0, 1, int(0.35 * SR))
    out[j:j + len(r)] = out[j:j + len(r)] * np.sqrt(1 - r) + cama[:len(r)] * np.sqrt(r)
    out[j + len(r):j + n] = cama[len(r):n][:len(out) - j - len(r)]

    n = int(0.30 * SR)
    out[:n] *= np.linspace(0, 1, n)
    n = int(0.70 * SR)
    out[-n:] *= np.linspace(1, 0, n)

    salida = f"{destino}/reel-de.wav"
    subprocess.run([FF, "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "1",
                    "-i", "-", "-c:a", "pcm_s16le", salida], input=out.tobytes(), check=True)
    print(f"listo: {salida}  ({fin:.2f} s)")
    pos = 0.0
    for (x, y), d in zip(TRAMOS, duras):
        print(f"  tramo {x:6.2f}-{y:6.2f} del bruto  ->  {pos:6.2f}-{pos + d:6.2f} de la pieza")
        pos += d
    print(f"  cama de ambiente desde {pos:.2f}")


def ambiente(x, dura):
    """Cama sintetizada a partir de los huecos de la propia pieza.

    Ni un bucle ni silencio: se saca la huella espectral de los huecos y se
    sintetiza con fase aleatoria, que es lo que dice la regla 11.

    **Los huecos son los de HUECOS, no los que salgan de un percentil.**
    Coger las ventanas mas flojas de la pieza mete colas de voz dentro, y una
    cola de voz es mas brillante que una sala: medido, la cama salia 3,5 dB
    por encima del ambiente de verdad entre 3 y 8 kHz, y eso se oye como
    ruido. Con los huecos medidos, el color cuadra banda a banda. Cada ventana
    se comprueba ademas por factor de cresta, pico entre rms: por encima de 5
    hay una respiracion dentro y se descarta.

    **La ventana de sintesis va en raiz.** Con ventana de Hann y medio solape,
    la suma reconstruye bien una senal, pero aqui cada ventana lleva fase
    aleatoria y no esta correlacionada con la anterior: lo que se suma no son
    amplitudes sino potencias, y w1^2 + w2^2 no es constante. Vale 1 en el
    centro de cada ventana y 0,5 en el cruce, asi que la cama sale con un
    temblor de 3 dB al ritmo del salto. Medido sobre esta pieza: un pico a
    21,5 Hz en la envolvente, que son los 44100 entre 2048 del salto, y su
    armonico a 43. A esa frecuencia no se oye como tremolo, se oye como que el
    audio se rompe. Con la ventana en raiz, w^2 es Hann y Hann mas Hann
    desplazada media ventana suma 1: la potencia queda plana.
    """
    n = 2048
    ven = np.hanning(n)
    trozos = []
    for a0, a1 in HUECOS:
        t = x[int(a0 * SR):int(a1 * SR)]
        for i in range(0, len(t) - n, n // 2):
            w = t[i:i + n]
            r = np.sqrt((w ** 2).mean()) + 1e-12
            if np.abs(w).max() / r < 5:
                trozos.append(w)
    if len(trozos) < 8:
        sys.exit("los huecos no dan ni ocho ventanas: revisa HUECOS")
    trozos = np.array(trozos)
    huella = np.abs(np.fft.rfft(trozos * ven, axis=1)).mean(0)

    salto = n // 2
    total = int(dura * SR) + n
    cama = np.zeros(total, np.float32)
    # Hann periodica en raiz: ver la explicacion de arriba.
    ventana = np.sqrt(0.5 - 0.5 * np.cos(2 * np.pi * np.arange(n) / n)).astype(np.float32)
    for i in range(0, total - n, salto):
        fase = np.exp(2j * np.pi * np.random.rand(len(huella)))
        cama[i:i + n] += (np.fft.irfft(huella * fase, n) * ventana).astype(np.float32)
    cama = cama[:int(dura * SR)]

    # Se nivela contra el ambiente de los propios huecos, que es contra lo que
    # empalma, no contra la media de la pieza.
    suelo = np.sqrt((trozos ** 2).mean())
    cama *= suelo / (np.sqrt((cama ** 2).mean()) + 1e-12)
    return cama


if __name__ == "__main__":
    main()
