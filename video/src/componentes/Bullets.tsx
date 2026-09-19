import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import {
  brand,
  color,
  easeOut,
  fontSize,
  radius,
  shadow,
  space,
  tracking,
  weight,
} from "../brand/theme";

/**
 * Los tres servicios, uno detras de otro.
 *
 * Cada uno entra por su cuenta y con aire suficiente para leerse: son el
 * argumento comercial de la pieza, asi que mandan sobre el metraje en
 * lugar de acompanarlo.
 *
 * La marca de cada linea puede ser el numero o un check. El numero ordena
 * una lista; el check afirma que algo ya esta resuelto, que es lo que hace
 * falta cuando lo que se vende es no tener que ocuparse de nada.
 */
export const Bullets: React.FC<{
  items: string[];
  desde?: number;
  /** Fotogramas entre una entrada y la siguiente. */
  relevo?: number;
  marca?: "numero" | "check";
  /** Cuerpo del texto. Se baja en ingles, donde las frases son mas largas
   *  que en espanol y si no se parten en dos lineas. */
  cuerpo?: number;
  /** Fotograma de entrada de cada linea, uno a uno. Sustituye al relevo fijo
   *  cuando las tarjetas tienen que caer sobre las palabras de la locucion,
   *  que no llegan a intervalos regulares. */
  tiempos?: number[];
}> = ({
  items,
  desde = 0,
  relevo = 26,
  marca = "numero",
  cuerpo = 40,
  tiempos,
}) => {
  const frame = useCurrentFrame();

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "stretch", gap: space[3] }}>
      {items.map((texto, i) => {
        const t = frame - (tiempos ? tiempos[i] : desde + i * relevo);
        return (
          <Interactive.Div
            key={texto}
            name={`Bullet ${i + 1}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: space[6],
              backgroundColor: color.bg1,
              borderRadius: radius.lg,
              boxShadow: shadow.raised,
              padding: `${space[4]}px ${space[6]}px ${space[4]}px ${space[4]}px`,
              opacity: interpolate(t, [0, 9], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              translate: interpolate(t, [0, 16], ["-40px 0px", "0px 0px"], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(...easeOut),
              }),
            }}
          >
            <div
              style={{
                flex: "none",
                width: 76,
                height: 76,
                borderRadius: radius.pill,
                backgroundColor: brand.green,
                color: color.fgInverse,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: fontSize["2xl"],
                fontWeight: weight.black,
              }}
            >
              {marca === "check" ? (
                <svg width="38" height="38" viewBox="0 0 24 24">
                  <path
                    d="M4.5 12.5 L9.5 17.5 L19.5 6.5"
                    fill="none"
                    stroke={color.fgInverse}
                    strokeWidth="3.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    // El trazo se dibuja con la tarjeta, no aparece de golpe.
                    strokeDasharray="26"
                    strokeDashoffset={interpolate(t, [8, 22], [26, 0], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                      easing: Easing.bezier(...easeOut),
                    })}
                  />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            <div
              style={{
                fontSize: cuerpo,
                fontWeight: weight.extrabold,
                letterSpacing: tracking.tight,
                color: brand.forest,
                textTransform: "uppercase",
                lineHeight: 1.1,
              }}
            >
              {texto}
            </div>
          </Interactive.Div>
        );
      })}
    </div>
  );
};
