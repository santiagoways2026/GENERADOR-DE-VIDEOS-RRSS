import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { brand, color, easeOut, radius, space, tipo, tracking, weight } from "../brand/theme";

/**
 * Un dato contado con la cifra como protagonista.
 *
 * Cuando lo que importa es un numero, una tarjeta con tres lineas lo entierra
 * entre texto. Aqui la cifra ocupa lo que tiene que ocupar y el resto la
 * acompana: encima de que va, debajo el detalle.
 *
 * La cifra puede contar desde cero, que es lo que hace que se mire.
 */
export const Cifra: React.FC<{
  /** Lo que va encima, pequeno y en lima. */
  encima?: string;
  cifra: string;
  /** La unidad, junto a la cifra pero mas pequena. */
  unidad?: string;
  /** El detalle, debajo y en placa. */
  debajo?: string;
  desde?: number;
  /** Cuenta desde cero hasta la cifra. Solo si la cifra es un numero. */
  cuenta?: number;
  cuerpo?: number;
}> = ({ encima, cifra, unidad, debajo, desde = 0, cuenta, cuerpo = 150 }) => {
  const frame = useCurrentFrame();
  const t = frame - desde;

  const entra = (retardo: number) =>
    interpolate(t, [retardo, retardo + 12], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  const numero = Number(cifra.replace(/[^\d]/g, ""));
  const visible =
    cuenta && Number.isFinite(numero) && numero > 0
      ? Math.round(
          interpolate(t, [4, 4 + cuenta], [0, numero], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(...easeOut),
          }) / 5,
        ) * 5
      : cifra;

  return (
    <Interactive.Div
      name="Cifra"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: space[2],
      }}
    >
      {encima ? (
        <div
          style={{
            ...tipo.apoyo,
            color: brand.lime,
            fontSize: Math.round(cuerpo * 0.2),
            letterSpacing: tracking.loose,
            textTransform: "uppercase",
            textShadow: "0 3px 14px rgba(14,44,31,0.6)",
            opacity: entra(0),
          }}
        >
          {encima}
        </div>
      ) : null}

      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: space[3],
          color: color.fgInverse,
          textShadow: "0 6px 26px rgba(14,44,31,0.55)",
          opacity: entra(4),
          translate: interpolate(t, [4, 18], ["0px 20px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(...easeOut),
          }),
        }}
      >
        <span
          style={{
            ...tipo.cifra,
            fontSize: cuerpo,
            lineHeight: 0.95,
          }}
        >
          {visible}
        </span>
        {unidad ? (
          <span
            style={{
              ...tipo.cifra,
              fontSize: Math.round(cuerpo * 0.36),
            }}
          >
            {unidad}
          </span>
        ) : null}
      </div>

      {debajo ? (
        <div
          style={{
            marginTop: space[2],
            backgroundColor: brand.green,
            color: color.fgInverse,
            borderRadius: radius.md,
            padding: `${space[3]}px ${space[5]}px`,
            fontSize: Math.round(cuerpo * 0.23),
            fontWeight: weight.black,
            letterSpacing: tracking.wide,
            textTransform: "uppercase",
            // Barrido lateral, como las cartelas del kit.
            clipPath: `inset(0 ${interpolate(t, [16, 40], [100, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(...easeOut),
            })}% 0 0)`,
          }}
        >
          {debajo}
        </div>
      ) : null}
    </Interactive.Div>
  );
};
