#!/usr/bin/env python3
"""Parte un bruto en sus planos y los deja listos para `public/brutos`.

Es el paso que faltaba entre `planos.py`, que dice dónde empieza cada toma, y
el montaje, que espera un archivo por plano. Recorta respetando los límites
detectados, así que ningún clip se come el principio del plano siguiente.

    python3 recortar.py bruto.mp4 destino/ [nombre1 nombre2 ...]

Sin nombres, los archivos salen como `bruto-01.mp4`, `bruto-02.mp4` y así.
Con nombres, se aplican por orden a los planos detectados y los que sobren
siguen con la numeración. Conviene pasar solo los planos que se van a usar:
el banco se lee mejor con nombres como `catedral-torres` que con números.
"""
import subprocess, sys, os, pathlib

from planos import FF, planos

# Los clips del banco son 1920x1080 a 30 fps en H.264, y conviene que los
# nuevos salgan igual para que Remotion no tenga que adaptar nada al vuelo.
CODIFICACION = ["-c:v", "libx264", "-preset", "slow", "-crf", "18",
                "-pix_fmt", "yuv420p", "-r", "30", "-an"]


def recortar(src, destino, nombres=(), paso=0.25, umbral=0.22):
    dur, tramos = planos(src, paso, umbral)
    destino = pathlib.Path(destino)
    destino.mkdir(parents=True, exist_ok=True)
    base = pathlib.Path(src).stem.lower().replace(" ", "-")

    print(f"{os.path.basename(src)}  ·  {dur:.1f}s  ·  {len(tramos)} planos")
    salidas = []
    for i, (ini, fin) in enumerate(tramos):
        nombre = nombres[i] if i < len(nombres) else f"{base}-{i+1:02d}"
        salida = destino / f"{nombre}.mp4"
        # -ss antes de -i busca rápido; -t en lugar de -to porque la búsqueda
        # ya ha movido el origen de tiempos.
        subprocess.run([FF, "-v", "error", "-ss", f"{ini:.3f}", "-i", src,
                        "-t", f"{fin - ini:.3f}", *CODIFICACION,
                        str(salida), "-y"], check=True)
        print(f"  {salida.name:28s} {ini:6.2f}s → {fin:6.2f}s   ({fin-ini:.2f}s)")
        salidas.append(salida)
    return salidas


if __name__ == "__main__":
    if len(sys.argv) < 3:
        raise SystemExit(__doc__)
    recortar(sys.argv[1], sys.argv[2], sys.argv[3:])
