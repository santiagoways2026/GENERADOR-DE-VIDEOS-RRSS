"""Corta del vídeo limpio cada tramo que usan los shorts, con imagen y audio
juntos, para que Remotion solo tenga que pegarlos.

    python3 herramientas/scripts/cortar_tramos.py
"""
import json
import subprocess
from pathlib import Path

VIDEO = Path(__file__).resolve().parents[2] / "video"
FUENTE = VIDEO / "public/hilary/limpio.mp4"

tramos = {v["src"]: (v["desde"], v["dur"]) for d in json.load(open(VIDEO / "src/shorts/shorts.json")) for v in d["video"]}
for src, (desde, dur) in sorted(tramos.items()):
    salida = VIDEO / "public" / src
    if salida.exists() and salida.stat().st_size > 0:
        continue
    salida.parent.mkdir(parents=True, exist_ok=True)
    # -ss delante de -i y recodificando: corte exacto al fotograma.
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{desde:.3f}", "-i", str(FUENTE), "-t", f"{dur:.3f}",
                    "-c:v", "libx264", "-preset", "fast", "-crf", "17", "-g", "15", "-pix_fmt", "yuv420p",
                    "-c:a", "aac", "-b:a", "192k", str(salida)], check=True)
print(len(tramos), "tramos")
