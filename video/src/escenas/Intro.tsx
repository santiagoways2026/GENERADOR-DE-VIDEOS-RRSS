import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { brand, easeOut } from "../brand/theme";
import { Logo } from "../componentes/Logo";

/**
 * Cabecera de marca: el mismo fondo del cierre y el logo en blanco.
 *
 * Abre y cierra con un fundido corto para enlazar con el metraje de antes
 * y de despues. El logo entra con fade y un desplazamiento corto hacia
 * arriba, sin rebote, como pide la guia.
 */
export const Intro: React.FC<{
  duracion: number;
  ancho?: number;
  /** Olivo liso, a juego con el cierre plano. */
  plano?: boolean;
}> = ({ duracion, ancho = 520, plano = false }) => {
  const frame = useCurrentFrame();
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

  return (
    <AbsoluteFill
      style={{
        // Si abre la pieza no hay nada antes: solo se funde la salida.
        opacity: plano
          ? interpolate(frame, [duracion - 8, duracion], [1, 0], clamp)
          : interpolate(frame, [0, 8, duracion - 8, duracion], [0, 1, 1, 0], clamp),
        background: plano
          ? brand.green
          : `linear-gradient(${interpolate(frame, [0, duracion], [160, 176], clamp)}deg, ${brand.green} 0%, ${brand.greenDark} 46%, ${brand.forest} 100%)`,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Logo
        variante="blanco"
        ancho={ancho}
        style={{
          opacity: interpolate(frame, [8, 24], [0, 1], clamp),
          translate: interpolate(frame, [8, 26], ["0px 18px", "0px 0px"], {
            ...clamp,
            easing: Easing.bezier(...easeOut),
          }),
          scale: interpolate(frame, [8, duracion], [0.96, 1], {
            ...clamp,
            easing: Easing.bezier(...easeOut),
            output: "perceptual-scale",
          }),
        }}
      />
    </AbsoluteFill>
  );
};
