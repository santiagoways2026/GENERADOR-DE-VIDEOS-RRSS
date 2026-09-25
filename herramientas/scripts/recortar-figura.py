#!/usr/bin/env python3
"""Cambia el fondo de un tramo de vídeo por el degradado de marca.

Para las piezas de divulgación, las que abren con un titular grande y la
presentadora recortada encima. El recorte se hace con **u2net_human_seg**, que
se baja de las releases de `danielgatis/rembg`, en GitHub, que es de los pocos
sitios de modelos que el entorno deja pasar.

Por qué ese modelo y no otro
----------------------------
Se probó antes `human_segmentation_pphumanseg` de opencv_zoo, que pesa 6 MB y
va mucho más rápido. No sirve: trabaja a 192x192 y aquí el lienzo es 686x1218,
así que además de submuestrear cuatro veces le llega la persona aplastada de
ancho. En el fotograma de prueba le metía una caña de bambú por la mejilla y
dejaba fondo pegado en las esquinas de abajo. u2net va a 320x320 y sin
deformar, y sale limpio: pelo, contorno y cara.

Lo que hace, por fotograma:

1. Saca el alfa con el modelo.
2. **Se queda sólo con la mancha grande.** El modelo suela encender trozos
   sueltos del fondo; la persona es una sola región conexa.
3. **Suaviza el alfa en el tiempo**, con una media de tres fotogramas. Sin
   esto el contorno hierve: el modelo no sabe que los fotogramas van seguidos
   y cada uno le sale un poco distinto.
4. Compone sobre el degradado y, al final del tramo, **vuelve al fondo real
   con un fundido**. Sólo cambia el fondo: la persona se queda donde está y
   del mismo tamaño, así que lo que se funde es el bambú apareciendo detrás.
   Un corte seco ahí se lee como un fallo, porque el plano de ella no cambia
   y el fondo sí.

**Y la persona no se toca de tamaño, aunque tiente.** Se probó encogerla al
86 % y pegarla abajo, que es como sale en los modelos de este formato y deja
sitio de sobra para el titular. No vale, por el fundido de vuelta: sea cual
sea la forma de deshacerlo, en esas cuatro décimas se ven las dos, la pequeña
y la de tamaño natural, una encima de otra. Y si en vez de fundir se corta,
el salto de tamaño sobre la misma persona se lee como un fallo de montaje.
El titular se ajusta a ella, no al revés: se mide dónde empieza su pelo, que
aquí es el píxel 444 de 1920, y el texto se queda por encima.

    python3 recortar-figura.py <entrada.mp4> <salida.mp4> --hasta 2.9 --vuelta 0.4
"""
import argparse
import os
import re
import subprocess
import sys

import cv2
import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from ambiente import binarios  # noqa: E402

AQUI = os.path.dirname(os.path.abspath(__file__))
MODELO = os.path.join(AQUI, "u2net_human_seg.onnx")
LADO = 320
# Bosque y olivo de la guía. El degradado va de uno a otro de arriba abajo.
BOSQUE = (0x18, 0x48, 0x34)
OLIVO = (0x7A, 0xA6, 0x06)


def sesion():
    import onnxruntime as ort
    if not os.path.exists(MODELO):
        sys.exit(f"falta {MODELO}\n"
                 "  curl -sSL -o herramientas/scripts/u2net_human_seg.onnx \\\n"
                 "    https://github.com/danielgatis/rembg/releases/download/v0.0.0/"
                 "u2net_human_seg.onnx")
    return ort.InferenceSession(MODELO, providers=["CPUExecutionProvider"])


def alfa(ses, nombre, im):
    rgb = cv2.cvtColor(im, cv2.COLOR_BGR2RGB).astype(np.float32) / 255.0
    r = cv2.resize(rgb, (LADO, LADO), interpolation=cv2.INTER_AREA)
    m = np.array([0.485, 0.456, 0.406], np.float32)
    s = np.array([0.229, 0.224, 0.225], np.float32)
    x = ((r - m) / s).transpose(2, 0, 1)[None]
    o = ses.run(None, {nombre: x})[0][0, 0]
    o = (o - o.min()) / (o.max() - o.min() + 1e-9)
    return cv2.resize(o, (im.shape[1], im.shape[0]), interpolation=cv2.INTER_LINEAR)


