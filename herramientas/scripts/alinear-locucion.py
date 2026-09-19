#!/usr/bin/env python3
"""Reparte el texto de una locucion entre los tramos de voz del audio.

Sirve para los subtitulos cuando no hay un SRT. Los tiempos se pueden medir
con exactitud, pero repartir el guion entre ellos a ojo sale mal: basta
equivocarse en un tramo para que todo lo demas quede corrido.

Esto lo resuelve midiendo. Se localizan los tramos de voz con
`silencedetect`, se cuentan las silabas de cada palabra y se busca el reparto
que mejor ajusta el peso del texto a la duracion de cada tramo, con
programacion dinamica. Cortar donde hay un punto o una coma puntua mejor,
porque ahi es donde de verdad respira quien lee.

    python3 alinear-locucion.py locucion.mp3 guion.txt frances

Escribe `video/src/subtitulos/<nombre>.ts`. Si luego llega un SRT de verdad,
`srt-a-cues.mjs` lo sustituye: esto es la mejor aproximacion sin el, no un
reemplazo de una transcripcion.
"""
import json
import pathlib
import re
import subprocess
import sys

RAIZ = pathlib.Path(__file__).resolve().parents[2]
sys.path.insert(0, str(RAIZ / "herramientas/scripts"))
from planos import FF, FP

UMBRAL = "-30dB"
PAUSA = "0.25"
# Lo que cuesta cortar donde no hay ni coma ni punto.
CORTE_FEO = 0.035


def duracion(src):
    out = subprocess.run([FP, "-v", "error", "-show_entries", "format=duration",
                          "-of", "json", str(src)], capture_output=True,
                         text=True, check=True)
    return float(json.loads(out.stdout)["format"]["duration"])


def tramos_de_voz(src):
    """Los trozos con voz, o sea lo que queda entre silencio y silencio."""
    salida = subprocess.run(
        [FF, "-i", str(src), "-af", f"silencedetect=noise={UMBRAL}:d={PAUSA}",
         "-f", "null", "-"], capture_output=True, text=True).stderr
    silencios = []
    for m in re.finditer(r"silence_start: ([\d.]+)[\s\S]*?silence_duration: ([\d.]+)",
                         salida):
        silencios.append((float(m.group(1)), float(m.group(2))))
    fin = duracion(src)
    tramos, cursor = [], 0.0
    for inicio, largo in silencios:
        if inicio - cursor > 0.05:
            tramos.append((cursor, inicio))
        cursor = inicio + largo
    if fin - cursor > 0.05:
        tramos.append((cursor, fin))
    return tramos


# Los numeros se leen, y lo que cuenta para el reparto es lo que se tarda en
# decirlos, no los caracteres que ocupan.
NUMEROS = {
    "780": "seven hundred and eighty", "33": "thirty three", "115": "one hundred and fifteen",
    "2027": "twenty twenty seven", "24/7": "twenty four seven", "100": "one hundred",
}

VOCALES = "aeiouy"


def silabas(palabra):
    """Conteo aproximado para ingles. Basta para repartir pesos."""
    p = re.sub(r"[^a-z]", "", palabra.lower())
    if not p:
        return 0
    grupos = len(re.findall(r"[aeiouy]+", p))
    if p.endswith("e") and not p.endswith(("le", "ee", "ye")) and grupos > 1:
        grupos -= 1
    return max(1, grupos)


# Una cifra y su unidad se dicen de un tirón y en pantalla no se separan.
UNIDADES = {"km", "kilometres", "kilometers", "stages", "days", "hours"}


def preparar(texto):
    """Palabras con su peso y si detras de ellas se puede cortar."""
    palabras = []
    # "780 km" es una sola cosa: se pega antes de repartir nada.
    piezas = []
    for bruto in texto.split():
        if (piezas and re.fullmatch(r"[\d/]+", re.sub(r"[^\w/]", "", piezas[-1]))
                and re.sub(r"[^\w]", "", bruto).lower() in UNIDADES):
            piezas[-1] = f"{piezas[-1]} {bruto}"
        else:
            piezas.append(bruto)
    for bruto in piezas:
        limpio = bruto.strip()
        peso = 0
        for parte in limpio.split():
            clave = re.sub(r"[^\w/]", "", parte)
            hablado = NUMEROS.get(clave, clave)
            peso += sum(silabas(x) for x in hablado.split())
        peso = peso or 1
        # Un punto pesa mas que una coma, y una coma mas que nada.
        if re.search(r"[.!?:]$", limpio):
            corte = 1.0
        elif re.search(r"[,;]$", limpio):
            corte = 0.55
        else:
            corte = 0.0
        palabras.append({"texto": limpio, "peso": peso, "corte": corte})
    return palabras


