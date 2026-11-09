import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { brand, easeOut } from "../brand/theme";

/**
 * Transición de bloque: una cortina olivo que cruza el plano de izquierda a
 * derecha y tapa el corte justo en su fotograma. Es el mismo barrido lateral
 * de las cartelas, llevado a pantalla completa, con un filo lima delante.
 *
 * Se coloca en una <Sequence> que empieza `MEDIA` fotogramas antes del corte
 * y dura `TOTAL`. Solo en cambios de bloque: en cada corte cansa.
 */
export const MEDIA = 7;
export const TOTAL = MEDIA * 2;

const recorrido = (frame: number, desde: number, hasta: number) =>
  interpolate(frame, [desde, hasta], [100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...easeOut),
  });

/** Una capa de color: entra tapando hacia la derecha y sale destapando. */
const Capa: React.FC<{ fondo: string; retraso: number }> = ({ fondo, retraso }) => {
  const frame = useCurrentFrame();
  const entrando = frame < MEDIA + retraso;
  const clip = entrando
    ? `inset(0 ${recorrido(frame, retraso, MEDIA + retraso - 2)}% 0 0)`
    : `inset(0 0 0 ${100 - recorrido(frame, MEDIA + retraso, TOTAL + retraso - 2)}%)`;
  return <AbsoluteFill style={{ backgroundColor: fondo, clipPath: clip }} />;
};

export const Transicion: React.FC = () => (
  <AbsoluteFill>
    {/* El filo lima va dos fotogramas por delante y se asoma en el borde. */}
    <Capa fondo={brand.lime} retraso={-2} />
    <Capa fondo={brand.green} retraso={0} />
  </AbsoluteFill>
);
