import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { brand, color, easeOut, weight } from "../brand/theme";

/**
 * Tarjeta de la credencial, legible en móvil.
 *
 * La pieza original traía esta tarjeta quemada con el texto a 26 px, que en
 * un teléfono no se lee. Esta la tapa entera en la misma posición con solo
 * dos cosas: qué es y que va incluida. Lo de conseguirla por tu cuenta ya lo
 * dice la voz.
 * Entra un poco antes que la quemada y sale un poco después, para que la de
 * debajo no asome nunca.
 */
const Icono: React.FC = () => (
  <svg width="96" height="80" viewBox="0 0 96 80" fill="none">
    <rect x="4" y="4" width="88" height="72" rx="12" stroke="#fff" strokeWidth="7" />
    <line x1="48" y1="8" x2="48" y2="72" stroke="#fff" strokeWidth="6" />
    <line x1="18" y1="30" x2="36" y2="30" stroke="#fff" strokeWidth="7" strokeLinecap="round" />
    <line x1="18" y1="50" x2="36" y2="50" stroke="#fff" strokeWidth="7" strokeLinecap="round" />
    <circle cx="70" cy="40" r="11" stroke="#fff" strokeWidth="7" />
  </svg>
);

export const Credencial: React.FC<{ entrada: number; salida: number }> = ({ entrada, salida }) => {
  const frame = useCurrentFrame();
  const t = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
  return (
    <Interactive.Div
      name="Credencial"
      style={{
        position: "absolute",
        top: 232,
        left: 44,
        right: 44,
        minHeight: 268,
        display: "flex",
        borderRadius: 14,
        overflow: "hidden",
        backgroundColor: color.bg1,
        clipPath: `inset(0 ${interpolate(frame, [entrada, entrada + 10], [100, 0], {
          ...t,
          easing: Easing.bezier(...easeOut),
        })}% 0 0)`,
        opacity: interpolate(frame, [salida, salida + 6], [1, 0], t),
      }}
    >
      <div
        style={{
          flex: "none",
          width: 176,
          backgroundColor: brand.green,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icono />
      </div>
      <div
        style={{
          padding: "0 44px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 14,
        }}
      >
        <span
          style={{
            fontSize: 80,
            lineHeight: 1,
            fontWeight: weight.extrabold,
            letterSpacing: "-0.02em",
            color: brand.forest,
          }}
        >
          The credential
        </span>
        <span
          style={{
            fontSize: 40,
            lineHeight: 1.15,
            fontWeight: weight.bold,
            // Texto verde sobre blanco: verde sendero, nunca el olivo.
            color: "#506718",
          }}
        >
          Included with Santiago Ways
        </span>
      </div>
    </Interactive.Div>
  );
};
