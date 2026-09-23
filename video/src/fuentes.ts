/**
 * Cascada tipografica oficial: Montserrat -> Manrope -> Poppins.
 * Se empaquetan con el proyecto en lugar de descargarse de Google en cada
 * render: asi el video sale identico en cualquier maquina y sin conexion.
 */
import "@fontsource/montserrat/latin-400.css";
import "@fontsource/montserrat/latin-700.css";
import "@fontsource/montserrat/latin-800.css";
import "@fontsource/montserrat/latin-900.css";
import "@fontsource/manrope/latin-400.css";
import "@fontsource/manrope/latin-700.css";

/**
 * El CSS de @fontsource no siempre llega a aplicarse en el render: el
 * navegador sin cabeza pinta con la fuente de sistema. Así que, además, se
 * registran los mismos archivos a mano y el render espera a que estén.
 */
import { continueRender, delayRender, staticFile } from "remotion";

const ARCHIVOS: [string, string, string][] = [
  ["Montserrat", "400", "fuentes/montserrat-latin-400-normal.woff2"],
  ["Montserrat", "700", "fuentes/montserrat-latin-700-normal.woff2"],
  ["Montserrat", "800", "fuentes/montserrat-latin-800-normal.woff2"],
  ["Montserrat", "900", "fuentes/montserrat-latin-900-normal.woff2"],
  ["Manrope", "400", "fuentes/manrope-latin-400-normal.woff2"],
  ["Manrope", "700", "fuentes/manrope-latin-700-normal.woff2"],
];

if (typeof document !== "undefined") {
  const espera = delayRender("Cargando tipografías");
  Promise.all(
    ARCHIVOS.map(([familia, peso, ruta]) =>
      new FontFace(familia, `url(${staticFile(ruta)}) format("woff2")`, { weight: peso })
        .load()
        .then((fuente) => document.fonts.add(fuente)),
    ),
  )
    .catch((e) => console.error("No se pudo cargar una tipografía", e))
    .finally(() => continueRender(espera));
}
