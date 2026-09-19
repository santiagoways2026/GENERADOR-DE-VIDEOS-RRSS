import { Easing, interpolate, useCurrentFrame } from "remotion";
import { brand, color, fontFamily, margin, radius, space, weight } from "../brand/theme";

export type Cue = {
  /** Segundo en el que entra. */
  desde: number;
  /** Segundo en el que sale. */
  hasta: number;
  texto: string;
};

/**
 * Subtitulos quemados, para las piezas de YouTube.
 *
 * En Shorts se ve mucho sin sonido, asi que el subtitulo no es un extra: es
 * la mitad del mensaje. Va en placa bosque con el texto en blanco, que es la
 * pareja del manual para fondos oscuros y la unica que se lee igual sobre un
 * camino soleado que sobre un interior.
 *
 * Los tiempos salen de medir el audio, no de repartir el guion a ojo:
 * `herramientas/scripts/srt-a-cues.mjs` convierte un SRT en la lista de cues.
 *
 * La franja de abajo la ocupa la interfaz de Shorts, asi que el bloque se
 * ancla por encima de ella y nunca se centra en pantalla.
 */

/** Distancia al borde inferior. Deja libre la botonera de Shorts. */
const ALTURA = 400;
/** Lo que tarda en entrar. Corto: un subtitulo que se hace esperar estorba. */
const ENTRADA = 4;

export const Subtitulos: React.FC<{
  cues: Cue[];
  fps?: number;
  cuerpo?: number;
}> = ({ cues, fps = 30, cuerpo = 46 }) => {
  const frame = useCurrentFrame();
  const segundo = frame / fps;
  const activo = cues.find((c) => segundo >= c.desde && segundo < c.hasta);
  if (!activo) return null;

  const t = frame - activo.desde * fps;

  return (
    <div
      style={{
        position: "absolute",
        left: margin,
        right: margin,
        bottom: ALTURA,
        display: "flex",
        justifyContent: "center",
        fontFamily,
      }}
    >
      <div
        style={{
          backgroundColor: brand.forest,
          color: color.fgInverse,
          borderRadius: radius.md,
          padding: `${space[3]}px ${space[5]}px`,
          fontSize: cuerpo,
          fontWeight: weight.extrabold,
          lineHeight: 1.2,
          textAlign: "center",
          textWrap: "balance",
          opacity: interpolate(t, [0, ENTRADA], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(t, [0, ENTRADA + 3], ["0px 8px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.22, 0.61, 0.36, 1),
          }),
        }}
      >
        {activo.texto}
      </div>
    </div>
  );
};
