"""Guion del short de Paula en el mojón (carpeta "Short 1" del Drive).

Cinco tomas del mismo plano, pegadas con su propio audio. Cada corte entre
tomas va tapado por un recurso de metraje propio, para que no se vea el salto.

    python3 herramientas/scripts/short_paula.py transcripcion.json
"""
import json
import sys
from pathlib import Path

SALIDA = Path(__file__).resolve().parents[2] / "video/src/paula/paula.json"

# (toma, desde, hasta) en segundos de cada clip.
TOMAS = [("0057", 16.50, 19.95),   # ¿Sabías que no necesitas hacer los 800 km...?
         ("0058", 0.45, 5.45),     # ...al menos los últimos 100 km de una ruta oficial
         ("0059", 2.28, 5.55),     # Por eso Sarria se ha convertido en...
         ("0060", 0.00, 6.95),     # Y de aquí nos quedan 108,741 km...
         ("0066", 0.00, 7.80)]     # CTA y ¡Buen camino!
CORRIGE = {"Sarrias": "Sarria", "organizamos.": "organizamos."}
D = "dji/DJI_2026092"
# Recursos: (en, dur, src, desde). Cada uno tapa un corte entre tomas.
RECURSOS = [(3.15, 3.0, D + "9065826_0015_D.mp4", 7.4),   # sellado de la credencial
            (8.15, 2.4, D + "9071708_0025_D.mp4", 0.5),   # letras de Sarria
            (10.55, 2.6, D + "9072030_0030_D.mp4", 0.5),  # peregrinos en Sarria
            (18.35, 3.0, D + "9061142_0014_D.mp4", 18.0)] # maletas
CARTELAS = [dict(en=4.0, dur=3.6, principal="100 km", secundaria="Mínimo para la Compostela"),
            dict(en=13.9, dur=3.4, principal="108,741 km", secundaria="Hasta Santiago")]


def main():
    tr = json.load(open(sys.argv[1]))
    planos, palabras, t = [], [], 0.0
    for i, (toma, a, b) in enumerate(TOMAS):
        planos.append(dict(src=f"paula/{toma}.mp4", desde=a, dur=round(b - a, 3), en=round(t, 3),
                           zoom=1.22 if i % 2 == 0 else 1.32))
        for s in tr[f"{toma}.mp4"]:
            for w in s["w"]:
                if w["s"] >= a - 0.02 and w["e"] <= b + 0.1:
                    txt = w["w"].strip()
                    txt = CORRIGE.get(txt, txt)
                    palabras.append(dict(t=txt, en=round(t + w["s"] - a, 3), fin=round(t + min(w["e"], b) - a, 3)))
        t += b - a
    # Whisper parte "108,741" en dos y oye "Sarrias ha" donde dice "Sarria se ha".
    limpias = []
    for w in palabras:
        if w["t"].startswith(",") and limpias:
            limpias[-1]["t"] += w["t"]
            limpias[-1]["fin"] = w["fin"]
            continue
        if w["t"] == "ha" and limpias and limpias[-1]["t"] == "Sarria":
            w = dict(w, t="se ha")
        w["t"] = w["t"].replace("compostela", "Compostela")
        limpias.append(w)
    palabras = limpias
    datos = dict(duracion=round(t + 1.4, 3), finVoz=round(t, 3), planos=planos, palabras=palabras,
                 recursos=[dict(en=e, dur=d, src=s, desde=o) for e, d, s, o in RECURSOS],
                 cartelas=CARTELAS, titulo=["¿Sabías que", "no necesitas", "800 km?"],
                 musica=dict(src="musica/chill_Bossa_Antigua.mp3", vol=0.04))
    json.dump(datos, open(SALIDA, "w"), ensure_ascii=False, indent=1)
    print(datos["duracion"], " ".join(p["t"] for p in palabras))


main()
