import { Composition } from "remotion";
import { format, fps } from "./brand/theme";
import { DURACION_REEL, ReelXacobeo } from "./ReelXacobeo";
import { DURACION_TESTIMONIO_REEL, TestimonioReel } from "./TestimonioReel";
import { DURACION_TESTIMONIO_YT, TestimonioYouTube } from "./TestimonioYouTube";

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
        id="TestimonioReel"
        component={TestimonioReel}
        durationInFrames={DURACION_TESTIMONIO_REEL}
        fps={fps}
        width={format.reels.width}
        height={format.reels.height}
      />
      <Composition
        id="TestimonioYouTube"
        component={TestimonioYouTube}
        durationInFrames={DURACION_TESTIMONIO_YT}
        fps={fps}
        width={format.youtube.width}
        height={format.youtube.height}
      />
    </>
  );
};
