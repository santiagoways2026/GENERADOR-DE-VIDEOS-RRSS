#!/usr/bin/env python3
"""Quita una marca de agua fija de un video y, de paso, recorta por los extremos.

Sirve para recuperar piezas antiguas que llevan el logo pegado en una esquina
durante todo el metraje. El logo no se conoce de antemano: se aprende del
propio video.

Como funciona
-------------
1. Se muestrean fotogramas y se mira la desviacion tipica temporal de cada
   pixel. Lo que esta pegado encima apenas cambia, asi que sale la silueta.
2. Se separan los fotogramas de fondo mas oscuro y los de fondo mas claro, se
   promedian y se rellena por difusion el fondo bajo el logo. Con dos fondos
   tan distintos sale la opacidad:

       oscuro = (1-a)*F_oscuro + a*C
       claro  = (1-a)*F_claro  + a*C   ->   a = 1 - (oscuro-claro)/(F_osc-F_cla)

3. Con la opacidad se dibuja la silueta exacta del logo y se rellena por
   difusion desde los pixeles limpios de alrededor y desde los huecos entre
   letras, que si son fondo bueno.

Se rellena la silueta, no su rectangulo: los trazos de la tipografia miden dos
o tres pixeles y se cierran sin que se note. El unico sitio donde se adivina el
parche es un simbolo macizo sobre fondo con mucha textura.

Deshacer la mezcla (fondo = (salida - a*C)/(1-a)) suena mejor y se probo, pero
no sirve en material como este: la marca es casi opaca, asi que dividir por
1-a multiplica por ocho el ruido de compresion y salen colorines. Y en el borde
semitransparente el error de a deja un fantasma del logo, que es justo lo que se
queria quitar. Rellenar es mas humilde y sale limpio.

    python3 marca-agua.py entrada.mp4 salida.mp4 \
        --zona 440,315,200,45 --desde 1.335 --hasta 59.27
"""
import argparse, json, os, re, shutil, subprocess, sys, tempfile

import numpy as np
from PIL import Image


def binarios():
    """ffmpeg y ffprobe: los de Remotion si estan, si no los del sistema."""
    aqui = os.path.dirname(os.path.abspath(__file__))
    comp = os.path.join(aqui, "..", "..", "video", "node_modules",
                        "@remotion", "compositor-linux-x64-gnu")
    ff, fp = os.path.join(comp, "ffmpeg"), os.path.join(comp, "ffprobe")
    if os.path.exists(ff) and os.path.exists(fp):
        return ff, fp
    try:
        import imageio_ffmpeg
        ff = imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError:
        ff = shutil.which("ffmpeg")
    if not ff:
        sys.exit("no encuentro ffmpeg")
    fp = shutil.which("ffprobe")
    if not fp:                                     # hermano del ffmpeg que haya
        cand = os.path.join(os.path.dirname(ff),
                            os.path.basename(ff).replace("ffmpeg", "ffprobe"))
        fp = cand if os.path.exists(cand) else None
    return ff, fp


FF, FP = binarios()


def sonda(src):
    """Devuelve (ancho, alto, fps, duracion). Funciona aunque no haya ffprobe."""
    if FP:
        out = subprocess.run([FP, "-v", "error", "-select_streams", "v:0",
                              "-show_entries", "stream=width,height,r_frame_rate",
                              "-show_entries", "format=duration",
                              "-of", "json", src], capture_output=True, text=True)
        if out.returncode == 0 and out.stdout.strip():
            j = json.loads(out.stdout)
            v = j["streams"][0]
            n, d = v["r_frame_rate"].split("/")
            return (int(v["width"]), int(v["height"]), float(n) / float(d),
                    float(j["format"]["duration"]))
    # sin ffprobe: leer la cabecera que ffmpeg escribe en su salida de error
    txt = subprocess.run([FF, "-hide_banner", "-i", src],
                         capture_output=True, text=True).stderr
    m = re.search(r"Video:.*?,\s*(\d+)x(\d+)", txt)
    if not m:
        sys.exit("no consigo leer el video de entrada")
    w, h = int(m.group(1)), int(m.group(2))
    f = re.search(r"([\d.]+)\s*fps", txt) or re.search(r"([\d.]+)\s*tbr", txt)
    fps = float(f.group(1)) if f else 25.0
    t = re.search(r"Duration:\s*(\d+):(\d+):([\d.]+)", txt)
    dur = (int(t.group(1)) * 3600 + int(t.group(2)) * 60 + float(t.group(3))) if t else 0.0
    return w, h, fps, dur


