import { Easing, interpolate, useCurrentFrame } from "remotion";
import { brand, color, margin, tipo } from "../brand/theme";

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
 * la mitad del mensaje.
 *
 * Va suelto sobre la imagen, sin banda detras. Una placa opaca ocupando el
 * ancho tapa metraje en todos los planos para resolver la legibilidad de
 * unos pocos, y ademas parte la pieza en dos mitades. La legibilidad la
 * sostiene un contorno de bosque, que es la tinta de la marca: aguanta sobre
 * un camino soleado igual que sobre un interior oscuro y no tapa nada.
 *
 * Montserrat 800. El 900 del titular, a cuerpo 50, se empasta y cierra los
 * contornos de la letra.
 *
 * Los tiempos salen de medir el audio, nunca de repartir el guion a ojo:
 * `alinear-locucion.py` cuando no hay SRT, `srt-a-cues.mjs` cuando lo hay.
 *
 * La franja de abajo la ocupa la interfaz de Shorts, asi que el bloque se
 * ancla por encima de ella y nunca se centra en pantalla.
 */

/** Distancia al borde inferior. Deja libre la botonera de Shorts. */
const ALTURA = 400;
/** Lo que tarda en entrar. Corto: un subtitulo que se hace esperar estorba. */
const ENTRADA = 4;

/**
 * Contorno de bosque, dibujado con sombras en las ocho direcciones.
 *
 * `-webkit-text-stroke` engorda la letra hacia dentro y a este cuerpo se
 * come los contrafuertes de la letra; ocho sombras cortas la rodean por
 * fuera y dejan el dibujo de la letra intacto.
 */
const contorno = (grosor: number, tinta: string) =>
  [
    ...Array.from({ length: 8 }, (_, i) => {
      const a = (i * Math.PI) / 4;
      return `${(Math.cos(a) * grosor).toFixed(2)}px ${(Math.sin(a) * grosor).toFixed(2)}px 0 ${tinta}`;
    }),
    `0 6px 20px rgba(14,44,31,0.55)`,
  ].join(", ");

export const Subtitulos: React.FC<{
  cues: Cue[];
  fps?: number;
  cuerpo?: number;
}> = ({ cues, fps = 30, cuerpo = 50 }) => {
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
      }}
    >
      <div
        style={{
          ...tipo.subtitulo,
          color: color.fgInverse,
          fontSize: cuerpo,
          lineHeight: 1.18,
          textAlign: "center",
          textWrap: "balance",
          textShadow: contorno(3, brand.forest),
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
