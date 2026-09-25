#!/usr/bin/env python3
"""Monta la pista del reel de hoteles: un corte por dentro y cola de musica.

Dos cosas que no se pueden hacer desde Remotion:

1. **El corte de 12,68 s.** Se van los "40 years younger than you" y "seeing
   people from all over the world", y con ellos la frase que los abria, que
   sola no se sostiene. El corte entra en 29,72 y no en 30,45: en el 29,75 el
   hombre arranca un "and" que luego deja colgado, y sin quitarlo la frase se
   queda a medias. "five days" acaba en el 29,32, asi que hay algo de margen.
   Los dos extremos caen en silencio entre frases, pero la pista lleva voz y
   musica en el mismo canal, asi que la musica sí salta. Por eso la juntura
   va con fundido cruzado de verdad, con material de los dos lados, y asi la
   longitud de cada tramo no cambia y la imagen no se descuadra.

   **De donde sale el lado que se apaga, ojo.** La primera version lo tomaba
   del propio material de detras del corte, 29,72 en adelante, que es la
   continuacion natural de la musica. El problema es que ahi es justo donde
   vive el "and": el fundido empieza con ese lado a volumen entero, asi que
   la palabra que se acababa de quitar volvia a sonar, solo que apagandose.
   Se oia, y con razon. Ahora el lado que se apaga se toma de CRUCE_DESDE,
   el hueco sin voz que queda entre el "and" y la frase siguiente: misma
   sala, misma musica, ninguna palabra.

2. **El arranque, en el 15,40 y no en el 15,30.** No es cosa del audio: el
   master cambia de plano en el 15,40 y los tres fotogramas de antes son un
   plano de bosque, que abriendo la pieza se ve como un destello. Se mueve
   aqui tambien, y no solo en la imagen, para que la boca siga cuadrando.

3. **El escalon de la juntura.** El master baja la musica cuando alguien
   habla y la sube cuando nadie habla. A un lado del corte hay voz cerca y la
   musica esta agachada; al otro hay un hueco de tres segundos y la musica
   esta entera. Medido, son 7,2 dB de rms y 9,6 de graves: la musica pegaba
   un salto en el segundo 15 aunque el corte en si fuera limpio. El tramo B
   entra 7,2 dB por debajo y sube a su nivel en dos segundos, que es justo lo
   que queda de hueco antes de la frase siguiente. Es el mismo gesto que hace
   el master solo, asi que no se oye como un truco.

4. **La cola.** El testimonio se acaba antes que la pieza, y la placa de
   marca no puede quedarse muda. La musica sale del arranque del master, que
   tiene 15,77 s sin una sola voz, y entra con otro fundido cruzado.

   **Y sale del 7,75, no del 1,50.** Por dos motivos, los dos medidos. El
   1,50 es la entrada del tema, sin bajos: 10 dB menos de graves y 5 de rms
   que lo que venia sonando, asi que al llegar el cierre se caia el suelo de
   la musica. Y ademas caia a contratiempo: el pulso son 0,5016 s, y
   comparando la envolvente de ataques de los dos lados, el 1,50 entraba
   desplazado medio pulso. El 7,75 cuadra con 0,2 ms de error y tiene el
   mismo cuerpo, 64,4 dB de graves contra 63,1. El siguiente sitio que cuadra
   es el 8,25, por si alguna vez hace falta mover la cola.

   Ojo: la fase no se cuenta multiplicando pulsos por la distancia. A 62 s de
   distancia, un milisegundo de error en el pulso son ya 125 de desfase. Se
   compara la envolvente de ataques de los dos lados y se busca el
   desplazamiento que mejor casa, que es lo unico que mide lo que se oye.

    python3 audio-reel-hoteles.py <carpeta de trabajo>
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
MASTER = os.path.join(RAIZ, "video", "public", "montajes", "testimonios-EN.mp4")

A0, A1 = 15.40, 29.72      # el padre: lista de deseos, emocion, los 100 km
CRUCE_DESDE = 30.16        # hueco sin voz: de aqui sale el lado que se apaga
B0, B1 = 42.40, 70.80      # el equipaje y todo lo del hijo
COLA0 = 7.75               # arranque de la cola: cuadra con el pulso y tiene cuerpo
CRUCE = 0.40
CRUCE_COLA = 0.60
RAMPA = 2.00               # lo que tarda la musica en subir tras el corte
RAMPA_DB = 7.2             # cuanto entra por debajo, medido a los dos lados
FIN = 49.10                # lo que dura la pieza entera


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
        """Fundido cruzado de potencia constante.

        Con ganancias lineales, dos trozos de musica distintos se restan en
        medio del cruce y dejan un bache de 3 dB: medido, la pieza caia a
        -32,5 dB justo en la juntura. Como los dos lados no estan
        correlacionados, lo que se conserva es la potencia, asi que las
        ganancias van en raiz y el nivel no se mueve.
        """
        n = min(int(dur * SR), len(sale), len(entra))
        r = np.linspace(0, 1, n)[:, None]
        i = int(desde * SR)
        out[i:i + n] = sale[:n] * np.sqrt(1 - r) + entra[:n] * np.sqrt(r)

    durA = A1 - A0
    durB = B1 - B0

    # El tramo B entra agachado y sube: el master lo tenia sin agachar porque
    # ahi no habla nadie, y de golpe se oia el escalon.
    b = t(B0, B1)
    n = int(RAMPA * SR)
    b[:n] *= (10 ** (np.linspace(-RAMPA_DB, 0.0, n) / 20))[:, None]

    mete(0.0, t(A0, A1))
    mete(durA, b)
    mete(durA + durB - CRUCE_COLA, t(COLA0, COLA0 + (FIN - (durA + durB - CRUCE_COLA))))

    # 1 · el tramo del padre da paso al del equipaje
    cruza(durA, t(CRUCE_DESDE, CRUCE_DESDE + CRUCE), b[:int(CRUCE * SR)], CRUCE)
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
