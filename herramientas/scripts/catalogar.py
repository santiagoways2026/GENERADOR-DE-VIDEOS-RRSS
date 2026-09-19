#!/usr/bin/env python3
"""Genera una hoja de contactos de un vídeo: N fotogramas con su marca de tiempo.

Sirve para catalogar brutos sin tener que abrirlos uno a uno: de un vistazo se
ve cuántos planos distintos contiene un archivo y en qué segundo empieza cada
uno.

    python3 catalogar.py entrada.mp4 salida.jpg [columnas] [filas]
"""
import subprocess, sys, tempfile, os, json, pathlib, shutil
from PIL import Image, ImageDraw


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
    out = subprocess.run(
        [FP, "-v", "error", "-show_entries", "format=duration", "-of", "json", src],
        capture_output=True, text=True, check=True)
    return float(json.loads(out.stdout)["format"]["duration"])


def hoja(src, dst, cols=5, filas=3, ancho=380):
    dur = duracion(src)
    n = cols * filas
    tiempos = [dur * (i + 0.5) / n for i in range(n)]
    tmp = tempfile.mkdtemp()
    miniaturas = []
    for i, t in enumerate(tiempos):
        p = os.path.join(tmp, f"{i:03d}.jpg")
        subprocess.run([FF, "-v", "error", "-ss", f"{t:.2f}", "-i", src,
                        "-frames:v", "1", "-vf", f"scale={ancho}:-1", p, "-y"],
                       check=True)
        if os.path.exists(p):
            miniaturas.append((t, Image.open(p).convert("RGB")))
    if not miniaturas:
        raise SystemExit("sin fotogramas")

    w, h = miniaturas[0][1].size
    hoja = Image.new("RGB", (cols * w, filas * h), "#184834")
    dibujo = ImageDraw.Draw(hoja)
    for i, (t, im) in enumerate(miniaturas):
        x, y = (i % cols) * w, (i // cols) * h
        hoja.paste(im, (x, y))
        etiqueta = f"{t:.1f}s"
        dibujo.rectangle([x + 6, y + 6, x + 12 + 8 * len(etiqueta), y + 28], fill="#184834")
        dibujo.text((x + 10, y + 12), etiqueta, fill="#B0F808")
    hoja.save(dst, quality=88)
    print(f"{dst}  ·  {dur:.1f}s  ·  {len(miniaturas)} fotogramas")


if __name__ == "__main__":
    src, dst = sys.argv[1], sys.argv[2]
    c = int(sys.argv[3]) if len(sys.argv) > 3 else 5
    f = int(sys.argv[4]) if len(sys.argv) > 4 else 3
    hoja(src, dst, c, f)
