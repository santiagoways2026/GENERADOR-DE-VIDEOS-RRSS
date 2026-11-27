#!/usr/bin/env bash
# Monta el vídeo de YouTube del webinar Holy Year 2027 con las tareas de Pau:
# ventanas flotantes (suscripción, contacto, redes con QR), diapositiva final
# fija unos 10 s. El QR va solo, sin URL. Sin música de fondo (decisión de
# Paula): el audio es el del vídeo original.
#
# Uso: montar_yt_webinar.sh <dir_trabajo> <salida.mp4> [desde] [duracion]
#   desde/duracion sirven para probar un tramo sin codificar los 29 min.
# En <dir_trabajo> tienen que estar orig.mp4, v_*.mov (render de
# YtWeb-* con fondo transparente) y hold.png (fotograma de la diapositiva final).
set -euo pipefail
D=$1; OUT=$2; SS=${3:-0}; DUR=${4:-}

# Tiempos en el vídeo original (segundos).
SUS=54; CON=1062; RED=1384
HOLD=1744.4          # la diapositiva final entra tras "Buen Camino"

r() { python3 -c "print(round($1-$SS,3))"; }
T=(); [ -n "$DUR" ] && T=(-t "$DUR")

ffmpeg -v error -y \
  -ss "$SS" "${T[@]}" -i "$D/orig.mp4" \
  -itsoffset "$(r $SUS)" -i "$D/v_Suscribir.mov" \
  -itsoffset "$(r $CON)" -i "$D/v_Contacto.mov" \
  -itsoffset "$(r $RED)" -i "$D/v_Redes.mov" \
  -loop 1 -framerate 25 -i "$D/hold.png" \
  -filter_complex "
    [0:v]setpts=PTS-STARTPTS[b];
    [b][1:v]overlay=eof_action=pass[v1];
    [v1][2:v]overlay=eof_action=pass[v2];
    [v2][3:v]overlay=eof_action=pass[v3];
    [4:v]format=yuva420p,fade=t=in:st=$(r $HOLD):d=0.5:alpha=1,setpts=PTS-STARTPTS[h];
    [v3][h]overlay=shortest=1:enable='gte(t,$(r $HOLD))',format=yuv420p[v];
    [0:a]aresample=48000,asetpts=PTS-STARTPTS[a]" \
  -map "[v]" -map "[a]" -c:v libx264 -preset fast -crf 19 -pix_fmt yuv420p \
  -c:a aac -b:a 256k -ar 48000 -movflags +faststart "$OUT"
