#!/usr/bin/env python3
"""Genera la voz en off de cada vídeo con edge-tts y las marcas por palabra.

Cada segmento del guion se sintetiza por separado y se une con una pausa fija,
así el montaje sabe exactamente dónde empieza cada frase.

    python3 voz.py guiones.json carpeta_salida [id_video ...]

Salida por vídeo: <id>.mp3 (voz sola, 48 kHz) y <id>.json con los segmentos y
las palabras (inicio y fin en segundos).
"""
import asyncio, json, os, subprocess, sys, tempfile
import edge_tts

PROXY = os.environ.get("HTTPS_PROXY")
INICIO = 0.05  # la voz arranca casi en el primer fotograma
RECORTE_INI = 0.07  # silencio que edge-tts deja delante de cada frase
COLA = 0.3
TONO = "+0Hz"  # lo que se deja tras la última palabra (edge-tts deja casi 0,9 s)


async def sintetiza(texto, voz, rate, destino, pitch="+0Hz"):
    c = edge_tts.Communicate(texto, voz, rate=rate, pitch=pitch, boundary="WordBoundary", proxy=PROXY)
    palabras = []
    with open(destino, "wb") as f:
        async for chunk in c.stream():
            if chunk["type"] == "audio":
                f.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                ini = chunk["offset"] / 1e7
                palabras.append({"t": chunk["text"], "ini": ini, "fin": ini + chunk["duration"] / 1e7})
    return palabras


def duracion(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                          "-of", "csv=p=0", path], capture_output=True, text=True, check=True)
    return float(out.stdout.strip())


async def video(vid, cfg, voz, salida):
    tmp = tempfile.mkdtemp()
    piezas, segs, t = [], [], INICIO
    sil = os.path.join(tmp, "sil.wav")
    for i, s in enumerate(cfg["segmentos"]):
        mp3 = os.path.join(tmp, f"s{i}.mp3")
        palabras = await sintetiza(s["voz"], voz, cfg["rate"], mp3, TONO)
        wav = os.path.join(tmp, f"s{i}.wav")
        fin = palabras[-1]["fin"] + COLA
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", mp3, "-af",
                        f"atrim={RECORTE_INI}:{fin},asetpts=PTS-STARTPTS,afade=t=out:st={fin - RECORTE_INI - 0.08}:d=0.08",
                        "-ar", "48000", "-ac", "1", wav], check=True)
        d = duracion(wav)
        off = t - RECORTE_INI
        segs.append({**s, "ini": round(t, 3), "fin": round(t + d, 3),
                     "palabras": [{"t": p["t"], "ini": round(off + p["ini"], 3), "fin": round(off + p["fin"], 3)} for p in palabras]})
        piezas.append(wav)
        t += d + cfg["pausa"]
    lista = os.path.join(tmp, "lista.txt")
    with open(lista, "w") as f:
        f.write(f"file '{os.path.join(tmp, 'ini.wav')}'\n")
        for i, p in enumerate(piezas):
            f.write(f"file '{p}'\n")
            if i < len(piezas) - 1:
                f.write(f"file '{sil}'\n")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", "anullsrc=r=48000:cl=mono",
                    "-t", str(cfg["pausa"]), sil], check=True)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", "anullsrc=r=48000:cl=mono",
                    "-t", str(INICIO), os.path.join(tmp, "ini.wav")], check=True)
    mp3 = os.path.join(salida, f"{vid}.mp3")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", lista,
                    "-ar", "48000", "-ac", "2", "-b:a", "192k", mp3], check=True)
    with open(os.path.join(salida, f"{vid}.json"), "w") as f:
        json.dump({"duracion": round(duracion(mp3), 3), "segmentos": segs}, f, ensure_ascii=False, indent=1)
    print(vid, round(duracion(mp3), 2), "s")


async def main():
    global TONO
    guiones = json.load(open(sys.argv[1]))
    TONO = guiones.get("tono", "+0Hz")
    salida = sys.argv[2]
    os.makedirs(salida, exist_ok=True)
    ids = sys.argv[3:] or list(guiones["videos"])
    for vid in ids:
        await video(vid, guiones["videos"][vid], guiones["voz"], salida)

asyncio.run(main())
