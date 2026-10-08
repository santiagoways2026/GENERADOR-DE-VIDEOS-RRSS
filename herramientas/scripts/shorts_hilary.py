"""Genera el guion de montaje de los shorts verticales de Hildary.

Lee la transcripción palabra a palabra del vídeo largo (faster-whisper) y,
para cada short, resuelve las frases elegidas a sus tiempos exactos. Todo lo
que el render necesita sale ya en tiempo de salida: tramos de voz, planos,
B-roll, cartelas, subtítulos, efectos y música.

    python3 herramientas/scripts/shorts_hilary.py transcripcion.json

Escribe video/src/shorts/shorts.json.
"""
import json
import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
SALIDA = RAIZ / "video/src/shorts/shorts.json"

# --------------------------------------------------------------------------
# Transcripción corregida
# --------------------------------------------------------------------------

CORRECCIONES = {
    "Sarrio": "Sarria", "Farrel": "Ferrol", "tracking": "trekking",
    "Arzua": "Arzúa", "Opradruzo": "O Pedrouzo", "Perduzo": "O Pedrouzo",
    "casino": "scallop", "holograms": "pilgrims", "Waze": "Ways",
    "Francaise": "Francés", "Rey": "Rei", "Albradoro": "Obradoiro",
    "Saint-Jean-Pierre-de-Port": "Saint-Jean-Pied-de-Port",
}


def cargar_palabras(ruta):
    segs = json.load(open(ruta))
    crudas = [dict(t=w["w"].strip(), s=w["s"], e=w["e"]) for s in segs for w in s["words"]]
    ws = []
    for w in crudas:
        # Los guiones de "Saint-Jean-..." llegan como tokens sueltos.
        if w["t"].startswith("-") and ws:
            ws[-1]["t"] += w["t"]
            ws[-1]["e"] = w["e"]
        else:
            ws.append(w)
    out = []
    i = 0
    while i < len(ws):
        w = ws[i]
        nxt = ws[i + 1]["t"] if i + 1 < len(ws) else ""
        if w["t"] == "Porto" and nxt.startswith("Moren"):
            out.append(dict(t="Portomarín" + nxt[5:], s=w["s"], e=ws[i + 1]["e"]))
            i += 2
            continue
        if w["t"] == "Pala" and nxt == "de":
            w = dict(w, t="Palas")
        if w["t"] == "Plaza" and ws[i + 2]["t"].startswith("Albradoro"):
            w = dict(w, t="Praza")
            ws[i + 1] = dict(ws[i + 1], t="do")
        base = re.sub(r"[^\w\-']", "", w["t"])
        if base in CORRECCIONES:
            w = dict(w, t=w["t"].replace(base, CORRECCIONES[base]))
        out.append(w)
        i += 1
    return out


def norm(t):
    return re.sub(r"[^a-z0-9áéíóúñ']", "", t.lower())


class Texto:
    def __init__(self, palabras):
        self.ws = palabras
        self.n = [norm(w["t"]) for w in palabras]

    def buscar(self, frase, cerca, desde_idx=0, margen=25):
        objetivo = [norm(x) for x in frase.split()]
        mejor = None
        for i in range(desde_idx, len(self.ws) - len(objetivo) + 1):
            if self.n[i:i + len(objetivo)] == objetivo:
                d = abs(self.ws[i]["s"] - cerca)
                if mejor is None or d < mejor[0]:
                    mejor = (d, i)
        if mejor is None or mejor[0] > margen:
            raise ValueError(f"No encuentro '{frase}' cerca de {cerca}")
        return mejor[1]

    def tramo(self, inicio, cerca, fin):
        """Del arranque de la frase `inicio` al final de la frase `fin`."""
        i = self.buscar(inicio, cerca)
        # El final es la primera aparición de la frase después del inicio.
        f = self.buscar(fin, self.ws[i]["s"], i, margen=90) + len(fin.split()) - 1
        ws = self.ws
        a = ws[i]["s"] - 0.06
        if i > 0:
            a = max(a, (ws[i - 1]["e"] + ws[i]["s"]) / 2)
        b = ws[f]["e"] + 0.12
        if f + 1 < len(ws):
            b = min(b, (ws[f]["e"] + ws[f + 1]["s"]) / 2 + 0.05)
        return round(a, 3), round(b, 3)

    def en(self, frase, cerca):
        return self.ws[self.buscar(frase, cerca)]["s"]


# --------------------------------------------------------------------------
# Material visual
# --------------------------------------------------------------------------

YT = "hilary/youtube.mp4"
LIMPIO = "hilary/limpio.mp4"

# Tramos donde el vídeo de YouTube ya pone B-roll a pantalla completa. Van
# sincronizados con la voz, así que se reaprovechan tal cual en vertical.
# Límites medidos con detección de cortes y recortados un par de fotogramas
# hacia dentro: un límite largo dejaba ver un fotograma de Hildary.
# Fuera las dos tomas de la pareja mayor de la mano (17,2-19,0 y 75,1-78,4):
# la marca no las quiere.
STOCK = [(7.2, 17.13), (19.07, 30.7), (72.75, 75.07), (109.2, 118.9), (160.1, 161.9), (183.65, 187.9),
         (236.8, 241.05), (274.6, 285.9), (297.27, 306.9), (321.6, 331.77),
         (339.6, 341.4), (344.35, 353.33), (360.7, 376.9), (383.6, 396.4),
         (404.1, 409.9), (414.1, 419.7), (440.2, 450.9), (474.1, 486.9),
         (497.6, 504.87), (531.1, 535.73), (548.1, 557.4), (589.6, 602.27),
         (611.1, 616.23)]

