"""Compara los planos candidatos contra toda la biblioteca.

La firma es la MEDIANA de nueve fotogramas repartidos por el plano, no un
fotograma suelto: la mediana borra a la gente que cruza y deja el fondo, que
es lo que de verdad identifica una toma. Dos tomas del mismo sitio con gente
distinta delante dan firmas casi iguales; un fotograma suelto, no.
"""
import glob, os, subprocess, sys
import numpy as np

FF = "/usr/local/lib/python3.11/dist-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2"
W, H = 64, 36


def firma(f, ini=None, fin=None):
    cmd = [FF, "-v", "error"]
    if ini is not None:
        cmd += ["-ss", str(ini), "-to", str(fin)]
    cmd += ["-i", f, "-map", "0:v", "-vf", f"scale={W}:{H}", "-pix_fmt", "gray",
            "-f", "rawvideo", "-"]
    v = np.frombuffer(subprocess.run(cmd, capture_output=True).stdout,
                      np.uint8).reshape(-1, H, W).astype(float)
    if len(v) == 0:
        return None
    idx = np.linspace(0, len(v) - 1, min(9, len(v))).astype(int)
    m = np.median(v[idx], axis=0).ravel()
    m = m - m.mean()
    n = np.linalg.norm(m)
    return m / n if n > 1e-6 else m


def main():
    fuente = sys.argv[1]
    tramos = [tuple(float(x) for x in a.split(",")) for a in sys.argv[2:]]

    biblio = []
    for carpeta in ("video/public/brutos", "video/public/brutos/testimonios",
                    "video/public/brutos/piezas-viejas"):
        for g in sorted(glob.glob(f"{carpeta}/*.mp4")):
            s = firma(g)
            if s is not None:
                biblio.append((os.path.relpath(g, "video/public/brutos"), s))
    print(f"biblioteca: {len(biblio)} planos\n")

    print("  #   entra   sale    parecido maximo con la biblioteca")
    for i, (a, b) in enumerate(tramos, 1):
        s = firma(fuente, a, b)
        if s is None:
            print(f"  {i:2d}  sin fotogramas")
            continue
        sim = sorted(((float(np.dot(s, t)), n) for n, t in biblio), reverse=True)
        mejor, seg = sim[0], sim[1]
        marca = "  <-- YA ESTA" if mejor[0] > 0.92 else ("  <-- mirar" if mejor[0] > 0.85 else "")
        print(f"  {i:2d}  {a:6.2f} {b:6.2f}   {mejor[0]:.3f} {mejor[1]:28s}"
              f" | {seg[0]:.3f} {seg[1]}{marca}")


main()
