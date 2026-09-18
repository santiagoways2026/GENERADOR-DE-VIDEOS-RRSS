import { Easing, interpolate } from "remotion";
import { duration, easeOut, slideUp } from "../brand/theme";

/**
 * Entrada estandar de la marca: fade mas slide-up corto, easing de salida,
 * cero rebote. La guia lo dice explicitamente: "Fade + slide-up 8-12 px,
 * nunca bounce".
 *
 * Devuelve las props de estilo ya calculadas para el fotograma actual.
 */
export const entrada = (frame: number, desde = 0, dur = duration.slow) => ({
  opacity: interpolate(frame, [desde, desde + dur], [0, 1], {
    extrapolateLeft: "clamp" as const,
    extrapolateRight: "clamp" as const,
  }),
  translate: interpolate(
    frame,
    [desde, desde + dur],
    [`0px ${slideUp}px`, "0px 0px"],
    {
      extrapolateLeft: "clamp" as const,
      extrapolateRight: "clamp" as const,
      easing: Easing.bezier(...easeOut),
    },
  ),
});
