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
  /** Pone el bloque olivo en la primera linea y el texto blanco debajo,
   *  cuando lo que hay que subrayar es el arranque de la frase. */
  destacadoArriba?: boolean;
}> = ({
  gancho,
  destacado,
  abajo = 560,
  tamano = 70,
  destacadoArriba = false,
}) => {
  const frame = useCurrentFrame();
  const entrada = {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...easeOut),
  } as const;

  // La linea de arriba entra primero; la de abajo, con el relevo del kit.
  const tBlanco = destacadoArriba ? RELEVO : 0;
  const tVerde = destacadoArriba ? 0 : RELEVO;

  const lineaBlanca = (
    <div
      style={{
        padding: "0 4px",
        whiteSpace: "pre-line",
        // Sombra tintada hacia bosque, nunca negra, para leer sobre foto.
        textShadow:
          "0 2px 16px rgba(14, 44, 31, 0.6), 0 1px 3px rgba(14, 44, 31, 0.5)",
        opacity: interpolate(frame, [tBlanco, tBlanco + 12], [0, 1], entrada),
        translate: `0 ${interpolate(frame, [tBlanco, tBlanco + 12], [slideUp, 0], entrada)}px`,
      }}
    >
      {gancho}
    </div>
  );

  const lineaVerde = (
    <>
      {/* El servicio puede partirse en dos lineas: cada una lleva su propio
          bloque olivo, como en las piezas de referencia. */}
      <div
        style={{
          lineHeight: 1.36,
          // Un salto de linea en el texto marca donde se parte.
          whiteSpace: "pre-line",
          clipPath: `inset(0 ${interpolate(frame, [tVerde, tVerde + BARRIDO], [100, 0], entrada)}% 0 0)`,
        }}
      >
        <span
          style={{
            backgroundColor: brand.green,
            padding: "2px 18px 6px",
            borderRadius: 6,
            boxDecorationBreak: "clone",
            WebkitBoxDecorationBreak: "clone",
          }}
        >
          {destacado}
        </span>
      </div>
    </>
  );

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
      {destacadoArriba ? lineaVerde : lineaBlanca}
      {destacadoArriba ? lineaBlanca : lineaVerde}
    </Interactive.Div>
  );
};
