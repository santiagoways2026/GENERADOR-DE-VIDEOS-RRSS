/**
 * Cascada tipografica oficial: Montserrat -> Manrope -> Poppins.
 *
 * Los archivos van en public/fuentes, copiados de @fontsource, en lugar de
 * descargarse de Google en cada render: asi el video sale identico en
 * cualquier maquina y sin conexion.
 *
 * Se registran con la API FontFace y el render se retiene hasta tenerlas.
 * Importar las hojas CSS de @fontsource no basta: con `font-display: swap`
 * el render no espera y el texto sale en la fuente de reserva del sistema.
 */
import { continueRender, delayRender, staticFile } from "remotion";

const FUENTES = [
  { familia: "Montserrat", peso: "400", archivo: "montserrat-latin-400-normal" },
  { familia: "Montserrat", peso: "700", archivo: "montserrat-latin-700-normal" },
  { familia: "Montserrat", peso: "800", archivo: "montserrat-latin-800-normal" },
  { familia: "Montserrat", peso: "900", archivo: "montserrat-latin-900-normal" },
  { familia: "Manrope", peso: "400", archivo: "manrope-latin-400-normal" },
  { familia: "Manrope", peso: "700", archivo: "manrope-latin-700-normal" },
];

const espera = delayRender("Cargando Montserrat y Manrope");

Promise.all(
  FUENTES.map(async ({ familia, peso, archivo }) => {
    const cara = new FontFace(
      familia,
      `url(${staticFile(`fuentes/${archivo}.woff2`)}) format("woff2")`,
      { weight: peso, style: "normal" },
    );
    await cara.load();
    document.fonts.add(cara);
  }),
)
  .then(() => continueRender(espera))
  .catch((err) => {
    console.error("No se pudieron cargar las fuentes", err);
    continueRender(espera);
  });
