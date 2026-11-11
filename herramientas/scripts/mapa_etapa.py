#!/usr/bin/env python3
"""Prepara los datos de mapa y perfil de una etapa para Remotion.

    /usr/bin/python3 herramientas/scripts/mapa_etapa.py herramientas/scripts/etapas/vigo-redondela.json

Lee una configuración (encuadre, municipios, puntos de paso, paradas) y
escribe `video/src/datos/etapa-<id>.json` con:

- `tierra`: la costa, sacada de los límites municipales de OpenStreetMap
  (Nominatim). El mar es lo que queda sin pintar.
- `ruta`: si hay `relacion`, el trazado oficial del Camino en OpenStreetMap
  entre el primer y el último punto (camino más corto dentro de la
  relación); si no, una ruta a pie por los puntos de paso (FOSSGIS, foot).
  `enlace` añade delante un tramo a pie desde un punto (el centro de la
  ciudad) hasta el inicio del trazado oficial.
- `paradas`: cada parada colocada sobre la ruta, con su km.
- `rios`, `autopistas`, `tren`, `agua`: si la configuración pide `capas`, los
  ríos, autopistas y autovías, vías de tren y embalses de OpenStreetMap,
  descargados por cuadrículas de la API principal (Overpass no es accesible
  desde la nube) y guardados en `herramientas/scripts/etapas/.cache/`.
- `perfil`: altitud cada ~100 m (EU-DEM 25 m, vía OpenTopoData), si se pide.

Todo en píxeles del lienzo `ancho` x `alto`. Los datos de OpenStreetMap
obligan a poner "© colaboradores de OpenStreetMap" en la imagen.
"""
import json, math, sys, time, urllib.parse, urllib.request
from pathlib import Path

UA = {"User-Agent": "mapa-etapa/1.0"}
RAIZ = Path(__file__).resolve().parents[2]


def get(url):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.load(r)


def municipio(nombre):
    q = urllib.parse.quote(f"{nombre}, Pontevedra, Galicia")
    d = get(f"https://nominatim.openstreetmap.org/search?q={q}&format=geojson"
            "&polygon_geojson=1&polygon_threshold=0.0003&limit=1&featureType=settlement")
    time.sleep(1.1)
    g = d["features"][0]["geometry"]
    return g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]


def trazado_oficial(relacion, desde, hasta, dist):
    """Camino más corto entre dos puntos usando solo las vías de la relación."""
    import heapq
    d = get(f"https://api.openstreetmap.org/api/0.6/relation/{relacion}/full.json")["elements"]
    nodos = {e["id"]: (e["lon"], e["lat"]) for e in d if e["type"] == "node"}
    G = {}
    for w in (e for e in d if e["type"] == "way"):
        for a, b in zip(w["nodes"], w["nodes"][1:]):
            if a in nodos and b in nodos:
                dd = dist(nodos[a], nodos[b])
                G.setdefault(a, []).append((b, dd))
                G.setdefault(b, []).append((a, dd))
    s = min(G, key=lambda n: dist(nodos[n], desde))
    t = min(G, key=lambda n: dist(nodos[n], hasta))
    D, P, h = {s: 0}, {}, [(0, s)]
    while h:
        c, u = heapq.heappop(h)
        if u == t:
            break
        if c > D[u]:
            continue
        for v, w in G[u]:
            if c + w < D.get(v, 1e9):
                D[v], P[v] = c + w, u
                heapq.heappush(h, (c + w, v))
    camino = [t]
    while camino[-1] != s:
        camino.append(P[camino[-1]])
    return [list(nodos[n]) for n in reversed(camino)]


INTERES = {"waterway": {"river", "stream", "canal"},
           "highway": {"motorway", "trunk"},
           "railway": {"rail"}, "natural": {"water"}}


