#!/usr/bin/env python3
"""Detecta los cambios de plano de un vídeo comparando fotogramas.

Los brutos son compilaciones con varios planos pegados. Cortar a ciegas
mete medio plano ajeno en la escena, así que conviene saber dónde empieza
y acaba cada uno antes de elegir el trozo.

    python3 planos.py entrada.mp4 [paso_en_segundos] [umbral]
"""
import subprocess, sys, tempfile, os, json, pathlib, shutil
from PIL import Image


def _compositor():
    """Localiza el ffmpeg que Remotion empaqueta, sin rutas fijas.

    El paquete del compositor cambia de nombre según la libc (gnu o musl) y
    el proyecto puede estar clonado en cualquier carpeta, así que se busca
    desde este archivo hacia arriba en lugar de escribir la ruta a mano.
    """
    aqui = pathlib.Path(__file__).resolve()
    for base in [aqui.parent, *aqui.parents]:
        for mods in (base / "video" / "node_modules", base / "node_modules"):
            for pkg in sorted(mods.glob("@remotion/compositor-*")):
                ff, fp = pkg / "ffmpeg", pkg / "ffprobe"
                if ff.exists() and fp.exists():
                    return str(ff), str(fp)
    for nombre in ("ffmpeg", "ffprobe"):
        if shutil.which(nombre) is None:
            raise SystemExit(
                "No encuentro ffmpeg. Ejecuta 'npm install' dentro de video/ "
                "para que Remotion instale el suyo."
            )
    return shutil.which("ffmpeg"), shutil.which("ffprobe")


FF, FP = _compositor()


def duracion(src):
    out = subprocess.run([FP, "-v", "error", "-show_entries", "format=duration",
                          "-of", "json", src], capture_output=True, text=True, check=True)
    return float(json.loads(out.stdout)["format"]["duration"])


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

    tramos = []
    for i in range(len(cortes) - 1):
        ini, fin = cortes[i], cortes[i + 1]
        if fin - ini < 0.4:
            continue
        tramos.append((ini, fin))
    return dur, tramos


if __name__ == "__main__":
    src = sys.argv[1]
    paso = float(sys.argv[2]) if len(sys.argv) > 2 else 0.25
    umbral = float(sys.argv[3]) if len(sys.argv) > 3 else 0.22
    dur, tramos = planos(src, paso, umbral)
    print(f"{os.path.basename(src)}  ·  {dur:.1f}s")
    for i, (ini, fin) in enumerate(tramos, 1):
        print(f"  plano {i:2d}:  {ini:6.2f}s → {fin:6.2f}s   ({fin-ini:.2f}s)")
