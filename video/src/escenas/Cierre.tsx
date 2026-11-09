import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import {
  brand,
  easeOut,
  fontFamily,
  gradient,
  logo,
  radius,
  videoSize,
  weight,
} from "../brand/theme";
import { Logo } from "../componentes/Logo";

/**
 * Cierre de marca según el Brandbook 2027. Dos variantes:
 *
 * - `verde`, para reels: la pieza "Cabecera" del brandbook, caja verde Ways
 *   con su degradado sutil a 135°, concha como marca de agua muy suave, logo
 *   blanco y la web. En reels el cierre es opcional.
 * - `blanco`, para YouTube: pantalla final blanca con el logo y un único CTA,
 *   suscribirse o reservar.
 *
 * Todo en Montserrat: la web ya no va en Manrope, que sale de la marca.
 */
export const Cierre: React.FC<{
  duracion: number;
  variante?: "verde" | "blanco";
  /** Único CTA de la pantalla final blanca. */
  cta?: string;
}> = ({ duracion, variante = "verde", cta = "Suscríbete" }) => {
  const frame = useCurrentFrame();
  const verde = variante === "verde";

  const aparece = (desde: number) =>
    interpolate(frame, [desde, desde + 16], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  return (
    <AbsoluteFill
      style={{
        background: verde ? gradient.cajaVerde : brand.white,
        alignItems: "center",
        justifyContent: "center",
        fontFamily,
        overflow: "hidden",
      }}
    >
      {verde ? (
        // La concha entera como marca de agua muy suave, que el brandbook
        // admite. Nunca recortada: cabe completa en el lienzo.
        <Img
          src={staticFile(logo.isotipoBlanco)}
          style={{
            position: "absolute",
            width: "78%",
            maxWidth: 900,
            opacity: 0.08,
          }}
        />
      ) : null}

      <Logo
        variante={verde ? "blanco" : "verde"}
        ancho={verde ? 620 : 520}
        style={{
          opacity: aparece(4),
          // Un acercamiento mínimo que mantiene vivo el plano fijo.
          scale: interpolate(frame, [4, duracion], [0.95, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(...easeOut),
            output: "perceptual-scale",
          }),
        }}
      />

      {verde ? (
        <div
          style={{
            marginTop: 32,
            color: brand.white,
            fontSize: 36,
            fontWeight: weight.semibold,
            opacity: aparece(18),
          }}
        >
          santiagoways.com
        </div>
      ) : (
        // CTA: verde Ways con letra blanca sobre blanco, en negrita y plano.
        <div
          style={{
            marginTop: 40,
            backgroundColor: brand.green,
            color: brand.white,
            fontSize: videoSize.etiqueta * 1.25,
            fontWeight: weight.bold,
            padding: "14px 36px",
            borderRadius: radius.pill,
            opacity: aparece(18),
          }}
        >
          {cta}
        </div>
      )}
    </AbsoluteFill>
  );
};
