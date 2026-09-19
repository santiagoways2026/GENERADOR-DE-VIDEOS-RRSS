import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import {
  brand,
  color,
  easeOut,
  format,
  margin,
  radius,
  tipo,
} from "../brand/theme";

/**
 * Texto grande directamente sobre la imagen, con la frase clave en bloque.
 *
 * Es el contrapunto de `Cartela` y de `Bullets`. Una pieza entera resuelta a
 * base de placas y listas acaba pareciendo una plantilla, y todas las piezas
 * de la marca acaban pareciendo la misma.
 *
 * Es el patron `.impact` de la guia, tal cual viene descrito alli: *"the
 * signature impact headline pattern - UPPERCASE, white on green block"*, con
 * peso 900, interlineado corto y `letter-spacing` negativo. De ahi salen las
 * decisiones que no se tocan:
 *
 * - **El bloque es verde de marca, con la letra en blanco.** No lima: el
 *   lima es para los "punch blocks" pequenos, y ademas obliga a letra bosque,
 *   que sobre metraje pesa menos.
 * - **Peso 900**, que es lo que lo hace parecer un titular y no un pie. Por
 *   eso va en Montserrat: Manrope no pasa de 800.
 *
 * El bloque y su texto entran juntos, con el mismo barrido lateral que las
 * cartelas del kit. Antes las palabras entraban una a una por dentro de un
 * bloque ya dibujado, y se veian flotando dentro de la caja en lugar de
 * formar parte de ella.
 */

/** Lo que tarda en entrar una palabra suelta. */
const PALABRA = 7;
/** Retardo entre una palabra y la siguiente. */
const RELEVO = 4;
/**
 * Barrido del bloque.
 *
 * Mas corto que los 27 de las cartelas del kit, porque un titular aguanta en
 * pantalla mucho menos que una cartela: el de «the most walked» dura 41
 * fotogramas, y con 27 de barrido llegaba entero solo los ultimos diez.
 */
const BARRIDO = 16;

const TONOS = {
  /** El de la guia: bloque verde de marca, letra blanca. */
  olivo: { fondo: brand.green, tinta: color.fgInverse },
  /** Bosque, para un plano ya muy verde donde el olivo se pierde. */
  bosque: { fondo: brand.forest, tinta: color.fgInverse },
  /** Lima. De uso puntual, y siempre con la letra en bosque. */
  lima: { fondo: brand.lime, tinta: color.fgOnLime },
} as const;

/**
 * Agrupa las palabras seguidas que van en bloque.
 *
 * Sin esto cada palabra llevaria su propia caja y el bloque saldria a
 * trozos, con un hueco en cada espacio.
 */
const agrupar = (palabras: string[], resaltadas: Set<number>) => {
  const grupos: { resaltado: boolean; desde: number; palabras: string[] }[] =
    [];
  palabras.forEach((palabra, i) => {
    const resaltado = resaltadas.has(i);
    const ultimo = grupos[grupos.length - 1];
    if (ultimo && ultimo.resaltado === resaltado) {
      ultimo.palabras.push(palabra);
    } else {
      grupos.push({ resaltado, desde: i, palabras: [palabra] });
    }
  });
  return grupos;
};

/** Ancho util del titular, ya descontados los margenes. */
const ANCHO = format.reels.width - 2 * (margin - 8);
/**
 * Lo que ocupa de ancho un caracter de Montserrat 900 en mayusculas, en em.
 *
 * Medido sobre un fotograma renderizado, no sacado de la especificacion: es
 * una letra ancha y a ojo se queda corto.
 */
const AVANCE = 0.74;
/** El aire lateral del bloque, contando los dos lados. */
const AIRE = 0.3;

/**
 * El cuerpo mas grande al que el titular cabe de una linea por trozo.
 *
 * Un bloque no parte por dentro, asi que tiene que caber entero en el ancho;
 * el texto suelto parte donde quiera, y ahi solo importa la palabra mas
 * larga. Sin esto, «the best signposted» partia dentro del bloque y dejaba
 * un rectangulo verde con medio lado vacio.
 */
const cabe = (grupos: { resaltado: boolean; palabras: string[] }[]) => {
  const anchos = grupos.map((grupo) => {
    const largo = grupo.resaltado
      ? grupo.palabras.join(" ").length
      : Math.max(...grupo.palabras.map((p) => p.length));
    return largo * AVANCE + (grupo.resaltado ? AIRE : 0);
  });
  return Math.floor(ANCHO / Math.max(...anchos));
};

