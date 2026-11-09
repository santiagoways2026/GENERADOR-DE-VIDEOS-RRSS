import { CanvasImage, staticFile } from "remotion";
import { logo } from "../brand/theme";

/**
 * La marca nunca se escribe como texto: siempre el archivo oficial.
 *
 * - `verde` sobre blanco; `blanco` sobre cualquier otro fondo, foto incluida.
 * - `isotipoBlanco` es la marca de agua de vídeo: arriba a la derecha, desde
 *   24 px, con aire alrededor y nunca sobre caras.
 * - Nunca recortado, girado ni usado como trama.
 */
const ARCHIVO = {
  verde: logo.verde,
  blanco: logo.blanco,
  isotipo: logo.isotipo,
  isotipoBlanco: logo.isotipoBlanco,
} as const;

export const Logo: React.FC<{
  variante?: keyof typeof ARCHIVO;
  ancho?: number;
  style?: React.CSSProperties;
}> = ({ variante = "blanco", ancho = 320, style }) => {
  const esIsotipo = variante === "isotipo" || variante === "isotipoBlanco";
  return (
    <CanvasImage
      src={staticFile(ARCHIVO[variante])}
      style={{
        width: Math.max(ancho, esIsotipo ? logo.minWidthIsotipo : logo.minWidth),
        height: "auto",
        objectFit: "contain",
        ...style,
      }}
    />
  );
};

/**
 * Marca de agua de vídeo según el Brandbook 2027: isotipo blanco arriba a la
 * derecha. Sustituye al logo completo abajo a la izquierda que se usaba antes.
 */
export const MarcaDeAgua: React.FC<{ ancho?: number; margen?: number }> = ({
  ancho = 56,
  margen = 56,
}) => (
  <Logo
    variante="isotipoBlanco"
    ancho={ancho}
    style={{ position: "absolute", top: margen, right: margen, opacity: 0.92 }}
  />
);
