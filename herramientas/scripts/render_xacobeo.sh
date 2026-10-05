#!/usr/bin/env bash
# Renderiza los shorts del Xacobeo y sus portadas.
#   herramientas/scripts/render_xacobeo.sh          # todos
#   herramientas/scripts/render_xacobeo.sh 03 08    # solo esos
set -euo pipefail
cd "$(dirname "$0")/../../video"
mkdir -p out/xacobeo/crudo out/xacobeo/final out/xacobeo/entrega out/xacobeo/portadas
ids=$(python3 -c "import json;print(' '.join(d['id'] for d in json.load(open('src/xacobeo/xacobeo.json'))))")
for id in $ids; do
  if [ $# -gt 0 ]; then ok=0; for p in "$@"; do [[ $id == $p* ]] && ok=1; done; [ $ok = 1 ] || continue; fi
  echo "== $id"
  if [ ! -s "out/xacobeo/entrega/$id.mp4" ]; then
  [ -s "out/xacobeo/crudo/$id.mp4" ] || npx remotion render "Xacobeo-$id" "out/xacobeo/crudo/$id.mp4" \
    --concurrency="${CONCURRENCIA:-3}" --crf=20 --timeout=120000 --log=error
  # Nivel de referencia de Reels, TikTok y Shorts.
  ffmpeg -v error -y -i "out/xacobeo/crudo/$id.mp4" -c:v copy -af loudnorm=I=-14:TP=-1.5:LRA=11 \
    -ar 48000 -c:a aac -b:a 192k "out/xacobeo/final/$id.mp4"
  # Copia de menos de 30 MB para compartir por chat.
  d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "out/xacobeo/final/$id.mp4")
  vb=$(python3 -c "print(min(9000, int(26*8*1024/$d - 200)))")
  ffmpeg -v error -y -i "out/xacobeo/final/$id.mp4" -c:v libx264 -preset medium -b:v ${vb}k \
    -maxrate $((vb*3/2))k -bufsize $((vb*2))k -pix_fmt yuv420p -c:a copy -movflags +faststart "out/xacobeo/entrega/$id.mp4"
  fi
  [ -s "out/xacobeo/portadas/portada-$id.jpg" ] && continue
  # Fotograma de la portada, extraído del vídeo en el segundo elegido.
  seg=$(python3 -c "import json;print([d for d in json.load(open('src/xacobeo/xacobeo.json')) if d['id']=='$id'][0]['portada']['fotograma'])")
  vid=$(python3 -c "import json;print([d for d in json.load(open('src/xacobeo/xacobeo.json')) if d['id']=='$id'][0]['video'])")
  mkdir -p public/xacobeo/portadas
  ffmpeg -v error -y -ss "$seg" -i "public/$vid" -frames:v 1 \
    -vf "eq=brightness=0.03:contrast=1.05:saturation=1.08,colorbalance=rs=0.03:bs=-0.03,unsharp=5:5:0.4" \
    -q:v 2 "public/xacobeo/portadas/$id.jpg"
  npx remotion still "Portada-$id" "out/xacobeo/portadas/$id.png" --log=error
  ffmpeg -v error -y -i "out/xacobeo/portadas/$id.png" -q:v 2 "out/xacobeo/portadas/portada-$id.jpg"
  rm "out/xacobeo/portadas/$id.png"
done
echo RENDER_FIN