# --------------------------------------------------------------------------
# utilidades de imagen

def _nucleo(sigma):
    r = max(1, int(3 * sigma))
    k = np.exp(-np.arange(-r, r + 1) ** 2 / (2 * sigma * sigma))
    return k / k.sum()


def suaviza(img, sigma):
    """Gaussiana separable sobre los dos ultimos ejes."""
    k = _nucleo(sigma)
    r = len(k) // 2
    conv = lambda v: np.convolve(np.pad(v, (r, r), "edge"), k, "valid")
    return np.apply_along_axis(conv, -2, np.apply_along_axis(conv, -1, img))


def vecinos(m):
    """Cuenta vecinos activos de cada pixel de una mascara booleana."""
    p = np.pad(m.astype(np.int16), 1)
    h, w = m.shape
    return sum(p[1 + dy:1 + dy + h, 1 + dx:1 + dx + w]
               for dy in (-1, 0, 1) for dx in (-1, 0, 1)) - m


def difunde(img, hueco, vueltas):
    """Rellena 'hueco' resolviendo Laplace desde los pixeles validos."""
    u = img.astype(np.float32).copy()
    idx = np.nonzero(hueco)
    u[idx] = u[~hueco].mean(axis=0)
    for _ in range(vueltas):
        p = np.pad(u, ((1, 1), (1, 1), (0, 0)), mode="edge")
        prom = (p[:-2, 1:-1] + p[2:, 1:-1] + p[1:-1, :-2] + p[1:-1, 2:]) * 0.25
        u[idx] = prom[idx]
    return u


# --------------------------------------------------------------------------
# aprender la marca

def muestrear(src, zona, n, desde, hasta):
    x, y, w, h = zona
    tmp = tempfile.mkdtemp()
    fps = max(n / max(hasta - desde, 0.1), 0.1)
    cmd = [FF, "-v", "error", "-ss", str(desde), "-t", str(hasta - desde), "-i", src,
           "-vf", f"fps={fps:.4f},crop={w}:{h}:{x}:{y}", "-y",
           os.path.join(tmp, "m_%05d.png")]
    subprocess.run(cmd, check=True)
    fs = sorted(os.listdir(tmp))
    A = np.stack([np.asarray(Image.open(os.path.join(tmp, f)).convert("RGB"), np.float32)
                  for f in fs])
    shutil.rmtree(tmp)
    return A


