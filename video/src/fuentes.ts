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

import { continueRender, delayRender } from "remotion";

/**
 * Importar el CSS solo declara las fuentes: el navegador no las descarga
 * hasta que un texto las pide, y para entonces Remotion ya ha capturado el
 * fotograma con la fuente de sistema. Aquí se piden todas por adelantado y
 * el render espera a tenerlas.
 *
 * Este archivo solo tiene efectos, así que está declarado en `sideEffects`
 * de package.json. Sin eso el empaquetador lo descarta entero y todo sale
 * con la fuente del sistema sin avisar.
 */
const PEDIDAS = [
  "400 32px Montserrat",
  "700 32px Montserrat",
  "800 32px Montserrat",
  "900 32px Montserrat",
  "400 32px Manrope",
  "700 32px Manrope",
];

if (typeof document !== "undefined") {
  const espera = delayRender("Cargando las fuentes de marca");
  Promise.all(PEDIDAS.map((f) => document.fonts.load(f)))
    .then(() => continueRender(espera))
    .catch((err) => {
      console.error("No se pudieron cargar las fuentes", err);
      continueRender(espera);
    });
}
