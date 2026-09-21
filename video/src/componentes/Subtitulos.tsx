import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import {
  brand,
  easeOut,
  fps,
  lineHeight,
  margin,
  radius,
  space,
  weight,
} from "../brand/theme";

/**
 * Subtitulos quemados, cortados por frase de la locucion.
 *
 * Los tiempos salen de medir los silencios del audio, los mismos que marcan
 * los cortes de imagen, asi que cada pie entra exactamente cuando empieza la
 * frase que transcribe.
 *
 * Van sobre una placa bosque translucida y no sobre el metraje a pelo: el
 * texto blanco sobre un plano claro se pierde, y la marca no admite negro.
 */

export type Pie = {
  /** Segundo en que empieza la frase. */
  desde: number;
  /** Segundo en que acaba. */
  hasta: number;
  texto: string;
};

/** Entrada corta: la del resto de la pieza, sin rebote. */
const ENTRADA = 5;

/**
 * Hueco maximo, en segundos, que se rellena alargando el pie anterior.
 *
 * Entre frase y frase hay pausas de medio segundo. Dejar el pie en blanco en
 * cada una produce un parpadeo constante, asi que las pausas cortas se cubren
 * manteniendo el pie hasta que entra el siguiente.
 */
const PUENTE = 1.1;

export const Subtitulos: React.FC<{ lista: Pie[] }> = ({ lista }) => {
  const frame = useCurrentFrame();
  const t = frame / fps;

  const i = lista.findIndex((p, j) => {
    const siguiente = lista[j + 1];
    const hasta =
      siguiente && siguiente.desde - p.hasta <= PUENTE ? siguiente.desde : p.hasta;
    return t >= p.desde && t < hasta;
  });
  if (i === -1) return null;

  const pie = lista[i];
  const entrada = (t - pie.desde) * fps;

  return (
    <Interactive.Div
      name="Subtítulos"
      style={{
        position: "absolute",
        left: margin,
        right: margin,
        bottom: 320,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          backgroundColor: "rgba(14, 44, 31, 0.72)",
          color: brand.white,
          padding: `${space[4]}px ${space[5]}px`,
          borderRadius: radius.md,
          fontSize: 46,
          lineHeight: lineHeight.snug,
          fontWeight: weight.bold,
          textAlign: "center",
          textWrap: "balance",
          opacity: interpolate(entrada, [0, ENTRADA], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(
            entrada,
            [0, ENTRADA * 2],
            ["0px 10px", "0px 0px"],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(...easeOut),
            },
          ),
        }}
      >
        {pie.texto}
      </span>
    </Interactive.Div>
  );
};
