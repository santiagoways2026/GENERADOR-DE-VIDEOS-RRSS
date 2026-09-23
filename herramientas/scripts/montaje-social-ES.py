"""Rehace la base de la pieza social en espanol.

Tres cosas que cambian la duracion, y por eso van aqui y no en Remotion:

1. Una apertura nueva de 3 s por delante. El plano con el que arrancaba es
   un bosque a contraluz velado, con un muro de hormigon al fondo.
2. Fuera el tramo 20.00-25.15 del montaje. Ahi habla un segundo peregrino
   al que no se ve en ningun momento: el montaje original le daba plano
   justo despues, y ese plano cayo con el recorte anterior.
3. En su lugar, siete segundos de alojamiento. Es lo que el peregrino acaba
   de contar, "los dos alojamientos que llevamos", y no habia imagen.

Los dos tramos sin voz llevan una cama de ambiente sacada de los silencios
del propio montaje. La pieza no tiene musica, asi que poner una aqui sola
sonaria a parche. Las camas se hacen antes, con `ambiente.py`:

    python3 ambiente.py social-montaje.mp4 amb-apertura.wav 3.0 \
        0.05,0.62 19.62,20.42 41.06,41.29
    python3 ambiente.py social-montaje.mp4 amb-hoteles.wav 7.0 \
        0.05,0.62 19.62,20.42 41.06,41.29

    python3 montaje-social-ES.py <carpeta con social-montaje.mp4>
"""
import os
import subprocess
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from ambiente import binarios  # noqa: E402

FF = binarios()
AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.normpath(os.path.join(AQUI, "..", ".."))
B = os.path.join(RAIZ, "video", "public", "brutos")
# Carpeta de trabajo: el montaje de partida y las camas de ambiente. Se pasa
# como argumento porque estos archivos pesan y no entran en el repositorio.
S = sys.argv[1] if len(sys.argv) > 1 else os.path.join(RAIZ, "video", "public", "montajes")
M = f"{S}/social-montaje.mp4"

# (archivo, entra, dura)
APERTURA = [(f"{B}/campo-flores.mp4", 0.03, 1.60),
            (f"{B}/contraluz.mp4", 0.00, 1.40)]
HOTELES = [(f"{B}/casa-rural.mp4", 0.03, 1.10),
           (f"{B}/habitacion.mp4", 0.10, 2.00),
           (f"{B}/testimonios/bano-ducha.mp4", 0.05, 1.10),
           (f"{B}/mesa-exterior.mp4", 0.10, 1.20),
           (f"{B}/terraza.mp4", 0.30, 1.60)]

ent, filtros, vs = [], [], []
i = 0
for grupo in (APERTURA, HOTELES):
    for f, x, d in grupo:
        ent += ["-ss", f"{x}", "-t", f"{d}", "-i", f]
        filtros.append(
            f"[{i}:v]scale=1280:720:force_original_aspect_ratio=increase,"
            f"crop=1280:720,fps=fps=30,setsar=1,format=yuv420p[v{i}]")
        vs.append(f"[v{i}]")
        i += 1

n_ap = len(APERTURA)
filtros.append("".join(vs[:n_ap]) + f"concat=n={n_ap}:v=1:a=0[vP]")
filtros.append("".join(vs[n_ap:]) + f"concat=n={len(HOTELES)}:v=1:a=0[vH]")

# Las camas de ambiente.
iP, iH, iM = i, i + 1, i + 2
ent += ["-i", f"{S}/amb-apertura.wav", "-i", f"{S}/amb-hoteles.wav", "-i", M]
filtros += [f"[{iP}:a]aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=stereo[aP]",
            f"[{iH}:a]aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=stereo[aH]"]

# Los dos tramos que se conservan del montaje. El corte de salida cae en el
# silencio entre frases (19.55-20.49) y el de entrada tambien (24.92-25.19),
# con 40 ms de fundido a cada lado para que no chasquee.
filtros += [
    "[%d:v]trim=0:20.00,setpts=PTS-STARTPTS,fps=fps=30,setsar=1,format=yuv420p[vA]" % iM,
    "[%d:a]atrim=0:20.00,asetpts=PTS-STARTPTS,afade=t=out:st=19.96:d=0.04,"
    "aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=stereo[aA]" % iM,
    "[%d:v]trim=25.15:47.17,setpts=PTS-STARTPTS,fps=fps=30,setsar=1,format=yuv420p[vB]" % iM,
    "[%d:a]atrim=25.15:47.17,asetpts=PTS-STARTPTS,afade=t=in:st=0:d=0.04,"
    "aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=stereo[aB]" % iM,
    "[vP][aP][vA][aA][vH][aH][vB][aB]concat=n=4:v=1:a=1[v][a]",
]

cmd = [FF, "-v", "warning", "-stats", "-y"] + ent + [
    "-filter_complex", ";".join(filtros), "-map", "[v]", "-map", "[a]",
    "-c:v", "libx264", "-crf", "16", "-preset", "slow", "-pix_fmt", "yuv420p",
    "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709",
    "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart",
    f"{S}/social-ES-v3.mp4"]
subprocess.run(cmd, check=True)
