import { brand, color, tracking, weight } from "../brand/theme";
import { CajaDetras } from "../componentes/CajaDetras";

/**
 * Refuerzo del CTA de la voz: deja tu pregunta en comentarios. Es el mismo
 * CTA que dice Hilary, no uno nuevo, y asoma por detrás de ella con poco
 * texto para no competir con su cara.
 */
const Flecha: React.FC = () => (
  <svg width="44" height="44" viewBox="0 0 44 44">
    <circle cx="22" cy="22" r="22" fill={brand.green} />
    <path d="M22 11 V31 M13 23 L22 32 L31 23" stroke="#fff" strokeWidth="4.5" fill="none"
      strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PreguntaDetras: React.FC<{ entrada: number; salida: number }> = ({ entrada, salida }) => (
  <CajaDetras nombre="Pregunta detrás" entrada={entrada} salida={salida} top={470} left={56} width={300}>
    <span
      style={{
        fontSize: 20,
        fontWeight: weight.bold,
        letterSpacing: tracking.wide,
        textTransform: "uppercase",
        color: color.fg3,
      }}
    >
      Questions?
    </span>
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <span
        style={{
          fontSize: 44,
          lineHeight: 1.05,
          fontWeight: weight.extrabold,
          letterSpacing: "-0.02em",
          color: brand.forest,
        }}
      >
        Ask us
        <br />
        below
      </span>
      <Flecha />
    </div>
  </CajaDetras>
);
