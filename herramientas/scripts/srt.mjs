// Escribe el SRT de un vídeo con los mismos bloques que se queman en pantalla.
//   node srt.mjs voz.json salida.srt
import { readFileSync, writeFileSync } from "node:fs";
import { srt, trocear } from "../../video/src/enero/subtitulos.ts";
const voz = JSON.parse(readFileSync(process.argv[2], "utf8"));
writeFileSync(process.argv[3], srt(trocear(voz)));