def alinear(palabras, tramos):
    """Reparto que mejor ajusta el peso del texto a la duracion de los tramos.

    El coste de meter un trozo de texto en un tramo es lo que se desvia su
    duracion esperada de la real, menos una rebaja si el corte cae en un
    signo de puntuacion.
    """
    n, m = len(palabras), len(tramos)
    if m > n:
        raise SystemExit(f"Hay {m} tramos de voz y solo {n} palabras.")
    peso_total = sum(p["peso"] for p in palabras)
    voz_total = sum(b - a for a, b in tramos)
    acumulado = [0]
    for p in palabras:
        acumulado.append(acumulado[-1] + p["peso"])

    INF = float("inf")
    # coste[i][j]: mejor coste repartiendo las primeras i palabras en j tramos.
    coste = [[INF] * (m + 1) for _ in range(n + 1)]
    desde = [[0] * (m + 1) for _ in range(n + 1)]
    coste[0][0] = 0.0
    for j in range(1, m + 1):
        esperado = (tramos[j - 1][1] - tramos[j - 1][0]) / voz_total
        for i in range(j, n - (m - j) + 1):
            mejor, corte_mejor = INF, i - 1
            for k in range(j - 1, i):
                if coste[k][j - 1] is INF or coste[k][j - 1] == INF:
                    continue
                porcion = (acumulado[i] - acumulado[k]) / peso_total
                c = coste[k][j - 1] + abs(porcion - esperado)
                # Cortar donde no respira nadie se penaliza. Sin esto el
                # reparto cuadra en tiempo pero parte frases por la mitad,
                # y un subtitulo que corta "780 / km" se lee fatal aunque
                # dure lo que tiene que durar.
                c += (1 - palabras[i - 1]["corte"]) * CORTE_FEO
                if c < mejor:
                    mejor, corte_mejor = c, k
            coste[i][j] = mejor
            desde[i][j] = corte_mejor

    cortes, i = [], n
    for j in range(m, 0, -1):
        k = desde[i][j]
        cortes.append((k, i))
        i = k
    cortes.reverse()
    return cortes


def main():
    if len(sys.argv) < 4:
        raise SystemExit(__doc__)
    audio, guion, nombre = sys.argv[1], sys.argv[2], sys.argv[3]
    texto = pathlib.Path(guion).read_text(encoding="utf-8")
    palabras = preparar(texto)
    tramos = tramos_de_voz(audio)
    print(f"{len(tramos)} tramos de voz · {len(palabras)} palabras")

    cues = []
    for (a, b), (ini, fin) in zip(tramos, alinear(palabras, tramos)):
        cues.append({
            "desde": round(a, 3),
            "hasta": round(b, 3),
            "texto": " ".join(p["texto"] for p in palabras[ini:fin]),
        })

    for c in cues:
        print(f"  {c['desde']:6.2f} → {c['hasta']:6.2f}  {c['texto']}")

    constante = f"SUBTITULOS_{re.sub(r'[^A-Z0-9]', '_', nombre.upper())}"
    destino = RAIZ / "video/src/subtitulos" / f"{nombre}.ts"
    destino.parent.mkdir(parents=True, exist_ok=True)
    destino.write_text(
        'import type { Cue } from "../componentes/Subtitulos";\n\n'
        f"/**\n * Subtitulos de {nombre}.\n *\n"
        " * NO SE EDITA A MANO. Lo genera:\n"
        f" *   python3 herramientas/scripts/alinear-locucion.py "
        f"{pathlib.Path(audio).name} {pathlib.Path(guion).name} {nombre}\n */\n"
        f"export const {constante}: Cue[] = "
        + json.dumps(cues, ensure_ascii=False, indent=2) + ";\n",
        encoding="utf-8")
    print(f"\n{destino}")


if __name__ == "__main__":
    main()
