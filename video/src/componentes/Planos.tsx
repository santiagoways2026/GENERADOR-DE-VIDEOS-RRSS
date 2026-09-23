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
 * funden por ningun lado: ese borde lo corta el bloque de fuera.
 */
export const Planos: React.FC<{
  lista: Plano[];
  /** Duracion del bloque, en fotogramas. */
  total: number;
  overlay?: number;
}> = ({ lista, total, overlay = 0.34 }) => {
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
        const from = inicio - (esPrimero ? 0 : medioCruce);
        const duracion =
          duracionLogica +
          (esPrimero ? 0 : medioCruce) +
          (esUltimo ? 0 : medioCruce);

        // Si el bloque le pide al plano mas tiempo del que dura de verdad,
        // se estira en camara lenta en vez de pedirle a OffthreadVideo
        // fotogramas que no existen (eso cuelga el render).
        const playbackRate = Math.min(1, (p.dura * fps) / duracion);
        return (
          <Sequence key={p.src} from={from} durationInFrames={duracion} name={p.src}>
            <Clip
              src={`brutos/${p.src}.mp4`}
              duracion={duracion}
              overlay={overlay}
              encuadre={p.encuadre}
              zoom={1.05}
              playbackRate={playbackRate}
              fundeEntrada={!esPrimero}
              fundeSalida={!esUltimo}
            />
          </Sequence>
        );
      })}
    </>
  );
};
