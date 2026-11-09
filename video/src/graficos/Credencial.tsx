import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { brand, color, easeOut, tracking, weight } from "../brand/theme";

/**
 * Tarjeta de la credencial, legible en móvil.
 *
 * La pieza original traía esta tarjeta quemada con el texto a 26 px, que en
 * un teléfono no se lee. Esta la tapa entera en la misma posición: mismo
 * contenido y misma estructura, con el cuerpo a 34 px y el texto más corto.
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
      <div style={{ padding: "26px 36px 28px", display: "flex", flexDirection: "column", gap: 6 }}>
        <span
          style={{
            fontSize: 24,
            fontWeight: weight.extrabold,
            letterSpacing: tracking.loose,
            textTransform: "uppercase",
            // Texto verde sobre blanco: verde sendero, nunca el olivo.
            color: "#506718",
          }}
        >
          Your pilgrim passport
        </span>
        <span
          style={{
            fontSize: 64,
            lineHeight: 1.05,
            fontWeight: weight.extrabold,
            letterSpacing: "-0.015em",
            color: brand.forest,
          }}
        >
          The credential
        </span>
        <span
          style={{
            fontSize: 34,
            lineHeight: 1.25,
            fontWeight: weight.bold,
            color: brand.forestSoft,
            marginTop: 6,
          }}
        >
          Included with Santiago Ways. Otherwise, get one before you start.
        </span>
      </div>
    </Interactive.Div>
  );
};
