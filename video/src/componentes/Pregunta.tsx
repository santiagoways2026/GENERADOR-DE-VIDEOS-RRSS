import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { brand, easeOut, shadow, weight } from "../brand/theme";

/**
 * La pregunta de la entrevista, en una tarjeta pequena en la esquina
 * inferior izquierda mientras responden. La voz de quien pregunta se ha
 * quitado del montaje, asi que esta tarjeta es la que da contexto a cada
 * respuesta.
 *
 * Una sola linea, sin antetitulo: tarjeta blanca alargada con la pregunta
 * en bosque, de la misma familia que la tarjeta de dato. Entra con fade y
 * un desplazamiento corto y sale con un fade antes del corte.
 */
export const Pregunta: React.FC<{
  texto: string;
  duracion: number;
  /** Distancia a los bordes inferior e izquierdo, en px. */
  bottom: number;
  left: number;
  /** Escala tipografica: 1 en vertical 1080, menos en 1280x720. */
  escala?: number;
}> = ({ texto, duracion, bottom, left, escala = 1 }) => {
  const frame = useCurrentFrame();
  const clamp = {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  } as const;

  return (
    <Interactive.Div
      name="Pregunta"
      style={{
        position: "absolute",
        bottom,
        left,
        backgroundColor: brand.white,
        borderRadius: 14 * escala,
        padding: `${16 * escala}px ${30 * escala}px ${20 * escala}px`,
        boxShadow: shadow.raised,
        opacity: interpolate(
          frame,
          [0, 10, duracion - 8, duracion],
          [0, 1, 1, 0],
          clamp,
        ),
        translate: interpolate(frame, [0, 14], ["0px 16px", "0px 0px"], {
          ...clamp,
          easing: Easing.bezier(...easeOut),
        }),
      }}
    >
      <div
        style={{
          fontSize: 44 * escala,
          whiteSpace: "nowrap",
          lineHeight: 1.15,
          fontWeight: weight.extrabold,
          letterSpacing: "-0.01em",
          color: brand.forest,
        }}
      >
        {texto}
      </div>
    </Interactive.Div>
  );
};
