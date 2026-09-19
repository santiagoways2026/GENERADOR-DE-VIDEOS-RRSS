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


def fin_de_toma(src, umbral=0.22, paso=0.25):
    """Segundo en el que se acaba la primera toma del archivo.

    Es el limite real de un plano, y no siempre es donde acaba el archivo:
    `iglesia-exterior.mp4` dura 1,37 s pero su toma se corta en 1,25 y lo que
    viene detras es otra escena. Un `dura` por encima de ese limite mete en
    pantalla un fotograma en blanco y un trozo de la toma siguiente. Paso de
    un segundo en el short del Frances, y no lo vio nadie hasta verlo.

    Primero busca el corte a saltos, como `planos()`, y luego lo afina
    partiendo el intervalo por la mitad: a saltos de 0,25 s el corte puede
    estar hasta un cuarto de segundo antes de donde se detecta, que es
    demasiado margen para tomas que duran uno o dos segundos.
    """
    dur = duracion(src)
    tmp = tempfile.mkdtemp()

    def muestra(t):
        p = os.path.join(tmp, f"{int(t*1000):07d}.jpg")
        if not os.path.exists(p):
            subprocess.run([FF, "-v", "error", "-ss", f"{t:.3f}", "-i", src,
                            "-frames:v", "1", "-vf", "scale=160:-1", p, "-y"],
                           check=False)
        return firma(p) if os.path.exists(p) else None

    ancla = muestra(0.0)
    if ancla is None:
        return dur

    antes, previa, t, corte = 0.0, ancla, paso, None
    while t < dur:
        actual = muestra(t)
        if actual is not None:
            if distancia(previa, actual) > umbral:
                corte = (antes, t)
                break
            antes, previa = t, actual
        t += paso

    if corte is None:
        return dur

    lo, hi = corte
    referencia = muestra(lo)
    for _ in range(6):
        medio = (lo + hi) / 2
        actual = muestra(medio)
        if actual is None or referencia is None:
            break
        if distancia(referencia, actual) > umbral:
            hi = medio
        else:
            lo = medio
    return lo
