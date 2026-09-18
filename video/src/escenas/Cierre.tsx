import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { brand, easeOut, fontSize, space, tracking, weight } from "../brand/theme";
import { Logo } from "../componentes/Logo";

/**
 * Cierre de marca: degradado de olivo a bosque y el logo, sin nada mas.
 *
 * El degradado va entre dos verdes de la paleta, no entre colores ajenos:
 * el manual descarta los gradientes que no salen de la marca.
 */
export const Cierre: React.FC<{ duracion: number }> = ({ duracion }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${interpolate(frame, [0, duracion], [150, 178], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })}deg, ${brand.green} 0%, ${brand.greenDark} 46%, ${brand.forest} 100%)`,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Logo
        variante="blanco"
        ancho={620}
        style={{
          opacity: interpolate(frame, [4, 20], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          // Un acercamiento minimo que mantiene vivo el plano fijo.
          scale: interpolate(frame, [4, duracion], [0.94, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(...easeOut),
            output: "perceptual-scale",
          }),
        }}
      />

      <div
        style={{
          marginTop: space[6],
          color: "#FFFFFF",
          fontSize: fontSize["2xl"],
          fontWeight: weight.bold,
          letterSpacing: tracking.loose,
          textTransform: "lowercase",
          opacity: interpolate(frame, [18, 34], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        santiagoways.com
      </div>
    </AbsoluteFill>
  );
};
