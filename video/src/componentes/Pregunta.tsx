import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { brand, easeOut, shadow, weight } from "../brand/theme";

/**
 * La pregunta de la entrevista, en una tarjeta pequena en la esquina
 * superior derecha mientras responden. La voz de quien pregunta se ha
 * quitado del montaje, asi que esta tarjeta es la que da contexto a cada
 * respuesta.
 *
 * Misma familia que la tarjeta de dato: fondo blanco, antetitulo olivo en
 * versalitas espaciadas y el texto en bosque. Entra con fade y un
 * desplazamiento corto y sale con un fade antes del corte.
 */
export const Pregunta: React.FC<{
  texto: string;
  duracion: number;
  /** Distancia a los bordes superior y derecho, en px. */
  top: number;
  right: number;
  /** Ancho maximo de la tarjeta, en px. */
  ancho: number;
  /** Escala tipografica: 1 en vertical 1080, menos en 1280x720. */
  escala?: number;
}> = ({ texto, duracion, top, right, ancho, escala = 1 }) => {
  const frame = useCurrentFrame();
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

  return (
    <Interactive.Div
      name="Pregunta"
      style={{
        position: "absolute",
        top,
        right,
        maxWidth: ancho,
        backgroundColor: brand.white,
        borderRadius: 14 * escala,
        padding: `${20 * escala}px ${28 * escala}px ${24 * escala}px`,
        boxShadow: shadow.raised,
        opacity: interpolate(frame, [0, 10, duracion - 8, duracion], [0, 1, 1, 0], clamp),
        translate: interpolate(frame, [0, 14], ["0px 16px", "0px 0px"], {
          ...clamp,
          easing: Easing.bezier(...easeOut),
        }),
      }}
    >
      <div
        style={{
          fontSize: 22 * escala,
          fontWeight: weight.extrabold,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: brand.green,
        }}
      >
        We asked
      </div>
      <div
        style={{
          marginTop: 4 * escala,
          fontSize: 44 * escala,
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
