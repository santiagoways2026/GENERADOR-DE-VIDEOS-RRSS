"""Guion de montaje de los shorts del Xacobeo 2027 (Hildary, ya grabados).

Los vídeos llegan en vertical, con la voz y el cierre puestos. Aquí solo se
decide qué va encima y cuándo: titular de gancho, cartelas, cortinillas de
stock, gráficos y mapas, la web en el CTA, subtítulos, zooms, música y
efectos. Cada elemento se ancla a la frase que ilustra.

    python3 herramientas/scripts/shorts_xacobeo.py <carpeta con IMG_*.json>

Los JSON salen de faster-whisper con marcas por palabra. Escribe
video/src/xacobeo/xacobeo.json.
"""
import json
import re
import subprocess
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
PUBLIC = RAIZ / "video/public"
SALIDA = RAIZ / "video/src/xacobeo/xacobeo.json"

# Errores de la transcripción automática, palabra a palabra.
XACOBEO = re.compile(r"^(sh|ch|x)[a-z]*[ck][ao][bv][eo]o$", re.I)
SUELTAS = {"crow": "quote", "planet": "Camino, plan it", "Waves": "Ways", "Waste": "Ways"}

GANCHO = 2.6
MUSICA = ["Carefree", "Life_of_Riley", "Inspired", "Wholesome", "Sunshine_A",
          "Merry_Go", "Easy_Lemon", "Fretless", "Pamgaea", "Hyperfun"]


def palabras(ruta):
    segs = json.load(open(ruta))["segs"]
    ws = [dict(t=w["w"].strip(), s=w["s"], e=w["e"]) for s in segs for w in s["words"]]
    for k, w in enumerate(ws):
        cuerpo = re.sub(r"[^\w']", "", w["t"])
        resto = w["t"][len(cuerpo):] if w["t"].startswith(cuerpo) else ""
        previa = re.sub(r"[^\w]", "", ws[k - 1]["t"]) if k else ""
        siguiente = re.sub(r"[^\w]", "", ws[k + 1]["t"]).lower() if k + 1 < len(ws) else ""
        if XACOBEO.match(cuerpo):
            cuerpo = "Xacobeo"
        elif cuerpo in SUELTAS and (cuerpo not in ("Waves", "Waste") or previa == "Santiago"):
            cuerpo = SUELTAS[cuerpo]
        elif cuerpo == "Way" and previa == "Santiago":
            cuerpo = "Ways"
        elif cuerpo.lower() in ("whole", "holy") and siguiente == "year":
            cuerpo = "Holy"
        elif cuerpo == "year" and previa.lower() in ("whole", "holy"):
            cuerpo = "Year"
        w["t"] = cuerpo + resto
    # Una corrección de varias palabras se reparte el tiempo de la original.
    out = []
    for w in ws:
        partes = w["t"].split(" ")
        paso = (w["e"] - w["s"]) / len(partes)
        out += [dict(t=p, s=w["s"] + k * paso, e=w["s"] + (k + 1) * paso) for k, p in enumerate(partes)]
    return out, segs


def norm(t):
    return re.sub(r"[^a-z0-9']", "", t.lower())


def en(ws, frase, cerca=None):
    obj = [norm(x) for x in frase.split()]
    n = [norm(w["t"]) for w in ws]
    hits = [i for i in range(len(ws) - len(obj) + 1) if n[i:i + len(obj)] == obj]
    if not hits:
        raise ValueError(f"No encuentro '{frase}'")
    if cerca is not None:
        hits.sort(key=lambda i: abs(ws[i]["s"] - cerca))
    return round(ws[hits[0]]["s"], 3)


def fin_voz(ws):
    return ws[-1]["e"]


def duracion(ruta):
    return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0",
                                 str(ruta)], capture_output=True, text=True).stdout)


# Tipos de capa ----------------------------------------------------------

def cartela(frase, principal, secundaria=None, dur=3.2, tono="olivo"):
    return dict(tipo="cartela", frase=frase, principal=principal, secundaria=secundaria, dur=dur, tono=tono)


def stock(frase, nombre, dur=2.0, encuadre="50% 50%"):
    src = f"brutos/{nombre[7:]}.mp4" if nombre.startswith("brutos/") else f"xacobeo/stock/{nombre}.mp4"
    return dict(tipo="broll", frase=frase, src=src, dur=dur, encuadre=encuadre)


