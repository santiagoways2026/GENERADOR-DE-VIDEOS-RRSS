import { AbsoluteFill, Easing, interpolate, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { easeOut } from "../brand/theme";

/**
 * Orbit: la cámara parece girar alrededor de la persona.
 *
 * Dos capas: el fondo sin la persona, desenfocado, que gira en perspectiva y
 * se acerca; y el recorte de la persona encima, que apenas se mueve. La
 * diferencia entre las dos da el paralaje. Al final todo vuelve a su sitio y
 * se funde con el plano original, así que el corte de vuelta no se nota.
 *
 * Una sola vez por pieza: es el efecto con más firma.
 */
export const Orbita: React.FC<{
  fondo: string;
  figura: string;
  /** Fotogramas del giro. */
  duracion: number;
  /** Grados de giro al empezar. */
  giro?: number;
}> = ({ fondo, figura, duracion, giro = 14 }) => {
  const frame = useCurrentFrame();
  const t = {
    extrapolateLeft: "clamp" as const,
    extrapolateRight: "clamp" as const,
    easing: Easing.bezier(...easeOut),
  };
  const p = interpolate(frame, [0, duracion], [0, 1], t);
  return (
    <AbsoluteFill style={{ perspective: 1300, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          transform: `translateX(${(1 - p) * -34}px) rotateY(${(1 - p) * giro}deg) scale(${1.14 - 0.14 * p})`,
        }}
      >
        <OffthreadVideo src={staticFile(fondo)} muted style={{ width: "100%", height: "100%" }} />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          transformOrigin: "50% 60%",
          transform: `translateX(${(1 - p) * 20}px) scale(${1.08 - 0.08 * p})`,
        }}
      >
        <OffthreadVideo src={staticFile(figura)} transparent muted style={{ width: "100%", height: "100%" }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
