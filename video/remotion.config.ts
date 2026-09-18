/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { existsSync } from "node:fs";
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
const CHROMIUM = [
  "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell",
  "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
].filter(Boolean) as string[];

const encontrado = CHROMIUM.find((ruta) => existsSync(ruta));
if (encontrado) {
  Config.setBrowserExecutable(encontrado);
}
