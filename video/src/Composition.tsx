import { Composition } from "remotion";
import { format, fps } from "./brand/theme";
import { DURACION_APP, ReelApp } from "./ReelApp";
import { DURACION_CURIOSIDADES, ReelCuriosidades } from "./ReelCuriosidades";
import { DURACION_REEL, ReelXacobeo } from "./ReelXacobeo";
import { DURACION_PERFIL, PerfilSarria } from "./graficos/PerfilSarria";
import { StillsEtapas } from "./graficos/etapa/etapas";
import { DURACION_YT55, YouTubeMayores55 } from "./YouTubeMayores55";

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
        id="ReelApp"
        component={ReelApp}
        durationInFrames={DURACION_APP}
        fps={fps}
        width={format.reels.width}
        height={format.reels.height}
        defaultProps={{ provisional: true }}
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
      {/* Máster limpio: los subtítulos van como pistas .srt en YouTube. */}
      <Composition
        id="YouTubeMayores55"
        component={YouTubeMayores55}
        durationInFrames={DURACION_YT55}
        fps={fps}
        width={format.youtube.width}
        height={format.youtube.height}
        defaultProps={{ subtitulos: false }}
      />
      {/* Versión guía, con la locución escrita en pantalla para revisar el
          montaje mientras no hay audio grabado. */}
      <Composition
        id="YouTubeMayores55Guia"
        component={YouTubeMayores55}
        durationInFrames={DURACION_YT55}
        fps={fps}
        width={format.youtube.width}
        height={format.youtube.height}
        defaultProps={{ subtitulos: true }}
      />
      {/* Imágenes fijas de etapa, para la web. */}
      <StillsEtapas />
    </>
  );
};
