import { Composition } from "remotion";
import { format, fps } from "./brand/theme";
import { DURACION_REEL, ReelXacobeo } from "./ReelXacobeo";
import { DURACION_REEL_YOUTUBE, ReelXacobeoYoutube } from "./ReelXacobeoYoutube";

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
        id="ReelXacobeoYoutube"
        component={ReelXacobeoYoutube}
        durationInFrames={DURACION_REEL_YOUTUBE}
        fps={fps}
        width={format.youtube.width}
        height={format.youtube.height}
      />
    </>
  );
};
