import { Interactive, useCurrentFrame } from "remotion";
import {
  color,
  fontSize,
  lineHeight,
  margin,
  tracking,
  weight,
} from "../brand/theme";
import { entrada } from "./entrada";

/**
 * Texto en pantalla del reel. Va siempre en la mitad superior, para que
 * no lo tape el copy ni la interfaz de la aplicacion.
 *
 * Titulares de feed en mayusculas y peso 900, blanco sobre el metraje,
 * como marca la guia.
 */
export const Rotulo: React.FC<{
  children: React.ReactNode;
  desde?: number;
  tamano?: keyof typeof fontSize;
}> = ({ children, desde = 0, tamano = "4xl" }) => {
  const frame = useCurrentFrame();

  return (
    <Interactive.Div
      name="Rotulo"
      style={{
        position: "absolute",
        top: 220,
        left: margin,
        right: margin,
        fontSize: fontSize[tamano],
        fontWeight: weight.black,
        lineHeight: lineHeight.tight,
        letterSpacing: tracking.tight,
        textTransform: "uppercase",
        color: color.fgInverse,
        textShadow: "0 2px 24px rgba(14,44,31,0.45)",
        opacity: entrada(frame, desde).opacity,
        translate: entrada(frame, desde).translate,
      }}
    >
      {children}
    </Interactive.Div>
  );
};
