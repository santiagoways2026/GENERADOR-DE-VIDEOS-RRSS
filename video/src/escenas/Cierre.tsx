import { AbsoluteFill, Interactive, useCurrentFrame } from "remotion";
import {
  brand,
  color,
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

export type CierreProps = {
  pregunta: string;
  cta: string;
};

/**
 * Cierre en bosque: el manual lo reserva para footers y cierres, con uso
 * reducido. Aqui vive el unico CTA de la pieza, en estilo "punch":
 * lima con texto bosque.
 */
export const Cierre: React.FC<CierreProps> = ({ pregunta, cta }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: color.bgInk,
        fontFamily,
        padding: margin,
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        gap: space[7],
      }}
    >
      <Logo
        variante="blanco"
        ancho={560}
        style={{ opacity: entrada(frame, 0).opacity }}
      />

      <Interactive.Div
        name="Pregunta"
        style={{
          fontSize: fontSize["4xl"],
          fontWeight: weight.bold,
          lineHeight: lineHeight.snug,
          color: color.fgInverse,
          maxWidth: 820,
          opacity: entrada(frame, 8).opacity,
          translate: entrada(frame, 8).translate,
        }}
      >
        {pregunta}
      </Interactive.Div>

      {/* Boton "punch": lima con texto bosque. Un solo CTA por pieza. */}
      <Interactive.Div
        name="CTA"
        style={{
          backgroundColor: brand.lime,
          color: color.fgOnLime,
          fontSize: fontSize.xl,
          fontWeight: weight.bold,
          letterSpacing: tracking.wide,
          textTransform: "uppercase",
          padding: `${space[4]}px ${space[6]}px`,
          borderRadius: radius.md,
          opacity: entrada(frame, 16).opacity,
          translate: entrada(frame, 16).translate,
        }}
      >
        {cta}
      </Interactive.Div>
    </AbsoluteFill>
  );
};
