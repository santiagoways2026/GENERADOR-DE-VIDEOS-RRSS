#!/usr/bin/env bash
# Renderiza los shorts de Hildary y deja el audio a -14 LUFS, el nivel de
# referencia de Reels, TikTok y Shorts.
#   herramientas/scripts/render_shorts.sh            # todos
#   herramientas/scripts/render_shorts.sh 01 08      # solo esos
set -euo pipefail
cd "$(dirname "$0")/../../video"
mkdir -p out/crudo out/shorts
ids=$(python3 -c "import json;print(' '.join(d['id'] for d in json.load(open('src/shorts/shorts.json'))))")
for id in $ids; do
  if [ $# -gt 0 ]; then
    ok=0; for p in "$@"; do [[ $id == $p* ]] && ok=1; done
    [ $ok = 1 ] || continue
  fi
  [ -s "out/shorts/$id.mp4" ] && { echo "ya está: $id"; continue; }
  echo "== $id"
  npx remotion render "Short-$id" "out/crudo/$id.mp4" --concurrency="${CONCURRENCIA:-3}" --crf=20 --log=error
  ffmpeg -v error -y -i "out/crudo/$id.mp4" -c:v copy \
    -af loudnorm=I=-14:TP=-1.5:LRA=11 -ar 48000 -c:a aac -b:a 192k "out/shorts/$id.mp4"
done
