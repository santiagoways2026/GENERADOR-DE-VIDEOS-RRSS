/**
 * **Montserrat y nada mas**, que es lo que fija el Brandbook 2027: la edicion
 * anterior llevaba una cascada de Montserrat, Manrope y Poppins mas Tahoma
 * como corporativa de PDF, y el libro nuevo la retira entera.
 *
 * Se empaqueta con el proyecto en lugar de descargarse de Google en cada
 * render: asi el video sale identico en cualquier maquina y sin conexion.
 *
 * Los pesos son los cinco de la guia. **No se carga el 900**: el tope de la
 * familia en la marca es el 800, el ExtraBold.
 */
import "@fontsource/montserrat/latin-400.css";
import "@fontsource/montserrat/latin-500.css";
import "@fontsource/montserrat/latin-600.css";
import "@fontsource/montserrat/latin-700.css";
import "@fontsource/montserrat/latin-800.css";

/**
 * Las piezas de `archivo/` siguen pidiendo Montserrat 900 y Manrope, que es
 * con lo que se aprobaron. Se cargan aqui para que sigan renderizando igual.
 */
import "@fontsource/montserrat/latin-900.css";
import "@fontsource/manrope/latin-400.css";
import "@fontsource/manrope/latin-700.css";
import "@fontsource/manrope/latin-800.css";