def grafico(frase, g, dur=4.0, **kw):
    return dict(tipo="grafico", frase=frase, g=g, dur=dur, **kw)


def mapa(frase, nombre, desde, dur=2.2):
    return dict(tipo="mapa", frase=frase, src=f"xacobeo/mapas/{nombre}.mp4", desde=desde, dur=dur)


def web(frase, hasta=None):
    return dict(tipo="png", frase=frase, src="hilary/cartelas/sw-tag-light.png", ancho=880, web=True, hasta=hasta)


# Los diez shorts ----------------------------------------------------------

SHORTS = [
    dict(video="IMG_8743", fotograma=39.45, fin=39.9, id="01-por-que-2027", titulo=["BEFORE YOU", "CHOOSE YOUR", "CAMINO YEAR"],
         portada=["WHY 2027", "WILL BE", "DIFFERENT"],
         capas=[stock("2027 won't be", "catedral-siluetas", 2.5),
                cartela("It will be a Holy Year", "2027", "A HOLY YEAR"),
                grafico("This happens when", "calendario", 5.0, escala=0.92),
                stock("thousands of pilgrims", "multitud-calle", 2.4),
                stock("won't happen again", "abrazo", 1.6),
                cartela("don't leave it", "PLAN AHEAD", "DON'T WAIT TOO LONG"),
                web("Santiago Ways is already"),
                cartela("Request your quote", "REQUEST", "YOUR QUOTE", dur=4.0)]),

    dict(video="IMG_8744", fotograma=30.75, fin=31.2, id="02-el-siguiente-2032", titulo=["MISS 2027?", "YOU'LL WAIT", "UNTIL 2032"],
         portada=["THE NEXT", "HOLY YEAR?", "NOT UNTIL 2032"],
         capas=[cartela("you'll have to wait", "5 YEARS", "UNTIL THE NEXT ONE"),
                grafico("doesn't happen every year", "linea", 6.0, actual=2032, texto="After 2027, the next one is 2032", escala=0.92),
                stock("arriving in Santiago", "llegada-plaza", 1.5),
                stock("completely", "catedral-obradoiro", 2.6),
                web("Santiago Ways can organize"),
                cartela("Request your quote", "REQUEST YOUR QUOTE", "START PLANNING", dur=4.0)]),

    dict(video="IMG_8748", fotograma=39.55, fin=40.0, id="03-perdonar-pecados", titulo=["CAN THE CAMINO", "FORGIVE", "YOUR SINS?"],
         portada=["CAN THE CAMINO", "FORGIVE", "YOUR SINS?"],
         capas=[stock("Well, there's some truth", "brutos/interior-velas", 2.0),
                cartela("plenary indulgence", "INDULGENCE", "PLENARY · JUBILEE", dur=3.6),
                stock("established by the Church", "catedral-torres-2", 2.4),
                cartela("So no, walking", "100 KM", "NOT A MAGIC BUTTON"),
                stock("unforgettable Camino", "celebracion", 1.6),
                web("start planning it")]),

    dict(video="IMG_8750", fotograma=33.55, fin=34.0, id="04-error-reservar", titulo=["THE BIGGEST", "2027 BOOKING", "MISTAKE"],
         portada=["THE BIGGEST", "2027 BOOKING", "MISTAKE"],
         capas=[cartela("It will be a Holy Year", "HOLY YEAR", "HUGE DEMAND EXPECTED"),
                stock("most popular routes", "multitud-calle", 2.4),
                stock("best located accommodation", "hotel", 2.0),
                grafico("Waiting too long", "candado", 3.6, texto="Book early, more options", escala=1.1),
                web("talk to Santiago Ways")]),

    dict(video="IMG_8752", fotograma=33.95, fin=34.4, id="05-2027-vs-normal", titulo=["2027 VS", "A NORMAL", "YEAR"], acento=0,
         portada=["2027 VS", "A NORMAL", "YEAR"],
         capas=[cartela("will be a Xacobeo", "2027", "XACOBEO"),
                stock("more pilgrims", "multitud-camino", 1.8),
                stock("special celebrations", "celebracion", 1.6),
                stock("Santiago experiencing", "catedral-siluetas", 2.4),
                cartela("Yes, there will be", "MORE PEOPLE", "A UNIQUE EXPERIENCE"),
                web("can help you plan"),
                cartela("Request your quote", "REQUEST", "YOUR QUOTE", dur=4.0)]),

    dict(video="IMG_8754", fotograma=28.65, fin=29.1, id="06-puerta-santa", titulo=["THIS DOOR", "ISN'T OPEN", "EVERY YEAR"], acento=0,
         portada=["THE DOOR THAT", "ONLY OPENS IN", "A HOLY YEAR"],
         capas=[cartela("It's the Holy Door", "THE HOLY DOOR", "SANTIAGO CATHEDRAL", dur=3.4),
                stock("its opening marks", "brutos/portico-sellado", 1.9),
                stock("pilgrims from around", "llegada-plaza", 1.5),
                stock("Jubilee tradition", "brutos/interior-velas", 2.0),
                cartela("And in 2027", "2027", "CENTRE STAGE AGAIN"),
                web("Start planning")]),

    dict(video="IMG_8756", fotograma=32.95, fin=33.4, id="07-100km-indulgencia", titulo=["100 KM", "IS NOT THE", "INDULGENCE"],
         portada=["100 KM", "IS NOT THE", "INDULGENCE"],
         capas=[cartela("The famous 100", "100 KM", "= THE COMPOSTELA", dur=3.4),
                stock("Compostela on foot", "compostelas", 2.0),
                cartela("Holy Year Indulgence", "INDULGENCE", "SOMETHING DIFFERENT"),
                stock("two separate traditions", "brutos/interior-velas", 2.0),
                stock("And if you want to arrive", "llegada-plaza", 1.5),
                web("plan it with")]),

    dict(video="IMG_8758", fotograma=35.25, fin=35.7, id="08-que-ruta-2027", titulo=["WHICH CAMINO", "SHOULD YOU WALK", "IN 2027?"],
         portada=["WHICH CAMINO", "SHOULD YOU WALK", "IN 2027?"],
         capas=[mapa("The French Way", "frances", 16.0, 3.4),
                cartela("The French Way", "FRENCH WAY", None, dur=3.2),
                mapa("Portuguese Way?", "portugues", 15.0, 1.6),
                cartela("Portuguese Way?", "PORTUGUESE WAY", None, dur=1.5),
                mapa("Coastal Portuguese?", "portugues", 19.0, 1.4),
                cartela("Coastal Portuguese?", "COASTAL PORTUGUESE", None, dur=1.3),
                stock("English Way?", "brutos/vieiras", 1.2),
                cartela("English Way?", "ENGLISH WAY", None, dur=1.2),
                mapa("Primitive Way?", "primitivo", 16.0, 1.8),
                cartela("Primitive Way?", "PRIMITIVE WAY", None, dur=1.7),
                stock("choosing the right route", "bosque-peregrinos", 2.4),
                web("Tell us what kind")]),

    dict(video="IMG_8762", fotograma=34.35, fin=34.8, id="09-demasiado-lleno", titulo=["WILL THE CAMINO", "BE TOO CROWDED", "IN 2027?"],
         portada=["WILL THE CAMINO", "BE TOO CROWDED", "IN 2027?"],
         capas=[stock("important catch", "multitud-calle", 2.2),
                cartela("Not every route", "NOT EVERY ROUTE", "HAS THE SAME CROWDS", dur=3.6),
                stock("Choose your dates", "bosque-peregrinos", 2.4),
                stock("without limiting yourself", "atardecer", 2.2),
                web("Santiago Ways can help"),
                cartela("if you plan it", "PLAN IT WELL", "ENJOY 2027", dur=3.0)]),

    dict(video="IMG_8763", fotograma=30.95, fin=31.4, id="10-tu-camino-2027", titulo=["THIS IS THE YEAR", "I'M WALKING", "THE CAMINO"],
         portada=["IS 2027", "YOUR CAMINO", "YEAR?"],
         capas=[cartela("It will be a Holy Year", "2027", "A HOLY YEAR", dur=2.8),
                stock("Santiago will be celebrating", "catedral-siluetas", 2.4),
                stock("pilgrims arriving", "llegada-plaza", 1.5),
                stock("to be part of it", "abrazo", 1.5),
                cartela("But there's one thing", "START PLANNING", "DON'T LEAVE IT LATE", dur=3.6),
                web("Plan your 2027 Camino")]),
]


