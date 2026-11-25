#!/usr/bin/env python3
"""Descarga un mosaico de imagen de satélite (Esri World Imagery) para un
recuadro y lo une en una sola imagen, con la georreferencia en un JSON.

Es la misma fuente que usan los configuradores de mapas-vfx. Atribución
obligatoria en pantalla: «Imagen: Esri, Maxar, Earthstar Geographics».

    python3 satelite.py lon_min lat_min lon_max lat_max zoom salida.jpg
"""
import io, json, math, sys, urllib.request
from concurrent.futures import ThreadPoolExecutor
from PIL import Image

URL = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"


def px(lon, lat, z):
    """Coordenadas en píxeles de Web Mercator a ese zoom."""
    n = 256 * 2 ** z
    x = (lon + 180) / 360 * n
    s = math.sin(math.radians(lat))
    y = (0.5 - math.log((1 + s) / (1 - s)) / (4 * math.pi)) * n
    return x, y


def baja(z, x, y):
    req = urllib.request.Request(URL.format(z=z, x=x, y=y), headers={"User-Agent": "mapas-video/1.0"})
    for _ in range(4):
        try:
            with urllib.request.urlopen(req, timeout=30) as r:
                return x, y, Image.open(io.BytesIO(r.read())).convert("RGB")
        except Exception:
            pass
    raise RuntimeError(f"tesela {z}/{y}/{x}")


def main():
    lon0, lat0, lon1, lat1, z = map(float, sys.argv[1:6])
    z = int(z)
    salida = sys.argv[6]
    xa, ya = px(lon0, lat1, z)
    xb, yb = px(lon1, lat0, z)
    tx0, ty0, tx1, ty1 = int(xa // 256), int(ya // 256), int(xb // 256), int(yb // 256)
    tiles = [(x, y) for x in range(tx0, tx1 + 1) for y in range(ty0, ty1 + 1)]
    im = Image.new("RGB", ((tx1 - tx0 + 1) * 256, (ty1 - ty0 + 1) * 256))
    with ThreadPoolExecutor(6) as ex:
        for x, y, t in ex.map(lambda t: baja(z, *t), tiles):
            im.paste(t, ((x - tx0) * 256, (y - ty0) * 256))
    im.save(salida, quality=88)
    meta = {"zoom": z, "origenX": tx0 * 256, "origenY": ty0 * 256, "ancho": im.width, "alto": im.height,
            "atribucion": "Imagen: Esri, Maxar, Earthstar Geographics"}
    json.dump(meta, open(salida.rsplit(".", 1)[0] + ".json", "w"), indent=1)
    print(len(tiles), "teselas", im.size)


main()
