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
 * a derecha con un clip-path, no con un fundido. Cada placa entra medio
 * segundo despues de la anterior, como en las cartelas originales.
 *
 * Tanto `principal` como `secundaria` admiten un array de lineas. Cada linea
 * es su propia placa y barre por separado, que es como se escalonan en el
 * kit. Hace falta para los rotulos en ingles, bastante mas largos que los
 * espanoles: "In 2027, Spain opens a door it keeps sealed for years" no cabe
 * de una sola tirada en 1080 px de ancho.
 */

/** 896 ms del kit, a 30 fps. */
const BARRIDO = 27;
/** 480 ms de retardo entre placas. */
const RELEVO = 14;

/** Ancho util de la cartela: el lienzo menos los margenes y el padding. */
const ANCHO_TEXTO = 1080 - margin * 2 - 44 * 2;

/**
 * Cuerpo que cabe en una linea, estimado por numero de caracteres.
 *
 * Montserrat en peso 800 ronda 0,62 em de ancho medio; en 900 y mayusculas,
 * con el tracking abierto de las placas inferiores, sube a 0,70 em. Medir de
 * verdad exigiria el DOM, y el resultado cambiaria entre el Studio y el
 * render; una estimacion fija sale igual en los dos.
 */
const cuerpo = (lineas: string[], base: number, factor: number) => {
  const masLarga = Math.max(...lineas.map((l) => l.length), 1);
  return Math.min(base, Math.floor(ANCHO_TEXTO / (masLarga * factor)));
};

const enLineas = (t: string | string[]) => (Array.isArray(t) ? t : [t]);

const barrido = (frame: number, desde: number) =>
  `inset(0 ${interpolate(frame, [desde, desde + BARRIDO], [100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...easeOut),
  })}% 0 0)`;

/** Las esquinas encadenan las placas: solo la primera y la ultima redondean
 *  por fuera, las de en medio se cierran contra las vecinas. */
const esquinas = (i: number, total: number) => {
  if (total === 1) return "6px 6px 6px 6px";
  if (i === 0) return "6px 6px 0 0";
  if (i === total - 1) return "0 6px 6px 6px";
  return "0 6px 6px 0";
};

export const Cartela: React.FC<{
  /** Chip pequeno sobre las placas. Opcional. */
  eyebrow?: string;
  /** Placa blanca, texto en bosque. Es la que manda. */
  principal: string | string[];
  /** Placa olivo, texto en blanco. */
  secundaria?: string | string[];
  desde?: number;
  /** Tono de la placa inferior: olivo por defecto, lima para rematar. */
  tono?: "olivo" | "lima" | "bosque";
  /** Distancia al borde superior. Se sube cuando el bloque lleva mas texto. */
  arriba?: number;
}> = ({
  eyebrow,
  principal,
  secundaria,
  desde = 0,
  tono = "olivo",
  arriba = 200,
}) => {
  const frame = useCurrentFrame();

  const inferior = {
    olivo: { bg: brand.green, fg: color.fgInverse },
    lima: { bg: brand.lime, fg: color.fgOnLime },
    bosque: { bg: brand.forest, fg: color.fgInverse },
  }[tono];

  const arriba1 = enLineas(principal);
  const abajo = secundaria ? enLineas(secundaria) : [];
  const total = arriba1.length + abajo.length;

  const cuerpoArriba = cuerpo(arriba1, 84, 0.62);
  const cuerpoAbajo = cuerpo(abajo, 42, 0.7);

  const tEyebrow = desde;
  const tPrimera = desde + (eyebrow ? RELEVO : 0);

  return (
    <Interactive.Div
      name="Cartela"
      style={{
        position: "absolute",
        top: arriba,
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

      {/* Placas blancas: el dato, en bosque y peso 800. */}
      {arriba1.map((linea, i) => (
        <div
          key={linea}
          style={{
            backgroundColor: color.bg1,
            padding:
              i === arriba1.length - 1 ? "16px 44px 22px" : "16px 44px 10px",
            borderRadius: eyebrow && i === 0 ? "0 6px 0 0" : esquinas(i, total),
            clipPath: barrido(frame, tPrimera + i * RELEVO),
          }}
        >
          <span
            style={{
              display: "block",
              fontSize: cuerpoArriba,
              lineHeight: 1,
              fontWeight: weight.extrabold,
              letterSpacing: "-0.015em",
              color: brand.forest,
              whiteSpace: "nowrap",
            }}
          >
            {linea}
          </span>
        </div>
      ))}

      {/* Placas de color: el complemento, en mayusculas y peso negro. */}
      {abajo.map((linea, i) => {
        const indice = arriba1.length + i;
        return (
          <div
            key={linea}
            style={{
              backgroundColor: inferior.bg,
              padding: i === abajo.length - 1 ? "14px 44px 18px" : "14px 44px 8px",
              borderRadius: esquinas(indice, total),
              clipPath: barrido(frame, tPrimera + indice * RELEVO),
            }}
          >
            <span
              style={{
                display: "block",
                fontSize: cuerpoAbajo,
                lineHeight: 1.15,
                fontWeight: weight.black,
                letterSpacing: tracking.wide,
                textTransform: "uppercase",
                color: inferior.fg,
                whiteSpace: "nowrap",
              }}
            >
              {linea}
            </span>
          </div>
        );
      })}
    </Interactive.Div>
  );
};
