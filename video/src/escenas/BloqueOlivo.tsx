import { AbsoluteFill, Interactive, useCurrentFrame } from "remotion";
import {
  color,
  fontFamily,
  fontSize,
  lineHeight,
  margin,
  space,
  tracking,
  weight,
} from "../brand/theme";
import { entrada } from "../componentes/entrada";
import { Logo } from "../componentes/Logo";

export type BloqueOlivoProps = {
  eyebrow: string;
  titular: string;
  lead: string;
};

/**
 * Pieza base del feed: olivo solido con texto blanco.
 * Jerarquia obligatoria segun el checklist: eyebrow -> titular -> cuerpo.
 */
export const BloqueOlivo: React.FC<BloqueOlivoProps> = ({
  eyebrow,
  titular,
  lead,
}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: color.bgBrand,
        fontFamily,
        padding: margin,
        justifyContent: "center",
        gap: space[5],
      }}
    >
      <Interactive.Div
        name="Eyebrow"
        style={{
          fontSize: fontSize.sm,
          fontWeight: weight.bold,
          letterSpacing: tracking.loose,
          textTransform: "uppercase",
          color: color.fgInverse,
          opacity: entrada(frame, 0).opacity,
          translate: entrada(frame, 0).translate,
        }}
      >
        {eyebrow}
      </Interactive.Div>

      {/* Titular de feed: mayusculas, peso 900, blanco sobre olivo. */}
      <Interactive.Div
        name="Titular"
        style={{
          fontSize: fontSize.impact,
          fontWeight: weight.black,
          lineHeight: lineHeight.tight,
          letterSpacing: tracking.tight,
          textTransform: "uppercase",
          color: color.fgInverse,
          opacity: entrada(frame, 4).opacity,
          translate: entrada(frame, 4).translate,
        }}
      >
        {titular}
      </Interactive.Div>

      <Interactive.Div
        name="Lead"
        style={{
          fontSize: fontSize.xl,
          fontWeight: weight.regular,
          lineHeight: lineHeight.relaxed,
          color: color.fgInverse,
          maxWidth: 820,
          opacity: entrada(frame, 12).opacity,
          translate: entrada(frame, 12).translate,
        }}
      >
        {lead}
      </Interactive.Div>

      {/* Piezas sociales: la marca va en la esquina inferior. */}
      <Logo
        variante="blanco"
        ancho={300}
        style={{
          position: "absolute",
          left: margin,
          bottom: margin,
          opacity: entrada(frame, 16).opacity,
        }}
      />
    </AbsoluteFill>
  );
};
