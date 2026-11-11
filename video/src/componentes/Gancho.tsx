import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { brand, easeOut, weight } from "../brand/theme";

/**
 * Titular de arranque de los reels, como en las piezas publicadas:
 * centrado arriba, blanco en peso 800 y caja normal, con la parte clave
 * sobre una placa olivo. Entra con fade y un desplazamiento corto y se va
 * antes de que la persona termine de presentarse.
 */
export const Gancho: React.FC<{
  /** Texto en blanco, una linea por elemento. */
  lineas: string[];
  /** Texto sobre la placa olivo, en la ultima linea. */
  destacado: string;
  duracion: number;
  top?: number;
  tamano?: number;
}> = ({ lineas, destacado, duracion, top = 250, tamano = 92 }) => {
  const frame = useCurrentFrame();
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const sombra =
    "0 4px 22px rgba(14, 44, 31, 0.7), 0 2px 6px rgba(14, 44, 31, 0.65), 0 0 2px rgba(14, 44, 31, 0.5)";

  return (
    <Interactive.Div
      name="Gancho"
      style={{
        position: "absolute",
        top,
        left: 72,
        right: 72,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        fontSize: tamano,
        lineHeight: 1.08,
        fontWeight: weight.extrabold,
        letterSpacing: "-0.02em",
        color: brand.white,
        opacity: interpolate(frame, [0, 10, duracion - 8, duracion], [0, 1, 1, 0], clamp),
        translate: interpolate(frame, [0, 14], ["0px 24px", "0px 0px"], {
          ...clamp,
          easing: Easing.bezier(...easeOut),
        }),
      }}
    >
      {lineas.map((l) => (
        <span key={l} style={{ textShadow: sombra }}>
          {l}
        </span>
      ))}
      <span
        style={{
          marginTop: 10,
          backgroundColor: brand.green,
          borderRadius: 8,
          padding: "2px 22px 10px",
        }}
      >
        {destacado}
      </span>
    </Interactive.Div>
  );
};
