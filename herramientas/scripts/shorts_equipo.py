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
                ("0067", 83.68, 84.25, "+")],
        cartelas=[dict(frase=3, principal="Flechas amarillas", secundaria="En piedras, árboles y paredes"),
                  dict(frase=9, principal="App sin conexión", secundaria="Y asistencia 24 h")]),
    "s3-portomarin": dict(
        titulo=["Un pueblo", "trasladado", "piedra a piedra"],
        musica="chill_Dreamer",
        frases=[("0072", 1.07, 4.79, None),
                ("0072", 77.05, 79.23, D + "9110228_0069_D.mp4@3.0"),
                ("0072", 81.49, 83.87, None),
                ("0072", 84.11, 88.31, D + "9110126_0068_D.mp4@0.5"),
                ("0072", 120.69, 123.69, D + "9110407_0070_D.mp4@2.0"),
                ("0072", 125.39, 129.69, None),
                ("0072", 154.12, 158.14, "dji/IMG_5440.mp4@0.2"),
                ("0072", 169.24, 172.36, None)],
        cartelas=[dict(frase=3, principal="Portomarín", secundaria="Trasladado piedra a piedra")]),
    "s4-bastones": dict(
        titulo=["¿Bastones", "en el", "Camino?"],
        musica="chill_Wallpaper",
        frases=[("0073", 2.89, 6.19, None),
                ("0074", 1.96, 5.58, D + "9074037_0047_D.mp4@1.0"),
                ("0075", 9.28, 12.40, None),
                ("0076", 2.48, 7.14, D + "9074051_0048_D.mp4@1.0"),
                ("0078", 0.00, 3.22, None),
                ("0079", 26.45, 31.95, D + "9090338_0051_D.mp4@1.0")],
        cartelas=[dict(frase=4, principal="Ajústalos", secundaria="A tu medida")]),
    "s5-cuanto-se-camina": dict(
        titulo=["¿Cuánto se", "camina de", "verdad?"],
        musica="chill_Smooth_Lovin",
        frases=[("0082", 0.53, 2.67, None),
                ("0082", 39.09, 43.21, D + "9072925_0036_D.mp4@3.0"),
                ("0082", 53.63, 56.23, None),
                ("0082", 60.95, 63.05, "dji/IMG_5198.mp4@0.2"),
                ("0082", 70.88, 76.40, None),
                ("0082", 81.62, 84.54, D + "9073713_0044_D.mp4@3.0"),
                ("0082", 90.18, 94.08, None),
                ("0082", 98.94, 102.44, D + "9070236_0016_D.mp4@5.0")],
        cartelas=[dict(frase=1, principal="20 a 25 km", secundaria="Por etapa desde Sarria"),
                  dict(frase=2, principal="5 o 6 horas", secundaria="Caminando")]),
    "s6-nadie-te-cuenta": dict(
        titulo=["Lo que nadie", "te cuenta del", "Camino"],
        musica="chill_Deliberate_Thought",
        frases=[("0083", 10.47, 12.09, None),
                ("0084", 18.90, 20.55, D + "9110228_0069_D.mp4@6.0"),
                ("0091", 35.26, 36.98, None),
                ("0092", 4.80, 8.82, D + "9073410_0040_D.mp4@0.0"),
                ("0093", 10.19, 15.51, None),
                ("0099", 0.34, 2.54, D + "9073931_0046_D.mp4@1.0"),
                ("0100", 1.62, 6.44, None)]),
    "s7-xacobeo-2027": dict(
        titulo=["2027 no será", "un año", "normal"],
        musica="chill_Backbay_Lounge",
        frases=[("0101", 1.52, 4.40, None),
                ("0102", 16.30, 18.42, "dji/IMG_5542.mp4@0.3"),
                ("0102", 38.74, 44.52, None),
                ("0102", 48.18, 51.92, "dji/IMG_5543.mp4@14.0"),
                ("0102", 54.36, 56.84, None),
                ("0102", 60.26, 62.84, D + "9072047_0031_D.mp4@3.0"),
                ("0102", 69.82, 75.32, None),
                ("0102", 85.78, 90.50, "dji/IMG_5520.mp4@0.5")],
        cartelas=[dict(frase=2, principal="25 de julio", secundaria="En domingo: año santo"),
                  dict(frase=6, principal="Reserva", secundaria="Con tiempo")]),
    "s8-puerta-santa": dict(
        titulo=["La Puerta", "Santa", "se abre"],
        musica="chill_Late_Night_Radio",
        frases=[("0104", 3.75, 4.95, None),
                ("0104", 8.35, 13.10, "dji/IMG_5542.mp4@0.3"),
                ("0106", 31.01, 34.39, None),
                ("0106", 34.79, 37.07, "dji/IMG_5543.mp4@14.0"),
                ("0106", 37.07, 42.41, None)],
        cartelas=[dict(frase=2, principal="Año Xacobeo", secundaria="2027"),
                  dict(frase=3, principal="El siguiente", secundaria="2032")]),
    "s9-credencial": dict(
        titulo=["Sella tu", "credencial", "por el Camino"],
        musica="chill_Bossa_Antigua",
        # El sellado va sobre la primera frase; la Oficina del Peregrino se ve con ella delante.
        frases=[("0107", 19.20, 22.60, D + "9065826_0015_D.mp4@7.4"),
                ("0110", 0.80, 5.74, None)]),
}


