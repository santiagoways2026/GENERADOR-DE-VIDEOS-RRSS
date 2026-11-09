import { continueRender, delayRender, staticFile } from "remotion";

/**
 * Montserrat, una sola familia, como pide el Brandbook 2027. Pesos de 400 a
 * 800.
 *
 * Los archivos van dentro del proyecto, en `public/fuentes`, y se cargan con
 * la API FontFace del navegador. No se descargan de Google, así que el render
 * sale idéntico en cualquier máquina y sin conexión.
 *
 * Antes se importaban los CSS de @fontsource y no llegaban al render: el
 * vídeo salía con la fuente de reserva sin que nada avisara. Cargando los
 * archivos a mano y reteniendo el fotograma hasta que están listos, eso ya no
 * puede pasar en silencio: si una variante falla, el render se para.
 */
const PESOS = [400, 500, 600, 700, 800] as const;

if (typeof document !== "undefined") {
  const espera = delayRender("Cargando Montserrat");
  Promise.all(
    PESOS.map((peso) => {
      const cara = new FontFace(
        "Montserrat",
        `url(${staticFile(`fuentes/montserrat-latin-${peso}-normal.woff2`)}) format("woff2")`,
        { weight: String(peso), style: "normal" },
      );
      document.fonts.add(cara);
      return cara.load();
    }),
  ).then(() => continueRender(espera));
}
