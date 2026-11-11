/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { existsSync, readdirSync } from "node:fs";
import { Config } from "@remotion/cli/config";
import { enableTailwind } from '@remotion/tailwind-v4';

Config.setRspack(true);
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.overrideBundlerConfig(enableTailwind);

/**
 * Remotion descarga su propio Chrome la primera vez. Hay entornos que
 * bloquean esa descarga, entre ellos las sesiones de Claude Code en la web,
 * y entonces el render falla sin que quede claro por que.
 *
 * Si encontramos un Chromium ya instalado, lo usamos y el render funciona
 * sin que haya que pasar ninguna opcion a mano.
 */
const BASE = "/opt/pw-browsers";
const RELATIVAS = [
  "chrome-linux/headless_shell",
  "chrome-linux64/chrome-headless-shell",
  "chrome-headless-shell-linux64/chrome-headless-shell",
  "chrome-linux/chrome",
  "chrome-linux64/chrome",
];
// El numero de version cambia con cada imagen del entorno: se busca
// cualquier carpeta de Playwright en lugar de fijar una.
const carpetas = existsSync(BASE)
  ? readdirSync(BASE)
      .filter((d) => d.startsWith("chromium"))
      .sort((a, b) => Number(a.includes("headless")) - Number(b.includes("headless")))
      .reverse()
  : [];
const CHROMIUM = [
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
  ...carpetas.flatMap((d) => RELATIVAS.map((r) => `${BASE}/${d}/${r}`)),
].filter(Boolean) as string[];

const encontrado = CHROMIUM.find((ruta) => existsSync(ruta));
if (encontrado) {
  Config.setBrowserExecutable(encontrado);
}
