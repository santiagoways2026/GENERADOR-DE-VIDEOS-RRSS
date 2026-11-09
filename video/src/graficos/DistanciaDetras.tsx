import { Easing, interpolate, useCurrentFrame } from "remotion";
import { brand, color, easeOut, tracking, weight } from "../brand/theme";
import { CajaDetras } from "../componentes/CajaDetras";

/**
 * Los mínimos de la Compostela, en una caja que asoma por detrás de Hilary.
 * Cada cifra se enciende cuando la voz la dice.
 *
 * El pelo se abre hacia abajo, así que la caja va alta y compacta, y la
 * fuente arriba: lo de abajo es lo primero que se tapa.
 */
const Cifra: React.FC<{ cifra: string; modo: string; en: number }> = ({ cifra, modo, en }) => {
  const frame = useCurrentFrame();
  const t = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: 12,
        opacity: interpolate(frame, [en, en + 10], [0.22, 1], t),
        translate: interpolate(frame, [en, en + 14], ["0px 12px", "0px 0px"], {
          ...t,
          easing: Easing.bezier(...easeOut),
        }),
      }}
    >
      <span
        style={{
          fontSize: 64,
          lineHeight: 1,
          fontWeight: weight.extrabold,
          letterSpacing: "-0.03em",
          color: brand.forest,
        }}
      >
        {cifra}
        <span style={{ fontSize: 30, letterSpacing: 0, marginLeft: 4 }}>km</span>
      </span>
      <span
        style={{
          fontSize: 24,
          fontWeight: weight.extrabold,
          letterSpacing: tracking.wide,
          textTransform: "uppercase",
          // Texto verde sobre blanco: verde sendero, nunca el olivo.
          color: "#506718",
        }}
      >
        {modo}
      </span>
    </div>
  );
};

export const DistanciaDetras: React.FC<{
  entrada: number;
  aPie: number;
  enBici: number;
  salida: number;
  fuente: string;
}> = ({ entrada, aPie, enBici, salida, fuente }) => (
  <CajaDetras nombre="Distancia detrás" entrada={entrada} salida={salida} top={440} left={56} width={330}>
    <span
      style={{
        fontSize: 20,
        fontWeight: weight.bold,
        letterSpacing: tracking.wide,
        textTransform: "uppercase",
        color: color.fg3,
        marginBottom: 4,
      }}
    >
      {fuente}
    </span>
    <Cifra cifra="100" modo="Walk" en={aPie} />
    <Cifra cifra="200" modo="Bike" en={enBici} />
  </CajaDetras>
);
