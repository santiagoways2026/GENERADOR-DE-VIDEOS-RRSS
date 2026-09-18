import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
// Las fuentes se empaquetan con el proyecto en lugar de descargarse de
// Google en cada render: asi el video sale identico en cualquier maquina
// y el render funciona sin conexion.
import "@fontsource/montserrat/latin-700.css";
import "@fontsource/montserrat/latin-800.css";
import "@fontsource/open-sans/latin-400.css";
import { color, font, lineHeight, safePadding, size, weight } from "./brand/theme";

const headFamily = font.head;
const bodyFamily = font.body;

export type PortadaProps = {
  titular: string;
  subtitulo: string;
  cta: string;
};

export const EscenaPortada: React.FC<PortadaProps> = ({
  titular,
  subtitulo,
  cta,
}) => {
  // frame es el fotograma actual: 0, 1, 2... Es la unica fuente de tiempo.
  // Todo lo que se mueve se calcula a partir de el.
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    // Fondo verde solido: la pieza "grafica" del manual de marca.
    <AbsoluteFill
      style={{
        backgroundColor: color.green,
        padding: safePadding,
        justifyContent: "center",
        gap: 48,
      }}
    >
      {/* Titular: mayusculas, blanco sobre verde, peso black. */}
      <Interactive.Div
        name="Titular"
        style={{
          fontFamily: headFamily,
          fontWeight: weight.black,
          fontSize: size.title,
          lineHeight: lineHeight.tight,
          color: color.white,
          textTransform: "uppercase",
          opacity: interpolate(frame, [0, 14], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [0, 24], ["0px 60px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 200 }),
          }),
        }}
      >
        {titular}
      </Interactive.Div>

      {/* Barra de acento: se revela de izquierda a derecha y separa
          el titular del cuerpo. Es el recurso grafico mas sobrio del manual. */}
      <Interactive.Div
        name="BarraAcento"
        style={{
          height: 14,
          borderRadius: 999,
          backgroundColor: color.greenDark,
          width: interpolate(frame, [10, 30], [0, 420], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      />

      {/* Subtitulo: entra medio segundo mas tarde para crear jerarquia. */}
      <Interactive.Div
        name="Subtitulo"
        style={{
          fontFamily: bodyFamily,
          fontWeight: weight.regular,
          fontSize: size.body,
          lineHeight: lineHeight.normal,
          color: color.white,
          maxWidth: 820,
          opacity: interpolate(frame, [15, 32], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [15, 38], ["0px 40px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        {subtitulo}
      </Interactive.Div>

      {/* CTA: aparece al final, con un rebote suave para pedir la accion. */}
      <Interactive.Div
        name="CTA"
        style={{
          position: "absolute",
          left: safePadding,
          bottom: safePadding,
          fontFamily: headFamily,
          fontWeight: weight.bold,
          fontSize: size.caption,
          color: color.green,
          backgroundColor: color.white,
          padding: "24px 44px",
          borderRadius: 999,
          textTransform: "uppercase",
          letterSpacing: 1.5,
          opacity: interpolate(frame, [fps, fps + 12], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(frame, [fps, fps + 20], [0.8, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 12 }),
            output: "perceptual-scale",
          }),
        }}
      >
        {cta}
      </Interactive.Div>

      {/* Marcador de posicion del isotipo (vieira). Sustituir por el SVG real
          en public/ y renderizarlo con <CanvasImage src={staticFile(...)} />.
          El manual exige version blanca sobre fondo verde. */}
      <Interactive.Div
        name="Isotipo"
        style={{
          position: "absolute",
          right: safePadding,
          bottom: safePadding,
          width: 96,
          height: 96,
          borderRadius: 999,
          border: `4px solid ${color.white}`,
          color: color.white,
          fontFamily: headFamily,
          fontWeight: weight.black,
          fontSize: 34,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: interpolate(frame, [0, 20], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        SW
      </Interactive.Div>
    </AbsoluteFill>
  );
};
