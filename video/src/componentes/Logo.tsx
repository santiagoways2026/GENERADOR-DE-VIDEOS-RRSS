import { CanvasImage, staticFile } from "remotion";
import { logo } from "../brand/theme";

/**
 * El manual es tajante: "Santiago Ways" nunca se escribe como texto.
 * La marca escrita es siempre el archivo oficial.
 *
 * - `blanco` sobre olivo, bosque o fotografia.
 * - `verde` sobre blanco o crema.
 * - Nunca sobre lima, nunca rotado, nunca como mascara.
 */
export const Logo: React.FC<{
  variante?: "blanco" | "verde";
  ancho?: number;
  style?: React.CSSProperties;
}> = ({ variante = "blanco", ancho = 320, style }) => {
  return (
    <CanvasImage
      src={staticFile(variante === "blanco" ? logo.blanco : logo.verde)}
      style={{
        width: Math.max(ancho, logo.minWidth),
        height: "auto",
        objectFit: "contain",
        ...style,
      }}
    />
  );
};
