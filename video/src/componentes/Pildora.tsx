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
 * suelta sobre el metraje. Verde Ways o sendero, siempre con letra blanca y
 * en negrita: blanco sobre verde Ways solo vale en negrita.
 */
export const Pildora: React.FC<{
  etiqueta: string;
  texto: string;
  tono?: "verde" | "sendero";
  desde?: number;
  style?: React.CSSProperties;
}> = ({ etiqueta, texto, tono = "verde", desde = 0, style }) => {
  const frame = useCurrentFrame();

  const tonos = {
    verde: { bg: brand.green, fg: color.fgInverse, chip: "rgba(255,255,255,0.22)" },
    sendero: { bg: brand.sendero, fg: color.fgInverse, chip: "rgba(255,255,255,0.18)" },
  }[tono];

  return (
    <Interactive.Div
      name="Pildora"
      style={{
        alignSelf: "flex-start",
        display: "flex",
        alignItems: "center",
        gap: space[4],
        backgroundColor: tonos.bg,
        color: tonos.fg,
        borderRadius: radius.pill,
        padding: `${space[4]}px ${space[6]}px`,
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
          fontSize: fontSize.h4,
          fontWeight: weight.extrabold,
          letterSpacing: tracking.antetitulo,
          textTransform: "uppercase",
        }}
      >
        {etiqueta}
      </span>
      <span style={{ fontSize: fontSize.h2, fontWeight: weight.bold }}>
        {texto}
      </span>
    </Interactive.Div>
  );
};
