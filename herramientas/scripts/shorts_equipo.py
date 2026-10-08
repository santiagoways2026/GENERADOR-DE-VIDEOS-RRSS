"""Guiones de los shorts grabados por el equipo (carpetas "Short N" del Drive).

Cada short es una lista de frases: (clip, desde, hasta, recurso). Las tomas
repiten encuadre, así que un corte entre dos frases a cámara sería un salto:
por eso cada frase va o a cámara o tapada entera por un recurso, y nunca hay
dos frases a cámara seguidas.

    python3 herramientas/scripts/shorts_equipo.py transcripcion.json
"""
import json
import sys
from pathlib import Path

SALIDA = Path(__file__).resolve().parents[2] / "video/src/paula/equipo.json"
D = "dji/DJI_2026092"

SHORTS = {
    "s2-perderse": dict(
        titulo=["¿Te puedes", "perder en el", "Camino?"],
        musica="chill_Lobby_Time",
        frases=[("0067", 8.50, 10.66, None),
                ("0067", 15.34, 16.74, D + "9073931_0046_D.mp4@1.0"),
                ("0067", 19.86, 21.82, None),
                ("0067", 25.22, 27.76, D + "9090353_0052_D.mp4@0.2"),
                ("0067", 33.38, 36.84, D + "9090406_0053_D.mp4@1.0"),
                ("0067", 40.40, 41.96, None),
                ("0067", 47.02, 48.82, D + "9073410_0040_D.mp4@0.0"),
                ("0067", 52.38, 54.94, None),
                ("0067", 57.06, 59.36, D + "9071346_0021_D.mp4@2.0"),
                ("0067", 71.06, 76.94, None),
                ("0067", 80.26, 82.86, D + "9072030_0030_D.mp4@0.5"),
                ("0067", 83.68, 84.25, None)],
        cartelas=[dict(frase=3, principal="Flechas amarillas", secundaria="En piedras, árboles y paredes"),
                  dict(frase=9, principal="App sin conexión", secundaria="Y asistencia 24 h")]),
}


def palabras_de(tr, clip, a, b, t):
    out = []
    for s in tr[f"{clip}.mp4"]:
        for w in s["w"]:
            if w["s"] >= a - 0.05 and w["e"] <= b + 0.15:
                out.append(dict(t=w["w"].strip(), en=round(t + w["s"] - a, 3), fin=round(t + min(w["e"], b) - a, 3)))
    return out


def main():
    tr = json.load(open(sys.argv[1]))
    datos = []
    for sid, spec in SHORTS.items():
        planos, recursos, palabras, cartelas, t = [], [], [], [], 0.0
        for i, (clip, a, b, rec) in enumerate(spec["frases"]):
            a, b = a - 0.08, b + 0.12  # un respiro para no comerse sílabas
            dur = round(b - a, 3)
            planos.append(dict(src=f"paula/{clip}.mp4", desde=round(a, 3), dur=dur, en=round(t, 3),
                               zoom=1.15 if i % 2 == 0 else 1.25))
            if rec:
                src, desde = rec.split("@")
                recursos.append(dict(en=round(t, 3), dur=dur, src=src, desde=float(desde)))
            palabras += palabras_de(tr, clip, a, b, t)
            t += dur
        for c in spec.get("cartelas", []):
            p = planos[c["frase"]]
            cartelas.append(dict(en=round(p["en"] + 0.2, 3), dur=round(max(3.0, p["dur"]), 3),
                                 principal=c["principal"], secundaria=c["secundaria"]))
        for w in palabras:
            w["t"] = w["t"].replace("compostela", "Compostela")
        datos.append(dict(id=sid, titulo=spec["titulo"], duracion=round(t + 1.4, 3), finVoz=round(t, 3),
                          planos=planos, recursos=recursos, palabras=palabras, cartelas=cartelas,
                          musica=dict(src=f"musica/{spec['musica']}.mp3", vol=0.04)))
        print(sid, round(t, 1), " ".join(w["t"] for w in palabras)[:300])
    json.dump(datos, open(SALIDA, "w"), ensure_ascii=False, indent=1)


main()