# Los gráficos horizontales del vídeo largo no caben en vertical: se cambian
# por las versiones verticales en inglés que vienen en el Drive.
GRAFICOS = [
    ((57.0, 64.5), "hilary/mapas/ruta-frances.mp4", 3.0, "mapa"),
    ((88.5, 96.0), "hilary/mapas/ruta-sarria.mp4", 3.0, "mapa"),
    ((208.5, 221.0), "hilary/mapas/perfil-sarria-h.mp4", 1.0, "tarjeta"),
    ((317.5, 320.0), "hilary/mapas/etapas-sarria.mp4", 1.6, "mapa"),
    ((335.5, 338.0), "hilary/mapas/etapas-sarria.mp4", 3.7, "mapa"),
    ((357.0, 359.5), "hilary/mapas/etapas-sarria.mp4", 7.6, "mapa"),
    ((380.5, 383.5), "hilary/mapas/etapas-sarria.mp4", 9.9, "mapa"),
    ((397.5, 400.0), "hilary/mapas/etapas-sarria.mp4", 12.0, "mapa"),
]

# Música chill y baja (Kevin MacLeod, CC BY): la voz es la protagonista.
MUSICA = ["chill_Lobby_Time", "chill_Bossa_Antigua", "chill_Dreamer", "chill_Wallpaper",
          "chill_Smooth_Lovin", "chill_Deliberate_Thought", "chill_Backbay_Lounge",
          "chill_Late_Night_Radio"]

GANCHO = 2.4
CIERRE = 1.4


def cartela(nombre, **kw):
    return dict(tipo="png", src=f"hilary/cartelas/{nombre}.png", **kw)


# --------------------------------------------------------------------------
# Ritmo: sin destellos ni saltos
# --------------------------------------------------------------------------

MIN_BROLL = 2.5   # ningún recurso dura menos
MIN_HABLA = 2.0   # Hildary no asoma menos que esto entre dos recursos
LENTO = 0.7       # velocidad mínima a la que se estira un recurso
# Metraje propio de relleno para tapar un corte entre frases: gente caminando
# de espaldas, sin caras.
RELLENO = ["dji/DJI_20260929071346_0021_D.mp4", "dji/DJI_20260929073931_0046_D.mp4",
           "dji/DJI_20260929072925_0036_D.mp4", "dji/DJI_20260929074051_0048_D.mp4",
           "dji/DJI_20260929090338_0051_D.mp4", "dji/DJI_20260929073713_0044_D.mp4",
           "dji/DJI_20260929073458_0042_D.mp4", "dji/DJI_20260929090511_0056_D.mp4"]
_DURACIONES = {}


def dur_fuente(src):
    if src not in _DURACIONES:
        import subprocess
        r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0",
                            str(RAIZ / "video/public" / src)], capture_output=True, text=True)
        _DURACIONES[src] = float(r.stdout.strip() or 0)
    return _DURACIONES[src]


def estirar(b, nueva):
    """Alarga b a `nueva` segundos con más metraje o, si no hay, a cámara
    lenta. Devuelve False si haría falta ir más lento que LENTO."""
    disponible = b.get("max_src")
    if disponible is None:
        disponible = dur_fuente(b["src"]) - b["desde"]
    usado = min(disponible, nueva)
    vel = usado / nueva
    if vel < LENTO:
        return False
    b["dur"] = round(nueva, 3)
    if vel < 0.999:
        b["vel"] = round(vel, 3)
    else:
        b.pop("vel", None)
    return True


