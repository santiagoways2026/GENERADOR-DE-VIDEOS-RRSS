#!/usr/bin/env python3
"""Genera las pistas de subtítulos .srt de una pieza a partir de su archivo
de locución.

El vídeo y los subtítulos leen el mismo JSON, así que no pueden quedarse
desincronizados: si se retocan los tiempos al llegar la locución grabada, se
regeneran los .srt con este script y ya está.

    python3 srt.py video/src/datos/locucion-55.json salida/ nombre-base

Escribe nombre-base.es.srt y nombre-base.en.srt, una pista por idioma, para
subirlas a YouTube.
"""
import json, sys, pathlib


def marca(s):
    ms = round(s * 1000)
    h, ms = divmod(ms, 3_600_000)
    m, ms = divmod(ms, 60_000)
    seg, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{seg:02d},{ms:03d}"


def srt(pies, idioma):
    bloques = []
    for i, p in enumerate(pies, 1):
        bloques.append(f"{i}\n{marca(p['desde'])} --> {marca(p['hasta'])}\n{p[idioma]}\n")
    return "\n".join(bloques)


if __name__ == "__main__":
    origen, destino, base = sys.argv[1], pathlib.Path(sys.argv[2]), sys.argv[3]
    pies = json.loads(pathlib.Path(origen).read_text(encoding="utf-8"))["pies"]
    destino.mkdir(parents=True, exist_ok=True)
    for idioma in ("es", "en"):
        f = destino / f"{base}.{idioma}.srt"
        f.write_text(srt(pies, idioma), encoding="utf-8")
        print(f"{f}  ·  {len(pies)} pies")
