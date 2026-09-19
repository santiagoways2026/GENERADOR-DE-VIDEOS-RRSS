#!/usr/bin/env python3
"""Dibuja el perfil de volumen de un audio, tramo a tramo.

Sirve para elegir por dónde entra la música. Casi todos los temas traen su
propio fundido final; si se hace coincidir con el cierre de marca, no hay
que inventarse ninguno y la pieza termina con la canción. Este script dice
dónde empieza ese fundido y dónde están las partes plenas.

También vale para comprobar la mezcla de un render ya exportado: si la voz
y la música están equilibradas, el perfil sale parejo y sin caídas bruscas.

    python3 envolvente.py musica.mp3
    python3 envolvente.py salida.mp4 2.5

El segundo argumento es el tamaño del tramo en segundos, 2 por defecto.

El ffmpeg que trae Remotion viene con los filtros recortados y no incluye
`volumedetect` ni `astats`, así que el nivel se mide decodificando a PCM.
"""
import array, math, pathlib, subprocess, sys, tempfile, wave

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from planos import FF


def perfil(src, paso=2.0):
    """Nivel RMS en dBFS de cada tramo."""
    tmp = pathlib.Path(tempfile.mkdtemp()) / "a.wav"
    subprocess.run([FF, "-v", "error", "-i", src, "-ac", "1", "-ar", "8000",
                    "-c:a", "pcm_s16le", "-y", str(tmp)], check=True)
    with wave.open(str(tmp)) as w:
        sr = w.getframerate()
        d = array.array("h", w.readframes(w.getnframes()))
    for i in range(int(len(d) / sr / paso)):
        tramo = d[int(i * paso * sr):int((i + 1) * paso * sr)]
        if not tramo:
            continue
        rms = math.sqrt(sum(x * x for x in tramo) / len(tramo))
        yield i * paso, 20 * math.log10(rms / 32768) if rms else -99


def main():
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    src = sys.argv[1]
    paso = float(sys.argv[2]) if len(sys.argv) > 2 else 2.0
    for t, db in perfil(src, paso):
        # La barra arranca en -50 dB, que es silencio a efectos prácticos.
        print(f"{t:7.1f}s {db:6.1f} dB  {'#' * max(0, int((db + 50) * 1.2))}")


if __name__ == "__main__":
    main()
