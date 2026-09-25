import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { brand, color, easeOut, margin, slideUp, weight } from "../brand/theme";

/**
 * Titular de mensaje directo, el de las piezas de testimonio para anuncios.
 *
 * Dos lineas alineadas a la izquierda: arriba el gancho en blanco, sin
 * placa, y debajo el dato sobre el bloque olivo, en blanco. El gancho entra
 * con fundido y desplazamiento corto; el bloque, con el barrido del kit.
 */

/** 896 ms del kit, a 30 fps. */
const BARRIDO = 27;
/** 480 ms de relevo entre lineas, como en las cartelas del kit. */
const RELEVO = 14;

export const Titular: React.FC<{
  gancho: string;
  destacado: string;
  /** Distancia al borde inferior del lienzo. */
  abajo?: number;
  tamano?: number;
}> = ({ gancho, destacado, abajo = 560, tamano = 52 }) => {
  const frame = useCurrentFrame();
  const entrada = {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...easeOut),
  } as const;

  return (
    <Interactive.Div
      name="Titular"
      style={{
        position: "absolute",
        left: margin,
        right: margin,
        bottom: abajo,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 6,
        fontSize: tamano,
        lineHeight: 1.18,
        fontWeight: weight.extrabold,
        letterSpacing: "-0.01em",
        color: color.fgInverse,
      }}
    >
      <div
        style={{
          padding: "0 4px",
          // Sombra tintada hacia bosque, nunca negra, para leer sobre foto.
          textShadow: "0 2px 16px rgba(14, 44, 31, 0.6), 0 1px 3px rgba(14, 44, 31, 0.5)",
          opacity: interpolate(frame, [0, 12], [0, 1], entrada),
          translate: `0 ${interpolate(frame, [0, 12], [slideUp, 0], entrada)}px`,
        }}
      >
        {gancho}
      </div>
      <div
        style={{
          backgroundColor: brand.green,
          padding: "4px 18px 8px",
          borderRadius: 6,
          whiteSpace: "nowrap",
          clipPath: `inset(0 ${interpolate(frame, [RELEVO, RELEVO + BARRIDO], [100, 0], entrada)}% 0 0)`,
        }}
      >
        {destacado}
      </div>
    </Interactive.Div>
  );
};
