import { Easing, Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { brand, easeOut, weight } from "../brand/theme";

export type Palabra = {
  /** Texto de la palabra, tal cual se dice. */
  w: string;
  /** Inicio y fin en segundos de la linea de tiempo de la pieza. */
  s: number;
  e: number;
};

/**
 * Subtitulos de los reels de la marca, calcados de las piezas publicadas.
 *
 * Frases cortas de dos o tres palabras, en caja normal (no en mayusculas),
 * Montserrat en peso 800, blanco con una sombra suave. La palabra que se
 * esta diciendo se marca con una placa olivo y texto blanco.
 *
 * Ninguna frase cruza un corte de montaje: al cambiar de toma cambia
 * tambien la frase.
 */
export const Subtitulos: React.FC<{
  palabras: Palabra[];
  /** Maximo de palabras por frase. */
  porFrase?: number;
  /** Distancia desde arriba del lienzo, en px. */
  top?: number;
  tamano?: number;
  /** Tiempos de los cortes de montaje: ninguna frase cruza uno. */
  cortes?: number[];
}> = ({ palabras, porFrase = 3, top = 1290, tamano = 66, cortes = [] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Frases: se cortan por numero de palabras, por pausa, por puntuacion o por corte.
  const frases: Palabra[][] = [];
  let actual: Palabra[] = [];
  palabras.forEach((p, i) => {
    const anterior = palabras[i - 1];
    const pausa = anterior ? p.s - anterior.e > 0.45 : false;
    const corte = anterior
      ? cortes.some((c) => anterior.s < c && p.s >= c - 0.02)
      : false;
    if (actual.length && (actual.length >= porFrase || pausa || corte)) {
      frases.push(actual);
      actual = [];
    }
    actual.push(p);
    if (/[.?!,]$/.test(p.w.trim()) && actual.length >= 2) {
      frases.push(actual);
      actual = [];
    }
  });
  if (actual.length) frases.push(actual);

  const indice = frases.findIndex((f, i) => {
    const fin = f[f.length - 1].e;
    const siguiente = frases[i + 1]?.[0].s ?? Infinity;
    return t >= f[0].s - 0.05 && t < Math.min(fin + 0.5, siguiente - 0.05);
  });
  if (indice === -1) return null;
  const frase = frases[indice];
  const entrada = Math.round((frase[0].s - 0.05) * fps);

  return (
    <Interactive.Div
      name="Subtitulos"
      style={{
        position: "absolute",
        top,
        left: 72,
        right: 72,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        gap: "4px 10px",
        opacity: interpolate(frame, [entrada, entrada + 4], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        translate: interpolate(frame, [entrada, entrada + 6], ["0px 10px", "0px 0px"], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(...easeOut),
        }),
      }}
    >
      {frase.map((p, i) => {
        const activa = t >= p.s && t < p.e + 0.08;
        return (
          <span
            key={`${p.s}-${i}`}
            style={{
              fontSize: tamano,
              lineHeight: 1.2,
              fontWeight: weight.extrabold,
              letterSpacing: "-0.01em",
              color: brand.white,
              backgroundColor: activa ? brand.green : "transparent",
              borderRadius: 8,
              padding: "0px 12px 4px",
              textShadow: activa
                ? "none"
                : "0 2px 10px rgba(14, 44, 31, 0.55), 0 1px 2px rgba(14, 44, 31, 0.6)",
            }}
          >
            {p.w.trim().replace(/[.,]$/, "")}
          </span>
        );
      })}
    </Interactive.Div>
  );
};
