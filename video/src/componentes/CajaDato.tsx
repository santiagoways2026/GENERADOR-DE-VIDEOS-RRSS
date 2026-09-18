import { Interactive, useCurrentFrame } from "remotion";
import {
  brand,
  color,
  fontSize,
  lineHeight,
  radius,
  shadow,
  space,
  tracking,
  weight,
} from "../brand/theme";
import { entrada } from "./entrada";

/**
 * Caja de dato del kit de motion graphics, en sus tres tonos.
 * Estructura fija: eyebrow, cifra grande, explicacion corta.
 */
export const CajaDato: React.FC<{
  eyebrow: string;
  cifra: string;
  texto: string;
  tono?: "claro" | "olivo" | "bosque";
  desde?: number;
  style?: React.CSSProperties;
}> = ({ eyebrow, cifra, texto, tono = "olivo", desde = 0, style }) => {
  const frame = useCurrentFrame();

  const tonos = {
    claro: { bg: color.bg1, fg: color.fg1, sub: color.fg2, acc: brand.green },
    olivo: { bg: brand.green, fg: color.fgInverse, sub: color.fgInverse, acc: color.fgInverse },
    bosque: { bg: brand.forest, fg: color.fgInverse, sub: color.fgInverse, acc: brand.lime },
  }[tono];

  return (
    <Interactive.Div
      name="CajaDato"
      style={{
        backgroundColor: tonos.bg,
        borderRadius: radius.lg,
        boxShadow: shadow.card,
        padding: space[6],
        maxWidth: 620,
        display: "flex",
        flexDirection: "column",
        gap: space[2],
        opacity: entrada(frame, desde).opacity,
        translate: entrada(frame, desde).translate,
        ...style,
      }}
    >
      <div
        style={{
          fontSize: fontSize.base,
          fontWeight: weight.bold,
          letterSpacing: tracking.loose,
          textTransform: "uppercase",
          color: tonos.acc,
        }}
      >
        {eyebrow}
      </div>
      <div
        style={{
          fontSize: fontSize["4xl"],
          fontWeight: weight.black,
          lineHeight: lineHeight.tight,
          letterSpacing: tracking.tight,
          color: tonos.fg,
        }}
      >
        {cifra}
      </div>
      <div
        style={{
          fontSize: fontSize.lg,
          fontWeight: weight.regular,
          lineHeight: lineHeight.normal,
          color: tonos.sub,
          opacity: tono === "claro" ? 1 : 0.86,
        }}
      >
        {texto}
      </div>
    </Interactive.Div>
  );
};
