#!/usr/bin/env python3
"""Compara recortes verticales de un plano para elegir el encuadre.

Un bruto horizontal recortado a 9:16 pierde los laterales, y ahí es donde
suele estar la gente. El recorte central parte personas por la mitad más a
menudo de lo que parece, así que conviene mirar varias posiciones antes de
decidir, en vez de ponerlo a ojo y descubrirlo en el render.

Cada columna es una posición del recorte y cada fila un momento del plano,
porque la gente se mueve: un encuadre que funciona al principio puede dejar
a alguien cortado al final.

    python3 encuadre.py plano.mp4 comparativa.jpg 25,45,62,80

El número es el que se pone luego en `encuadre`: "45% 50%" desplaza el
recorte al 45 % del ancho original, 0 % se queda con el borde izquierdo y
100 % con el derecho.
"""
import os, pathlib, subprocess, sys, tempfile

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from planos import FF, duracion
from PIL import Image, ImageDraw

CW, CH = 203, 360
MOMENTOS = (0.12, 0.5, 0.88)


def main():
    if len(sys.argv) < 3:
        raise SystemExit(__doc__)
    src, salida = sys.argv[1], sys.argv[2]
    posiciones = [int(p) for p in (sys.argv[3] if len(sys.argv) > 3 else "25,50,75").split(",")]

    dur = duracion(src)
    tmp = tempfile.mkdtemp()
    hoja = Image.new("RGB", (len(posiciones) * CW, len(MOMENTOS) * CH), (14, 44, 31))
    dib = ImageDraw.Draw(hoja)

    for fila, frac in enumerate(MOMENTOS):
        t = dur * frac
        for col, pos in enumerate(posiciones):
            # Reproduce lo que hace `objectPosition` en el navegador.
            vf = f"crop=ih*9/16:ih:(iw-ih*9/16)*{pos}/100:0"
            p = os.path.join(tmp, f"{fila}-{col}.jpg")
            subprocess.run([FF, "-v", "error", "-ss", f"{t:.2f}", "-i", src,
                            "-frames:v", "1", "-vf", vf, "-y", p], check=True)
            x, y = col * CW, fila * CH
            hoja.paste(Image.open(p).resize((CW, CH)), (x, y))
            dib.rectangle([x, y, x + CW, y + 20], fill=(24, 72, 52))
            dib.text((x + 5, y + 5), f"{pos}%  ·  {t:.2f}s", fill=(176, 248, 8))

    hoja.save(salida, quality=88)
    print(f"{salida}  ·  {pathlib.Path(src).name}  ·  {dur:.2f}s")


if __name__ == "__main__":
    main()
