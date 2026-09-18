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
 *
 * El manual prohibe las cifras sin fuente en pantalla, y con mas motivo en
 * piezas que se quedan ancladas en el perfil durante meses: para entonces el
 * dato ya ha cambiado y lo unico que lo sostiene es de donde salio.
 */
export const CajaDato: React.FC<{
  eyebrow: string;
  cifra: string;
  texto: string;
  /** De donde sale el dato. Obligatoria en cuanto aparece una cifra. */
  fuente?: string;
  tono?: "claro" | "olivo" | "bosque";
  desde?: number;
  style?: React.CSSProperties;
}> = ({ eyebrow, cifra, texto, fuente, tono = "olivo", desde = 0, style }) => {
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
        padding: `${space[6]}px ${space[7]}px`,
        maxWidth: 880,
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
          fontSize: 32,
          fontWeight: weight.medium,
          lineHeight: lineHeight.snug,
          color: tonos.sub,
          opacity: tono === "claro" ? 1 : 0.86,
        }}
      >
        {texto}
      </div>
      {fuente ? (
        <div
          style={{
            marginTop: space[1],
            fontSize: fontSize.md,
            fontWeight: weight.medium,
            letterSpacing: tracking.wide,
            color: tonos.sub,
            opacity: tono === "claro" ? 0.7 : 0.72,
          }}
        >
          {fuente}
        </div>
      ) : null}
    </Interactive.Div>
  );
};