def capas_osm(id_, lon0, lon1, lat0, lat1):
    """Vías de interés del encuadre, por cuadrículas de 0,025° con caché."""
    import urllib.error
    cache = Path(__file__).parent / "etapas" / ".cache" / f"osm-{id_}.json"
    if cache.exists():
        return json.load(open(cache))
    keep = {}

    def bajar(a, b, c, d, nivel=0):
        url = f"https://api.openstreetmap.org/api/0.6/map.json?bbox={a},{c},{b},{d}"
        try:
            els = get(url)["elements"]
        except urllib.error.HTTPError as e:
            if e.code == 400 and nivel < 3:  # demasiados nodos: se parte en cuatro
                m, n = (a + b) / 2, (c + d) / 2
                for q in [(a, m, c, n), (m, b, c, n), (a, m, n, d), (m, b, n, d)]:
                    bajar(*q, nivel + 1)
                return
            raise
        nodos = {e["id"]: (e["lon"], e["lat"]) for e in els if e["type"] == "node"}
        for e in els:
            t = e.get("tags", {})
            if e["type"] == "way" and any(t.get(k) in v for k, v in INTERES.items()):
                co = [nodos[n] for n in e["nodes"] if n in nodos]
                if len(co) > len(keep.get(str(e["id"]), {}).get("co", [])):
                    keep[str(e["id"])] = {"tags": t, "co": co}
        time.sleep(1)

    paso, x = 0.025, lon0
    while x < lon1 - 1e-9:
        y = lat0
        while y < lat1 - 1e-9:
            bajar(round(x, 4), round(min(x + paso, lon1), 4), round(y, 4), round(min(y + paso, lat1), 4))
            y += paso
        x += paso
    cache.parent.mkdir(exist_ok=True)
    json.dump(keep, open(cache, "w"))
    return keep


