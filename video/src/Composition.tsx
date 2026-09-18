import { Composition } from "remotion";
import { canvas } from "./brand/theme";
import { EscenaPortada, type PortadaProps } from "./EscenaPortada";

/**
 * Una <Composition> declara un video: que componente pinta cada fotograma,
 * cuantos fotogramas dura, a que velocidad y en que tamano.
 * Aparece en la barra lateral de Remotion Studio con su id.
 */
export const MyComposition = () => {
  return (
    <Composition
      id="PortadaSW"
      component={EscenaPortada}
      durationInFrames={5 * canvas.fps} // 5 segundos
      fps={canvas.fps}
      width={canvas.width}
      height={canvas.height}
      defaultProps={
        {
          titular: "¿Cuál es tu Camino?",
          subtitulo:
            "Las 5 rutas que más peregrinos eligen, comparadas en un minuto.",
          cta: "Descúbrelo",
        } satisfies PortadaProps
      }
    />
  );
};
