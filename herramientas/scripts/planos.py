#!/usr/bin/env python3
"""Detecta los cambios de plano de un vídeo comparando fotogramas.

Los brutos son compilaciones con varios planos pegados. Cortar a ciegas
mete medio plano ajeno en la escena, así que conviene saber dónde empieza
y acaba cada uno antes de elegir el trozo.

    python3 planos.py entrada.mp4 [paso_en_segundos] [umbral]
"""
import subprocess, sys, tempfile, os, json, pathlib, shutil
from PIL import Image

def _binario(nombre):
    """El ffmpeg que trae Remotion, sin depender de que haya uno en el sistema.

    Se busca desde la raiz del repositorio: la ruta exacta cambia entre la
    build de glibc y la de musl, y entre maquinas."""
    raiz = pathlib.Path(__file__).resolve().parents[2]
    for patron in ("video/node_modules/@remotion/compositor-*/" + nombre,
                   "node_modules/@remotion/compositor-*/" + nombre):
        for ruta in sorted(raiz.glob(patron)):
            if os.access(ruta, os.X_OK):
                return str(ruta)
    hallado = shutil.which(nombre)
    if hallado:
        return hallado
    raise SystemExit(
        f"No encuentro {nombre}. Ejecuta `npm install` dentro de video/.")


FF = _binario("ffmpeg")
FP = _binario("ffprobe")


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
