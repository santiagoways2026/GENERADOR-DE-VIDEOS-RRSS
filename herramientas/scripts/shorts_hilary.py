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
STOCK = [(7.2, 31.2), (72.7, 78.4), (109.2, 118.9), (159.6, 161.9), (183.6, 187.9),
         (236.6, 241.2), (274.6, 285.9), (297.1, 306.9), (321.6, 331.9),
         (339.6, 341.4), (344.2, 353.4), (360.6, 376.9), (383.6, 396.4),
         (404.1, 409.9), (414.1, 419.9), (440.1, 450.9), (474.1, 486.9),
         (497.6, 504.9), (531.1, 535.9), (548.1, 557.4), (589.6, 602.4),
         (611.1, 616.4)]

# Los gráficos horizontales del vídeo largo no caben en vertical: se cambian
# por las versiones verticales en inglés que vienen en el Drive.
GRAFICOS = [
    ((57.0, 64.5), "hilary/mapas/ruta-frances.mp4", 3.0, "cubrir"),
    ((88.5, 96.0), "hilary/mapas/ruta-sarria.mp4", 3.0, "cubrir"),
    ((208.5, 221.0), "hilary/mapas/perfil-sarria-h.mp4", 1.0, "tarjeta"),
    ((317.5, 320.0), "hilary/mapas/etapas-sarria.mp4", 1.6, "cubrir"),
    ((335.5, 338.0), "hilary/mapas/etapas-sarria.mp4", 3.7, "cubrir"),
    ((357.0, 359.5), "hilary/mapas/etapas-sarria.mp4", 7.6, "cubrir"),
    ((380.5, 383.5), "hilary/mapas/etapas-sarria.mp4", 9.9, "cubrir"),
    ((397.5, 400.0), "hilary/mapas/etapas-sarria.mp4", 12.0, "cubrir"),
]

MUSICA = ["Carefree", "Life_of_Riley", "Happy_Alley", "Wholesome", "Sunshine_A",
          "Inspired", "Merry_Go", "Easy_Lemon", "Cheery_Monday", "Fretless",
          "Pamgaea", "Hyperfun", "Funkorama", "Airport_Lounge"]

GANCHO = 2.4
CIERRE = 1.4


def cartela(nombre, **kw):
    return dict(tipo="png", src=f"hilary/cartelas/{nombre}.png", **kw)


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
                                      src=YT, desde=round(ia, 3), modo="cubrir"))
            for (sa, sb), src, off, modo in GRAFICOS:
                ia, ib = max(a, sa), min(b, sb)
                if ib - ia >= 1.0:
                    broll.append(dict(en=round(t_out + ia - a, 3), dur=round(ib - ia, 3),
                                      src=src, desde=round(off + (ia - sa), 3), modo=modo))
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

    # B-roll extra por tema, anclado a la frase que ilustra. Si pisa un
    # B-roll que ya venía del vídeo largo, gana el del vídeo largo.
    for frase, cerca, dur, src, desde in spec.get("extra", []):
        en = round(a_salida(tx.en(frase, cerca)), 3)
        dur = min(dur, fin_principal - en)
        solapa = any(en < b["en"] + b["dur"] and b["en"] < en + dur for b in broll)
        if dur >= 1.0 and not solapa:
            broll.append(dict(en=en, dur=round(dur, 3), src=YT if src == "yt" else src,
                              desde=desde, modo="cubrir"))
    broll.sort(key=lambda b: b["en"])

    # El B-roll no tapa el gancho.
    broll = [b for b in broll if b["en"] + b["dur"] > GANCHO + 0.3]
    for b in broll:
        if b["en"] < GANCHO:
            corte = GANCHO - b["en"]
            b["en"], b["dur"], b["desde"] = GANCHO, round(b["dur"] - corte, 3), round(b["desde"] + corte, 3)

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

    # CTA de suscripción a mitad del short, como en el vídeo largo.
    if spec.get("cta", True):
        mitad = max(GANCHO + 4, fin_principal * 0.55)
        capas.append(dict(tipo="png", src="hilary/cartelas/sw-subscribe-button.png",
                          en=round(mitad, 3), dur=3.2, ancho=720, cta=True))

    # Cierre común: el final del vídeo largo con sus CTA.
    o = fin_principal
    capas += [
        dict(tipo="png", src="hilary/cartelas/sw-social-bar.png", en=round(o + 0.3, 3), dur=4.4, ancho=960, cta=True),
        dict(tipo="png", src="hilary/cartelas/sw-subscribe-button.png", en=round(o + 4.9, 3), dur=3.4, ancho=720, cta=True),
        dict(tipo="png", src="hilary/cartelas/sw-tag-light.png", en=round(o + 8.5, 3), dur=total_voz - o - 8.5, ancho=900, cta=True),
    ]
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
        musica=dict(src=f"musica/{MUSICA[idx % len(MUSICA)]}.mp3", vol=0.07,
                    desde=spec.get("musica_desde", 0)),
    )


