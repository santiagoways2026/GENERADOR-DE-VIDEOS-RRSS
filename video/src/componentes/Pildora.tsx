import { Interactive, useCurrentFrame } from "remotion";
import {
  brand,
  color,
  fontSize,
  radius,
  space,
  tracking,
  weight,
} from "../brand/theme";
import { entrada } from "./entrada";

/**
 * Pildora de dato del kit: ancho ajustado al texto, para subrayar una cifra
 * suelta sobre el metraje. En lima lleva texto bosque, nunca blanco.
 */
export const Pildora: React.FC<{
  etiqueta: string;
  texto: string;
  tono?: "lima" | "olivo" | "bosque";
  desde?: number;
  style?: React.CSSProperties;
}> = ({ etiqueta, texto, tono = "lima", desde = 0, style }) => {
  const frame = useCurrentFrame();

  const tonos = {
    lima: { bg: brand.lime, fg: color.fgOnLime, chip: "rgba(24,72,52,0.16)" },
    olivo: { bg: brand.green, fg: color.fgInverse, chip: "rgba(255,255,255,0.22)" },
    bosque: { bg: brand.forest, fg: color.fgInverse, chip: "rgba(176,248,8,0.22)" },
  }[tono];

  return (
    <Interactive.Div
      name="Pildora"
      style={{
        alignSelf: "flex-start",
        display: "flex",
        alignItems: "center",
        gap: space[3],
        backgroundColor: tonos.bg,
        color: tonos.fg,
        borderRadius: radius.pill,
        padding: `${space[3]}px ${space[5]}px`,
        opacity: entrada(frame, desde).opacity,
        translate: entrada(frame, desde).translate,
        ...style,
      }}
    >
      <span
        style={{
          backgroundColor: tonos.chip,
          borderRadius: radius.pill,
          padding: `${space[1]}px ${space[3]}px`,
          fontSize: fontSize.sm,
          fontWeight: weight.black,
          letterSpacing: tracking.loose,
          textTransform: "uppercase",
        }}
      >
        {etiqueta}
      </span>
      <span style={{ fontSize: fontSize.lg, fontWeight: weight.bold }}>
        {texto}
      </span>
    </Interactive.Div>
  );
};
