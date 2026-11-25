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

/*
 * Las hojas CSS solo declaran las fuentes: Chrome no las descarga hasta que
 * algo las pinta, y Remotion puede capturar el fotograma antes. Se cargan
 * aquí de forma explícita, desde public/fuentes, y el render espera a que
 * estén listas; si no, el vídeo sale con la letra de sistema.
 */
import { continueRender, delayRender, staticFile } from "remotion";

const PESOS = ["400", "600", "700", "800", "900"];

if (typeof document !== "undefined") {
  const espera = delayRender("Cargando Montserrat");
  Promise.all(
    PESOS.map((peso) => {
      const url = staticFile(`fuentes/montserrat-latin-${peso}-normal.woff2`);
      const f = new FontFace("Montserrat", `url(${url}) format("woff2")`, { weight: peso, style: "normal" });
      document.fonts.add(f);
      return f.load();
    }),
  )
    .then(() => continueRender(espera))
    .catch((e) => {
      console.error(e);
      continueRender(espera);
    });
}
