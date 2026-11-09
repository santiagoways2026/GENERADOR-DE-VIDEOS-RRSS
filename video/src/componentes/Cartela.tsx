import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import {
  brand,
  easeOut,
  fontSize,
  margin,
  space,
  tracking,
  weight,
  paleta,
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
  /** Distancia al borde superior. En redes, por debajo de la interfaz. */
  top?: number;
  /** Color del texto de la placa blanca. Bosque por defecto. */
  tinta?: string;
}> = ({ eyebrow, principal, secundaria, desde = 0, tono = "olivo", top = 200, tinta = brand.forest }) => {
  const frame = useCurrentFrame();

  const tEyebrow = desde;
  const tPrincipal = desde + (eyebrow ? RELEVO : 0);
  const tSecundaria = tPrincipal + RELEVO;

  return (
    <Interactive.Div
      name="Cartela"
      style={{
        position: "absolute",
        top,
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
            backgroundColor: paleta.sendero,
            color: brand.lime,
            fontSize: fontSize.lg,
            fontWeight: weight.extrabold,
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

      {/* Brandbook 2027, texto sobre vídeo: el dato en blanco y el complemento
          con el subrayado SW (placa verde Ways, letra blanca). Sin placa blanca. */}
      <span
        style={{
          display: "block",
          // Cabe siempre en el ancho útil (unos 0,62 em por letra).
          fontSize: Math.min(84, Math.floor(900 / (frase(principal).length * 0.62))),
          lineHeight: 1.1,
          fontWeight: weight.extrabold,
          letterSpacing: "-0.015em",
          color: brand.white,
          WebkitTextStroke: `10px ${paleta.grafito}`,
          paintOrder: "stroke fill",
          whiteSpace: "nowrap",
          clipPath: barrido(frame, tPrincipal),
        }}
      >
        {frase(principal)}
      </span>

      {secundaria ? (
        <span
          style={{
            display: "block",
            marginTop: 6,
            backgroundColor: paleta.verdeWays,
            padding: "4px 18px 8px",
            borderRadius: 8,
            fontSize: 46,
            lineHeight: 1.1,
            fontWeight: weight.extrabold,
            color: brand.white,
            whiteSpace: "nowrap",
            clipPath: barrido(frame, tSecundaria),
          }}
        >
          {frase(secundaria)}
        </span>
      ) : null}
    </Interactive.Div>
  );
};

/** Brandbook 2027: minúscula de frase. Un texto escrito todo en mayúsculas
 * pasa a "Primera mayúscula"; si ya mezcla, se respeta. */
const frase = (t: string) =>
  t === t.toUpperCase() && /[A-ZÁÉÍÓÚÑ]{2}/.test(t) ? t.charAt(0) + t.slice(1).toLowerCase() : t;
