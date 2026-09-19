import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import {
  brand,
  color,
  easeOut,
  radius,
  space,
  tracking,
  weight,
} from "../brand/theme";

/**
 * Rotulo de llamada con flecha, para YouTube.
 *
 * En Instagram el CTA no va dentro de la pieza: lo pone quien publica. En
 * YouTube es distinto, porque la llamada senala algo que esta en la propia
 * pantalla, los comentarios o el video de debajo, y ahi una flecha dibujada
 * hace un trabajo que ningun pie de publicacion puede hacer.
 *
 * La flecha se dibuja, no se escribe: los emojis y los caracteres
 * geometricos no estan en Montserrat y saldrian como una caja vacia.
 *
 * El movimiento es el de la marca, desplazamiento corto y fundido, sin
 * rebote. Se repite en bucle para que siga llamando la atencion durante los
 * segundos que el rotulo aguanta en pantalla.
 */

/** 896 ms del kit, a 30 fps. */
const BARRIDO = 27;
/** Cada cuantos fotogramas se repite el gesto de la flecha. */
const CICLO = 34;

export const Llamada: React.FC<{
  texto: string;
  desde?: number;
  /** Hacia donde apunta. `abajo` para el video siguiente o los comentarios. */
  flecha?: "abajo" | "ninguna";
  tono?: "olivo" | "lima" | "blanco";
  cuerpo?: number;
}> = ({ texto, desde = 0, flecha = "abajo", tono = "olivo", cuerpo = 44 }) => {
  const frame = useCurrentFrame();
  const t = frame - desde;

  const tonos = {
    olivo: { bg: brand.green, fg: color.fgInverse },
    lima: { bg: brand.lime, fg: color.fgOnLime },
    blanco: { bg: color.bg1, fg: brand.forest },
  }[tono];

  // El gesto: baja y se apaga, y vuelve a empezar.
  const ciclo = ((t % CICLO) + CICLO) % CICLO;
  const baja = interpolate(ciclo, [0, CICLO * 0.6], [0, 14], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(...easeOut),
  });
  const vive = interpolate(ciclo, [0, CICLO * 0.25, CICLO * 0.85], [0.6, 1, 0.6], {
    extrapolateRight: "clamp",
  });

  return (
    <Interactive.Div
      name="Llamada"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: space[3],
      }}
    >
      <div
        style={{
          backgroundColor: tonos.bg,
          color: tonos.fg,
          borderRadius: radius.md,
          padding: `${space[4]}px ${space[6]}px`,
          fontSize: cuerpo,
          fontWeight: weight.black,
          letterSpacing: tracking.wide,
          textTransform: "uppercase",
          textAlign: "center",
          lineHeight: 1.15,
          // El texto puede traer saltos de linea propios.
          whiteSpace: "pre-line",
          // Barrido lateral, como las cartelas: la marca no usa fundidos
          // para los bloques de texto.
          clipPath: `inset(0 ${interpolate(t, [0, BARRIDO], [100, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(...easeOut),
          })}% 0 0)`,
        }}
      >
        {texto}
      </div>

      {flecha === "abajo" ? (
        <svg
          width="78"
          height="62"
          viewBox="0 0 56 44"
          style={{
            translate: `0px ${baja}px`,
            opacity:
              vive *
              interpolate(t, [BARRIDO - 6, BARRIDO + 8], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
          }}
        >
          <path
            d="M28 4 V34 M12 22 L28 38 L44 22"
            fill="none"
            stroke={tonos.bg}
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
    </Interactive.Div>
  );
};
