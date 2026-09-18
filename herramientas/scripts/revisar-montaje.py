#!/usr/bin/env python3
"""Revisa el reparto de planos de una composicion antes de renderizar.

Comprueba las cuatro cosas que han salido mal alguna vez:

  1. Que ninguna toma se estire mas alla de lo que dura en el bruto, porque
     entonces se congela o se mete en el plano siguiente del bruto.
  2. Que ninguna baje del minimo legible. Un plano de menos de un segundo
     en medio de un bloque se lee como un error de montaje.
  3. Que no se repita una toma entre bloques contiguos, que al volver parece
     un fallo.
  4. Que el ralenti no se pase de frenada.

    python3 herramientas/scripts/revisar-montaje.py video/src/ReelXacobeoUS.tsx
"""
import re, sys, pathlib, subprocess, json

RAIZ = pathlib.Path(__file__).resolve().parents[2]
sys.path.insert(0, str(RAIZ / "herramientas/scripts"))
from planos import FP

MINIMO = 1.15
RITMO_MINIMO = 0.42


def duracion_bruto(nombre):
    ruta = RAIZ / "video/public/brutos" / f"{nombre}.mp4"
    if not ruta.exists():
        return None
    out = subprocess.run([FP, "-v", "error", "-show_entries", "format=duration",
                          "-of", "json", str(ruta)], capture_output=True, text=True, check=True)
    return float(json.loads(out.stdout)["format"]["duration"])


def main(destino):
    s = pathlib.Path(destino).read_text()
    B = [float(m) for m in re.findall(r"^\s*([\d.]+), //", s, re.M)]
    bloques = re.findall(
        r'name="([^"]+)">\s*<Planos\s+total=\{dur\((\d+)\)\}.*?lista=\{\[(.*?)\]\}', s, re.S)
    fallos = []
    usados = []

    for nombre, i, lista in bloques:
        i = int(i)
        D = B[i + 1] - B[i]
        planos = []
        for linea in re.findall(r"\{([^{}]*src:[^{}]*)\}", lista):
            src = re.search(r'src: "([^"]+)"', linea).group(1)
            dura = float(re.search(r"dura: ([\d.]+)", linea).group(1))
            ritmo = re.search(r"ritmo: ([\d.]+)", linea)
            planos.append((src, dura, float(ritmo.group(1)) if ritmo else 1.0))

        suma = sum(d / r for _, d, r in planos)
        if suma < D - 0.02:
            fallos.append(f"{nombre}: las tomas rinden {suma:.2f}s y el bloque "
                          f"pide {D:.2f}s")

        acc, reparto = 0.0, []
        for j, (src, dura, ritmo) in enumerate(planos):
            x = D - acc if j == len(planos) - 1 else (dura / ritmo) / suma * D
            acc += x
            reparto.append((src, x, ritmo))
            bruto = duracion_bruto(src)
            # Lo que se consume de bruto es lo que dura en pantalla por el
            # ritmo: a media velocidad, dos segundos de plano gastan uno de
            # metraje. Pasarse de ahi es lo que congela la imagen.
            gasto = x * ritmo
            if bruto is None:
                fallos.append(f"{nombre}: no existe el bruto {src}")
            elif gasto > bruto + 0.04:
                fallos.append(f"{nombre}/{src}: gasta {gasto:.2f}s de una toma "
                              f"que dura {bruto:.2f}s, asi que se congela")
            if x < MINIMO:
                fallos.append(f"{nombre}/{src}: solo {x:.2f}s en pantalla")
            if ritmo < RITMO_MINIMO:
                fallos.append(f"{nombre}/{src}: ralenti de {ritmo} demasiado "
                              f"marcado")

        usados.append((nombre, [p[0] for p in planos]))
        print(f"{nombre[:30]:30s} {D:5.2f}s  " +
              "  ".join(f"{a}:{b:.2f}" + (f"@{c}" if c != 1 else "")
                        for a, b, c in reparto))

    for (n1, p1), (n2, p2) in zip(usados, usados[1:]):
        for repe in set(p1) & set(p2):
            fallos.append(f"{repe} se repite entre «{n1}» y «{n2}», que van "
                          f"seguidos")

    print()
    if fallos:
        print(f"{len(fallos)} cosas que revisar:")
        for f in fallos:
            print(f"  · {f}")
        return 1
    print(f"Bien: {sum(len(p) for _, p in usados)} tomas, ninguna por debajo "
          f"de {MINIMO:.2f}s y sin repeticiones seguidas.")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1] if len(sys.argv) > 1
                  else "video/src/ReelXacobeoUS.tsx"))
