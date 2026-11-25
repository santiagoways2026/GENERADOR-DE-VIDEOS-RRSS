#!/usr/bin/env bash
# Versión sin voz en off de los verticales de enero: mismos planos, subtítulos
# y ambiente, para grabar encima una locución propia.
#
# El ambiente no se normaliza por su cuenta (subiría hasta -14 LUFS y sonaría
# muy alto): recibe la misma ganancia que la mezcla con voz, así suena igual
# que en la versión con voz.
#
#   bash herramientas/scripts/render-sin-voz.sh carpeta_salida [01 02 ...]
set -euo pipefail
RAIZ="$(cd "$(dirname "$0")/../.." && pwd)"
SALIDA="$(mkdir -p "$1" && cd "$1" && pwd)"; shift
IDS=("${@:-01 02 03 04 05}"); IDS=(${IDS[@]})
cd "$RAIZ/video"
declare -A COMP=([01]=Enero01PuertaSanta [02]=Enero02Curiosidades [03]=Enero03Caminos [04]=Enero04Sarria [05]=Enero05SemanaSanta)
declare -A NOMBRE=([01]=01_2027-01-01_puerta-santa_ES [02]=02_2027-01-08_curiosidades-ano-santo_ES [03]=03_2027-01-13_4-caminos-5-dias_ES [04]=04_2027-01-20_etapas-sarria_ES [05]=05_2027-01-22_semana-santa-ano-santo_ES)
TMP="$(mktemp -d)"
npx remotion bundle --out-dir="$TMP/bundle" --log=error >/dev/null
for id in "${IDS[@]}"; do
  n="${NOMBRE[$id]}"
  echo "== $n (sin voz)"
  # Ganancia que se aplicó a la mezcla con voz para llevarla a -14 LUFS.
  npx remotion render "$TMP/bundle" "${COMP[$id]}" "$TMP/con.wav" --codec=wav --log=error
  i=$(ffmpeg -hide_banner -nostats -i "$TMP/con.wav" -af ebur128 -f null - 2>&1 | awk '/Summary/{s=1} s&&/ I:/{print $2; exit}')
  ganancia=$(python3 -c "print(round(-14 - ($i), 2))")
  npx remotion render "$TMP/bundle" "${COMP[$id]}" "$TMP/sin.mp4" --props='{"sinVoz":true}' \
    --codec=h264 --crf=18 --pixel-format=yuv420p --color-space=bt709 --audio-codec=aac --log=error
  ffmpeg -v error -y -i "$TMP/sin.mp4" -c:v copy -af "volume=${ganancia}dB,alimiter=limit=0.84:level=false" \
    -c:a aac -b:a 192k -ar 48000 -ac 2 -movflags +faststart "$TMP/sin.final.mp4"
  mv "$TMP/sin.final.mp4" "$SALIDA/${n}_sin-voz.mp4"
  echo "   ganancia ${ganancia} dB"
done
rm -rf "$TMP"
