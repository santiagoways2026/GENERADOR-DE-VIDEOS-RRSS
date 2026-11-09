import { Easing, interpolate, useCurrentFrame } from "remotion";
import { easeOut, radius, shadow, slideUp } from "../brand/theme";
import { Clip } from "./Clip";

/**
 * Un plano vertical presentado como una caja dentro de un lienzo horizontal.
 *
 * Casi todo el metraje propio está grabado en vertical, para reels. Estirarlo
 * a 16:9 lo destroza, y rellenar los lados con una copia desenfocada es justo
 * la textura digital que el brandbook descarta. Así que se enseña como lo que
 * es: un plano vertical, con las esquinas y la sombra de las cajas de marca,
 * sobre blanco.
 */
export const Panel: React.FC<{
  src: string;
  ancho: number;
  alto: number;
  /** Fotograma, relativo a la escena, en que entra el panel. */
  desde?: number;
  duracion: number;
  encuadre?: string;
}> = ({ src, ancho, alto, desde = 0, duracion, encuadre }) => {
  const frame = useCurrentFrame();
  const t = frame - desde;

  return (
    <div
      style={{
        position: "relative",
        width: ancho,
        height: alto,
        borderRadius: radius.lg,
        overflow: "hidden",
        boxShadow: shadow.caja,
        opacity: interpolate(t, [0, 12], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        translate: interpolate(t, [0, 18], [`0px ${slideUp}px`, "0px 0px"], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(...easeOut),
        }),
      }}
    >
      <Clip src={src} duracion={duracion} overlay={0} zoom={1.06} encuadre={encuadre} />
    </div>
  );
};
