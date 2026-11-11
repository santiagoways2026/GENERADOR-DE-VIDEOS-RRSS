import { Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { brand, easeOut, weight } from "../brand/theme";
import { Easing } from "remotion";

export type Palabra = {
  /** Texto de la palabra, tal cual se dice. */
  w: string;
  /** Inicio y fin en segundos de la linea de tiempo de la pieza. */
  s: number;
  e: number;
};

/**
 * Subtitulos de marca para piezas verticales.
 *
 * Se agrupan en frases cortas de pocas palabras, porque en movil se leen de
 * un vistazo. El texto es blanco con sombra tintada hacia bosque, nunca
 * negra. La palabra que se esta diciendo se marca con un fondo lima y texto
 * bosque, la unica combinacion permitida sobre lima.
 *
 * Cada frase entra con un fade corto y un desplazamiento minimo, sin rebote.
 */
export const Subtitulos: React.FC<{
  palabras: Palabra[];
  /** Maximo de palabras por frase. */
  porFrase?: number;
  /** Distancia desde arriba del lienzo, en px. */
  top?: number;
  tamano?: number;
}> = ({ palabras, porFrase = 4, top = 1240, tamano = 64 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // Frases: se cortan por numero de palabras, por pausa o por puntuacion.
  const frases: Palabra[][] = [];
  let actual: Palabra[] = [];
  palabras.forEach((p, i) => {
    const anterior = palabras[i - 1];
    const pausa = anterior ? p.s - anterior.e > 0.45 : false;
    if (actual.length && (actual.length >= porFrase || pausa)) {
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

  const frase = frases.find(
    (f, i) => t >= f[0].s - 0.05 && t < Math.max(f[f.length - 1].e + 0.25, frases[i + 1] ? Math.min(frases[i + 1][0].s - 0.05, f[f.length - 1].e + 0.6) : f[f.length - 1].e + 0.6),
  );
  if (!frase) return null;

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
        gap: "6px 14px",
        opacity: interpolate(frame, [entrada, entrada + 5], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        translate: interpolate(frame, [entrada, entrada + 7], ["0px 12px", "0px 0px"], {
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
              lineHeight: 1.15,
              fontWeight: weight.black,
              textTransform: "uppercase",
              letterSpacing: "0.01em",
              color: activa ? brand.forest : brand.white,
              backgroundColor: activa ? brand.lime : "transparent",
              borderRadius: 6,
              padding: "2px 12px 6px",
              textShadow: activa
                ? "none"
                : "0 3px 14px rgba(14, 44, 31, 0.75), 0 1px 3px rgba(14, 44, 31, 0.9)",
            }}
          >
            {p.w.trim().replace(/[.,]$/, "")}
          </span>
        );
      })}
    </Interactive.Div>
  );
};
