import { Interactive, interpolate, useCurrentFrame } from "remotion";
import { brand, color, tracking, weight } from "../brand/theme";
import { barrido, RELEVO } from "../componentes/Cartela";

/**
 * Los dos mínimos de la Compostela, cada uno cuando la voz lo dice.
 *
 * Mismo lenguaje que la cartela: placa blanca con la cifra en bosque y placa
 * olivo con el complemento en mayúsculas. Van en pareja para que se lean
 * como alternativa, y con la fuente debajo porque son cifras.
 */
const Dato: React.FC<{ cifra: string; modo: string; desde: number }> = ({ cifra, modo, desde }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
      <div
        style={{
          backgroundColor: color.bg1,
          padding: "14px 36px 18px",
          borderRadius: "6px 6px 0 0",
          clipPath: barrido(frame, desde),
        }}
      >
        <span
          style={{
            display: "block",
            fontSize: 76,
            lineHeight: 1,
            fontWeight: weight.extrabold,
            letterSpacing: "-0.015em",
            color: brand.forest,
            whiteSpace: "nowrap",
          }}
        >
          {cifra}
        </span>
      </div>
      <div
        style={{
          backgroundColor: brand.green,
          padding: "12px 36px 14px",
          borderRadius: "0 6px 6px 6px",
          clipPath: barrido(frame, desde + RELEVO),
        }}
      >
        <span
          style={{
            display: "block",
            fontSize: 36,
            lineHeight: 1.1,
            fontWeight: weight.black,
            letterSpacing: tracking.wide,
            textTransform: "uppercase",
            color: color.fgInverse,
            whiteSpace: "nowrap",
          }}
        >
          {modo}
        </span>
      </div>
    </div>
  );
};

export const Distancias: React.FC<{
  /** Fotograma en que la voz dice la primera cifra. */
  aPie: number;
  /** Fotograma en que dice la segunda. */
  enBici: number;
  /** Fotograma en que empieza a retirarse. */
  salida: number;
  fuente: string;
}> = ({ aPie, enBici, salida, fuente }) => {
  const frame = useCurrentFrame();
  return (
    <Interactive.Div
      name="Distancias"
      style={{
        position: "absolute",
        top: 1490,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
        opacity: interpolate(frame, [salida, salida + 8], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      <div style={{ display: "flex", gap: 32 }}>
        <Dato cifra="100 km" modo="Walking" desde={aPie} />
        <Dato cifra="200 km" modo="Cycling" desde={enBici} />
      </div>
      <div
        style={{
          backgroundColor: brand.forest,
          color: color.fgInverse,
          fontSize: 26,
          fontWeight: weight.bold,
          letterSpacing: tracking.loose,
          textTransform: "uppercase",
          padding: "8px 16px",
          borderRadius: 6,
          opacity: interpolate(frame, [aPie + 10, aPie + 22], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {fuente}
      </div>
    </Interactive.Div>
  );
};
