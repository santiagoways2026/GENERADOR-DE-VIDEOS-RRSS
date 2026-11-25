#!/usr/bin/env bash
# Renderiza los verticales de enero, normaliza el audio a -14 LUFS y deja
# vídeo, voz, SRT y miniatura con los nombres de entrega.
#
#   bash herramientas/scripts/render-enero.sh carpeta_salida [01 02 ...]
set -euo pipefail
RAIZ="$(cd "$(dirname "$0")/../.." && pwd)"
SALIDA="$(mkdir -p "$1" && cd "$1" && pwd)"; shift
IDS=("${@:-01 02 03 04 05}"); IDS=(${IDS[@]})
cd "$RAIZ/video"
declare -A COMP=([01]=Enero01PuertaSanta [02]=Enero02Curiosidades [03]=Enero03Caminos [04]=Enero04Sarria [05]=Enero05SemanaSanta)
declare -A NOMBRE=([01]=01_2027-01-01_puerta-santa_ES [02]=02_2027-01-08_curiosidades-ano-santo_ES [03]=03_2027-01-13_4-caminos-5-dias_ES [04]=04_2027-01-20_etapas-sarria_ES [05]=05_2027-01-22_semana-santa-ano-santo_ES)
TMP="$(mktemp -d)"
mkdir -p "$SALIDA/miniaturas" "$SALIDA/subtitulos" "$SALIDA/voz"
npx remotion bundle --out-dir="$TMP/bundle" --log=error >/dev/null
for id in "${IDS[@]}"; do
  n="${NOMBRE[$id]}"
  echo "== $n"
  npx remotion render "$TMP/bundle" "${COMP[$id]}" "$TMP/$n.mp4" \
    --codec=h264 --crf=18 --pixel-format=yuv420p --color-space=bt709 --audio-codec=aac --log=error
  # Sonoridad en dos pasadas: medir y corregir. El vídeo no se recodifica.
  medida=$(ffmpeg -hide_banner -i "$TMP/$n.mp4" -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
  val() { echo "$medida" | python3 -c "import json,sys;print(json.load(sys.stdin)['$1'])"; }
  ffmpeg -v error -y -i "$TMP/$n.mp4" -c:v copy \
    -af "loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$(val input_i):measured_TP=$(val input_tp):measured_LRA=$(val input_lra):measured_thresh=$(val input_thresh):offset=$(val target_offset):linear=true" \
    -c:a aac -b:a 192k -ar 48000 -ac 2 -movflags +faststart "$TMP/$n.final.mp4"
  mv "$TMP/$n.final.mp4" "$SALIDA/$n.mp4"
  npx remotion still "$TMP/bundle" "Mini$id" "$SALIDA/miniaturas/$n.png" --log=error
  cp "public/enero/voz/$id.mp3" "$SALIDA/voz/$n.mp3"
  node "$RAIZ/herramientas/scripts/srt.mjs" "public/enero/voz/$id.json" "$SALIDA/subtitulos/$n.srt" 2>/dev/null
done
rm -rf "$TMP"
