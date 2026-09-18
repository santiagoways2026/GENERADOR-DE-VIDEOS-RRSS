import { AbsoluteFill, Easing, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Video } from "@remotion/media";
import { easeOut } from "../brand/theme";

/**
 * Un clip de metraje bruto encajado en el lienzo del reel.
 *
 * `objectFit: cover` recorta el sobrante en lugar de deformar: un bruto
 * horizontal se convierte en vertical cortando los laterales, asi que
 * conviene que el sujeto este centrado.
 *
 * `trimBefore` descarta fotogramas del principio del archivo, sin tocar
 * el archivo original: es el punto de entrada del corte.
 */
export const Clip: React.FC<{
  src: string;
  /** Fotograma del archivo por el que entra el corte. */
  trimBefore?: number;
  /** Oscurecido para que el texto encima se lea. El manual permite 0 a 40%. */
  overlay?: number;
  /** Zoom lento de principio a fin. 1 lo desactiva. */
  zoom?: number;
  duracion: number;
}> = ({ src, trimBefore = 0, overlay = 0.3, zoom = 1.08, duracion }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      <Video
        src={staticFile(src)}
        trimBefore={trimBefore}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          scale: interpolate(frame, [0, duracion], [1, zoom], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(...easeOut),
            output: "perceptual-scale",
          }),
        }}
      />
      {overlay > 0 ? (
        <AbsoluteFill
          style={{ backgroundColor: `rgba(14, 44, 31, ${overlay})` }}
        />
      ) : null}
    </AbsoluteFill>
  );
};
