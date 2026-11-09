import { Composition } from "remotion";
import { format, fps } from "./brand/theme";
import { DURACION_REEL, ReelXacobeo } from "./ReelXacobeo";
import { DURACION_COMPOSTELA, HilaryCompostela } from "./hilary/Compostela";

/**
 * Cada <Composition> es un video registrado: que componente lo pinta,
 * cuanto dura, a que velocidad y en que tamano.
 */
export const MyComposition = () => {
  return (
    <Composition
      id="ReelXacobeo"
      component={ReelXacobeo}
      durationInFrames={DURACION_REEL}
      fps={fps}
      width={format.reels.width}
      height={format.reels.height}
    />
  );
};

/** Hilary · Cómo conseguir la Compostela, sobre la pieza ya editada. */
export const ComposicionHilaryCompostela = () => {
  return (
    <Composition
      id="HilaryCompostela"
      component={HilaryCompostela}
      durationInFrames={DURACION_COMPOSTELA}
      fps={fps}
      width={format.reels.width}
      height={format.reels.height}
    />
  );
};
