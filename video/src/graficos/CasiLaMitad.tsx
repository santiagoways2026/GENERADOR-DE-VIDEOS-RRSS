import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { brand, easeOut, radius, tracking, weight } from "../brand/theme";
import { Subrayado } from "../componentes/Subrayado";

/**
 * El dato del gancho: casi la mitad de quienes llegan a Santiago tiene más de
 * 45 años.
 *
 * Diez figuras, y se encienden de una en una hasta casi cinco. La quinta no se
 * llena entera, porque el dato es "casi la mitad" (en torno al 48 % en 2025) y
 * el gráfico no debe decir más que el dato. Para un público mayor, contar
 * figuras se entiende antes que leer un porcentaje.
 *
 * Fuente impresa: las cifras de edad de 2025 de la Oficina del Peregrino,
 * difundidas por la Federación Española de Asociaciones de Amigos del Camino.
 */

const FIGURAS = 10;
/** 4,8 de 10: casi la mitad, no la mitad. */
const ENCENDIDAS = 4.8;

const Figura: React.FC<{ relleno: number }> = ({ relleno }) => (
  <svg width={64} height={150} viewBox="0 0 64 150">
    <defs>
      <clipPath id={`r${Math.round(relleno * 100)}`}>
        <rect x={0} y={0} width={64 * relleno} height={150} />
      </clipPath>
    </defs>
    <g fill={brand.niebla}>
      <circle cx={32} cy={20} r={18} />
      <rect x={6} y={46} width={52} height={104} rx={26} />
    </g>
    <g fill={brand.green} clipPath={`url(#r${Math.round(relleno * 100)})`}>
      <circle cx={32} cy={20} r={18} />
      <rect x={6} y={46} width={52} height={104} rx={26} />
    </g>
  </svg>
);

export const CasiLaMitad: React.FC<{ cuenta?: number }> = ({ cuenta = 30 }) => {
  const f = useCurrentFrame();
  const encendidas = interpolate(f, [cuenta, cuenta + 60], [0, ENCENDIDAS], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...easeOut),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: brand.white, flexDirection: "row", alignItems: "center", paddingLeft: 96, paddingRight: 96, gap: 64 }}>
      <div style={{ flex: "none", width: 470, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 14 }}>
        <div
          style={{
            backgroundColor: brand.green,
            color: brand.white,
            fontSize: 16,
            fontWeight: weight.bold,
            letterSpacing: tracking.antetitulo,
            textTransform: "uppercase",
            padding: "5px 12px",
            borderRadius: radius.md,
          }}
        >
          Peregrinos en 2025
        </div>
        <div style={{ fontSize: 52, lineHeight: 1.1, fontWeight: weight.extrabold, color: brand.grafito }}>
          Casi{" "}
          <Subrayado frame={f} desde={8} dura={22}>
            la mitad
          </Subrayado>
        </div>
        <div style={{ fontSize: 30, lineHeight: 1.2, fontWeight: weight.bold, color: brand.grafito }}>
          tiene más de 45 años
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 64px)", gap: "28px 22px" }}>
        {Array.from({ length: FIGURAS }, (_, i) => (
          <div
            key={i}
            style={{
              opacity: interpolate(f, [4 + i * 2, 14 + i * 2], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <Figura relleno={Math.min(Math.max(encendidas - i, 0), 1)} />
          </div>
        ))}
      </div>

      <div style={{ position: "absolute", left: 96, bottom: 36, fontSize: 15, color: brand.gris }}>
        Fuente: Oficina del Peregrino, datos de 2025 difundidos por la Federación Española de Asociaciones de Amigos del Camino.
      </div>
    </AbsoluteFill>
  );
};
