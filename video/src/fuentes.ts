import { useEffect, useState } from "react";
import { continueRender, delayRender, staticFile } from "remotion";

/**
 * Carga las fuentes de marca en el navegador que renderiza.
 *
 * Antes esto era un punado de `import "@fontsource/..."`. Compilaba sin
 * quejarse y **no cargaba nada**: el CSS de fontsource no llegaba al
 * documento, `document.fonts` se quedaba vacio y todas las piezas salian con
 * la sans-serif por defecto del sistema. No dio ni un error, y en pantalla
 * pasaba por buena porque la de respaldo tambien es una grotesca.
 *
 * Se descubrio pintando el mismo texto en Montserrat y en Manrope **sin
 * fallback**: las dos salieron en serif, que es lo que sale cuando no hay
 * ninguna fuente cargada. Ese es el truco para comprobarlo, y esta montado
 * en la composicion `Fuente`, que ademas imprime cuantas caras hay
 * registradas de verdad.
 *
 * Ahora se registran desde `public/fuentes/` con la API `FontFace`, y el
 * render espera a que esten listas. No depende del bundler ni de la red: el
 * resultado es identico en cualquier maquina y sin conexion.
 *
 * **Toda pieza nueva tiene que llamar a `useFuentesDeMarca()`.** Si se
 * olvida, la pieza se renderiza con otra letra y no avisa nadie.
 */

type Cara = {
  familia: "Montserrat" | "Manrope";
  peso: number;
  archivo: string;
};

/**
 * Los pesos que usa el sistema, y solo esos.
 *
 * Montserrat sostiene las placas del kit de motion graphics; Manrope, el
 * texto de video: titulares, cifras y subtitulos. El reparto esta en `tipo`,
 * dentro de `brand/theme.ts`. Manrope no tiene 900: su extrabold es el 800.
 */
const CARAS: Cara[] = [
  { familia: "Montserrat", peso: 400, archivo: "montserrat-latin-400-normal.woff2" },
  { familia: "Montserrat", peso: 700, archivo: "montserrat-latin-700-normal.woff2" },
  { familia: "Montserrat", peso: 800, archivo: "montserrat-latin-800-normal.woff2" },
  { familia: "Montserrat", peso: 900, archivo: "montserrat-latin-900-normal.woff2" },
  { familia: "Manrope", peso: 400, archivo: "manrope-latin-400-normal.woff2" },
  { familia: "Manrope", peso: 600, archivo: "manrope-latin-600-normal.woff2" },
  { familia: "Manrope", peso: 700, archivo: "manrope-latin-700-normal.woff2" },
  { familia: "Manrope", peso: 800, archivo: "manrope-latin-800-normal.woff2" },
];

const cargar = async () => {
  await Promise.all(
    CARAS.map(async (cara) => {
      const face = new FontFace(
        cara.familia,
        `url(${staticFile(`fuentes/${cara.archivo}`)}) format("woff2")`,
        { weight: String(cara.peso), style: "normal" },
      );
      await face.load();
      document.fonts.add(face);
    }),
  );
};

/**
 * Detiene el render hasta que las fuentes esten registradas.
 *
 * Se llama una vez, en el componente raiz de cada pieza.
 *
 * Devuelve si ya estan puestas. Las piezas no lo necesitan, porque el render
 * no avanza sin ellas; lo usa el banco de pruebas `Fuente` para contar las
 * caras despues de cargarlas y no antes.
 */
export const useFuentesDeMarca = () => {
  const [espera] = useState(() => delayRender("Cargando las fuentes de marca"));
  const [listas, setListas] = useState(false);

  useEffect(() => {
    cargar()
      .then(() => {
        setListas(true);
        continueRender(espera);
      })
      .catch((error) => {
        // Sin fuentes la pieza sale con otra tipografia y nadie se entera:
        // mejor que el render se pare y lo diga.
        throw new Error(`No se han podido cargar las fuentes de marca: ${error}`);
      });
  }, [espera]);

  return listas;
};
