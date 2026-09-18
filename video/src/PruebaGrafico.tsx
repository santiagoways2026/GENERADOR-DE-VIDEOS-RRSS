import { AbsoluteFill, Composition } from "remotion";
import "./fuentes";
import { brand, fontFamily, format, fps } from "./brand/theme";
import { Calendario } from "./graficos/Calendario";

/** Banco de pruebas: cada grafico aislado sobre un fondo neutro de marca. */
const Banco: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundColor: brand.forest,
      fontFamily,
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Calendario />
  </AbsoluteFill>
);

export const PruebaGrafico = () => (
  <Composition
    id="Grafico"
    component={Banco}
    durationInFrames={4 * fps}
    fps={fps}
    width={format.reels.width}
    height={format.reels.height}
  />
);
