#!/usr/bin/env python3
"""Propone el `objectPosition` de cada plano al pasar de horizontal a vertical.

Un 16:9 recortado a 9:16 con `cover` deja ver **el 33,75 % del ancho**. Todo lo
demas se va, y en estos brutos lo que se va por los lados suele ser la gente.
Este script mide donde esta lo que hay que dejar dentro y devuelve el numero
que se le pasa a `mirar()` en la escena.

Mira tres cosas, por este orden:

1. **Caras**, con YuNet. Si hay una cara, manda: una cara cortada no hay
   encuadre bonito que la salve. Se coge la mas grande de cada fotograma y se
   promedia por el plano, que es mas estable que fiarse de un fotograma.
2. **Quien se mueve**, si no hay cara. En estos brutos la camara esta quieta y
   lo unico que se mueve es el peregrino, asi que la diferencia entre
   fotogramas lo senala directamente. Si el movimiento esta repartido por mas
   de media imagen es que la camara panea, y entonces no dice nada y se pasa
   al siguiente.
3. **Donde esta el detalle**, si no hay ni cara ni movimiento util. Se mide la
   energia de bordes por columnas y se busca la ventana de 33,75 % de ancho
   que mas recoge. Un cielo liso no puntua; un muro o una fachada si.

Lo de los bordes solo no vale, y por eso hay un paso en medio: en el plano del
peregrino que cruza la vegetacion, los bordes se iban a los arbustos, que
tienen mucho mas detalle que una persona a cien metros, y dejaban al peregrino
fuera de cuadro.

    python3 encuadrar.py <video.mp4> [desde,hasta] [desde,hasta] ...

Sin tramos, mide el archivo entero. Imprime para cada tramo el punto en tanto
por uno y la llamada a `mirar()` ya escrita, mas si la decision viene de una
cara o de los bordes. **La propuesta se mira siempre en un fotograma antes de
darla por buena**: el script no sabe si el que sale de lado es el importante.
"""
import os
import subprocess
import sys

import cv2
import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from ambiente import binarios  # noqa: E402

VENTANA = (9 / 16) / (16 / 9)   # 33,75 % del ancho
ANCHO, ALTO = 320, 180
MUESTRAS = 9
MODELO = "yunet.onnx"


def fotogramas(ff, ruta, desde, dura, n=MUESTRAS):
    cmd = [ff, "-v", "error"]
    if desde is not None:
        cmd += ["-ss", str(desde)]
    cmd += ["-i", ruta]
    if dura is not None:
        cmd += ["-t", str(dura)]
    cmd += ["-vf", f"scale={ANCHO}:{ALTO}", "-pix_fmt", "bgr24", "-f", "rawvideo", "-"]
    raw = subprocess.run(cmd, capture_output=True).stdout
    a = np.frombuffer(raw, np.uint8).reshape(-1, ALTO, ANCHO, 3)
    if not len(a):
        return a
    return a[np.linspace(0, len(a) - 1, min(n, len(a))).astype(int)]


def caras(det, cuadros):
    """Centro horizontal de la cara mas grande de cada fotograma, en 0-1."""
    fuera = []
    for c in cuadros:
        _, caras_ = det.detect(np.ascontiguousarray(c))
        if caras_ is None or not len(caras_):
            continue
        x, _y, w, _h = max(caras_, key=lambda f: f[2] * f[3])[:4]
        fuera.append((x + w / 2) / ANCHO)
    return fuera


def movimiento(cuadros):
    """Columna donde se concentra lo que se mueve, o None si panea la camara."""
    gris = cuadros.mean(3).astype(np.float32)
    d = np.abs(np.diff(gris, axis=0)).mean(0).sum(0)
    d = d - np.median(d)            # el suelo de ruido de compresion no cuenta
    d[d < 0] = 0
    if not d.sum():
        return None
    # Si lo que se mueve ocupa mas de media imagen, es la camara, no un sujeto.
    orden = np.sort(d)[::-1]
    if np.searchsorted(np.cumsum(orden), 0.75 * d.sum()) > 0.5 * ANCHO:
        return None
    ancho = max(1, int(round(VENTANA * ANCHO)))
    suma = np.convolve(d, np.ones(ancho), "valid")
    return (int(np.argmax(suma)) + ancho / 2) / ANCHO


def bordes(cuadros):
    """Ventana de 33,75 % que mas energia de bordes recoge."""
    gris = cuadros.mean(3).astype(np.float32)
    e = np.abs(np.diff(gris, axis=2)).mean(0).sum(0)
    ancho = max(1, int(round(VENTANA * ANCHO)))
    suma = np.convolve(e, np.ones(ancho), "valid")
    return (int(np.argmax(suma)) + ancho / 2) / ANCHO


def encuadra(det, ff, ruta, desde=None, hasta=None):
    dura = None if hasta is None else hasta - desde
    cuadros = fotogramas(ff, ruta, desde, dura)
    if not len(cuadros):
        return None, "sin imagen", 0
    vistas = caras(det, cuadros)
    if len(vistas) >= 2:
        # Mediana: una deteccion suelta en un arbusto no mueve el encuadre.
        return float(np.median(vistas)), "cara", len(vistas)
    # Para el movimiento hacen falta fotogramas seguidos, no nueve repartidos.
    seguidos = fotogramas(ff, ruta, desde, min(dura or 1.0, 1.0), n=30)
    p = movimiento(seguidos) if len(seguidos) > 2 else None
    if p is not None:
        return p, "movimiento", 0
    return bordes(cuadros), "bordes", 0


def main():
    if len(sys.argv) < 2:
        sys.exit("uso: encuadrar.py <video.mp4> [desde,hasta] ...")
    ruta = sys.argv[1]
    modelo = os.path.join(os.path.dirname(os.path.abspath(__file__)), MODELO)
    if not os.path.exists(modelo):
        sys.exit(f"falta {modelo}: se baja de las releases de opencv_zoo")
    det = cv2.FaceDetectorYN.create(modelo, "", (ANCHO, ALTO), 0.6, 0.3, 500)
    ff = binarios()

    tramos = [tuple(float(x) for x in a.split(",")) for a in sys.argv[2:]] or [(None, None)]
    for desde, hasta in tramos:
        p, motivo, n = encuadra(det, ff, ruta, desde, hasta)
        if p is None:
            print(f"  {desde}-{hasta}  sin imagen")
            continue
        etiqueta = f"{desde:6.2f}-{hasta:6.2f}" if desde is not None else "archivo entero"
        marca = f"{motivo} ({n})" if motivo == "cara" else motivo
        print(f"  {etiqueta}   mirar({p:.2f})   {marca}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
