import { AbsoluteFill, Composition } from "remotion";
import { useFuentesDeMarca } from "./fuentes";
import { brand, format, fps } from "./brand/theme";

/**
 * Banco de pruebas de tipografia.
 *
 * Cada muestra pide su familia **sin fallback**. Si alguna sale en serif,
 * esa fuente no esta cargada y las piezas se estan renderizando con otra
 * letra: es lo que paso durante un tiempo sin que nadie se diera cuenta,
 * porque la sans-serif de respaldo tambien es una grotesca y en pantalla
 * pasaba por buena.
 *
 *   npx remotion still Fuente prueba.png
 */
const MUESTRA = "WALK LIGHT. Handpicked 780";

const Banco: React.FC = () => {
  const listas = useFuentesDeMarca();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: brand.forest,
        padding: 60,
        gap: 22,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div style={{ fontFamily: "monospace", fontSize: 24, color: brand.lime }}>
        caras registradas: {listas ? document.fonts.size : "?"}
        {" · deben ser 8"}
      </div>
      {(
        [
          ["Montserrat", 800],
          ["Montserrat", 900],
          ["Manrope", 700],
          ["Manrope", 800],
        ] as const
      ).map(([familia, peso]) => (
        <div key={`${familia}-${peso}`} style={{ color: "#fff" }}>
          <div style={{ fontFamily: "monospace", fontSize: 22, color: brand.lime }}>
            {familia} {peso}
          </div>
          <div
            style={{
              fontFamily: `"${familia}"`,
              fontWeight: peso,
              fontSize: 72,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
            }}
          >
            {MUESTRA}
          </div>
        </div>
      ))}
    </AbsoluteFill>
  );
};

export const PruebaFuente = () => (
  <Composition
    id="Fuente"
    component={Banco}
    durationInFrames={30}
    fps={fps}
    width={format.reels.width}
    height={format.reels.height}
  />
);
