import { Sequence } from "remotion";
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
 */
export const Planos: React.FC<{
  lista: Plano[];
  /** Duracion del bloque, en fotogramas. */
  total: number;
  overlay?: number;
}> = ({ lista, total, overlay = 0.34 }) => {
  const suma = lista.reduce((a, p) => a + p.dura, 0);
  let acumulado = 0;

  // Si las tomas no cubren el bloque hay que estirar alguna, y estirar un
  // plano significa o congelarlo o meterse en el plano siguiente del bruto.
  // Es el error que mas veces se ha colado, asi que avisa en el Studio.
  if (suma * 30 < total - 1) {
    console.warn(
      `Planos: las tomas suman ${suma.toFixed(2)}s y el bloque pide ` +
        `${(total / 30).toFixed(2)}s. Faltan ${(total / 30 - suma).toFixed(2)}s: ` +
        `anade una toma o acorta el bloque. ` +
        `Tomas: ${lista.map((p) => p.src).join(", ")}`,
    );
  }

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
        const duracion = fin - inicio;
        if (duracion <= 0) return null;
        return (
          <Sequence key={p.src} from={inicio} durationInFrames={duracion} name={p.src}>
            <Clip
              src={`brutos/${p.src}.mp4`}
              duracion={duracion}
              overlay={overlay}
              encuadre={p.encuadre}
              zoom={1.05}
            />
          </Sequence>
        );
      })}
    </>
  );
};
