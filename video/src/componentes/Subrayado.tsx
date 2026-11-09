import { Easing, interpolate } from "remotion";
import { brand, easeOut, subrayado } from "../brand/theme";

/**
 * El subrayado Ways del Brandbook 2027: un bloque de color plano detrás de
 * las una o dos palabras que llevan la promesa, girado -1,5° como un trazo
 * hecho a mano. Recto, sin redondeo ni sombra, sin degradado.
 *
 * - `ways`: por defecto, sobre blanco o foto. Bloque verde Ways, letra blanca.
 * - `sendero`: en negativo, sobre una caja verde Ways. Bloque sendero.
 *
 * Una sola vez por titular y un solo tipo por pieza: eso lo decide quien lo
 * coloca, el componente no puede saberlo.
 *
 * El bloque se descubre de izquierda a derecha con un barrido, como se dibuja
 * un subrayado a mano.
 */
export const Subrayado: React.FC<{
  children: React.ReactNode;
  tono?: "ways" | "sendero";
  /** Fotograma relativo en que empieza el barrido. */
  frame: number;
  desde?: number;
  dura?: number;
  style?: React.CSSProperties;
}> = ({ children, tono = "ways", frame, desde = 0, dura = 18, style }) => {
  const descubierto = interpolate(frame, [desde, desde + dura], [100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...easeOut),
  });

  return (
    <span
      style={{
        display: "inline-block",
        backgroundColor: tono === "ways" ? brand.green : brand.sendero,
        color: brand.white,
        padding: "0.02em 0.22em 0.08em",
        rotate: `${subrayado.giro}deg`,
        clipPath: `inset(0 ${descubierto}% 0 0)`,
        ...style,
      }}
    >
      {children}
    </span>
  );
};
