#!/usr/bin/env python3
"""Detecta los cambios de plano de un vídeo comparando fotogramas.

Los brutos son compilaciones con varios planos pegados. Cortar a ciegas
mete medio plano ajeno en la escena, así que conviene saber dónde empieza
y acaba cada uno antes de elegir el trozo.

    python3 planos.py entrada.mp4 [paso_en_segundos] [umbral]
"""
import subprocess, sys, tempfile, os, json, shutil, re
from PIL import Image

def binarios():
    """Busca un ffmpeg y un ffprobe completos.

    El que trae Remotion en node_modules sirve para renderizar, pero es una
    compilacion recortada: le faltan filtros que aqui hacen falta. Asi que va
    el ultimo, solo por si no hay otro.
    """
    ff = None
    try:
        import imageio_ffmpeg
        ff = imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError:
        ff = shutil.which("ffmpeg")
    if not ff:
        aqui = os.path.dirname(os.path.abspath(__file__))
        cand = os.path.join(aqui, "..", "..", "video", "node_modules",
                            "@remotion", "compositor-linux-x64-gnu", "ffmpeg")
        if os.path.exists(cand):
            ff = cand
    if not ff:
        sys.exit("no hay ffmpeg: pip install imageio-ffmpeg")

    return ff


FF = binarios()


def duracion(src):
    """Duracion en segundos, leida de lo que ffmpeg escribe por stderr.

    No se usa ffprobe: el ffmpeg que trae imageio viene solo, y en muchas
    maquinas no hay un ffprobe en el PATH.
    """
    out = subprocess.run([FF, "-hide_banner", "-i", src],
                         capture_output=True, text=True).stderr
    m = re.search(r"Duration:\s*(\d+):(\d+):(\d+\.?\d*)", out)
    if not m:
        sys.exit(f"no se puede leer la duracion de {src}")
    h, mi, s = m.groups()
    return int(h) * 3600 + int(mi) * 60 + float(s)


def firma(path):
    """Histograma normalizado de una miniatura, que basta para comparar planos."""
    im = Image.open(path).convert("RGB").resize((64, 36))
    h = im.histogram()
    total = sum(h) or 1
    return [v / total for v in h]


def distancia(a, b):
    return sum(abs(x - y) for x, y in zip(a, b)) / 2


def planos(src, paso=0.25, umbral=0.22):
    dur = duracion(src)
    tmp = tempfile.mkdtemp()
    tiempos, firmas = [], []
    t = 0.0
    while t < dur:
        p = os.path.join(tmp, f"{int(t*1000):07d}.jpg")
        subprocess.run([FF, "-v", "error", "-ss", f"{t:.2f}", "-i", src,
                        "-frames:v", "1", "-vf", "scale=160:-1", p, "-y"], check=False)
        if os.path.exists(p):
            tiempos.append(t)
            firmas.append(firma(p))
        t += paso

    cortes = [0.0]
    for i in range(1, len(firmas)):
        if distancia(firmas[i - 1], firmas[i]) > umbral:
            cortes.append(tiempos[i])
    cortes.append(dur)

    print(f"{os.path.basename(src)}  ·  {dur:.1f}s")
    for i in range(len(cortes) - 1):
        ini, fin = cortes[i], cortes[i + 1]
        if fin - ini < 0.4:
            continue
        print(f"  plano {i+1:2d}:  {ini:6.2f}s → {fin:6.2f}s   ({fin-ini:.2f}s)")


if __name__ == "__main__":
    src = sys.argv[1]
    paso = float(sys.argv[2]) if len(sys.argv) > 2 else 0.25
    umbral = float(sys.argv[3]) if len(sys.argv) > 3 else 0.22
    planos(src, paso, umbral)
