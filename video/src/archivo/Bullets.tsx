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
 */
export const Bullets: React.FC<{
  items: string[];
  desde?: number;
  /** Fotogramas entre una entrada y la siguiente. */
  relevo?: number;
}> = ({ items, desde = 0, relevo = 26 }) => {
  const frame = useCurrentFrame();

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "stretch", gap: space[3] }}>
      {items.map((texto, i) => {
        const t = frame - desde - i * relevo;
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
                backgroundColor: brand.lime,
                color: color.fgOnLime,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: fontSize["2xl"],
                fontWeight: weight.black,
              }}
            >
              {i + 1}
            </div>
            <div
              style={{
                fontSize: 40,
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
