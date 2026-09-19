/**
 * Convierte un SRT en la lista de cues que usa el componente `Subtitulos`.
 *
 *   node herramientas/scripts/srt-a-cues.mjs captions.srt frances
 *
 * Escribe `video/src/subtitulos/<nombre>.ts`. Se ejecuta en cuanto haya un
 * SRT de verdad: hasta entonces los cues se escriben a mano midiendo el audio
 * con `silencedetect`, que da los tiempos exactos pero no el texto.
 *
 * No hace falta instalar nada.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

const [srt, nombre] = process.argv.slice(2);
if (!srt || !nombre) {
  console.error("Uso: node srt-a-cues.mjs <archivo.srt> <nombre>");
  process.exit(1);
}

/** "00:01:23,456" a segundos. */
const aSegundos = (marca) => {
  const [h, m, resto] = marca.trim().split(":");
  const [s, ms] = resto.replace(",", ".").split(".");
  return Number(h) * 3600 + Number(m) * 60 + Number(s) + Number(ms ?? 0) / 1000;
};

const cues = fs
  .readFileSync(srt, "utf8")
  .replace(/\r/g, "")
  .split(/\n\n+/)
  .map((bloque) => bloque.split("\n").filter(Boolean))
  .filter((lineas) => lineas.some((l) => l.includes("-->")))
  .map((lineas) => {
    const i = lineas.findIndex((l) => l.includes("-->"));
    const [desde, hasta] = lineas[i].split("-->");
    return {
      desde: Number(aSegundos(desde).toFixed(3)),
      hasta: Number(aSegundos(hasta).toFixed(3)),
      // El SRT parte las frases largas en dos líneas; en pantalla se
      // recomponen y el ancho de la placa decide dónde cortar.
      texto: lineas.slice(i + 1).join(" ").trim(),
    };
  })
  .filter((c) => c.texto);

const constante = `SUBTITULOS_${nombre.toUpperCase().replace(/[^A-Z0-9]/g, "_")}`;
const salida = `import type { Cue } from "../componentes/Subtitulos";

/**
 * Subtitulos de ${nombre}.
 *
 * NO SE EDITA A MANO. Lo genera:
 *   node herramientas/scripts/srt-a-cues.mjs ${path.basename(srt)} ${nombre}
 */
export const ${constante}: Cue[] = ${JSON.stringify(cues, null, 2)};
`;

const destino = path.join(RAIZ, "video/src/subtitulos", `${nombre}.ts`);
fs.mkdirSync(path.dirname(destino), { recursive: true });
fs.writeFileSync(destino, salida);
console.log(`${cues.length} cues · ${cues.at(-1).hasta.toFixed(2)}s · ${destino}`);
