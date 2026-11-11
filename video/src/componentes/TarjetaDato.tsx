import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { brand, easeOut, scale, shadow, weight, zonaSegura } from "../brand/theme";

/**
 * Tarjeta de dato de los reels publicados: un antetitulo pequeno en
 * versalitas espaciadas y el dato grande debajo.
 *
 * - `blanca`: fondo blanco, antetitulo olivo y dato en bosque.
 * - `olivo`: fondo olivo oscuro y todo el texto en blanco.
 *
 * Entra con fade y un desplazamiento corto, sin rebote.
 */
export const TarjetaDato: React.FC<{
  antetitulo: string;
  dato: string;
  variante?: "blanca" | "olivo";
  top?: number;
}> = ({ antetitulo, dato, variante = "blanca", top = zonaSegura.top + 24 }) => {
  const frame = useCurrentFrame();
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const blanca = variante === "blanca";

  return (
    <Interactive.Div
      name="Tarjeta de dato"
      style={{
        position: "absolute",
        top,
        left: zonaSegura.left,
        right: zonaSegura.right,
        backgroundColor: blanca ? brand.white : scale.green[7],
        borderRadius: 14,
        padding: "26px 36px 30px",
        boxShadow: shadow.raised,
        opacity: interpolate(frame, [0, 10], [0, 1], clamp),
        translate: interpolate(frame, [0, 14], ["0px 20px", "0px 0px"], {
          ...clamp,
          easing: Easing.bezier(...easeOut),
        }),
      }}
    >
      <div
        style={{
          fontSize: 26,
          fontWeight: weight.extrabold,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: blanca ? brand.green : brand.white,
          opacity: blanca ? 1 : 0.92,
        }}
      >
        {antetitulo}
      </div>
      <div
        style={{
          marginTop: 6,
          fontSize: 60,
          lineHeight: 1.1,
          fontWeight: weight.extrabold,
          letterSpacing: "-0.01em",
          color: blanca ? brand.forest : brand.white,
        }}
      >
        {dato}
      </div>
    </Interactive.Div>
  );
};
