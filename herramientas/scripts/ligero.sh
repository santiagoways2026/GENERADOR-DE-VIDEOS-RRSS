#!/usr/bin/env bash
# Copia ligera de un vídeo para revisar (720x1280, unos 2,9 MB): el conector de
# Drive de las sesiones de Claude no deja subir archivos de más de unos 3 MB.
# La versión buena sigue siendo la de 1080x1920.
#
#   bash ligero.sh entrada.mp4 salida.mp4 [megas]
set -euo pipefail
ent="$1"; sal="$2"; mb="${3:-2.9}"
d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$ent")
vb=$(python3 -c "print(int(($mb*1e6*8/$d - 64000)/1000))")
tmp=$(mktemp -d)
( cd "$tmp" && ffmpeg -v error -y -i "$ent" -vf scale=720:1280:flags=lanczos -c:v libx264 -preset slow -b:v ${vb}k -pass 1 -an -f mp4 /dev/null \
  && ffmpeg -v error -y -i "$ent" -vf scale=720:1280:flags=lanczos -c:v libx264 -preset slow -b:v ${vb}k -pass 2 \
     -c:a aac -b:a 64k -movflags +faststart "$tmp/out.mp4" )
mv "$tmp/out.mp4" "$sal"; rm -rf "$tmp"
