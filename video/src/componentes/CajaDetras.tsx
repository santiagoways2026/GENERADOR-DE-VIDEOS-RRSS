import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { color, easeOut } from "../brand/theme";

/**
 * Caja que asoma por detrás de la persona.
 *
 * Va en la capa entre el metraje y el recorte de la persona, así que el pelo
 * y los hombros la tapan y gana profundidad. Tiene que ser sutil: acompaña a
 * quien habla, no compite con su cara.
 *
 * - Sale de detrás de la cabeza con un recorrido corto y lento, y vuelve a
 *   esconderse por el mismo sitio.
 * - Sombra apenas marcada y poco contenido: una idea por caja.
 * - Se coloca a un lado de la cabeza y estrecha, para que la persona solo le
 *   tape el borde. Si le tapa el texto, no se lee.
 */
export const CajaDetras: React.FC<{
  nombre: string;
  entrada: number;
  salida: number;
  top: number;
  left: number;
  width: number;
  /** Hacia dónde se esconde: +1 a la derecha, -1 a la izquierda. La caja
   *  sale del lado contrario a donde está, desde detrás de la cabeza. */
  lado?: 1 | -1;
  children: React.ReactNode;
}> = ({ nombre, entrada, salida, top, left, width, lado = 1, children }) => {
  const frame = useCurrentFrame();
  const t = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
  const ease = Easing.bezier(...easeOut);
  const fuera = `${lado * 150}px 0px`;
  return (
    <Interactive.Div
      name={nombre}
      style={{
        position: "absolute",
        top,
        left,
        width,
        padding: "24px 26px 22px",
        backgroundColor: color.bg1,
        borderRadius: 12,
        boxShadow: "0 6px 20px rgba(24, 72, 52, 0.12)",
        display: "flex",
        flexDirection: "column",
        // El texto se aleja del lado por donde la tapa la persona.
        alignItems: lado === 1 ? "flex-start" : "flex-end",
        textAlign: lado === 1 ? "left" : "right",
        gap: 8,
        translate:
          frame < salida
            ? interpolate(frame, [entrada, entrada + 22], [fuera, "0px 0px"], { ...t, easing: ease })
            : interpolate(frame, [salida, salida + 16], ["0px 0px", fuera], { ...t, easing: ease }),
        opacity:
          frame < salida
            ? interpolate(frame, [entrada, entrada + 14], [0, 1], t)
            : interpolate(frame, [salida + 4, salida + 16], [1, 0], t),
      }}
    >
      {children}
    </Interactive.Div>
  );
};
