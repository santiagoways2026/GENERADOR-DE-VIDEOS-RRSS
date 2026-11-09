import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { brand, color, easeOut, tracking, weight } from "../brand/theme";

/**
 * Los mínimos de la Compostela en una tarjeta que asoma por detrás de la
 * persona. Va en la capa entre el fondo y el recorte, así que el pelo y el
 * hombro la tapan y gana profundidad.
 *
 * Sale de detrás de la cabeza hacia la izquierda y vuelve a esconderse al
 * terminar. Cada cifra se enciende cuando la voz la dice.
 *
 * El pelo se abre hacia abajo, así que la tarjeta va alta y compacta, y la
 * fuente arriba: lo de abajo es lo primero que se tapa.
 */
const Cifra: React.FC<{ cifra: string; modo: string; en: number }> = ({ cifra, modo, en }) => {
  const frame = useCurrentFrame();
  const t = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        opacity: interpolate(frame, [en, en + 8], [0.18, 1], t),
        translate: interpolate(frame, [en, en + 12], ["0px 18px", "0px 0px"], {
          ...t,
          easing: Easing.bezier(...easeOut),
        }),
      }}
    >
      <span
        style={{
          fontSize: 72,
          lineHeight: 1,
          fontWeight: weight.black,
          letterSpacing: "-0.03em",
          color: brand.forest,
        }}
      >
        {cifra}
        <span style={{ fontSize: 36, letterSpacing: 0, marginLeft: 6 }}>km</span>
      </span>
      <span
        style={{
          marginTop: 6,
          backgroundColor: brand.green,
          color: color.fgInverse,
          fontSize: 26,
          fontWeight: weight.black,
          letterSpacing: tracking.wide,
          textTransform: "uppercase",
          padding: "6px 14px 8px",
          borderRadius: "0 6px 6px 6px",
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
}> = ({ entrada, aPie, enBici, salida, fuente }) => {
  const frame = useCurrentFrame();
  const t = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
  const ease = Easing.bezier(...easeOut);
  return (
    <Interactive.Div
      name="Distancia detrás"
      style={{
        position: "absolute",
        top: 428,
        left: 56,
        // Estrecha a propósito: solo el borde derecho se esconde tras el pelo.
        // El contenido cabe en los primeros 270 px, que nunca quedan tapados.
        width: 370,
        padding: "28px 28px 26px",
        backgroundColor: color.bg1,
        borderRadius: 14,
        boxShadow: "0 18px 40px rgba(24, 72, 52, 0.28)",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        // Sale de detrás de la cabeza: entra desde la derecha y vuelve allí.
        translate:
          frame < salida
            ? interpolate(frame, [entrada, entrada + 16], ["260px 0px", "0px 0px"], { ...t, easing: ease })
            : interpolate(frame, [salida, salida + 12], ["0px 0px", "300px 0px"], { ...t, easing: ease }),
        opacity:
          frame < salida
            ? interpolate(frame, [entrada, entrada + 8], [0, 1], t)
            : interpolate(frame, [salida + 4, salida + 12], [1, 0], t),
      }}
    >
      <span
        style={{
          alignSelf: "flex-start",
          backgroundColor: brand.forest,
          color: brand.lime,
          fontSize: 24,
          fontWeight: weight.black,
          letterSpacing: tracking.loose,
          textTransform: "uppercase",
          padding: "6px 12px",
          borderRadius: 6,
        }}
      >
        To qualify
      </span>
      <span
        style={{
          fontSize: 22,
          lineHeight: 1.3,
          fontWeight: weight.bold,
          color: brand.forestSoft,
          letterSpacing: tracking.wide,
          textTransform: "uppercase",
          maxWidth: 270,
          marginBottom: 6,
        }}
      >
        {fuente}
      </span>
      <Cifra cifra="100" modo="Walking" en={aPie} />
      <span style={{ fontSize: 26, fontWeight: weight.bold, color: brand.forestSoft }}>or</span>
      <Cifra cifra="200" modo="Cycling" en={enBici} />
    </Interactive.Div>
  );
};