# --------------------------------------------------------------------------
# Los shorts
# --------------------------------------------------------------------------

def shorts():
    return [
        dict(id="01-por-que-sarria", extra=[("most of us don't", 83, 3.0, "yt", 73.0), ("So starting in Sarria", 102, 3.0, "yt", 27.0)], titulo=["WHY DOES", "EVERYONE START", "IN SARRIA?"],
             tramos=[("why so many people", 50, "in Sarria."),
                     ("The full Camino", 52, "in France"),
                     ("But walking the entire", 75, "for one trip."),
                     ("That's where Sarria", 86, "for the Compostela."),
                     ("So starting in Sarria", 102, "sweet spot.")],
             capas=[cartela("sw-fact-pill", frase="That's where Sarria", cerca=86, dur=3.0, ancho=620),
                    cartela("sw-fact-box", frase="also the minimum", cerca=96, dur=3.6, ancho=520)]),

        dict(id="02-km-compostela", extra=[("Not exactly.", 152, 2.2, "yt", 12.5), ("or cycled", 157, 2.4, "yt", 499.8), ("100 kilometers is", 93, 3.0, "yt", 237.5)], titulo=["HOW MANY KM", "FOR THE", "COMPOSTELA?"],
             tramos=[("Do I", 146, "in Santiago?"),
                     ("Not exactly.", 152, "at least 200,"),
                     ("100 kilometers is", 93, "for the Compostela.")],
             capas=[cartela("sw-fact-box", frase="To qualify", cerca=153, dur=3.8, ancho=520)]),

        dict(id="03-como-conseguir-compostela", extra=[("You'll find places", 174, 3.0, "yt", 344.5)], titulo=["HOW DO YOU", "ACTUALLY GET THE", "COMPOSTELA?"],
             tramos=[("To qualify", 153, "pilgrim passport."),
                     ("Along the way", 167, "experience itself."),
                     ("Just remember", 180, "anything has changed.")],
             capas=[cartela("sw-card-credential", frase="credential, sometimes", cerca=162, dur=3.6, ancho=960),
                    cartela("sw-notice-stamp-credential", frase="For the final", cerca=170, dur=4.0, ancho=880),
                    cartela("sw-card-credential-where", frase="You'll find places", cerca=174, dur=3.6, ancho=900)]),

        dict(id="04-es-dificil", extra=[("You don't need to be", 197, 3.0, "yt", 27.0), ("The good news", 229, 3.0, "yt", 322.2)], titulo=["IS THE CAMINO", "FROM SARRIA", "DIFFICULT?"],
             tramos=[("The short answer", 196, "start to add up."),
                     ("The good news", 229, "huge number of people.")],
             capas=[cartela("sw-card-stages-question", en_src=198, dur=3.6, ancho=980)]),

        dict(id="05-lo-mas-duro", extra=[("waking up the next", 222, 3.0, "yt", 594.6)], titulo=["THE HARDEST PART", "ISN'T WHAT", "YOU THINK"],
             tramos=[("Galicia has a lot", 207, "start to add up."),
                     ("That's usually the real", 219, "and again and again.")]),

        dict(id="06-error-zapatillas", titulo=["DON'T MAKE", "THIS SHOE", "MISTAKE"],
             tramos=[("One of the biggest mistakes", 266, "the wrong shoes."),
                     ("For a route like", 270, "Break them in beforehand."),
                     ("because after 20 kilometers", 302, "notice your shoes.")],
             capas=[cartela("sw-tip-essentials", frase="do not wear them", cerca=283, dur=4.2, ancho=900)]),

        dict(id="07-botas-montana", titulo=["DO YOU NEED", "HIKING BOOTS", "FOR THE CAMINO?"],
             tramos=[("You don't necessarily need heavy", 291, "for hours,"),
                     ("lightweight trekking or hiking", 274, "good grip,"),
                     ("because after 20 kilometers", 302, "notice your shoes.")]),

        dict(id="08-cinco-etapas", titulo=["SARRIA TO", "SANTIAGO IN", "5 STAGES"],
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

        dict(id="09-etapa-mas-larga", titulo=["THE LONGEST", "STAGE FROM", "SARRIA"],
             tramos=[("stage three,", 356, "racing anyone.")],
             capas=[cartela("sw-stage-03-palas-arzua", frase="stage three,", cerca=356, dur=4.5, ancho=620),
                    cartela("sw-tip-card", frase="Take breaks,", cerca=372, dur=3.5, ancho=900)]),

        dict(id="10-ultimo-dia", titulo=["WHAT THE LAST", "DAY OF THE", "CAMINO FEELS LIKE"],
             tramos=[("stage five,", 398, "Lots of photos.")],
             capas=[cartela("sw-stage-05-arua-santiago", frase="stage five,", cerca=398, dur=4.0, ancho=620),
                    cartela("sw-card-yellow-arrow", frase="After following yellow", cerca=402, dur=3.6, ancho=960)]),

        dict(id="11-comer-camino", extra=[("And somehow, food", 462, 2.2, "brutos/terraza.mp4", 0), ("to get it.", 468, 1.9, "brutos/brindis.mp4", 0)], titulo=["WHAT DO YOU", "EAT ON THE", "CAMINO?"],
             tramos=[("You also have to eat,", 438, "Walk again."),
                     ("And somehow, food", 462, "to get it.")]),

        dict(id="12-cargar-mochila", extra=[("At Santiago Ways,", 505, 3.0, "yt", 531.6)], titulo=["DO YOU HAVE TO", "CARRY YOUR", "BACKPACK?"],
             tramos=[("You don't necessarily have to carry", 474, "Camino."),
                     ("There are luggage", 478, "when you arrive."),
                     ("At Santiago Ways,", 505, "accommodation and itinerary.")],
             capas=[cartela("sw-card-luggage-pregunta", en_src=474.6, dur=3.4, ancho=980),
                    cartela("sw-card-luggage-transporte", frase="There are luggage", cerca=478, dur=4.0, ancho=960),
                    cartela("sw-tag-light", frase="At Santiago Ways,", cerca=505, dur=4.0, ancho=900)]),

        dict(id="13-caminar-20km-facil", titulo=["THIS MAKES", "WALKING 20 KM", "MUCH EASIER"],
             tramos=[("You don't necessarily have to carry", 474, "Camino."),
                     ("walk the stage", 489, "when you arrive."),
                     ("And walking 20", 497, "huge difference.")],
             capas=[cartela("sw-tip-golden-rule", frase="walk the stage", cerca=489, dur=4.0, ancho=900)]),

        dict(id="14-donde-dormir", titulo=["WHERE DO YOU", "SLEEP ON THE", "CAMINO?"],
             tramos=[("Rest matters a lot.", 529, "experience the Camino.")],
             capas=[cartela("sw-card-accommodation-hotel", frase="many pilgrims choose", cerca=542, dur=4.2, ancho=980),
                    cartela("sw-notice-hoteles", frase="Being able to shower,", cerca=546, dur=3.8, ancho=880)]),

        dict(id="15-mejor-mes", extra=[("Spring and autumn", 563, 1.6, "brutos/campo-flores.mp4", 0), ("Summer gives you", 569, 3.0, "yt", 499.8), ("And winter is", 577, 2.0, "yt", 118.0)], titulo=["THE BEST MONTH", "TO WALK", "THE CAMINO"],
             tramos=[("So what's the best month", 558, "Sarria?"),
                     ("There isn't one perfect", 562, "being closed."),
                     ("So instead of asking", 585, "when you should go.")],
             capas=[cartela("sw-card-season-primavera", frase="Spring and autumn", cerca=563, dur=3.4, ancho=620),
                    cartela("sw-card-season-verano", frase="Summer gives you", cerca=569, dur=3.6, ancho=620),
                    cartela("sw-card-season-invierno", frase="And winter is", cerca=577, dur=3.6, ancho=620)],
             cta=False),

        dict(id="16-menos-gente", extra=[("Summer gives you", 569, 3.0, "yt", 499.8), ("And winter is", 577, 2.0, "yt", 118.0), ("Spring and autumn", 563, 1.6, "brutos/campo-flores.mp4", 0)], titulo=["WANT FEWER", "CROWDS? GO AT", "THIS TIME"],
             tramos=[("Summer gives you", 569, "on the route."),
                     ("And winter is", 577, "being closed."),
                     ("Spring and autumn", 563, "and atmosphere.")],
             capas=[cartela("sw-card-season-verano", frase="Summer gives you", cerca=569, dur=3.6, ancho=620),
                    cartela("sw-card-season-invierno", frase="And winter is", cerca=577, dur=3.6, ancho=620),
                    cartela("sw-card-season-otono", frase="Spring and autumn", cerca=563, dur=3.4, ancho=620)]),

        dict(id="17-primer-camino", extra=[("You don't need several", 622, 3.0, "yt", 344.5), ("The most important", 631, 3.0, "yt", 27.0)], titulo=["IS SARRIA A", "GOOD FIRST", "CAMINO?"],
             tramos=[("If this is going", 610, "getting there.")],
             capas=[cartela("sw-quote-band", frase="Because the goal", cerca=637, dur=4.0, ancho=960)]),

        dict(id="18-cuantos-dias", titulo=["HOW LONG FROM", "SARRIA TO", "SANTIAGO?"],
             tramos=[("It's just over", 11, "experienced hiker,"),
                     ("Most people divide", 310, "five stages."),
                     ("The most important", 631, "getting there.")],
             capas=[cartela("sw-stage-progress", frase="Most people divide", cerca=310, dur=3.6, ancho=900)]),

        dict(id="19-que-te-preocupa", extra=[("The distance,", 251, 2.2, "yt", 237.5), ("getting lost,", 253, 2.0, "yt", 322.4), ("carrying your backpack,", 255, 2.4, "yt", 480.5), ("And one of them", 262, 3.0, "yt", 275.2)], titulo=["WHAT WORRIES", "YOU MOST ABOUT", "THE CAMINO?"],
             tramos=[("What worries you most", 248, "on your feet.")]),

        dict(id="20-como-llegar-sarria", extra=[("such as Madrid,", 133, 3.0, "yt", 112.6), ("And once you arrive,", 139, 3.0, "yt", 27.0)], titulo=["HOW DO YOU", "GET TO", "SARRIA?"],
             tramos=[("Getting there is also", 123, "really begins.")]),

        dict(id="21-camino-sin-estres", extra=[("where you're sleeping", 648, 2.4, "yt", 531.6), ("how your luggage", 650, 2.4, "yt", 480.5), ("or how to structure", 653, 2.6, "hilary/mapas/etapas-sarria.mp4", 1.6), ("Your accommodation,", 660, 3.0, "yt", 548.6)], titulo=["WALK THE CAMINO", "WITHOUT THE", "STRESS"],
             tramos=[("And if you want to walk", 644, "start planning your trip.")],
             capas=[cartela("sw-tag-light", frase="Santiago Ways can organize", cerca=656, dur=4.0, ancho=900)],
             cta=False),

        dict(id="22-mejor-ruta-principiantes", titulo=["THE BEST CAMINO", "FOR", "BEGINNERS"],
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