def construir(carpeta, s, idx):
    ws, segs = palabras(Path(carpeta) / f"{s['video']}.json")
    video = f"xacobeo/videos/{s['video']}.mp4"
    # La duración, del vídeo original que viene junto a la transcripción.
    original = Path(carpeta) / f"{s['video']}.mov"
    total = duracion(original if original.exists() else PUBLIC / video)
    # Se corta antes de que Hildary vaya a parar la cámara.
    total = min(total, s.get("fin", total))
    voz_fin = fin_voz(ws)

    capas = []
    for c in s["capas"]:
        c = dict(c)
        c["en"] = max(GANCHO + 0.1, en(ws, c.pop("frase")))
        if c.get("web"):
            # La web se queda hasta que acaba la voz (o hasta la siguiente cartela).
            c["dur"] = round(voz_fin + 0.6 - c["en"], 3)
        capas.append(c)

    # Una sola cartela a la vez en la franja superior; las cortinillas
    # tampoco se pisan entre sí.
    for grupo in (("cartela", "png"), ("broll", "grafico", "mapa")):
        sel = sorted([c for c in capas if c["tipo"] in grupo], key=lambda c: c["en"])
        for a, b in zip(sel, sel[1:]):
            a["dur"] = round(min(a["dur"], b["en"] - a["en"] - 0.05), 3)
    capas = [c for c in capas if c["dur"] >= 0.8]
    for c in capas:
        c["dur"] = round(min(c["dur"], total - c["en"]), 3)

    # Zooms de énfasis en cada arranque de frase, alternando.
    zooms, k = [], 0
    for sg in segs:
        t = sg["start"]
        if t < GANCHO:
            continue
        k += 1
        zooms.append(dict(en=round(t, 3), z=1.0 if k % 2 == 0 else 1.1))

    sfx = [dict(en=0, src="sfx/impacto.wav", vol=0.45), dict(en=GANCHO - 0.25, src="sfx/whoosh-corto.wav", vol=0.25)]
    for c in capas:
        if c["tipo"] in ("broll", "grafico", "mapa"):
            sfx.append(dict(en=max(0, round(c["en"] - 0.15, 3)), src="sfx/whoosh-corto.wav", vol=0.22))
        elif c.get("web"):
            sfx.append(dict(en=c["en"], src="sfx/ding.wav", vol=0.25))
        else:
            sfx.append(dict(en=c["en"], src="sfx/pop.wav", vol=0.35))

    return dict(
        id=s["id"], video=video, duracion=round(total, 3),
        titulo=s["titulo"], acento=s.get("acento", len(s["titulo"]) - 1),
        gancho=dict(dur=GANCHO),
        # Portada: la sonrisa con la boca cerrada que hace al terminar de hablar,
        # justo antes del corte.
        portada=dict(titulo=s["portada"], acento=len(s["portada"]) - 1, fotograma=s.get("fotograma", 1.5)),
        capas=sorted(capas, key=lambda c: c["en"]),
        zooms=zooms,
        palabras=[dict(t=w["t"], en=round(w["s"], 3), fin=round(w["e"], 3)) for w in ws],
        sfx=sfx,
        musica=dict(src=f"musica/{MUSICA[idx % len(MUSICA)]}.mp3", vol=0.06),
    )


def main():
    datos = [construir(sys.argv[1], s, i) for i, s in enumerate(SHORTS)]
    SALIDA.parent.mkdir(parents=True, exist_ok=True)
    json.dump(datos, open(SALIDA, "w"), ensure_ascii=False, indent=1)
    for d in datos:
        tipos = [c["tipo"] for c in d["capas"]]
        print(f"{d['id']:26s} {d['duracion']:5.1f}s  capas {len(tipos):2d}  "
              f"stock {tipos.count('broll')}  gráficos {tipos.count('grafico') + tipos.count('mapa')}")


if __name__ == "__main__":
    main()
