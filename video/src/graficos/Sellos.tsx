import { Easing, Img, Interactive, interpolate, staticFile, useCurrentFrame } from "remotion";
import { brand, color, easeOut, logo, tracking, weight } from "../brand/theme";
import { barrido, RELEVO } from "../componentes/Cartela";

/**
 * Dos sellos que se estampan en la credencial, uno con cada palabra.
 *
 * El sello baja de algo más grande a su tamaño y se queda: sin rebote. El
 * anillo va un poco girado, como un sello de verdad; el isotipo dentro no,
 * porque el logo nunca se rota. El manual reserva el isotipo suelto para
 * "sellos pequeños", que es justo esto.
 */
const Sello: React.FC<{ en: number; giro: number }> = ({ en, giro }) => {
  const frame = useCurrentFrame();
  const t = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
  return (
    <div
      style={{
        position: "relative",
        width: 156,
        height: 156,
        opacity: interpolate(frame, [en, en + 3], [0, 1], t),
        scale: interpolate(frame, [en, en + 6], [1.45, 1], {
          ...t,
          easing: Easing.bezier(...easeOut),
        }),
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: `7px solid ${brand.forest}`,
          boxShadow: `inset 0 0 0 7px ${color.bg1}, inset 0 0 0 10px ${brand.forest}`,
          rotate: `${giro}deg`,
          opacity: 0.88,
        }}
      />
      <Img
        src={staticFile(logo.isotipo)}
        style={{ position: "absolute", width: 78, height: 78, left: 39, top: 39 }}
      />
    </div>
  );
};

export const Sellos: React.FC<{
  /** Fotograma en que la placa empieza a entrar. */
  desde: number;
  /** Fotogramas en que cae cada sello: los de "two" y "stamps". */
  golpes: [number, number];
  texto: string;
  salida: number;
}> = ({ desde, golpes, texto, salida }) => {
  const frame = useCurrentFrame();
  return (
    <Interactive.Div
      name="Sellos"
      style={{
        position: "absolute",
        top: 1480,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity: interpolate(frame, [salida, salida + 8], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      {/* Las dos placas al mismo ancho: leen como una sola credencial. */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "stretch" }}>
      <div
        style={{
          backgroundColor: color.bg1,
          padding: "20px 44px",
          borderRadius: "6px 6px 0 0",
          display: "flex",
          justifyContent: "center",
          gap: 56,
          clipPath: barrido(frame, desde),
        }}
      >
        <Sello en={golpes[0]} giro={-9} />
        <Sello en={golpes[1]} giro={7} />
      </div>
      <div
        style={{
          backgroundColor: brand.green,
          padding: "14px 40px 16px",
          borderRadius: "0 0 6px 6px",
          clipPath: barrido(frame, desde + RELEVO),
        }}
      >
        <span
          style={{
            display: "block",
            fontSize: 40,
            lineHeight: 1.1,
            fontWeight: weight.black,
            letterSpacing: tracking.wide,
            textTransform: "uppercase",
            color: color.fgInverse,
            whiteSpace: "nowrap",
            textAlign: "center",
          }}
        >
          {texto}
        </span>
      </div>
      </div>
    </Interactive.Div>
  );
};
