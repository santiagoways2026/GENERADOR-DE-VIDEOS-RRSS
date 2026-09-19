#!/usr/bin/env python3
"""Revisa el reparto de planos de una composicion antes de renderizar.

Comprueba las cuatro cosas que han salido mal alguna vez:

  1. Que ninguna toma se estire mas alla de donde se acaba de verdad, que no
     es donde se acaba el archivo: a varios brutos les queda pegado el
     arranque de la toma siguiente, y pasarse de ahi mete medio segundo de
     otra escena en mitad del bloque.
  2. Que ninguna baje del minimo legible. Un plano de menos de un segundo
     en medio de un bloque se lee como un error de montaje.
  3. Que no se repita ninguna toma en toda la pieza. Empezo mirando solo
     bloques contiguos y no bastaba: en el short del Frances, la toma de las
     mujeres con la Compostela salia en el bloque 5 y otra vez en el 7, con
     un bloque de por medio, y se notaba igual. En una pieza de menos de un
     minuto, una cara repetida se reconoce aunque pasen quince segundos.
  4. Que el ralenti no se pase de frenada.

    python3 herramientas/scripts/revisar-montaje.py video/src/ReelXacobeoUS.tsx
"""
import re, sys, pathlib, subprocess, json, hashlib

RAIZ = pathlib.Path(__file__).resolve().parents[2]
sys.path.insert(0, str(RAIZ / "herramientas/scripts"))
from planos import FP, fin_de_toma

MINIMO = 1.15
RITMO_MINIMO = 0.42


CACHE = RAIZ / "herramientas/scripts/.tomas.json"
_cache = json.loads(CACHE.read_text()) if CACHE.exists() else {}


def duracion_bruto(nombre):
    """Hasta donde se puede tirar de un bruto: el final de su primera toma.

    No es lo que dura el archivo. Los brutos son compilaciones y a algunos
    les queda pegado el arranque de la toma siguiente: `iglesia-exterior.mp4`
    dura 1,37 s y su toma se acaba en 1,16. Medir el archivo daba el visto
    bueno a un `dura` de 1,32 que metia en pantalla un fotograma en blanco y
    medio segundo de otra escena, justo antes del corte de bloque. Se veia al
    mirar la pieza y ningun script lo decia.

    Cada medida cuesta una docena de extracciones, asi que se guardan en
    `.tomas.json`, que va al repositorio. La clave es el hash del archivo, no
    su fecha: git no conserva las fechas, y con la fecha el cache no servia de
    nada en cuanto alguien clonaba.
    """
    ruta = RAIZ / "video/public/brutos" / f"{nombre}.mp4"
    if not ruta.exists():
        return None
    sello = hashlib.sha1(ruta.read_bytes()).hexdigest()[:16]
    guardado = _cache.get(nombre)
    if guardado and guardado.get("sello") == sello:
        return guardado["fin"]
    fin = fin_de_toma(str(ruta))
    _cache[nombre] = {"sello": sello, "fin": fin}
    CACHE.write_text(json.dumps(_cache, indent=2, sort_keys=True))
    return fin


def main(destino):
    s = pathlib.Path(destino).read_text()
    # El array de tiempos puede estar en una línea o comentado uno por uno,
    # así que se lee entero y se sacan los números de dentro.
    bloque = re.search(r"const B = \[(.*?)\];", s, re.S)
    if not bloque:
        raise SystemExit(f"{destino}: no encuentro el array B de tiempos.")
    # Los comentarios que anotan qué dice la voz llevan cifras dentro
    # ("In 2027, a door..."), así que se quitan antes de leer los tiempos.
    limpio = re.sub(r"//[^\n]*", "", bloque.group(1))
    B = [float(n) for n in re.findall(r"\d+(?:\.\d+)?", limpio)]
    bloques = re.findall(
        r'name="([^"]+)">\s*<Planos\s+total=\{dur\((\d+)\)\}.*?lista=\{\[(.*?)\]\}', s, re.S)
    fallos = []
    usados = []

    for nombre, i, lista in bloques:
        i = int(i)
        if i + 1 >= len(B):
            fallos.append(f"{nombre}: el bloque {i} no tiene tiempo de final "
                          f"en el array B")
            continue
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
            # metraje. Pasarse de ahi congela la imagen, o peor: si al bruto
            # le sigue otra toma, la mete en pantalla.
            gasto = x * ritmo
            if bruto is None:
                fallos.append(f"{nombre}: no existe el bruto {src}")
            elif gasto > bruto + 0.02:
                fallos.append(f"{nombre}/{src}: gasta {gasto:.2f}s y la toma "
                              f"se acaba en {bruto:.2f}s")
            if x < MINIMO:
                fallos.append(f"{nombre}/{src}: solo {x:.2f}s en pantalla")
            if ritmo < RITMO_MINIMO:
                fallos.append(f"{nombre}/{src}: ralenti de {ritmo} demasiado "
                              f"marcado")

        usados.append((nombre, [p[0] for p in planos]))
        print(f"{nombre[:30]:30s} {D:5.2f}s  " +
              "  ".join(f"{a}:{b:.2f}" + (f"@{c}" if c != 1 else "")
                        for a, b, c in reparto))

    donde = {}
    for nombre, planos in usados:
        for src in planos:
            donde.setdefault(src, []).append(nombre)
    for src, bloques in donde.items():
        if len(bloques) > 1:
            fallos.append(f"{src} sale {len(bloques)} veces, en "
                          + " y ".join(f"«{b}»" for b in bloques))

    print()
    if fallos:
        print(f"{len(fallos)} cosas que revisar:")
        for f in fallos:
            print(f"  · {f}")
        return 1
    print(f"Bien: {sum(len(p) for _, p in usados)} tomas, ninguna por debajo "
          f"de {MINIMO:.2f}s y ninguna repetida.")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1] if len(sys.argv) > 1
                  else "video/src/ReelXacobeoUS.tsx"))
