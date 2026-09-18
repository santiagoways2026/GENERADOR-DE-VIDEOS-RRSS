import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import {
  brand,
  color,
  easeOut,
  fontSize,
  margin,
  space,
  tracking,
  weight,
} from "../brand/theme";

/**
 * Cartela de texto del reel, calcada del kit de motion graphics.
 *
 * Son dos placas encajadas: la de arriba blanca con el texto en bosque, la
 * de abajo olivo con el texto en blanco. Las esquinas se responden entre si
 * (6px arriba, 0 en el vertice donde se tocan) para que lean como una sola
 * pieza en dos tiempos.
 *
 * Entran con el barrido del kit, `swWipe`: la placa se descubre de izquierda
 * a derecha con un clip-path, no con un fundido. La segunda entra medio
 * segundo despues, como en las cartelas originales.
 */

/** 896 ms del kit, a 30 fps. */
const BARRIDO = 27;
/** 480 ms de retardo entre placas. */
const RELEVO = 14;

const barrido = (frame: number, desde: number) =>
  `inset(0 ${interpolate(frame, [desde, desde + BARRIDO], [100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...easeOut),
  })}% 0 0)`;

export const Cartela: React.FC<{
  /** Chip pequeno sobre las placas. Opcional. */
  eyebrow?: string;
  /** Placa blanca, texto en bosque. Es la que manda. */
  principal: string;
  /** Placa olivo, texto en blanco. */
  secundaria?: string;
  desde?: number;
  /** Tono de la placa inferior: olivo por defecto, lima para rematar. */
  tono?: "olivo" | "lima" | "bosque";
}> = ({ eyebrow, principal, secundaria, desde = 0, tono = "olivo" }) => {
  const frame = useCurrentFrame();

  const inferior = {
    olivo: { bg: brand.green, fg: color.fgInverse },
    lima: { bg: brand.lime, fg: color.fgOnLime },
    bosque: { bg: brand.forest, fg: color.fgInverse },
  }[tono];

  const tEyebrow = desde;
  const tPrincipal = desde + (eyebrow ? RELEVO : 0);
  const tSecundaria = tPrincipal + RELEVO;

  return (
    <Interactive.Div
      name="Cartela"
      style={{
        position: "absolute",
        top: 200,
        left: margin,
        right: margin,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      {eyebrow ? (
        <div
          style={{
            backgroundColor: brand.forest,
            color: brand.lime,
            fontSize: fontSize.lg,
            fontWeight: weight.black,
            letterSpacing: tracking.loose,
            textTransform: "uppercase",
            padding: `${space[2]}px ${space[4]}px`,
            borderRadius: "6px 6px 0 0",
            marginBottom: 2,
            clipPath: barrido(frame, tEyebrow),
          }}
        >
          {eyebrow}
        </div>
      ) : null}

      {/* Placa blanca: el dato, en bosque y peso 800. */}
      <div
        style={{
          backgroundColor: color.bg1,
          padding: "20px 44px 24px",
          borderRadius: eyebrow ? "0 6px 6px 0" : "6px 6px 0 0",
          clipPath: barrido(frame, tPrincipal),
        }}
      >
        <span
          style={{
            display: "block",
            fontSize: 84,
            lineHeight: 1,
            fontWeight: weight.extrabold,
            letterSpacing: "-0.015em",
            color: brand.forest,
            whiteSpace: "nowrap",
          }}
        >
          {principal}
        </span>
      </div>

      {secundaria ? (
        <div
          style={{
            backgroundColor: inferior.bg,
            padding: "16px 44px 20px",
            borderRadius: "0 6px 6px 6px",
            clipPath: barrido(frame, tSecundaria),
          }}
        >
          <span
            style={{
              display: "block",
              fontSize: 44,
              lineHeight: 1.15,
              fontWeight: weight.medium,
              letterSpacing: "0.01em",
              color: inferior.fg,
              whiteSpace: "nowrap",
            }}
          >
            {secundaria}
          </span>
        </div>
      ) : null}
    </Interactive.Div>
  );
};
