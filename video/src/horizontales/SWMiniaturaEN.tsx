import { AbsoluteFill, Composition, OffthreadVideo, staticFile } from "remotion";
import "../fuentes";

import { brand } from "../brand/theme";
import { Logo } from "../componentes/Logo";

/**
 * Propuesta de miniatura para YouTube.
 *
 * Sale de un fotograma real de la pieza, el de las viajeras ensenando su
 * Compostela (00:02:11:27 del montaje de origen). No se retoca ninguna cara
 * ni se monta una escena que no ocurrio.
 *
 * El texto va abajo porque las caras ocupan la banda central: taparlas seria
 * perder justo lo que hace clicar.
 */
const FUENTE = "Montserrat, Manrope, Poppins, sans-serif";

export const SWMiniaturaEN: React.FC<{ sinLogo?: boolean }> = ({ sinLogo }) => (
  <AbsoluteFill style={{ backgroundColor: brand.forest }}>
    <OffthreadVideo
      src={staticFile("montajes/testimonios-EN.mp4")}
      trimBefore={Math.round(131.9 * 30)}
      muted
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(to top, rgba(10,26,18,0.88) 0%, rgba(10,26,18,0.55) 22%, rgba(10,26,18,0) 46%)",
      }}
    />
    <AbsoluteFill
      style={{ justifyContent: "flex-end", alignItems: "flex-start", padding: 56 }}
    >
      <div
        style={{
          fontFamily: FUENTE,
          fontWeight: 900,
          fontSize: 78,
          lineHeight: 1.12,
          letterSpacing: "-0.025em",
          color: brand.white,
          textShadow: "0 3px 24px rgba(8,22,15,0.6)",
        }}
      >
        Your Camino
        <br />
        <span
          style={{
            backgroundColor: brand.green,
            padding: "6px 18px",
            borderRadius: 8,
            display: "inline-block",
          }}
        >
          starts here
        </span>
      </div>
    </AbsoluteFill>
    {sinLogo ? null : (
      <AbsoluteFill
        style={{ justifyContent: "flex-start", alignItems: "flex-end", padding: 44 }}
      >
        <Logo variante="blanco" ancho={188} style={{ opacity: 0.95 }} />
      </AbsoluteFill>
    )}
  </AbsoluteFill>
);

export const SWMiniaturaENComposition: React.FC = () => (
  <Composition
    id="SWMiniaturaEN"
    component={SWMiniaturaEN}
    durationInFrames={1}
    fps={30}
    width={1280}
    height={720}
  />
);
