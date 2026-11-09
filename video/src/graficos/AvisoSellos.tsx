import { Easing, Img, Interactive, interpolate, staticFile, useCurrentFrame } from "remotion";
import { brand, color, easeOut, logo, tracking, weight } from "../brand/theme";

/**
 * Los dos sellos al día, en una sola tarjeta.
 *
 * La pieza original traía aquí un aviso quemado con dos frases largas. Esta
 * tarjeta lo tapa entero en la misma posición y lo reduce a la regla: dos
 * sellos al día en los últimos 100 km. Los dos huecos esperan vacíos y cada
 * sello cae cuando la voz dice "two" y "stamps", así que el dato se ve antes
 * de leerlo.
 *
 * El sello baja de más grande a su tamaño sin rebote. El anillo va girado,
 * como un sello de verdad; el isotipo no, porque el logo nunca se rota.
 */
const Hueco: React.FC<{ en: number; giro: number }> = ({ en, giro }) => {
  const frame = useCurrentFrame();
  const t = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
  return (
    <div style={{ position: "relative", width: 150, height: 150 }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: "4px dashed rgba(255, 255, 255, 0.45)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          backgroundColor: color.bg1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: interpolate(frame, [en, en + 3], [0, 1], t),
          scale: interpolate(frame, [en, en + 6], [1.5, 1], {
            ...t,
            easing: Easing.bezier(...easeOut),
          }),
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 8,
            borderRadius: "50%",
            border: `6px solid ${brand.forest}`,
            boxShadow: `inset 0 0 0 6px ${color.bg1}, inset 0 0 0 9px ${brand.forest}`,
            rotate: `${giro}deg`,
            opacity: 0.9,
          }}
        />
        <Img src={staticFile(logo.isotipo)} style={{ width: 70, height: 70 }} />
      </div>
    </div>
  );
};

export const AvisoSellos: React.FC<{
  entrada: number;
  /** Fotogramas en que cae cada sello. */
  golpes: [number, number];
  salida: number;
}> = ({ entrada, golpes, salida }) => {
  const frame = useCurrentFrame();
  const t = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
  return (
    <Interactive.Div
      name="Aviso de sellos"
      style={{
        position: "absolute",
        // Tapa entera la tarjeta quemada: 72-952 px de ancho, 250-545 de alto.
        top: 238,
        left: 60,
        width: 904,
        height: 320,
        borderRadius: 14,
        backgroundColor: brand.forest,
        padding: "0 56px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        // Aparece de golpe en el corte: la quemada entra ahí mismo y un barrido
        // la dejaría asomar.
        opacity: frame < entrada ? 0 : interpolate(frame, [salida, salida + 8], [1, 0], t),
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <span
          style={{
            fontSize: 30,
            fontWeight: weight.black,
            letterSpacing: tracking.loose,
            textTransform: "uppercase",
            color: brand.lime,
          }}
        >
          Last 100 km
        </span>
        <span
          style={{
            fontSize: 88,
            lineHeight: 0.98,
            fontWeight: weight.extrabold,
            letterSpacing: "-0.02em",
            color: color.fgInverse,
          }}
        >
          2 stamps
          <br />a day
        </span>
      </div>
      <div style={{ display: "flex", gap: 24 }}>
        <Hueco en={golpes[0]} giro={-9} />
        <Hueco en={golpes[1]} giro={7} />
      </div>
    </Interactive.Div>
  );
};
