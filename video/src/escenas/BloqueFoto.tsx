import {
  AbsoluteFill,
  CanvasImage,
  Easing,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {
  brand,
  color,
  easeOut,
  fontFamily,
  fontSize,
  lineHeight,
  margin,
  radius,
  space,
  tracking,
  weight,
} from "../brand/theme";
import { entrada } from "../componentes/entrada";
import { Logo } from "../componentes/Logo";

export type BloqueFotoProps = {
  foto: string;
  titular: string;
  /** Palabra clave que subraya el brushstroke. Entre una y tres palabras. */
  destacado: string;
};

/**
 * Pieza emocional: fotografia real del Camino con overlay y un trazo de
 * pincel lima que subraya la palabra clave, con texto bosque encima.
 * El manual limita el brushstroke a 1-3 palabras y lo quiere ligeramente
 * rotado. Nunca como contenedor de parrafos.
 */
export const BloqueFoto: React.FC<BloqueFotoProps> = ({
  foto,
  titular,
  destacado,
}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ fontFamily }}>
      {/* Un zoom lentisimo da vida a una foto fija sin distraer. */}
      <CanvasImage
        src={staticFile(foto)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          scale: interpolate(frame, [0, 150], [1, 1.06], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            output: "perceptual-scale",
          }),
        }}
      />

      {/* Overlay: el manual permite negro de 0 a 40% sobre foto. */}
      <AbsoluteFill style={{ backgroundColor: "rgba(0,0,0,0.38)" }} />

      <AbsoluteFill
        style={{
          padding: margin,
          justifyContent: "flex-end",
          gap: space[5],
          paddingBottom: 260,
        }}
      >
        <Interactive.Div
          name="Titular"
          style={{
            fontSize: fontSize["3xl"],
            fontWeight: weight.extrabold,
            lineHeight: lineHeight.snug,
            letterSpacing: tracking.tight,
            color: color.fgInverse,
            maxWidth: 880,
            opacity: entrada(frame, 6).opacity,
            translate: entrada(frame, 6).translate,
          }}
        >
          {titular}
        </Interactive.Div>

        {/* Brushstroke lima. El trazo se revela y el texto va en bosque. */}
        <Interactive.Div
          name="Brushstroke"
          style={{
            alignSelf: "flex-start",
            backgroundColor: brand.lime,
            color: color.fgOnLime,
            fontSize: fontSize["3xl"],
            fontWeight: weight.black,
            lineHeight: lineHeight.tight,
            textTransform: "uppercase",
            padding: `${space[2]}px ${space[5]}px`,
            borderRadius: radius.md,
            rotate: "-1.5deg",
            overflow: "hidden",
            opacity: interpolate(frame, [18, 24], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            scale: interpolate(frame, [18, 34], [0.94, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(...easeOut),
              output: "perceptual-scale",
            }),
          }}
        >
          {destacado}
        </Interactive.Div>
      </AbsoluteFill>

      <Logo
        variante="blanco"
        ancho={300}
        style={{
          position: "absolute",
          left: margin,
          bottom: margin,
          opacity: entrada(frame, 20).opacity,
        }}
      />
    </AbsoluteFill>
  );
};
