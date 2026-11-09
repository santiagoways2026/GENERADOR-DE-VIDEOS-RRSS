import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { brand, easeOut, gradient, logo, radius, tracking, weight } from "../brand/theme";
import { Logo } from "../componentes/Logo";

/**
 * La pieza "Capítulo" del brandbook: caja verde Ways a toda pantalla con su
 * degradado sutil, la concha entera como marca de agua muy suave, el isotipo
 * arriba a la derecha, el antetítulo y el titular del bloque.
 *
 * Es el respiro entre bloques y el sitio de la tensión: dos segundos y medio
 * de calma en los que el espectador sabe exactamente qué viene.
 *
 * El titular va sin subrayado. Un solo tipo de subrayado por pieza: el resto
 * del vídeo ya usa el de por defecto, y aquí, sobre verde, tocaría el
 * negativo.
 */
export const Capitulo: React.FC<{
  antetitulo: string;
  titular: string;
}> = ({ antetitulo, titular }) => {
  const f = useCurrentFrame();
  const barrido = (desde: number) =>
    `inset(0 ${interpolate(f, [desde, desde + 22], [100, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(...easeOut),
    })}% 0 0)`;

  return (
    <AbsoluteFill
      style={{
        background: gradient.cajaVerde,
        justifyContent: "center",
        paddingLeft: 120,
        overflow: "hidden",
      }}
    >
      <Img
        src={staticFile(logo.isotipoBlanco)}
        style={{ position: "absolute", right: 60, bottom: -40, width: 560, opacity: 0.08 }}
      />
      <Logo
        variante="isotipoBlanco"
        ancho={40}
        style={{ position: "absolute", top: 40, right: 48 }}
      />
      <div
        style={{
          alignSelf: "flex-start",
          color: brand.white,
          fontSize: 16,
          fontWeight: weight.bold,
          letterSpacing: tracking.antetitulo,
          textTransform: "uppercase",
          border: `2px solid ${brand.white}`,
          borderRadius: radius.md,
          padding: "5px 12px",
          clipPath: barrido(2),
        }}
      >
        {antetitulo}
      </div>
      <div
        style={{
          marginTop: 18,
          color: brand.white,
          fontSize: 60,
          lineHeight: 1.1,
          fontWeight: weight.extrabold,
          maxWidth: 820,
          textWrap: "balance",
          clipPath: barrido(10),
        }}
      >
        {titular}
      </div>
    </AbsoluteFill>
  );
};
