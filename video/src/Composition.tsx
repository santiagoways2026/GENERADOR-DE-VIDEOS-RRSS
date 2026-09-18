import { Composition } from "remotion";
import { format, fps } from "./brand/theme";
import { DURACION_REEL, ReelXacobeo } from "./ReelXacobeo";
import { DURACION_REEL_US, ReelXacobeoUS } from "./ReelXacobeoUS";

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
      {/* La version para Estados Unidos, en ingles. Dura casi el doble: a ese
          publico hay que explicarle el Camino antes de venderle nada. */}
      <Composition
        id="ReelXacobeoUS"
        component={ReelXacobeoUS}
        durationInFrames={DURACION_REEL_US}
        fps={fps}
        width={format.reels.width}
        height={format.reels.height}
      />
    </>
  );
};
