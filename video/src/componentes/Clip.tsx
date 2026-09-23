import {
  AbsoluteFill,
  Easing,
  interpolate,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { easeOut, medioCruce } from "../brand/theme";

/**
 * Un clip de metraje encajado en el lienzo del reel.
 *
 * Se usa `OffthreadVideo` y no el `Video` de `@remotion/media` porque este
 * ultimo ignora `objectFit`: el clip aparece en banda en lugar de recortarse.
 *
 * Aviso de calidad: un bruto de 1920x1080 recortado a vertical solo aporta
 * 608 px de ancho reales, asi que llenar un lienzo de 1080 lo amplia un 78 %.
 * Se nota en las texturas finas, no tanto en un plano general.
 *
 * `fundeEntrada`/`fundeSalida` hacen un fundido cruzado real con el plano
 * vecino: Planos solapa las Sequence `medioCruce` fotogramas a cada lado
 * del corte, asi que durante el solape los dos videos estan montados a la
 * vez y uno se funde sobre el otro. No es un fundido a un color -- eso lee
 * como una pausa, no como un corte suave.
 */
export const Clip: React.FC<{
  src: string;
  /** Segundo del archivo por el que entra el corte. */
  desdeSegundo?: number;
  /** Oscurecido para que el texto encima se lea. El manual permite 0 a 40%. */
  overlay?: number;
  /** Zoom lento de principio a fin. 1 lo desactiva. */
  zoom?: number;
  duracion: number;
  /** Encuadre del recorte, en porcentaje: "50% 50%" centra, "20% 50%"
   *  se queda con la parte izquierda del plano. */
  encuadre?: string;
  /** Velocidad de reproduccion. Por debajo de 1 estira el plano en cámara
   *  lenta cuando el bloque dura mas que el metraje real disponible, para
   *  no pedirle a OffthreadVideo fotogramas que no existen. */
  playbackRate?: number;
  /** Funde de entrada sobre el plano anterior, en vez de empezar de golpe. */
  fundeEntrada?: boolean;
  /** Funde de salida bajo el plano siguiente, en vez de cortar de golpe. */
  fundeSalida?: boolean;
}> = ({
  src,
  desdeSegundo = 0,
  overlay = 0.3,
  zoom = 1.08,
  duracion,
  encuadre = "50% 50%",
  playbackRate = 1,
  fundeEntrada = false,
  fundeSalida = false,
}) => {
  const frame = useCurrentFrame();

  const entra = fundeEntrada
    ? interpolate(frame, [0, medioCruce], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;
  const sale = fundeSalida
    ? interpolate(frame, [duracion - medioCruce, duracion], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ opacity: Math.min(entra, sale) }}>
        <OffthreadVideo
          src={staticFile(src)}
          trimBefore={desdeSegundo > 0 ? Math.round(desdeSegundo * 30) : undefined}
          playbackRate={playbackRate}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: encuadre,
            scale: interpolate(frame, [0, duracion], [1, zoom], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(...easeOut),
              output: "perceptual-scale",
            }),
          }}
        />
        {overlay > 0 ? (
          <AbsoluteFill
            style={{ backgroundColor: `rgba(14, 44, 31, ${overlay})` }}
          />
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
