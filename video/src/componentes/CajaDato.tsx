import { Interactive, useCurrentFrame } from "remotion";
import {
  brand,
  gradient,
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
 * Caja de dato en los tres tonos del Brandbook 2027: blanca con texto
 * grafito, verde Ways con su degradado y sendero. Nunca verde sobre verde.
 * Estructura fija: eyebrow, cifra grande, explicacion corta.
 */
export const CajaDato: React.FC<{
  eyebrow: string;
  cifra: string;
  texto: string;
  tono?: "claro" | "verde" | "sendero";
  desde?: number;
  style?: React.CSSProperties;
}> = ({ eyebrow, cifra, texto, tono = "verde", desde = 0, style }) => {
  const frame = useCurrentFrame();

  const tonos = {
    claro: { bg: color.bg1, fg: color.fg1, sub: color.fg2, acc: color.fgAccent },
    verde: { bg: gradient.cajaVerde, fg: color.fgInverse, sub: color.fgInverse, acc: color.fgInverse },
    sendero: { bg: brand.sendero, fg: color.fgInverse, sub: color.fgInverse, acc: color.fgInverse },
  }[tono];

  return (
    <Interactive.Div
      name="CajaDato"
      style={{
        background: tonos.bg,
        borderRadius: radius.lg,
        boxShadow: shadow.caja,
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
          fontSize: fontSize.texto,
          fontWeight: weight.bold,
          letterSpacing: tracking.antetitulo,
          textTransform: "uppercase",
          color: tonos.acc,
        }}
      >
        {eyebrow}
      </div>
      <div
        style={{
          fontSize: fontSize.display,
          fontWeight: weight.extrabold,
          lineHeight: lineHeight.titular,
          letterSpacing: tracking.normal,
          color: tonos.fg,
        }}
      >
        {cifra}
      </div>
      <div
        style={{
          fontSize: fontSize.h4,
          fontWeight: weight.regular,
          lineHeight: lineHeight.texto,
          color: tonos.sub,
          opacity: tono === "claro" ? 1 : 0.86,
        }}
      >
        {texto}
      </div>
    </Interactive.Div>
  );
};