def main(ruta_cfg):
    cfg = json.load(open(ruta_cfg))
    W, H = cfg["ancho"], cfg["alto"]
    lon0, lon1, lat0, lat1 = cfg["encuadre"]
    k = math.cos(math.radians((lat0 + lat1) / 2))
    # Encaja el encuadre en el lienzo sin deformar, centrado.
    esc = min(W / ((lon1 - lon0) * k), H / (lat1 - lat0))
    clon, clat = (lon0 + lon1) / 2, (lat0 + lat1) / 2

    def p(lon, lat):
        return (round(W / 2 + (lon - clon) * k * esc, 1), round(H / 2 - (lat - clat) * esc, 1))

    def anillo(r):
        return "M" + "L".join(f"{x},{y}" for x, y in (p(*c) for c in r)) + "Z"

    tierra = [" ".join(anillo(r) for poly in municipio(m) for r in poly) for m in cfg["municipios"]]

    def dist(a, b):
        dx = (b[0] - a[0]) * math.cos(math.radians(a[1])) * 111.32
        dy = (b[1] - a[1]) * 110.57
        return math.hypot(dx, dy)

    if cfg.get("relacion"):
        co = trazado_oficial(cfg["relacion"], cfg["puntos"][0], cfg["puntos"][-1], dist)
        if cfg.get("enlace"):
            # Tramo a pie desde el centro hasta donde empieza el trazado oficial.
            a, b = cfg["enlace"], co[0]
            r = get("https://routing.openstreetmap.de/routed-foot/route/v1/driving/"
                    f"{a[0]},{a[1]};{b[0]},{b[1]}?overview=full&geometries=geojson")["routes"][0]
            co = r["geometry"]["coordinates"] + co
    else:
        w = ";".join(f"{lon},{lat}" for lon, lat in cfg["puntos"])
        r = get(f"https://routing.openstreetmap.de/routed-foot/route/v1/driving/{w}?overview=full&geometries=geojson")["routes"][0]
        co = r["geometry"]["coordinates"]

    acum = [0.0]
    for a, b in zip(co, co[1:]):
        acum.append(acum[-1] + dist(a, b))
    total = acum[-1]

    pts, kms = [p(*co[0])], [0.0]
    for c, km in zip(co[1:], acum[1:]):
        q = p(*c)
        if math.dist(q, pts[-1]) >= 2:
            pts.append(q); kms.append(km)
    pts.append(p(*co[-1])); kms.append(total)

    paradas = []
    for nombre, lon, lat in cfg["paradas"]:
        t = p(lon, lat)
        i = min(range(len(pts)), key=lambda j: math.dist(pts[j], t))
        paradas.append({"nombre": nombre, "x": pts[i][0], "y": pts[i][1], "km": round(kms[i], 2)})

    salida = {"ancho": W, "alto": H, "km": round(total, 1), "tierra": tierra,
              "ruta": [list(x) for x in pts], "paradas": paradas}

    if cfg.get("capas"):
        # El encuadre visible real, que es más ancho que el pedido si el lienzo lo es.
        vlon = W / 2 / (k * esc); vlat = H / 2 / esc
        vias = capas_osm(cfg["id"], clon - vlon, clon + vlon, clat - vlat, clat + vlat)

        def linea(co):
            q = [p(*c) for c in co]
            sim = [q[0]]
            for r in q[1:]:
                if math.dist(r, sim[-1]) >= 1.5:
                    sim.append(r)
            if len(q) > 1 and sim[-1] != q[-1]:
                sim.append(q[-1])
            return sim

        def d(sim, cerrar=False):
            return "M" + "L".join(f"{x},{y}" for x, y in sim) + ("Z" if cerrar else "")

        rios, autopistas, tren, agua = [], [], [], []
        etiquetas = {}
        for v in vias.values():
            t, sim = v["tags"], linea(v["co"])
            if len(sim) < 2 or t.get("tunnel") in ("yes", "culvert") or t.get("layer", "0").startswith("-"):
                continue
            if t.get("waterway"):
                nombre = t.get("name")
                principal = t["waterway"] in ("river", "canal") or nombre in cfg.get("rios_extra", [])
                if not principal and not nombre:
                    continue
                rios.append({"d": d(sim), "principal": principal})
                # Rótulo en el tramo visible más largo de cada río con nombre.
                dentro = [r for r in sim if 40 < r[0] < W - 40 and 40 < r[1] < H - 40]
                if principal and nombre and len(dentro) > len(etiquetas.get(nombre, [])):
                    etiquetas[nombre] = dentro
            elif t.get("highway") in ("motorway", "trunk"):
                autopistas.append({"d": d(sim), "puente": t.get("bridge") == "yes", "nombre": t.get("name", "")})
            elif t.get("railway") == "rail":
                if t.get("service") or t.get("usage") == "industrial":
                    continue
                tren.append(d(sim))
            elif t.get("natural") == "water" and v["co"][0] == v["co"][-1]:
                agua.append(d(sim, True))

        rotulos = []
        for nombre, pts_ in etiquetas.items():
            if len(pts_) < 6:
                continue
            m = len(pts_) // 2
            a, b = pts_[max(0, m - 3)], pts_[min(len(pts_) - 1, m + 3)]
            giro = math.degrees(math.atan2(b[1] - a[1], b[0] - a[0]))
            if giro > 90: giro -= 180
            if giro < -90: giro += 180
            rotulos.append({"nombre": nombre, "x": pts_[m][0], "y": pts_[m][1], "giro": round(giro)})
        salida.update(rios=rios, autopistas=autopistas, tren=tren, agua=agua, rotulosRios=rotulos)

    if cfg.get("perfil"):
        n = max(20, int(total * 10))
        muestras, j = [], 0
        for s in range(n + 1):
            km = total * s / n
            while j < len(acum) - 2 and acum[j + 1] < km:
                j += 1
            f = 0 if acum[j + 1] == acum[j] else (km - acum[j]) / (acum[j + 1] - acum[j])
            a, b = co[j], co[j + 1]
            muestras.append((km, a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f))
        alts = []
        for i in range(0, len(muestras), 100):
            lote = "|".join(f"{la:.6f},{lo:.6f}" for _, lo, la in muestras[i:i + 100])
            d = get(f"https://api.opentopodata.org/v1/eudem25m?locations={lote}")
            alts += [x["elevation"] for x in d["results"]]
            time.sleep(1.2)
        # Algún punto en el puerto cae fuera del modelo: se toma el vecino.
        for i, a in enumerate(alts):
            if a is None:
                alts[i] = next((x for x in alts[i:] if x is not None), alts[i - 1] if i else 0)
        # Media móvil corta: el modelo de 25 m mete dientes que no se notan andando.
        suave = [sum(alts[max(0, i - 2):i + 3]) / len(alts[max(0, i - 2):i + 3]) for i in range(len(alts))]
        salida["perfil"] = [[round(m[0], 2), round(a)] for m, a in zip(muestras, suave)]

    destino = RAIZ / "video/src/datos" / f"etapa-{cfg['id']}.json"
    json.dump(salida, open(destino, "w"), ensure_ascii=False)
    print(destino, f"{total:.1f} km", len(pts), "puntos")


if __name__ == "__main__":
    main(sys.argv[1])
