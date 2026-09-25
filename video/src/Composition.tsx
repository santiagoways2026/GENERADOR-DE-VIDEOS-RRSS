import { Composition } from "remotion";
import { format, fps } from "./brand/theme";
import { DURACION_REEL, ReelXacobeo } from "./ReelXacobeo";
import {
  DURACION_TESTIMONIO_ARGENTINAS,
  TestimonioArgentinas,
} from "./TestimonioArgentinas";
import {
  DURACION_TESTIMONIO_CECILIA,
  TestimonioCecilia,
} from "./TestimonioCecilia";

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
        id="TestimonioArgentinas"
        component={TestimonioArgentinas}
        durationInFrames={DURACION_TESTIMONIO_ARGENTINAS}
        fps={fps}
        width={format.reels.width}
        height={format.reels.height}
      />
      <Composition
        id="TestimonioCecilia"
        component={TestimonioCecilia}
        durationInFrames={DURACION_TESTIMONIO_CECILIA}
        fps={fps}
        width={format.reels.width}
        height={format.reels.height}
      />
    </>
  );
};
