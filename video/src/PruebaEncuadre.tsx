import { AbsoluteFill, Composition, Sequence } from "remotion";
import "./fuentes";
import {
  brand,
  color,
  fontFamily,
  fontSize,
  format,
  fps,
  lineHeight,
  margin,
  tracking,
  weight,
} from "./brand/theme";
import { Clip } from "./componentes/Clip";
import { Logo } from "./componentes/Logo";

const TITULAR = "2027 = Año Santo";

/** Opcion A: el clip llena la pantalla. Se recorta a los lados y se amplia. */
const Recorte: React.FC = () => (
  <AbsoluteFill style={{ fontFamily }}>
    <Clip src="brutos/A1-obradoiro.mp4" duracion={90} overlay={0.34} />
    <AbsoluteFill style={{ padding: margin, justifyContent: "flex-start" }}>
      <div
        style={{
          marginTop: 180,
          fontSize: fontSize.impact,
          fontWeight: weight.black,
          lineHeight: lineHeight.tight,
          letterSpacing: tracking.tight,
          textTransform: "uppercase",
          color: color.fgInverse,
        }}
      >
        {TITULAR}
      </div>
    </AbsoluteFill>
    <Logo variante="blanco" ancho={300} style={{ position: "absolute", left: margin, bottom: margin }} />
  </AbsoluteFill>
);

/** Opcion B: el clip conserva su proporcion y la marca ocupa el resto. */
const Banda: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: brand.green, fontFamily }}>
    <AbsoluteFill style={{ padding: margin, justifyContent: "flex-start" }}>
      <div
        style={{
          marginTop: 120,
          fontSize: fontSize.impact,
          fontWeight: weight.black,
          lineHeight: lineHeight.tight,
          letterSpacing: tracking.tight,
          textTransform: "uppercase",
          color: color.fgInverse,
        }}
      >
        {TITULAR}
      </div>
    </AbsoluteFill>

    {/* El clip en su proporcion nativa, sin ampliar ni un pixel. */}
    <div
      style={{
        position: "absolute",
        top: 620,
        left: 0,
        width: format.reels.width,
        height: Math.round((format.reels.width * 9) / 16),
        overflow: "hidden",
      }}
    >
      <Clip src="brutos/A1-obradoiro.mp4" duracion={90} overlay={0} zoom={1} />
    </div>

    <Logo variante="blanco" ancho={300} style={{ position: "absolute", left: margin, bottom: margin }} />
  </AbsoluteFill>
);

const Comparativa: React.FC = () => (
  <AbsoluteFill>
    <Sequence durationInFrames={90} name="A · Recorte a pantalla completa">
      <Recorte />
    </Sequence>
    <Sequence from={90} durationInFrames={90} name="B · Proporción nativa">
      <Banda />
    </Sequence>
  </AbsoluteFill>
);

export const PruebaEncuadre = () => (
  <Composition
    id="Encuadre"
    component={Comparativa}
    durationInFrames={180}
    fps={fps}
    width={format.reels.width}
    height={format.reels.height}
  />
);
