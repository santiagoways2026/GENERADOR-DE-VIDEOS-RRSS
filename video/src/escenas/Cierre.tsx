import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  brand,
  color,
  easeOut,
  fontSize,
  radius,
  space,
  tracking,
  weight,
} from "../brand/theme";
import { Logo } from "../componentes/Logo";

/**
 * Cierre de marca: degradado de olivo a bosque y el logo, sin nada mas.
 *
 * El degradado va entre dos verdes de la paleta, no entre colores ajenos:
 * el manual descarta los gradientes que no salen de la marca.
 *
 * La llamada a la accion es opcional y va debajo del logo, en una sola
 * placa. El manual solo admite un CTA por pieza, asi que si se pone aqui no
 * puede haber otro antes.
 */
export const Cierre: React.FC<{
  duracion: number;
  /** Llamada a la accion. Una sola, y solo en el cierre. */
  cta?: string;
  /** Remate bajo el CTA: donde se toca. */
  coletilla?: string;
  web?: string;
}> = ({ duracion, cta, coletilla, web = "santiagoways.com" }) => {
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
          fontFamily: "Manrope, sans-serif",
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
        {web}
      </div>

      {cta ? (
        <div
          style={{
            marginTop: space[8],
            backgroundColor: color.bg1,
            color: brand.forest,
            borderRadius: radius.md,
            padding: `${space[4]}px ${space[7]}px`,
            fontSize: 46,
            fontWeight: weight.black,
            letterSpacing: tracking.wide,
            textTransform: "uppercase",
            textAlign: "center",
            // Barrido lateral, como las cartelas: la marca no usa fundidos
            // para los bloques de texto.
            clipPath: `inset(0 ${interpolate(frame, [26, 50], [100, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(...easeOut),
            })}% 0 0)`,
          }}
        >
          {cta}
        </div>
      ) : null}

      {coletilla ? (
        <div
          style={{
            marginTop: space[4],
            backgroundColor: brand.lime,
            color: color.fgOnLime,
            borderRadius: radius.md,
            padding: `${space[3]}px ${space[6]}px`,
            fontSize: fontSize.xl,
            fontWeight: weight.black,
            letterSpacing: tracking.loose,
            textTransform: "uppercase",
            clipPath: `inset(0 ${interpolate(frame, [40, 62], [100, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(...easeOut),
            })}% 0 0)`,
          }}
        >
          {coletilla}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