export const Titular: React.FC<{
  texto: string;
  desde?: number;
  /** Fotograma en el que empieza a irse. Sin esto se queda hasta el final. */
  hasta?: number;
  cuerpo?: number;
  /** Palabras que van sobre el bloque de color, contando desde cero. */
  resalta?: number[];
  tono?: keyof typeof TONOS;
  align?: "left" | "center";
  /** Linea pequena debajo, para el matiz que no cabe en el titular. */
  pie?: string;
}> = ({
  texto,
  desde = 0,
  hasta,
  cuerpo = 96,
  resalta = [],
  tono = "olivo",
  align = "left",
  pie,
}) => {
  const frame = useCurrentFrame();
  const t = frame - desde;
  const palabras = texto.split(" ");
  const grupos = agrupar(palabras, new Set(resalta));
  const { fondo, tinta } = TONOS[tono];
  const cuerpoFinal = Math.min(cuerpo, cabe(grupos));

  const salida =
    hasta === undefined
      ? 1
      : interpolate(frame, [hasta, hasta + 10], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

  /** Cada palabra suelta entra por su cuenta, en orden de lectura. */
  const palabraStyle = (i: number): React.CSSProperties => {
    const tp = t - i * RELEVO;
    return {
      display: "inline-block",
      opacity: interpolate(tp, [0, PALABRA], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
      translate: interpolate(tp, [0, PALABRA + 3], ["0px 18px", "0px 0px"], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(...easeOut),
      }),
    };
  };

  return (
    <Interactive.Div
      name="Titular"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: align === "center" ? "center" : "flex-start",
        gap: 24,
        width: "100%",
        paddingLeft: align === "center" ? 0 : margin - 8,
        paddingRight: align === "center" ? 0 : margin - 8,
        opacity: salida,
      }}
    >
      <div
        style={{
          ...tipo.titular,
          fontSize: cuerpoFinal,
          // La guia pide 0.95, que es lo justo para el texto suelto. Aqui
          // sube a 1.3: con menos, el bloque de una linea se monta encima
          // del de la siguiente, porque la caja del bloque es mas alta que
          // la letra.
          lineHeight: 1.3,
          textTransform: "uppercase",
          color: color.fgInverse,
          textAlign: align,
          textWrap: "balance",
          textShadow:
            "0 4px 22px rgba(14,44,31,0.5), 0 1px 3px rgba(14,44,31,0.55)",
        }}
      >
        {grupos.map((grupo) => {
          if (!grupo.resaltado) {
            return (
              <span key={`suelto-${grupo.desde}`}>
                {grupo.palabras.map((palabra, j) => {
                  const i = grupo.desde + j;
                  return (
                    <span key={`${palabra}-${i}`} style={palabraStyle(i)}>
                      {palabra}
                      {i < palabras.length - 1 ? " " : ""}
                    </span>
                  );
                })}
              </span>
            );
          }

          // El bloque entra de una pieza, con su texto dentro. El barrido
          // arranca cuando le tocaria a su primera palabra.
          const tb = t - grupo.desde * RELEVO;
          const corte = interpolate(tb, [0, BARRIDO], [100, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(...easeOut),
          });
          const ultima = grupo.desde + grupo.palabras.length - 1;

          return (
            <span key={`bloque-${grupo.desde}`}>
              <span
                style={{
                  backgroundColor: fondo,
                  color: tinta,
                  // Dentro del bloque el contraste ya lo da el fondo: la
                  // sombra ahi solo ensucia.
                  textShadow: "none",
                  // Ajustado a la caja de la letra, que ya trae su propio aire
                  // arriba y abajo. Con mas, el bloque se despega del texto.
                  padding: "0.02em 0.14em",
                  borderRadius: radius.md,
                  // Caja entera, no texto corrido. Con el bloque en linea,
                  // un titular que parte en dos deja dos trozos de caja, y
                  // el `clip-path` del barrido solo recorta el primero: la
                  // segunda linea desaparecia del todo. Asi el bloque es una
                  // caja sola, el texto parte por dentro si hace falta y el
                  // barrido la recorre entera.
                  display: "inline-block",
                  whiteSpace: "nowrap",
                  clipPath: `inset(0 ${corte}% 0 0)`,
                }}
              >
                {grupo.palabras.join(" ")}
              </span>
              {/* El espacio va fuera del bloque: dentro lo alargaria una
                palabra de aire por detras de la ultima letra. */}
              {ultima < palabras.length - 1 ? " " : ""}
            </span>
          );
        })}
      </div>

      {pie ? (
        <div
          style={{
            ...tipo.apoyo,
            // En un movil, por debajo de 38 px no se lee de pasada.
            fontSize: Math.max(38, Math.round(cuerpoFinal * 0.4)),
            color: color.fgInverse,
            textShadow:
              "0 3px 16px rgba(14,44,31,0.65), 0 1px 2px rgba(14,44,31,0.7)",
            opacity: interpolate(
              t,
              [palabras.length * RELEVO, palabras.length * RELEVO + 10],
              [0, 0.95],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            ),
          }}
        >
          {pie}
        </div>
      ) : null}
    </Interactive.Div>
  );
};
