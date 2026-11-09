import { Composition } from "remotion";
import { format, fps } from "./brand/theme";
import { DURACION_CURIOSIDADES, ReelCuriosidades } from "./ReelCuriosidades";
import { DURACION_REEL, ReelXacobeo } from "./ReelXacobeo";
import { DURACION_PERFIL, PerfilSarria } from "./graficos/PerfilSarria";

/**
 * Cada <Composition> es un video registrado: que componente lo pinta,
 * cuanto dura, a que velocidad y en que tamano.
 */
export const MyComposition = () => {
  return (
    <>
      <Composition
        id="ReelXacobeo"
        component={ReelXacobeo}
        durationInFrames={DURACION_REEL}
        fps={fps}
        width={format.reels.width}
        height={format.reels.height}
      />
      <Composition
        id="ReelCuriosidades"
        component={ReelCuriosidades}
        durationInFrames={DURACION_CURIOSIDADES}
        fps={fps}
        width={format.reels.width}
        height={format.reels.height}
      />
      <Composition
        id="GraficoPerfilSarria"
        component={PerfilSarria}
        durationInFrames={DURACION_PERFIL}
        fps={fps}
        width={format.youtube.width}
        height={format.youtube.height}
      />
    </>
  );
};