def ritmo(broll, cortes, fin, idx):
    """Menos cambios y ningún salto:
    - ningún recurso de menos de MIN_BROLL (los extra cortos se quitan);
    - cada corte entre frases de Hildary queda tapado por un recurso;
    - Hildary nunca asoma menos de MIN_HABLA entre dos recursos: el anterior
      se alarga hasta el siguiente o, si no da, se quita el extra."""
    def fin_de(b):
        return b["en"] + b["dur"]

    broll = [dict(b) for b in broll if not (b["prio"] == 1 and b["dur"] < MIN_BROLL)]
    broll.sort(key=lambda b: b["en"])
    for i, b in enumerate(broll):
        if b["dur"] < MIN_BROLL:
            tope = broll[i + 1]["en"] if i + 1 < len(broll) else fin
            estirar(b, min(MIN_BROLL, tope - b["en"]))
        # Encajonado entre dos recursos: se le recorta el principio al
        # siguiente, si le sobra, para que este no pase como un parpadeo.
        sig = broll[i + 1] if i + 1 < len(broll) else None
        falta = MIN_BROLL - b["dur"]
        if (falta > 0.01 and sig and abs(sig["en"] - (b["en"] + b["dur"])) < 0.05
                and sig["dur"] - falta >= 2.0):
            b2 = dict(b)
            if estirar(b2, b["dur"] + falta):
                b.update(b2)
                sig["en"], sig["desde"], sig["dur"] = (round(sig["en"] + falta, 3), round(sig["desde"] + falta, 3),
                                                       round(sig["dur"] - falta, 3))
    # Si aun así queda un parpadeo entre dos recursos, se quita.
    broll = [b for i, b in enumerate(broll)
             if not (b["dur"] < MIN_BROLL - 0.3 and 0 < i < len(broll) - 1
                     and b["en"] - fin_de(broll[i - 1]) < 0.2 and broll[i + 1]["en"] - fin_de(b) < 0.2)]

    def visible(t):
        return not any(b["en"] <= t < fin_de(b) for b in broll)

    def tapado(c):
        # Solo hay salto si Hildary se ve justo antes y justo después del corte.
        return not (visible(c - 0.12) and visible(c + 0.12))

    for k, c in enumerate(cortes):
        if tapado(c):
            continue
        antes = [b for b in broll if c - MIN_BROLL < fin_de(b) <= c + 0.3]
        despues = [b for b in broll if c - 0.3 <= b["en"] < c + MIN_BROLL]
        if antes:
            # Hasta pasado el corte, sin pisar el recurso siguiente.
            # Antes del cierre basta con llegar al corte.
            hasta = min([c + 0.6, fin] + [b["en"] for b in broll if c - 0.12 < b["en"] < c + 0.6])
            if estirar(antes[-1], hasta - antes[-1]["en"]):
                continue
        if despues:
            b = despues[0]
            nuevo_en = max([c - 0.6] + [fin_de(x) for x in broll if fin_de(x) <= b["en"]])
            b2 = dict(b)
            if estirar(b2, fin_de(b) - nuevo_en):
                b.update(b2, en=round(nuevo_en, 3))
                continue
        # Nada cerca: un plano de relleno de metraje propio centrado en el corte.
        if c < GANCHO + 0.3:
            continue  # bajo el gancho no se ve
        src = RELLENO[(idx + k) % len(RELLENO)]
        # Antes del cierre el relleno acaba justo en el corte; dentro, lo cruza.
        a, z = (c - 2.6, c) if c >= fin - 0.05 else (c - 1.4, c + 1.4)
        a = max([a, GANCHO] + [fin_de(b) for b in broll if fin_de(b) <= c])
        z = min([z, fin] + [b["en"] for b in broll if b["en"] >= c])
        if z - a >= MIN_BROLL - 0.3:
            broll.append(dict(en=round(a, 3), dur=round(z - a, 3), src=src, desde=1.0, modo="cubrir", prio=1))
        broll.sort(key=lambda b: b["en"])

    sin_pellizcos(broll)
    broll = [b for b in broll if b["dur"] >= 1.0]
    for _ in range(20):
        broll.sort(key=lambda b: b["en"])
        cambio = False
        # Hueco con el gancho, entre recursos y con el cierre.
        bordes = [(None, broll[0])] if broll else []
        bordes += list(zip(broll, broll[1:]))
        bordes += [(broll[-1], None)] if broll else []
        for a, b in bordes:
            ini = fin_de(a) if a else GANCHO
            fin_h = b["en"] if b else fin
            hueco = fin_h - ini
            if not (0.01 < hueco < MIN_HABLA):
                continue
            # Mismo gráfico a los dos lados: alargar el primero repetiría animación.
            mismo = a and b and a["src"] == b["src"] and a["modo"] != "cubrir"
            if a and not mismo and estirar(a, fin_h - a["en"]):
                cambio = True
                break
            if b:
                b2 = dict(b)
                if estirar(b2, fin_de(b) - ini):
                    b.update(b2, en=round(ini, 3))
                    cambio = True
                    break
            quitables = [x for x in (a, b) if x and x["prio"] == 1]
            if quitables:
                broll.remove(min(quitables, key=lambda x: x["dur"]))
                cambio = True
                break
        if not cambio:
            break
    return broll


# Cortes de plano del vídeo de YouTube (detección de escena, umbral 0,3).
CORTES_YT = json.load(open(Path(__file__).with_name("cortes_youtube.json")))
PELLIZCO = 0.7


def sin_pellizcos(broll):
    """Un trozo del vídeo largo que empieza o acaba con menos de PELLIZCO
    segundos de otra toma se desplaza dentro de su tramo de stock para que
    ese cambio no se vea: era un parpadeo de un plano distinto."""
    for b in broll:
        if b["src"] != YT:
            continue
        largo = b["dur"] * b.get("vel", 1)
        tramo = next(((sa, sb) for sa, sb in STOCK if sa - 0.05 <= b["desde"] <= sb), None)
        if not tramo:
            continue
        for _ in range(3):
            s0, s1 = b["desde"], b["desde"] + largo
            dentro = [c for c in CORTES_YT if s0 + 0.05 < c < s1 - 0.05]
            cola = [c for c in dentro if s1 - c < PELLIZCO]
            cabeza = [c for c in dentro if c - s0 < PELLIZCO]
            if cola:
                nuevo = b["desde"] - (s1 - cola[0]) - 0.04
            elif cabeza:
                nuevo = b["desde"] + (cabeza[-1] - s0) + 0.04
            else:
                break
            if tramo[0] <= nuevo and nuevo + largo <= tramo[1]:
                b["desde"] = round(nuevo, 3)
                continue
            # No cabe desplazarlo: se recorta en el corte y el hueco lo cubre
            # el ritmo. Sin margen para volver a crecer hacia el pellizco.
            vel = b.get("vel", 1)
            if cola:
                largo = cola[0] - 0.04 - s0
                b["dur"] = round(largo / vel, 3)
            else:
                quita = cabeza[-1] + 0.04 - s0
                b["desde"], b["en"] = round(b["desde"] + quita, 3), round(b["en"] + quita / vel, 3)
                largo -= quita
                b["dur"] = round(largo / vel, 3)
            b["max_src"] = round(largo, 3)
            break


# --------------------------------------------------------------------------
# Construcción de un short
# --------------------------------------------------------------------------

