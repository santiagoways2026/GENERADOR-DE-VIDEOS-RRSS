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
    """Cama sintetizada a partir de los huecos mas limpios de la propia pieza.

    Ni un bucle ni silencio: se saca la huella espectral de los huecos y se
    sintetiza con fase aleatoria, que es lo que dice la regla 11. Los huecos
    se eligen por factor de cresta, pico entre rms: por debajo de 5 es
    ambiente y por encima hay una respiracion dentro.
    """
    n = 4096
    trozos = x[:len(x) // n * n].reshape(-1, n)
    rms = np.sqrt((trozos ** 2).mean(1)) + 1e-12
    cresta = np.abs(trozos).max(1) / rms
    quietos = trozos[(cresta < 5) & (rms < np.percentile(rms, 30))]
    if len(quietos) < 4:
        quietos = trozos[np.argsort(rms)[:8]]
    huella = np.abs(np.fft.rfft(quietos * np.hanning(n), axis=1)).mean(0)

    salto = n // 2
    total = int(dura * SR) + n
    cama = np.zeros(total, np.float32)
    ventana = np.hanning(n).astype(np.float32)
    for i in range(0, total - n, salto):
        fase = np.exp(2j * np.pi * np.random.rand(len(huella)))
        cama[i:i + n] += (np.fft.irfft(huella * fase, n) * ventana).astype(np.float32)
    cama = cama[:int(dura * SR)]
    # Se nivela contra el ambiente con el que empalma, no contra la media ni
    # contra el ultimo medio segundo: ahi todavia queda cola de voz y la cama
    # entraba 4 dB por encima de lo que suena de verdad entre frase y frase.
    # Se mide en ventanas de una decima sobre los ultimos siete segundos, que
    # es el tramo entero, y se coge el percentil 10: los tres ultimos
    # segundos son casi todo voz y el percentil salia 3 dB alto.
    m = int(0.1 * SR)
    cola = x[-int(7.0 * SR):]
    v = cola[:len(cola) // m * m].reshape(-1, m)
    suelo = np.percentile(np.sqrt((v ** 2).mean(1)), 10)
    cama *= (suelo + 1e-12) / (np.sqrt((cama ** 2).mean()) + 1e-12)
    return cama


if __name__ == "__main__":
    main()
