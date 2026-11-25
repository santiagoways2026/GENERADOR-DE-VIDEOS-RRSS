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
const PW = "/opt/pw-browsers";
/** La versión de Playwright cambia el nombre de la carpeta, así que se busca
 *  cualquier chromium_headless_shell-NNNN o chromium-NNNN que haya. */
const instalados = existsSync(PW) ? readdirSync(PW) : [];
const CHROMIUM = [
  ...instalados
    .filter((d) => d.startsWith("chromium_headless_shell-"))
    .flatMap((d) => [
      `${PW}/${d}/chrome-headless-shell-linux64/chrome-headless-shell`,
      `${PW}/${d}/chrome-linux/headless_shell`,
    ]),
  ...instalados
    .filter((d) => /^chromium-\d+$/.test(d))
    .flatMap((d) => [`${PW}/${d}/chrome-linux64/chrome`, `${PW}/${d}/chrome-linux/chrome`]),
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
].filter(Boolean) as string[];

const encontrado = CHROMIUM.find((ruta) => existsSync(ruta));
if (encontrado) {
  Config.setBrowserExecutable(encontrado);
}