def construir(tx, spec, outro, idx):
    tramos = [tx.tramo(*t) for t in spec["tramos"]] + outro["tramos"]
    n_principal = len(spec["tramos"])

    voz, video, broll = [], [], []
    t_out = 0.0
    mapa = []  # (desde_src, hasta_src, en_out)
    for k, (a, b) in enumerate(tramos):
        dur = round(b - a, 3)
        voz.append(dict(desde=a, dur=dur, en=round(t_out, 3)))
        mapa.append((a, b, t_out))
        # Cada tramo se corta del vídeo limpio con su imagen y su audio en un
        # mismo archivo: cortar y pegar, sin posibilidad de descuadre.
        video.append(dict(desde=a, dur=dur, en=round(t_out, 3),
                          src=f"hilary/tramos/{a:.3f}-{b:.3f}.mp4",
                          zoom=1.0 if k % 2 == 0 else 1.14))
        es_outro = k >= n_principal
        if not es_outro:
            for (sa, sb) in STOCK:
                ia, ib = max(a, sa), min(b, sb)
                if ib - ia >= 1.0:
                    broll.append(dict(en=round(t_out + ia - a, 3), dur=round(ib - ia, 3),
                                      src=YT, desde=round(ia, 3), modo="cubrir",
                                      prio=2, max_src=round(sb - ia, 3)))
            for (sa, sb), src, off, modo in GRAFICOS:
                ia, ib = max(a, sa), min(b, sb)
                if ib - ia >= 1.0:
                    broll.append(dict(en=round(t_out + ia - a, 3), dur=round(ib - ia, 3),
                                      src=src, desde=round(off + (ia - sa), 3), modo=modo, prio=3))
        t_out += dur
    fin_principal = sum(b - a for a, b in tramos[:n_principal])
    total_voz = t_out

    def a_salida(t_src):
        for a, b, en in mapa:
            if a - 0.05 <= t_src <= b + 0.05:
                return en + (t_src - a)
        # Si cae en un hueco recortado, va al principio del tramo siguiente.
        for a, b, en in mapa:
            if t_src < a:
                return en
        return mapa[-1][2]

    # B-roll extra por tema, anclado a la frase que ilustra. Los clips "dji/"
    # son metraje propio del Camino (solo de la carpeta Brutos: las de "Short N"
    # son Paula hablando a cámara y no valen como recurso). Si pisa un
    # B-roll que ya venía del vídeo largo, gana el del vídeo largo.
    for frase, cerca, dur, src, desde in spec.get("extra", []):
        en = round(a_salida(tx.en(frase, cerca)), 3)
        dur = min(dur, fin_principal - en)
        # Lo que acaba bajo el gancho se descarta después: no cuenta como solape.
        solapa = any(en < b["en"] + b["dur"] and b["en"] < en + dur
                     for b in broll if b["en"] + b["dur"] > GANCHO + 0.3)
        if dur >= 1.0 and not solapa:
            modo = "mapa" if src.startswith("hilary/mapas/") else "cubrir"
            broll.append(dict(en=en, dur=round(dur, 3), src=YT if src == "yt" else src,
                              desde=desde, modo=modo, prio=1,
                              # De un extra del vídeo largo no se sabe qué sigue: no se alarga.
                              max_src=round(dur, 3) if src == "yt" else None))
    broll.sort(key=lambda b: b["en"])

    # El B-roll no tapa el gancho.
    broll = [b for b in broll if b["en"] + b["dur"] > GANCHO + 0.3]
    for b in broll:
        if b["en"] < GANCHO:
            corte = GANCHO - b["en"]
            b["en"], b["dur"], b["desde"] = GANCHO, round(b["dur"] - corte, 3), round(b["desde"] + corte, 3)
            if b.get("max_src") is not None:
                b["max_src"] = round(b["max_src"] - corte, 3)

    # Un mismo gráfico partido por un cambio de tramo se une en uno solo:
    # partido, la tarjeta volvía a entrar y se veía un salto.
    unidos = []
    for b in broll:
        p = unidos[-1] if unidos else None
        if (p and p["src"] == b["src"] and p["modo"] == b["modo"]
                and abs(b["en"] - (p["en"] + p["dur"])) < 0.2
                and abs(b["desde"] - (p["desde"] + p["dur"])) < 0.3):
            p["dur"] = round(b["en"] + b["dur"] - p["en"], 3)
        else:
            unidos.append(b)
    broll = unidos
    cortes = [v["en"] for v in video[1:n_principal + 1]]
    broll = ritmo(broll, cortes, fin_principal, idx)
    for b in broll:
        b.pop("prio", None)
        b.pop("max_src", None)

    # Subtítulos palabra a palabra.
    palabras = []
    for a, b, en in mapa:
        for w in tx.ws:
            if w["s"] >= a - 0.02 and w["e"] <= b + 0.15:
                palabras.append(dict(t=w["t"], en=round(en + w["s"] - a, 3),
                                     fin=round(en + min(w["e"], b) - a, 3)))

    capas = []
    for c in spec.get("capas", []):
        c = dict(c)
        if "frase" in c:
            c["en"] = round(a_salida(tx.en(c.pop("frase"), c.pop("cerca"))), 3)
        elif "en_src" in c:
            c["en"] = round(a_salida(c.pop("en_src")), 3)
        capas.append(c)

    # CTA de suscripción a mitad del short: fuera, a petición de la marca.
    if spec.get("cta", False):
        mitad = max(GANCHO + 4, fin_principal * 0.55)
        capas.append(dict(tipo="png", src="hilary/cartelas/sw-subscribe-button.png",
                          en=round(mitad, 3), dur=3.2, ancho=720, cta=True))

    # Cierre común: el final del vídeo largo con sus CTA.
    o = fin_principal
    capas += [
        # Sin botón de suscribirse: la barra social se queda hasta la etiqueta.
        dict(tipo="png", src="hilary/cartelas/sw-social-bar.png", en=round(o + 0.3, 3), dur=8.0, ancho=960, cta=True),
        dict(tipo="png", src="hilary/cartelas/sw-tag-light.png", en=round(o + 8.5, 3), dur=total_voz - o - 8.5, ancho=900, cta=True),
    ]
    # Un mapa ya trae su titular y sus datos: la cartela que coincide con él
    # lo taparía y repetiría lo mismo.
    mapas = [b for b in broll if b["modo"] == "mapa"]
    def tapa_mapa(c):
        return any(min(c["en"] + c["dur"], m["en"] + m["dur"]) - max(c["en"], m["en"]) > 0.8 for m in mapas)
    # Si queda tiempo, la cartela entra cuando el mapa se retira.
    for c in capas:
        if c.get("cta"):
            continue
        for m in mapas:
            fin_m = m["en"] + m["dur"]
            if min(c["en"] + c["dur"], fin_m) - max(c["en"], m["en"]) > 0.8:
                fin_c = c["en"] + c["dur"]
                c["en"] = round(fin_m + 0.1, 3)
                c["dur"] = round(fin_c + 0.8 - c["en"], 3)
    capas = [c for c in capas if c.get("cta") or (c["dur"] >= 2.0 and not tapa_mapa(c))]
    capas.sort(key=lambda c: c["en"])
    # Una sola cartela a la vez en la franja superior.
    for i in range(len(capas) - 1):
        lim = capas[i + 1]["en"] - capas[i]["en"] - 0.1
        capas[i]["dur"] = round(min(capas[i]["dur"], lim), 3)
    capas = [c for c in capas if c["dur"] > 0.8]

    # Efectos de sonido.
    sfx = [dict(en=0, src="sfx/impacto.wav", vol=0.55), dict(en=0.05, src="sfx/rise.wav", vol=0.18),
           dict(en=GANCHO - 0.25, src="sfx/whoosh.wav", vol=0.35)]
    for c in capas:
        sfx.append(dict(en=c["en"], src="sfx/ding.wav" if c.get("cta") else "sfx/pop.wav",
                        vol=0.28 if c.get("cta") else 0.4))
    ultimo = -10
    for b in broll:
        if b["en"] - ultimo > 1.5:
            sfx.append(dict(en=max(0, b["en"] - 0.2), src="sfx/whoosh-corto.wav", vol=0.22))
        ultimo = b["en"] + b["dur"]
    sfx.append(dict(en=round(total_voz - 0.3, 3), src="sfx/whoosh.wav", vol=0.3))

    return dict(
        id=spec["id"],
        titulo=spec["titulo"],
        acento=spec.get("acento", len(spec["titulo"]) - 1),
        experto=spec.get("experto", False),
        duracion=round(total_voz + CIERRE, 3),
        cierre=dict(en=round(total_voz, 3), dur=CIERRE),
        gancho=dict(dur=GANCHO, src=f"hilary/recortes/{spec['id']}.webm", desde=tramos[0][0]),
        voz=voz, video=video, broll=broll, capas=capas, palabras=palabras, sfx=sfx,
        musica=dict(src=f"musica/{MUSICA[idx % len(MUSICA)]}.mp3", vol=0.04,
                    desde=spec.get("musica_desde", 0)),
    )


