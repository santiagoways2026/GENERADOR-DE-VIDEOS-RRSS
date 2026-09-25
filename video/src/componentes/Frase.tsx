import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { brand, color, easeOut, margin, slideUp, weight } from "../brand/theme";

/**
 * Frase suelta sobre el metraje, con las palabras clave destacadas.
 *
 * Es el "destacado" del kit de motion graphics llevado a una frase entera:
 * el texto va tal cual, en blanco, y solo las palabras clave llevan detras
 * el bloque olivo, que entra con el barrido `swWipe` del kit. Texto blanco
 * sobre olivo, como pide la guia.
 *
 * Las palabras clave se marcan con asteriscos: "Todo *organizado*". Un
 * salto de linea en el texto parte la frase ahi.
 */

/** 896 ms del kit, a 30 fps. */
const BARRIDO = 27;
/** El bloque arranca cuando la frase ya se ha asentado. */
const RETARDO = 8;

const trozos = (texto: string) =>
  texto.split(/(\*[^*]+\*)/).filter(Boolean).map((t) =>
    t.startsWith("*") ? { t: t.slice(1, -1), clave: true } : { t, clave: false },
  );

export const Frase: React.FC<{
  texto: string;
  desde?: number;
  /** Distancia al borde superior: por debajo de la franja de la interfaz. */
  arriba?: number;
  tamano?: number;
}> = ({ texto, desde = 0, arriba = 320, tamano = 78 }) => {
  const frame = useCurrentFrame();
  const t = frame - desde;

  const entrada = { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(...easeOut) } as const;

  return (
    <Interactive.Div
      name="Frase"
      style={{
        position: "absolute",
        top: arriba,
        left: margin,
        right: margin,
        textAlign: "center",
        whiteSpace: "pre-line",
        fontSize: tamano,
        lineHeight: 1.22,
        fontWeight: weight.extrabold,
        letterSpacing: "-0.01em",
        color: color.fgInverse,
        // Sombra tintada hacia bosque, nunca negra, para leer sobre cielo.
        textShadow: "0 2px 18px rgba(14, 44, 31, 0.55), 0 1px 3px rgba(14, 44, 31, 0.45)",
        opacity: interpolate(t, [0, 12], [0, 1], entrada),
        translate: `0 ${interpolate(t, [0, 12], [slideUp, 0], entrada)}px`,
      }}
    >
      {trozos(texto).map((p, i) =>
        p.clave ? (
          <span
            key={i}
            style={{
              backgroundColor: brand.green,
              padding: "0 16px 4px",
              borderRadius: 6,
              boxDecorationBreak: "clone",
              WebkitBoxDecorationBreak: "clone",
              textShadow: "none",
              clipPath: `inset(0 ${interpolate(t, [RETARDO, RETARDO + BARRIDO], [100, 0], entrada)}% 0 0)`,
            }}
          >
            {p.t}
          </span>
        ) : (
          <span key={i}>{p.t}</span>
        ),
      )}
    </Interactive.Div>
  );
};
