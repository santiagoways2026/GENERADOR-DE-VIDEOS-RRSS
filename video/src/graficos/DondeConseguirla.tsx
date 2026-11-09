import { Interactive, interpolate, useCurrentFrame } from "remotion";
import { brand, color, weight } from "../brand/theme";

/**
 * Dónde conseguir la credencial, en tres puntos cortos.
 *
 * La pieza original traía aquí una tarjeta quemada con tres frases largas a
 * letra pequeña. Esta la tapa entera en la misma posición (90-990 px de
 * ancho, 250-510 de alto) con una idea por línea y letra que se lee en el
 * móvil. Aparece de golpe en el corte y sale con la transición.
 */
const PUNTOS: { texto: string; destacado?: boolean }[] = [
  { texto: "Camino associations" },
  { texto: "Parishes & pilgrim offices" },
  { texto: "Included with Santiago Ways", destacado: true },
];

export const DondeConseguirla: React.FC<{ entrada: number; salida: number }> = ({ entrada, salida }) => {
  const frame = useCurrentFrame();
  return (
    <Interactive.Div
      name="Dónde conseguirla"
      style={{
        position: "absolute",
        top: 244,
        left: 84,
        width: 912,
        height: 272,
        borderRadius: 14,
        backgroundColor: color.bg1,
        padding: "0 48px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 10,
        opacity: frame < entrada ? 0 : interpolate(frame, [salida, salida + 6], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      <span
        style={{
          fontSize: 54,
          lineHeight: 1.05,
          fontWeight: weight.extrabold,
          letterSpacing: "-0.02em",
          color: brand.forest,
          marginBottom: 6,
        }}
      >
        Where to get it
      </span>
      {PUNTOS.map(({ texto, destacado }) => (
        <div key={texto} style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <span
            style={{
              flex: "none",
              width: 14,
              height: 14,
              borderRadius: 999,
              backgroundColor: brand.green,
            }}
          />
          <span
            style={{
              fontSize: 38,
              lineHeight: 1.15,
              fontWeight: destacado ? weight.extrabold : weight.bold,
              // Texto verde sobre blanco: verde sendero, nunca el olivo.
              color: destacado ? "#506718" : brand.forest,
            }}
          >
            {texto}
          </span>
        </div>
      ))}
    </Interactive.Div>
  );
};