# --------------------------------------------------------------------------
# Los shorts
# --------------------------------------------------------------------------

def shorts():
    return [
        dict(id="01-por-que-sarria", extra=[("walking the entire", 80, 3.2, "dji/DJI_20260929071346_0021_D.mp4", 2.0), ("most of us don't", 83, 3.0, "dji/DJI_20260929073931_0046_D.mp4", 1.0), ("the minimum distance", 97, 3.4, "dji/DJI_20260929065826_0015_D.mp4", 7.4), ("So starting in Sarria", 102, 3.0, "dji/DJI_20260929071708_0025_D.mp4", 0.5)], titulo=["WHY DOES", "EVERYONE START", "IN SARRIA?"],
             tramos=[("why so many people", 50, "in Sarria."),
                     ("The full Camino", 52, "in France"),
                     ("But walking the entire", 75, "for one trip."),
                     ("That's where Sarria", 86, "for the Compostela."),
                     ("So starting in Sarria", 102, "sweet spot.")],
             capas=[cartela("sw-fact-pill", frase="That's where Sarria", cerca=86, dur=3.0, ancho=620),
                    cartela("sw-fact-box", frase="also the minimum", cerca=96, dur=3.6, ancho=520)]),

        dict(id="02-km-compostela", extra=[("Not exactly.", 152, 2.2, "yt", 12.5), ("walked at least", 155, 1.8, "dji/DJI_20260929090421_0054_D.mp4", 0.5), ("or cycled", 157, 2.4, "yt", 499.8), ("100 kilometers is", 93, 3.0, "yt", 237.5), ("the minimum distance", 97, 3.6, "dji/DJI_20260929073439_0041_D.mp4", 0.3)], titulo=["HOW MANY KM", "FOR THE", "COMPOSTELA?"],
             tramos=[("Do I", 146, "in Santiago?"),
                     ("Not exactly.", 152, "at least 200,"),
                     ("100 kilometers is", 93, "for the Compostela.")],
             capas=[cartela("sw-fact-box", frase="To qualify", cerca=153, dur=3.8, ancho=520)]),

        dict(id="03-como-conseguir-compostela", extra=[("You'll find places", 174, 3.0, "yt", 344.5), ("Along the way", 167, 3.0, "dji/DJI_20260929081752_0049_D.mp4", 0.3), ("For the final", 170, 2.8, "dji/DJI_20260929090406_0053_D.mp4", 1.0), ("becomes a small", 178.6, 3.0, "dji/DJI_20260929071755_0026_D.mp4", 6.0)], titulo=["HOW DO YOU", "ACTUALLY GET THE", "COMPOSTELA?"],
             tramos=[("To qualify", 153, "pilgrim passport."),
                     ("Along the way", 167, "experience itself."),
                     ("Just remember", 180, "anything has changed.")],
             capas=[cartela("sw-card-credential", frase="credential, sometimes", cerca=162, dur=3.6, ancho=960),
                    cartela("sw-notice-stamp-credential", frase="For the final", cerca=170, dur=4.0, ancho=880),
                    cartela("sw-card-credential-where", frase="You'll find places", cerca=174, dur=3.6, ancho=900)]),

        dict(id="04-es-dificil", extra=[("You don't need to be", 197, 3.0, "yt", 27.0), ("The good news", 229, 3.0, "yt", 322.2), ("But don't make", 203, 3.2, "dji/DJI_20260929074037_0047_D.mp4", 1.0), ("signposted and", 232, 3.0, "dji/DJI_20260929090353_0052_D.mp4", 0.2), ("very achievable", 243, 3.2, "dji/DJI_20260929073713_0044_D.mp4", 18.0)], titulo=["IS THE CAMINO", "FROM SARRIA", "DIFFICULT?"],
             tramos=[("The short answer", 196, "start to add up."),
                     ("The good news", 229, "huge number of people.")],
             capas=[cartela("sw-card-stages-question", en_src=198, dur=3.6, ancho=980)]),

        dict(id="05-lo-mas-duro", extra=[("waking up the next", 222, 3.0, "yt", 594.6), ("and again and again", 226.3, 2.6, "dji/DJI_20260929072513_0035_D.mp4", 2.0)], titulo=["THE HARDEST PART", "ISN'T WHAT", "YOU THINK"],
             tramos=[("Galicia has a lot", 207, "start to add up."),
                     ("That's usually the real", 219, "and again and again.")]),

        dict(id="06-error-zapatillas", extra=[("the wrong shoes", 269.6, 2.6, "dji/DJI_20260929073410_0040_D.mp4", 0.2), ("time on day one", 286, 3.2, "dji/DJI_20260929073931_0046_D.mp4", 4.0)], titulo=["DON'T MAKE", "THIS SHOE", "MISTAKE"],
             tramos=[("One of the biggest mistakes", 266, "the wrong shoes."),
                     ("For a route like", 270, "Break them in beforehand."),
                     ("because after 20 kilometers", 302, "notice your shoes.")],
             capas=[cartela("sw-tip-essentials", frase="do not wear them", cerca=283, dur=4.2, ancho=900)]),

        dict(id="07-botas-montana", extra=[("especially if you're", 293.7, 3.2, "dji/DJI_20260929074051_0048_D.mp4", 2.0)], titulo=["DO YOU NEED", "HIKING BOOTS", "FOR THE CAMINO?"],
             tramos=[("You don't necessarily need heavy", 291, "for hours,"),
                     ("lightweight trekking or hiking", 274, "good grip,"),
                     ("because after 20 kilometers", 302, "notice your shoes.")]),

        dict(id="08-cinco-etapas", extra=[("This is the one", 401.5, 3.0, "dji/IMG_5542.mp4", 0.3), ("into five stages", 314.3, 2.7, "dji/DJI_20260929072047_0031_D.mp4", 3.0)], titulo=["SARRIA TO", "SANTIAGO IN", "5 STAGES"],
             tramos=[("Most people divide", 310, "five stages."),
                     ("Stage one,", 314, "around 22 kilometers."),
                     ("Stage two,", 336, "24 to 25 kilometers."),
                     ("stage three,", 356, "of the five stages."),
                     ("Stage four,", 380, "around 19 kilometers."),
                     ("stage five,", 398, "been waiting for.")],
             capas=[cartela("sw-stage-01-sarria-portomarin", frase="Stage one,", cerca=314, dur=4.0, ancho=620),
                    cartela("sw-stage-02-portomarin-palas", frase="Stage two,", cerca=336, dur=4.0, ancho=620),
                    cartela("sw-stage-03-palas-arzua", frase="stage three,", cerca=356, dur=4.0, ancho=620),
                    cartela("sw-stage-04-arzua-arua", frase="Stage four,", cerca=380, dur=3.6, ancho=620),
                    cartela("sw-stage-05-arua-santiago", frase="stage five,", cerca=398, dur=4.0, ancho=620)],
             cta=False),

        dict(id="09-etapa-mas-larga", extra=[("not racing anyone", 379.1, 3.0, "dji/DJI_20260929073458_0042_D.mp4", 1.0)], titulo=["THE LONGEST", "STAGE FROM", "SARRIA"],
             tramos=[("stage three,", 356, "racing anyone.")],
             capas=[cartela("sw-stage-03-palas-arzua", frase="stage three,", cerca=356, dur=4.5, ancho=620),
                    cartela("sw-tip-card", frase="Take breaks,", cerca=372, dur=3.5, ancho=900)]),

        dict(id="10-ultimo-dia", extra=[("Santiago de Compostela.", 399.5, 4.5, "dji/IMG_5542.mp4", 0.0), ("towards Santiago", 409.9, 4.1, "dji/IMG_5543.mp4", 2.0), ("in front of you", 419.9, 3.4, "dji/IMG_5543.mp4", 14.0), ("suddenly hits", 427.9, 1.8, "dji/IMG_5531.mp4", 2.0), ("And yes, there", 429.8, 3.0, "dji/IMG_5520.mp4", 0.5)], titulo=["WHAT THE LAST", "DAY OF THE", "CAMINO FEELS LIKE"],
             tramos=[("stage five,", 398, "Lots of photos.")],
             capas=[cartela("sw-stage-05-arua-santiago", frase="stage five,", cerca=398, dur=4.0, ancho=620),
                    cartela("sw-card-yellow-arrow", frase="After following yellow", cerca=402, dur=3.6, ancho=960)]),

        dict(id="11-comer-camino", extra=[("have lunch", 451.4, 3.0, "dji/IMG_5198.mp4", 0.2), ("These stops", 455.0, 3.0, "dji/IMG_5198.mp4", 3.2), ("more delicious", 465.8, 3.0, "dji/DJI_20260929090511_0056_D.mp4", 1.0), ("And somehow, food", 462, 2.2, "brutos/terraza.mp4", 0), ("to get it.", 468, 1.9, "brutos/brindis.mp4", 0)], titulo=["WHAT DO YOU", "EAT ON THE", "CAMINO?"],
             tramos=[("You also have to eat,", 438, "Walk again."),
                     ("And somehow, food", 462, "to get it.")]),

        dict(id="12-cargar-mochila", extra=[("walk the stage", 489.7, 3.0, "dji/DJI_20260929071346_0021_D.mp4", 8.0), ("your main bag", 494.0, 3.0, "dji/DJI_20260929061142_0014_D.mp4", 18.0), ("together with your", 509.7, 3.0, "dji/DJI_20260929083455_0050_D.mp4", 1.0), ("At Santiago Ways,", 505, 3.0, "yt", 531.6)], titulo=["DO YOU HAVE TO", "CARRY YOUR", "BACKPACK?"],
             tramos=[("You don't necessarily have to carry", 474, "Camino."),
                     ("There are luggage", 478, "when you arrive."),
                     ("At Santiago Ways,", 505, "accommodation and itinerary.")],
             capas=[cartela("sw-card-luggage-pregunta", en_src=474.6, dur=3.4, ancho=980),
                    cartela("sw-card-luggage-transporte", frase="There are luggage", cerca=478, dur=4.0, ancho=960),
                    cartela("sw-tag-light", frase="At Santiago Ways,", cerca=505, dur=4.0, ancho=900)]),

        dict(id="13-caminar-20km-facil", extra=[("walk the stage", 489.7, 3.0, "dji/DJI_20260929071346_0021_D.mp4", 8.0), ("your main bag", 494.0, 3.0, "dji/DJI_20260929061142_0014_D.mp4", 18.0)], titulo=["THIS MAKES", "WALKING 20 KM", "MUCH EASIER"],
             tramos=[("You don't necessarily have to carry", 474, "Camino."),
                     ("walk the stage", 489, "when you arrive."),
                     ("And walking 20", 497, "huge difference.")],
             capas=[cartela("sw-tip-golden-rule", frase="walk the stage", cerca=489, dur=4.0, ancho=900)]),

        dict(id="14-donde-dormir", extra=[("doing it again", 537.2, 3.0, "dji/DJI_20260929090421_0054_D.mp4", 0.5), ("private rooms", 545.7, 2.3, "dji/IMG_5440.mp4", 0.2)], titulo=["WHERE DO YOU", "SLEEP ON THE", "CAMINO?"],
             tramos=[("Rest matters a lot.", 529, "experience the Camino.")],
             capas=[cartela("sw-card-accommodation-hotel", frase="many pilgrims choose", cerca=542, dur=4.2, ancho=980),
                    cartela("sw-notice-hoteles", frase="Being able to shower,", cerca=546, dur=3.8, ancho=880)]),

        dict(id="15-mejor-mes", extra=[("isn't one perfect", 562.2, 2.6, "dji/DJI_20260929073458_0042_D.mp4", 1.0), ("a lot more pilgrims", 574.6, 3.0, "dji/DJI_20260929072030_0030_D.mp4", 0.5), ("more rain", 580.3, 3.0, "dji/DJI_20260929110228_0069_D.mp4", 3.0), ("Spring and autumn", 563, 1.6, "brutos/campo-flores.mp4", 0), ("Summer gives you", 569, 3.0, "yt", 499.8), ("And winter is", 577, 2.0, "yt", 118.0)], titulo=["THE BEST MONTH", "TO WALK", "THE CAMINO"],
             tramos=[("So what's the best month", 558, "Sarria?"),
                     ("There isn't one perfect", 562, "being closed."),
                     ("So instead of asking", 585, "when you should go.")],
             capas=[cartela("sw-card-season-primavera", frase="Spring and autumn", cerca=563, dur=3.4, ancho=620),
                    cartela("sw-card-season-verano", frase="Summer gives you", cerca=569, dur=3.6, ancho=620),
                    cartela("sw-card-season-invierno", frase="And winter is", cerca=577, dur=3.6, ancho=620)],
             cta=False),

        dict(id="16-menos-gente", extra=[("a lot more pilgrims", 574.6, 3.0, "dji/DJI_20260929072030_0030_D.mp4", 0.5), ("more rain", 580.3, 3.0, "dji/DJI_20260929110228_0069_D.mp4", 3.0), ("Summer gives you", 569, 3.0, "yt", 499.8), ("And winter is", 577, 2.0, "yt", 118.0), ("Spring and autumn", 563, 1.6, "brutos/campo-flores.mp4", 0)], titulo=["WANT FEWER", "CROWDS? GO AT", "THIS TIME"],
             tramos=[("Summer gives you", 569, "on the route."),
                     ("And winter is", 577, "being closed."),
                     ("Spring and autumn", 563, "and atmosphere.")],
             capas=[cartela("sw-card-season-verano", frase="Summer gives you", cerca=569, dur=3.6, ancho=620),
                    cartela("sw-card-season-invierno", frase="And winter is", cerca=577, dur=3.6, ancho=620),
                    cartela("sw-card-season-otono", frase="Spring and autumn", cerca=563, dur=3.4, ancho=620)]),

        dict(id="17-primer-camino", extra=[("excellent signposting", 617.1, 3.0, "dji/DJI_20260929090353_0052_D.mp4", 0.2), ("logistical detail", 628.7, 3.0, "dji/DJI_20260929070236_0016_D.mp4", 5.0), ("Because the goal", 637.1, 3.2, "dji/DJI_20260929073713_0044_D.mp4", 3.0), ("You don't need several", 622, 3.0, "yt", 344.5), ("The most important", 631, 3.0, "yt", 27.0)], titulo=["IS SARRIA A", "GOOD FIRST", "CAMINO?"],
             tramos=[("If this is going", 610, "getting there.")],
             capas=[cartela("sw-quote-band", frase="Because the goal", cerca=637, dur=4.0, ancho=960)]),

        dict(id="18-cuantos-dias", extra=[("into five stages", 314.3, 3.0, "dji/DJI_20260929072047_0031_D.mp4", 3.0), ("choose an itinerary", 633.6, 3.0, "dji/DJI_20260929072925_0036_D.mp4", 4.0), ("Because the goal", 637.1, 3.2, "dji/DJI_20260929073713_0044_D.mp4", 3.0)], titulo=["HOW LONG FROM", "SARRIA TO", "SANTIAGO?"],
             tramos=[("It's just over", 11, "experienced hiker,"),
                     ("Most people divide", 310, "five stages."),
                     ("The most important", 631, "getting there.")],
             capas=[cartela("sw-stage-progress", frase="Most people divide", cerca=310, dur=3.6, ancho=900)]),

        dict(id="19-que-te-preocupa", extra=[("much easier to solve", 258.8, 3.0, "dji/DJI_20260929061142_0014_D.mp4", 2.0), ("The distance,", 251, 2.2, "yt", 237.5), ("getting lost,", 253, 2.0, "yt", 322.4), ("carrying your backpack,", 255, 2.4, "yt", 480.5), ("And one of them", 262, 3.0, "yt", 275.2)], titulo=["WHAT WORRIES", "YOU MOST ABOUT", "THE CAMINO?"],
             tramos=[("What worries you most", 248, "on your feet.")]),

        dict(id="20-como-llegar-sarria", extra=[("Depending on where", 127.6, 3.0, "dji/DJI_20260929071136_0018_D.mp4", 1.0), ("by train,", 131.1, 3.0, "dji/DJI_20260929071708_0025_D.mp4", 0.5), ("And once you arrive,", 139, 3.0, "dji/DJI_20260929071211_0019_D.mp4", 2.0)], titulo=["HOW DO YOU", "GET TO", "SARRIA?"],
             tramos=[("Getting there is also", 123, "really begins.")]),

        dict(id="21-camino-sin-estres", extra=[("can organize the entire", 656.9, 3.0, "dji/DJI_20260929070236_0016_D.mp4", 8.0), ("arranged before", 664.4, 2.6, "dji/IMG_5440.mp4", 0.2), ("click the link", 667.1, 3.0, "dji/DJI_20260929072030_0030_D.mp4", 0.5), ("where you're sleeping", 648, 2.4, "yt", 531.6), ("how your luggage", 650, 2.4, "yt", 480.5), ("or how to structure", 653, 2.6, "hilary/mapas/etapas-sarria.mp4", 1.6), ("Your accommodation,", 660, 3.0, "yt", 548.6)], titulo=["WALK THE CAMINO", "WITHOUT THE", "STRESS"],
             tramos=[("And if you want to walk", 644, "start planning your trip.")],
             capas=[cartela("sw-tag-light", frase="Santiago Ways can organize", cerca=656, dur=4.0, ancho=900)],
             cta=False),

        dict(id="22-mejor-ruta-principiantes", extra=[("the first time,", 2.9, 2.4, "dji/DJI_20260929072047_0031_D.mp4", 3.0), ("hear about again", 5.4, 1.6, "dji/DJI_20260929073931_0046_D.mp4", 0.5)], titulo=["THE BEST CAMINO", "FOR", "BEGINNERS"],
             tramos=[("If you're thinking", 0, "Santiago de Compostela.")],
             capas=[cartela("sw-card-route-frances", frase="Camino Francés from", cerca=7, dur=3.6, ancho=720)]),
    ]


def main():
    tx = Texto(cargar_palabras(sys.argv[1]))
    outro = dict(tramos=[tx.tramo("And if you still have", 674, "Buen Camino.")])
    datos = [construir(tx, s, outro, i) for i, s in enumerate(shorts())]
    SALIDA.parent.mkdir(parents=True, exist_ok=True)
    json.dump(datos, open(SALIDA, "w"), ensure_ascii=False, indent=1)
    for d in datos:
        print(f"{d['id']:32s} {d['duracion']:5.1f}s  broll {len(d['broll']):2d}  capas {len(d['capas'])}")


if __name__ == "__main__":
    main()