# Lo que Whisper oye mal en estas tomas.
ARREGLOS = {"compostela": "Compostela", "portomarín": "Portomarín", "Velesar": "Belesar",
            "Sarri ": "Sarria ", "Comparadas": "Con paradas", "santiagoweb": "santiagoways",
            "santiagowest": "santiagoways", "jacobeo": "Xacobeo", "Jacoveo": "Xacobeo", "cambio": "camino",
            "evidencia": "credencial", "selfies": "sellos", "reservalo": "resérvalo",
            "organizemos": "organicemos", "Way.": "Ways."}


PALABRA = {"Sarri": "Sarria"}
# Pares de palabras seguidas: (oído, oído) -> (bien, bien); "" une las dos.
PARES = {("saco", "veo"): ("Xacobeo", ""), ("ahí", "a"): ("ya", ""), ("ahora", "rarísima"): ("a horas", "rarísimas")}


def palabras_de(tr, clip, a, b, t):
    out = []
    for s in tr[f"{clip}.mp4"]:
        for w in s["w"]:
            if w["s"] >= a - 0.05 and w["s"] < b - 0.05:
                out.append(dict(t=w["w"].strip(), en=round(t + w["s"] - a, 3), fin=round(t + min(w["e"], b) - a, 3)))
    return out


def main():
    tr = json.load(open(sys.argv[1]))
    datos = []
    for sid, spec in SHORTS.items():
        planos, recursos, palabras, cartelas, t = [], [], [], [], 0.0
        for i, (clip, a, b, rec) in enumerate(spec["frases"]):
            a, b = max(0.0, a - 0.08), b + 0.12  # un respiro para no comerse sílabas
            dur = round(b - a, 3)
            planos.append(dict(src=f"paula/{clip}.mp4", desde=round(a, 3), dur=dur, en=round(t, 3),
                               zoom=1.15 if i % 2 == 0 else 1.25))
            if rec == "+":
                # Sigue el recurso anterior sin corte.
                recursos[-1]["dur"] = round(recursos[-1]["dur"] + dur, 3)
            elif rec:
                src, desde = rec.split("@")
                recursos.append(dict(en=round(t, 3), dur=dur, src=src, desde=float(desde)))
            palabras += palabras_de(tr, clip, a, b, t)
            t += dur
        for c in spec.get("cartelas", []):
            p = planos[c["frase"]]
            cartelas.append(dict(en=round(p["en"] + 0.2, 3), dur=round(max(3.0, p["dur"]), 3),
                                 principal=c["principal"], secundaria=c["secundaria"]))
        limpias = []
        for w in palabras:
            for a, b in ARREGLOS.items():
                w["t"] = w["t"].replace(a, b)
            w["t"] = PALABRA.get(w["t"], w["t"])
            previa = limpias[-1]["t"] if limpias else ""
            if (previa, w["t"]) in PARES:
                limpias[-1]["t"], w["t"] = PARES[(previa, w["t"])]
                if not w["t"]:
                    limpias[-1]["fin"] = w["fin"]
                    continue
            limpias.append(w)
        palabras = limpias
        datos.append(dict(id=sid, titulo=spec["titulo"], duracion=round(t + 1.4, 3), finVoz=round(t, 3),
                          planos=planos, recursos=recursos, palabras=palabras, cartelas=cartelas,
                          musica=dict(src=f"musica/{spec['musica']}.mp3", vol=0.04)))
        print(sid, round(t, 1), " ".join(w["t"] for w in palabras)[:300])
    json.dump(datos, open(SALIDA, "w"), ensure_ascii=False, indent=1)


main()
