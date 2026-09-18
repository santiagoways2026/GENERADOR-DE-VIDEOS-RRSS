import { Composition } from "remotion";
import { format, fps } from "./brand/theme";
import { Reel, type ReelProps } from "./Reel";

/**
 * Cada <Composition> es un video registrado: que componente lo pinta,
 * cuanto dura, a que velocidad y en que tamano. Aparece con su id en la
 * barra lateral de Remotion Studio.
 */
export const MyComposition = () => {
  return (
    <Composition
      id="ReelCamino"
      component={Reel}
      durationInFrames={10 * fps}
      fps={fps}
      width={format.reels.width}
      height={format.reels.height}
      defaultProps={
        {
          eyebrow: "Camino Portugués",
          titular: "Tui o Sarria",
          lead: "Dos puntos de partida, dos Caminos distintos. Te contamos cuál encaja contigo.",
          foto: "img/peregrinos-camino.jpg",
          titularFoto: "El Camino empieza cuando",
          destacado: "dejas de tener prisa",
          pregunta: "¿Ya tienes fecha para tu Camino?",
          cta: "Cuéntanos",
        } satisfies ReelProps
      }
    />
  );
};
