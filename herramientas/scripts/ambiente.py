#!/usr/bin/env python3
"""Cama de ambiente sintetizada a partir del propio montaje.

Cuando un bloque se monta sin voz, planos de recurso o una apertura, hace
falta algo debajo o el corte suena a mute. Si la pieza no lleva música, meter
una sólo en ese tramo suena a parche: lo que funciona es ambiente de la misma
grabación.

**No se hace con un bucle.** Se probó encadenando los silencios en palíndromo,
con fundidos cruzados, y se oye: los huecos entre frases duran medio segundo,
así que el ciclo vuelve cada segundo y medio, y las mitades invertidas suenan
al revés, que es justo lo que delata el truco. Lo que sí funciona es sacar la
huella espectral de esos silencios, que es el color de la sala, y sintetizar
con fase aleatoria. Sale un ambiente continuo, sin ciclo y sin nada
reconocible dentro.

    python3 ambiente.py montaje.mp4 cama.wav 7.0  0.05,0.62 19.62,20.42

Los huecos hay que elegirlos midiendo, no de oído. En la pieza social en
español uno medía lo mismo que la voz y tenía un pico de 0,88: era una
respiración. Sirve el factor de cresta, pico entre rms: por debajo de 5 es
ambiente, por encima hay algo dentro. `--listar` los mide y no sintetiza nada.
"""
import os
import shutil
import subprocess
import sys

import numpy as np

SR = 44100
VENTANA = 2048
SALTO = VENTANA // 2


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


def leer(ff, src, canales=2):
    crudo = subprocess.run([ff, "-v", "error", "-i", src, "-ac", str(canales),
                            "-ar", str(SR), "-f", "f32le", "-"],
                           capture_output=True).stdout
    return np.frombuffer(crudo, np.float32).reshape(-1, canales)


def cresta(x):
    rms = float(np.sqrt((x ** 2).mean()))
    return float(np.abs(x).max()) / max(rms, 1e-9), rms


def huella(audio, huecos):
    """Magnitud media por banda de los silencios, canal a canal."""
    ven = np.hanning(VENTANA)[:, None]
    acc, n = 0.0, 0
    for x, y in huecos:
        t = audio[int(x * SR):int(y * SR)]
        for i in range(0, len(t) - VENTANA, SALTO):
            acc = acc + np.abs(np.fft.rfft(t[i:i + VENTANA] * ven, axis=0))
            n += 1
    if not n:
        sys.exit("los huecos no dan ni una ventana: son demasiado cortos")
    return acc / n


def sintetiza(h, segundos, canales):
    """Superposición y suma con fase aleatoria. Sin ciclo: cada ventana es
    ruido distinto y sólo comparten el color.

    **La ventana de síntesis va en raíz, y no se divide por el peso.** Con
    Hann y medio solape, la suma reconstruye bien una señal, pero aquí cada
    ventana lleva fase aleatoria y no está correlacionada con la anterior: lo
    que se suma no son amplitudes sino potencias, y w1² + w2² no es constante.
    Vale 1 en el centro de cada ventana y 0,5 en el cruce, así que la cama sale
    con un temblor de 3 dB al ritmo del salto. Medido sobre la pieza alemana:
    un pico a 21,5 Hz en la envolvente, que son los 44100 entre 2048 del salto,
    y su armónico a 43. A esa frecuencia no se oye como trémolo, se oye como
    que el audio se rompe. Dividir por el peso tampoco lo arregla, porque el
    peso suma amplitudes. Con la ventana en raíz, w² es Hann y Hann más Hann
    desplazada media ventana suma 1: la potencia queda plana."""
    total = int(segundos * SR)
    salida = np.zeros((total + VENTANA, canales))
    ven = np.sqrt(0.5 - 0.5 * np.cos(2 * np.pi * np.arange(VENTANA) / VENTANA))[:, None]
    rng = np.random.default_rng(20260923)
    for i in range(0, total, SALTO):
        fase = rng.uniform(0, 2 * np.pi, h.shape)
        trozo = np.fft.irfft(h * np.exp(1j * fase), n=VENTANA, axis=0) * ven
        salida[i:i + VENTANA] += trozo
    salida = salida[:total]

    # Una deriva muy lenta de nivel, para que no suene a ruido de cinta.
    t = np.arange(total) / SR
    salida *= (1 + 0.10 * np.sin(2 * np.pi * 0.17 * t + 0.6))[:, None]
    return salida


def main():
    args = [a for a in sys.argv[1:] if a != "--listar"]
    listar = "--listar" in sys.argv
    if len(args) < (2 if listar else 4):
        sys.exit("uso: ambiente.py entrada.mp4 cama.wav segundos x1,y1 x2,y2 ...\n"
                 "     ambiente.py entrada.mp4 --listar x1,y1 x2,y2 ...")
    ff = binarios()
    src = args[0]
    a = leer(ff, src)

    if listar:
        huecos = [tuple(float(v) for v in h.split(",")) for h in args[1:]]
        print("hueco            rms      cresta")
        for x, y in huecos:
            c, r = cresta(a[int(x * SR):int(y * SR)])
            print(f"{x:6.2f}-{y:6.2f}   {r:.5f}  {c:6.1f}"
                  f"   {'ambiente' if c < 5 else 'lleva algo dentro'}")
        return

    destino, segundos = args[1], float(args[2])
    huecos = [tuple(float(v) for v in h.split(",")) for h in args[3:]]
    nivel = float(np.median([np.sqrt((a[int(x * SR):int(y * SR)] ** 2).mean())
                             for x, y in huecos]))
    c = sintetiza(huella(a, huecos), segundos, a.shape[1])
    c *= nivel / max(float(np.sqrt((c ** 2).mean())), 1e-9)

    print(f"cama de {segundos:.2f} s, pico {float(np.abs(c).max()):.4f}, "
          f"rms {float(np.sqrt((c ** 2).mean())):.5f}")
    subprocess.run([ff, "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac",
                    str(a.shape[1]), "-i", "-", "-c:a", "pcm_s16le", destino],
                   input=c.astype(np.float32).tobytes(), check=True)


if __name__ == "__main__":
    main()
