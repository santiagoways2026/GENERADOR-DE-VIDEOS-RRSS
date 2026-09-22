import { AbsoluteFill, Composition } from "remotion";
import "@fontsource/montserrat/latin-800.css";
import "@fontsource/montserrat/latin-900.css";
import "@fontsource/manrope/latin-800.css";
import "@fontsource/poppins/latin-800.css";
import "@fontsource/poppins/latin-900.css";
import { brand } from "./brand/theme";

/**
 * Muestra de las tres tipograficas oficiales, para decidir cual es la de las
 * referencias. Solo sirve para elegir; no entra en ninguna pieza.
 *
 * Manrope llega hasta el 800, no tiene 900.
 */
const CASOS: { nombre: string; familia: string; peso: number }[] = [
  { nombre: "Montserrat 900", familia: "Montserrat", peso: 900 },
  { nombre: "Manrope 800", familia: "Manrope", peso: 800 },
  { nombre: "Poppins 900", familia: "Poppins", peso: 900 },
];

export const SWMuestraFuentes: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: brand.forest, padding: 44 }}>
    {CASOS.map((c) => (
      <div key={c.nombre} style={{ marginBottom: 26 }}>
        <div
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: 17,
            fontWeight: 800,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: brand.lime,
            marginBottom: 8,
          }}
        >
          {c.nombre}
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span
            style={{
              fontFamily: `${c.familia}, sans-serif`,
              fontSize: 62,
              lineHeight: 1.02,
              fontWeight: c.peso,
              letterSpacing: "-0.02em",
              textTransform: "uppercase",
              color: brand.white,
              marginRight: 14,
            }}
          >
            Always a
          </span>
          <span
            style={{
              fontFamily: `${c.familia}, sans-serif`,
              fontSize: 62,
              lineHeight: 1.02,
              fontWeight: c.peso,
              letterSpacing: "-0.02em",
              textTransform: "uppercase",
              color: brand.white,
              backgroundColor: brand.green,
              padding: "9px 16px",
              borderRadius: 6,
            }}
          >
            private room
          </span>
        </div>
      </div>
    ))}
  </AbsoluteFill>
);

export const SWMuestraFuentesComposition: React.FC = () => (
  <Composition
    id="SWMuestraFuentes"
    component={SWMuestraFuentes}
    durationInFrames={1}
    fps={30}
    width={1280}
    height={720}
  />
);
