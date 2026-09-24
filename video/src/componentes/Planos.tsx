import { Sequence } from "remotion";
import { fps, medioCruce } from "../brand/theme";
import { Clip } from "./Clip";

export type Plano = {
  /** Nombre del archivo en public/brutos, sin extension. */
  src: string;
  /** Duracion real del plano en el bruto, en segundos. */
  dura: number;
  /** Encuadre del recorte cuando el sujeto no esta centrado. */
  encuadre?: string;
  /** Zoom lento de principio a fin. Por defecto se calcula solo segun
   *  cuanta camara lenta le toque al plano (1.05 si no va estirado, mas si
   *  va muy estirado). Poner un valor aqui lo fija y desactiva ese calculo. */
  zoom?: number;
};

/**
 * Encadena los planos de un bloque repartiendo su duracion.
 *
 * Los brutos son compilaciones y ningun plano suyo pasa de 2,75 segundos,
 * asi que un corte largo se come el plano siguiente y aparecen esos saltos
 * raros a mitad de escena. Aqui cada plano se recorta en proporcion a lo
 * que dura de verdad, de modo que ninguno se estira mas alla de su final.
 *
 * Basta con que la suma de duraciones reales cubra el bloque.
 *
 * Los cortes internos (entre planos de la misma lista) se funden entre si
 * en vez de cortar en seco: cada Sequence se solapa `medioCruce` fotogramas
 * con la siguiente y Clip hace un fundido cruzado real (los dos videos se
 * ven a la vez, no un fundido a un color). El primer y el ultimo plano no
 * funden por ningun lado por defecto: ese borde lo corta el bloque de
 * fuera. `fundeEntradaBloque`/`fundeSalidaBloque` extienden ese fundido al
 * bloque vecino cuando el corte seco entre dos bloques muy distintos (y
 * los dos en camara lenta) lee mal -- el bloque de fuera tiene que ampliar
 * su propia Sequence lo mismo que aqui para que el solape encaje.
 */
export const Planos: React.FC<{
  lista: Plano[];
  /** Duracion del bloque, en fotogramas. */
  total: number;
  overlay?: number;
  /** Fundir con el bloque anterior en vez de cortar en seco al entrar. */
  fundeEntradaBloque?: boolean;
  /** Fundir con el bloque siguiente en vez de cortar en seco al salir. */
  fundeSalidaBloque?: boolean;
}> = ({
  lista,
  total,
  overlay = 0.34,
  fundeEntradaBloque = false,
  fundeSalidaBloque = false,
}) => {
  const suma = lista.reduce((a, p) => a + p.dura, 0);
  let acumulado = 0;

  return (
    <>
      {lista.map((p, i) => {
        const inicio = acumulado;
        // El ultimo absorbe el redondeo para que no quede un hueco de un frame.
        const fin =
          i === lista.length - 1
            ? total
            : acumulado + Math.round((p.dura / suma) * total);
        acumulado = fin;
        const duracionLogica = fin - inicio;
        if (duracionLogica <= 0) return null;

        const esPrimero = i === 0;
        const esUltimo = i === lista.length - 1;
        const fundeEntrada = !esPrimero || fundeEntradaBloque;
        const fundeSalida = !esUltimo || fundeSalidaBloque;
        const from = inicio - (esPrimero ? (fundeEntradaBloque ? medioCruce : 0) : medioCruce);
        const duracion =
          duracionLogica +
          (esPrimero ? (fundeEntradaBloque ? medioCruce : 0) : medioCruce) +
          (esUltimo ? (fundeSalidaBloque ? medioCruce : 0) : medioCruce);

        // Si el bloque le pide al plano mas tiempo del que dura de verdad,
        // se estira en camara lenta en vez de pedirle a OffthreadVideo
        // fotogramas que no existen (eso cuelga el render).
        const playbackRate = Math.min(1, (p.dura * fps) / duracion);
        // El zoom corre a su propio ritmo, no al de la camara lenta: cuanto
        // mas estirado va el plano, mas empuje hace falta para que no lea
        // como congelado. A playbackRate 1 (el caso de siempre, planos que
        // caben en su bloque sin estirarse) esto da 1.05, el zoom de
        // siempre, sin cambiar nada.
        const zoomAuto = 1.05 + (1 - playbackRate) * 0.35;
        return (
          <Sequence key={p.src} from={from} durationInFrames={duracion} name={p.src}>
            <Clip
              src={`brutos/${p.src}.mp4`}
              duracion={duracion}
              overlay={overlay}
              encuadre={p.encuadre}
              zoom={p.zoom ?? zoomAuto}
              playbackRate={playbackRate}
              fundeEntrada={fundeEntrada}
              fundeSalida={fundeSalida}
            />
          </Sequence>
        );
      })}
    </>
  );
};