def sola_la_grande(a):
    """El modelo enciende trozos sueltos del fondo. La persona es una sola."""
    duro = (a > 0.5).astype(np.uint8)
    n, etiq, est, _ = cv2.connectedComponentsWithStats(duro, 8)
    if n <= 1:
        return a
    grande = 1 + int(np.argmax(est[1:, cv2.CC_STAT_AREA]))
    return a * (etiq == grande)


def degradado(h, w):
    y = np.linspace(0, 1, h)[:, None, None]
    c1 = np.array(BOSQUE[::-1], np.float32)   # BGR
    c2 = np.array(OLIVO[::-1], np.float32)
    return (c1 * (1 - y) + c2 * y) * np.ones((1, w, 1), np.float32)


def main():
    p = argparse.ArgumentParser()
    p.add_argument("entrada")
    p.add_argument("salida")
    p.add_argument("--hasta", type=float, required=True,
                   help="segundo hasta el que el fondo es el degradado")
    p.add_argument("--vuelta", type=float, default=0.4,
                   help="segundos de fundido de vuelta al fondo real")
    p.add_argument("--fps", type=float, default=30.0)
    a = p.parse_args()

    ff = binarios()
    ses = sesion()
    nombre = ses.get_inputs()[0].name

    tam = subprocess.run([ff, "-hide_banner", "-i", a.entrada],
                         capture_output=True).stderr.decode()
    ancho, alto = (int(x) for x in re.search(r"(\d{3,4})x(\d{3,4})", tam).groups())

    total = int(round((a.hasta + a.vuelta) * a.fps))
    print(f"{ancho}x{alto}, {total} fotogramas a tratar")

    lee = subprocess.Popen([ff, "-v", "error", "-i", a.entrada, "-pix_fmt", "bgr24",
                            "-f", "rawvideo", "-"], stdout=subprocess.PIPE)
    escribe = subprocess.Popen(
        [ff, "-y", "-v", "error", "-f", "rawvideo", "-pix_fmt", "bgr24",
         "-s", f"{ancho}x{alto}", "-r", str(a.fps), "-i", "-",
         "-i", a.entrada, "-map", "0:v", "-map", "1:a?",
         "-c:v", "libx264", "-crf", "18", "-preset", "medium",
         "-pix_fmt", "yuv420p", "-c:a", "copy", "-shortest",
         "-movflags", "+faststart", a.salida], stdin=subprocess.PIPE)

    fondo = degradado(alto, ancho)
    n = ancho * alto * 3
    cola = []      # los tres ultimos alfas, para suavizar en el tiempo
    i = 0
    while True:
        buf = lee.stdout.read(n)
        if len(buf) < n:
            break
        im = np.frombuffer(buf, np.uint8).reshape(alto, ancho, 3)
        if i < total:
            m = sola_la_grande(alfa(ses, nombre, im))
            cola.append(m)
            if len(cola) > 3:
                cola.pop(0)
            m = np.mean(cola, 0)
            # cuanto pesa el degradado: 1 hasta `hasta`, luego baja
            t = i / a.fps
            peso = 1.0 if t <= a.hasta else max(0.0, 1 - (t - a.hasta) / a.vuelta)
            # Solo cambia el fondo: 1 = imagen real, 0 = degradado.
            mez = m + (1 - m) * (1 - peso)
            salida = im.astype(np.float32) * mez[:, :, None] + fondo * (1 - mez[:, :, None])
            escribe.stdin.write(salida.astype(np.uint8).tobytes())
            if i % 15 == 0:
                print(f"  {i}/{total}", flush=True)
        else:
            escribe.stdin.write(buf)
        i += 1
    escribe.stdin.close()
    escribe.wait()
    lee.stdout.close()
    lee.wait()
    print(f"listo: {a.salida} ({i} fotogramas)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
