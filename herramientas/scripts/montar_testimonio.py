#!/usr/bin/env python3
"""Prepara el metraje de un testimonio a partir de una entrevista en plano fijo.

Corta los fragmentos elegidos (tiempos en segundos del bruto horizontal),
les aplica la corrección de color, los une en un solo archivo con el audio
ya limpio y escribe un JSON con la línea de tiempo y las palabras
remapeadas, que es lo que leen las composiciones de Remotion.

Los cortes se redondean a fotogramas de 30 fps y el audio se corta con los
mismos tiempos, así que imagen y voz no se desplazan al encadenar.

    python3 montar_testimonio.py plan.json

El plan indica el vídeo fuente, el audio limpio, la transcripción de
faster-whisper, el desfase de la cámara (si no es la que grabó el audio),
el filtro de color, el tamaño de salida y la lista de fragmentos.
"""
import json, os, re, subprocess, sys, tempfile

FPS = 30


def fr(t):
    return round(t * FPS) / FPS


def run(cmd):
    subprocess.run(cmd, check=True)


def main(plan_path):
    plan = json.load(open(plan_path))
    base = os.path.dirname(os.path.abspath(plan_path))
    p = lambda k: os.path.join(base, plan[k])
    desfase = plan.get("desfase", 0.0)
    correcciones = plan.get("correcciones", {})
    segs = json.load(open(p("transcripcion")))
    palabras = [w for s in segs for w in s["words"]]

    tmp = tempfile.mkdtemp()
    piezas, linea, words_out = [], [], []
    t_linea = 0.0
    for i, (ini, fin) in enumerate(plan["fragmentos"]):
        ini, fin = fr(ini), fr(fin)
        dura = round(fin - ini, 4)
        v = os.path.join(tmp, f"v{i:02d}.mp4")
        a = os.path.join(tmp, f"a{i:02d}.wav")
        run(["ffmpeg", "-v", "error", "-y", "-ss", f"{ini - desfase:.4f}", "-i", p("video"),
             "-t", f"{dura:.4f}", "-an",
             "-vf", f"fps={FPS},{plan['escala']},{plan['color']},format=yuv420p",
             "-c:v", "libx264", "-preset", "medium", "-crf", str(plan.get("crf", 18)), v])
        # Fundido de 8 ms en cada borde: evita el chasquido del corte.
        run(["ffmpeg", "-v", "error", "-y", "-ss", f"{ini:.4f}", "-t", f"{dura:.4f}",
             "-i", p("audio"), "-af",
             f"afade=t=in:d=0.008,afade=t=out:st={dura - 0.008:.4f}:d=0.008",
             "-ar", "48000", "-ac", "1", a])
        piezas.append((v, a))
        linea.append({"desde": round(t_linea, 4), "hasta": round(t_linea + dura, 4),
                      "fuente": [ini, fin]})
        for w in palabras:
            if w["s"] >= ini - 0.02 and w["e"] <= fin + 0.05:
                texto = w["w"].strip()
                clave = re.sub(r"[^\w']", "", texto.lower())
                if clave in correcciones:
                    texto = re.sub(r"[\w']+", correcciones[clave], texto, count=1)
                words_out.append({"w": texto, "s": round(w["s"] - ini + t_linea, 3),
                                  "e": round(min(w["e"], fin) - ini + t_linea, 3)})
        t_linea += dura

    lista_v = os.path.join(tmp, "v.txt")
    lista_a = os.path.join(tmp, "a.txt")
    open(lista_v, "w").write("".join(f"file '{v}'\n" for v, _ in piezas))
    open(lista_a, "w").write("".join(f"file '{a}'\n" for _, a in piezas))
    salida = os.path.join(base, plan["salida"])
    os.makedirs(os.path.dirname(salida), exist_ok=True)
    run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", lista_v,
         "-f", "concat", "-safe", "0", "-i", lista_a,
         "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "256k",
         "-movflags", "+faststart", salida])
    json.dump({"duracion": round(t_linea, 4), "cortes": linea, "palabras": words_out},
              open(os.path.join(base, plan["json"]), "w"), indent=1, ensure_ascii=False)
    print(f"{salida}: {t_linea:.2f} s en {len(piezas)} fragmentos")


if __name__ == "__main__":
    main(sys.argv[1])