def aprender(A, quieto=0.55, margen=2):
    """Devuelve (alfa, color, silueta) de la marca a partir de las muestras."""
    T, H, W, _ = A.shape

    sd = A.std(0).mean(2)
    mask = sd < np.median(sd) * quieto
    mask &= vecinos(mask) >= 3                     # fuera pixeles sueltos
    for _ in range(2):
        mask |= vecinos(mask) >= 4                 # cerrar huecos de un pixel
    if not mask.any():
        sys.exit("no encuentro nada fijo en esa zona: revisa --zona")
    for _ in range(margen):
        mask = vecinos(mask) > 0                   # coger el antialias del borde

    # dos grupos de fotogramas: fondo plano, uno oscuro y otro claro
    gris = A.mean(3)
    limpio = ~mask
    brillo = np.array([gris[t][limpio].mean() for t in range(T)])
    plano = np.array([gris[t][limpio].std() for t in range(T)])
    cand = np.argsort(plano)[:max(int(T * 0.5), 8)]
    cand = cand[np.argsort(brillo[cand])]
    k = max(len(cand) // 4, 3)
    D, B = A[cand[:k]].mean(0), A[cand[-k:]].mean(0)
    D0, B0 = difunde(D, mask, 3000), difunde(B, mask, 3000)

    dif, dif0 = D - B, D0 - B0
    with np.errstate(invalid="ignore"):
        por_canal = 1.0 - dif / np.where(np.abs(dif0) < 12, np.nan, dif0)
        util = ~np.all(np.isnan(por_canal), axis=2)
        alfa = np.zeros(por_canal.shape[:2], np.float64)
        alfa[util] = np.nanmedian(por_canal[util], axis=1)
    alfa = np.clip(np.nan_to_num(alfa, nan=0.0), 0.0, 0.97)
    alfa[~mask] = 0.0
    alfa = np.where(mask, suaviza(alfa[None, None], 0.5)[0, 0], 0.0)

    a3 = alfa[..., None]
    color = np.clip(np.where(a3 > 0.02, (D - (1 - a3) * D0) / np.maximum(a3, 1e-3), 0.0), 0, 255)

    sil = alfa > 0.03
    for _ in range(2):
        sil = vecinos(sil) > 0
    return alfa, color, sil


# --------------------------------------------------------------------------
# borrar la marca

class Borrador:
    """Rellena la silueta del logo con lo que hay alrededor, fotograma a fotograma.

    El relleno no promedia en todas las direcciones por igual: mira hacia donde
    van las formas del propio fotograma y estira por ahi. En un plano de bosque
    eso continua los troncos a traves de la banda, en vez de dejar un borron
    horizontal que canta mucho mas que el logo.
    """

    def __init__(self, sil, vueltas=600, piso=0.20):
        self.vueltas, self.piso = vueltas, piso
        ys, xs = np.nonzero(sil)                    # caja ajustada, para ir mas rapido
        self.y0, self.y1 = max(ys.min() - 3, 0), min(ys.max() + 4, sil.shape[0])
        self.x0, self.x1 = max(xs.min() - 3, 0), min(xs.max() + 4, sil.shape[1])
        self.hueco = sil[self.y0:self.y1, self.x0:self.x1]
        self.idx = np.nonzero(self.hueco)
        self.bueno = ~self.hueco

    def _direcciones(self, u):
        """Pesos de vecino segun por donde van las formas (tensor de estructura)."""
        g = u.mean(2) * self.bueno
        p = np.pad(g, 1, mode="edge")
        v = np.pad(self.bueno.astype(np.float32), 1, mode="edge")
        Ix = (p[1:-1, 2:] - p[1:-1, :-2]) * (v[1:-1, 2:] * v[1:-1, :-2])
        Iy = (p[2:, 1:-1] - p[:-2, 1:-1]) * (v[2:, 1:-1] * v[:-2, 1:-1])
        J = difunde(np.stack([Ix * Ix, Iy * Iy, Ix * Iy], -1), self.hueco, 200)
        J = suaviza(J.transpose(2, 0, 1), 2.0).transpose(1, 2, 0)
        ang = 0.5 * np.arctan2(2 * J[..., 2], J[..., 0] - J[..., 1])
        vx, vy = -np.sin(ang), np.cos(ang)          # direccion de las isofotas
        wx = (vx * vx + self.piso)[..., None]
        wy = (vy * vy + self.piso)[..., None]
        return wx, wy, 2.0 * (wx + wy)

    def __call__(self, roi):
        """roi: recorte uint8 HxWx3 de la zona. Devuelve el recorte limpio."""
        out = roi.astype(np.float32).copy()
        u = out[self.y0:self.y1, self.x0:self.x1].copy()
        wx, wy, den = self._direcciones(u)
        u[self.idx] = u[self.bueno].mean(axis=0)     # arranque plano, converge antes
        for _ in range(self.vueltas):
            p = np.pad(u, ((1, 1), (1, 1), (0, 0)), mode="edge")
            prom = (wy * (p[:-2, 1:-1] + p[2:, 1:-1])
                    + wx * (p[1:-1, :-2] + p[1:-1, 2:])) / den
            u[self.idx] = prom[self.idx]
        out[self.y0:self.y1, self.x0:self.x1] = u
        return np.clip(out, 0, 255).astype(np.uint8)


# --------------------------------------------------------------------------
# recorte: en vez de rellenar, quitar de cuadro la franja donde vive la marca

def calcular_recorte(sil, zona, tam, margen=4):
    """Decide que recorte deja la marca fuera y devuelve (x, y, ancho, alto).

    Se corta por el borde mas cercano al logo, el que menos imagen se lleva, y
    luego se reajusta al mismo formato que traia el video para no deformar.
    Devuelve las coordenadas sobre el fotograma original.
    """
    zx, zy, _, _ = zona
    W, H = tam
    ys, xs = np.nonzero(sil)
    ly0, ly1 = ys.min() + zy - margen, ys.max() + zy + margen
    lx0, lx1 = xs.min() + zx - margen, xs.max() + zx + margen

    # cuanto cuesta sacar la marca por cada lado, en proporcion
    costes = {"abajo": (H - ly0) / H, "arriba": ly1 / H,
              "derecha": (W - lx0) / W, "izquierda": lx1 / W}
    lado = min(costes, key=costes.get)
    x, y, w, h = 0, 0, W, H
    if lado == "abajo":
        h = max(ly0, 1)
    elif lado == "arriba":
        y, h = ly1, max(H - ly1, 1)
    elif lado == "derecha":
        w = max(lx0, 1)
    else:
        x, w = lx1, max(W - lx1, 1)

    # volver al formato original recortando el otro eje, centrado
    objetivo = W / H
    if w / h > objetivo:
        nw = int(round(h * objetivo))
        x, w = x + (w - nw) // 2, nw
    else:
        nh = int(round(w / objetivo))
        y, h = y + (h - nh) // 2, nh

    w, h = w - (w % 2), h - (h % 2)                 # pares, que x264 lo pide
    return x, y, w, h, lado, costes[lado]


def recortar(src, dst, caja, tam, desde, hasta, calidad,
             fundido_entrada, fundido_salida):
    x, y, w, h = caja
    W, H = tam
    dur = hasta - desde
    vf = f"crop={w}:{h}:{x}:{y},scale={W}:{H}:flags=lanczos,setsar=1"
    af = []
    if fundido_entrada > 0:
        af.append(f"afade=t=in:st=0:d={fundido_entrada}")
    if fundido_salida > 0:
        af.append(f"afade=t=out:st={max(dur - fundido_salida, 0):.3f}:d={fundido_salida}")
    cmd = [FF, "-v", "error", "-y", "-ss", str(desde), "-t", str(dur), "-i", src,
           "-vf", vf, "-c:v", "libx264", "-preset", "slow", "-crf", str(calidad),
           "-pix_fmt", "yuv420p", "-movflags", "+faststart",
           "-c:a", "aac", "-b:a", "160k"]
    if af:
        cmd += ["-af", ",".join(af)]
    subprocess.run(cmd + [dst], check=True)


# --------------------------------------------------------------------------

def procesar(src, dst, zona, desde, hasta, borrador, tam, fps, calidad,
             fundido_entrada, fundido_salida):
    x, y, w, h = zona
    W, H = tam
    dur = hasta - desde
    entrada = [FF, "-v", "error", "-ss", str(desde), "-t", str(dur), "-i", src,
               "-f", "rawvideo", "-pix_fmt", "rgb24", "-"]
    af = []
    if fundido_entrada > 0:
        af.append(f"afade=t=in:st=0:d={fundido_entrada}")
    if fundido_salida > 0:
        af.append(f"afade=t=out:st={max(dur - fundido_salida, 0):.3f}:d={fundido_salida}")
    salida = [FF, "-v", "error", "-y",
              "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(fps), "-i", "-",
              "-ss", str(desde), "-t", str(dur), "-i", src,
              "-map", "0:v", "-map", "1:a?",
              "-c:v", "libx264", "-preset", "slow", "-crf", str(calidad),
              "-pix_fmt", "yuv420p", "-movflags", "+faststart",
              "-c:a", "aac", "-b:a", "160k"]
    if af:
        salida += ["-af", ",".join(af)]
    salida += [dst]

    pin = subprocess.Popen(entrada, stdout=subprocess.PIPE)
    pout = subprocess.Popen(salida, stdin=subprocess.PIPE)
    n, paso = 0, W * H * 3
    try:
        while True:
            crudo = pin.stdout.read(paso)
            if len(crudo) < paso:
                break
            fr = np.frombuffer(crudo, np.uint8).reshape(H, W, 3).copy()
            fr[y:y + h, x:x + w] = borrador(fr[y:y + h, x:x + w])
            pout.stdin.write(fr.tobytes())
            n += 1
            if n % 100 == 0:
                print(f"  {n} fotogramas", flush=True)
    finally:
        pout.stdin.close()
        pin.stdout.close()
        pin.wait()
        pout.wait()
    return n


def main():
    p = argparse.ArgumentParser(description=__doc__,
                                formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("entrada")
    p.add_argument("salida")
    p.add_argument("--zona", required=True,
                   help="x,y,ancho,alto donde vive la marca, con un poco de margen")
    p.add_argument("--desde", type=float, default=0.0, help="segundo del primer fotograma")
    p.add_argument("--hasta", type=float, default=None, help="segundo del ultimo fotograma")
    p.add_argument("--muestras", type=int, default=350)
    p.add_argument("--aprender-desde", type=float, default=0.0,
                   help="tramo del que se aprende la marca, por defecto el video entero")
    p.add_argument("--aprender-hasta", type=float, default=None)
    p.add_argument("--modo", choices=("recorte", "relleno"), default="recorte",
                   help="recorte deja la marca fuera de cuadro y hace un zoom corto; "
                        "relleno mantiene el encuadre y reconstruye el hueco")
    p.add_argument("--calidad", type=int, default=18, help="crf de x264, menos es mejor")
    p.add_argument("--fundido-entrada", type=float, default=0.0, help="fundido de audio, en segundos")
    p.add_argument("--fundido-salida", type=float, default=0.0)
    p.add_argument("--vista", help="guarda aqui un png con el antes y el despues")
    a = p.parse_args()

    zona = tuple(int(v) for v in a.zona.split(","))
    W, H, fps, dur = sonda(a.entrada)
    if a.hasta is None:
        a.hasta = dur
    print(f"video {W}x{H} a {fps:.3f} fps, tramo {a.desde:.3f}-{a.hasta:.3f} s")

    # la marca se aprende del video entero, no del tramo: hacen falta fondos
    # muy distintos debajo del logo para que salga la opacidad
    print("aprendiendo la marca...")
    A = muestrear(a.entrada, zona, a.muestras, a.aprender_desde, a.aprender_hasta or dur)
    alfa, color, sil = aprender(A)
    print(f"  silueta {int(sil.sum())} px, opacidad media {alfa[sil].mean():.2f}, "
          f"maxima {alfa.max():.2f}")

    if a.modo == "recorte":
        x, y, w, h, lado, coste = calcular_recorte(sil, zona, (W, H))
        print(f"  la marca sale por {lado}: recorte {w}x{h} desde ({x},{y}), "
              f"zoom {W / w:.3f}x, se pierde el {coste * 100:.1f}% por ese lado")
        print("recortando...")
        recortar(a.entrada, a.salida, (x, y, w, h), (W, H), a.desde, a.hasta,
                 a.calidad, a.fundido_entrada, a.fundido_salida)
        print(f"listo: {a.salida}")
        return

    borrador = Borrador(sil)
    if a.vista:
        i = len(A) // 2
        antes = A[i].astype(np.uint8)
        par = np.concatenate([antes, borrador(antes)], axis=0)
        Image.fromarray(par).resize((par.shape[1] * 3, par.shape[0] * 3),
                                    Image.NEAREST).save(a.vista)
        print(f"  vista en {a.vista}")

    print("limpiando...")
    n = procesar(a.entrada, a.salida, zona, a.desde, a.hasta, borrador,
                 (W, H), fps, a.calidad, a.fundido_entrada, a.fundido_salida)
    print(f"listo: {a.salida} ({n} fotogramas)")


if __name__ == "__main__":
    main()
