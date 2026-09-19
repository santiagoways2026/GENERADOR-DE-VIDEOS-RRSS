import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { brand, color, easeOut, margin, tipo } from "../brand/theme";

/**
 * Texto grande directamente sobre la imagen, con la frase clave resaltada.
 *
 * Es el contrapunto de `Cartela` y de `Bullets`. Una pieza entera resuelta a
 * base de placas y listas acaba pareciendo una plantilla, y todas las piezas
 * de la marca acaban pareciendo la misma.
 *
 * El resalte es una banda de color detras de las palabras, como un
 * subrayador, no la palabra pintada de otro color. Eso segundo se probo y
 * ademas se salta el manual: el lima no es color de letra, es fondo, y lo
 * que va encima es bosque. Sobre olivo, blanco.
 *
 * Va en Manrope extrabold, que es lo que el sistema reserva para el texto de
 * video: abre mas que Montserrat al cuerpo grande y contrasta con el logo.
 * Fuera del resalte la legibilidad la sostiene la sombra de bosque; sobre un
 * plano muy claro conviene subir el `overlay` de `Planos`.
 */

/** Lo que tarda en entrar una palabra. */
const PALABRA = 7;
/** Retardo entre una palabra y la siguiente. */
const RELEVO = 4;

const TONOS = {
  lima: { fondo: brand.lime, tinta: color.fgOnLime },
  olivo: { fondo: brand.green, tinta: color.fgInverse },
  bosque: { fondo: brand.forest, tinta: color.fgInverse },
} as const;

/**
 * Agrupa las palabras seguidas que van resaltadas.
 *
 * Sin esto cada palabra llevaria su propia caja y el resalte saldria a
 * trozos, con un hueco en cada espacio.
 */
const agrupar = (palabras: string[], resaltadas: Set<number>) => {
  const grupos: { resaltado: boolean; desde: number; palabras: string[] }[] = [];
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

export const Titular: React.FC<{
  texto: string;
  desde?: number;
  /** Fotograma en el que empieza a irse. Sin esto se queda hasta el final. */
  hasta?: number;
  cuerpo?: number;
  /** Palabras que van sobre la banda de color, contando desde cero. */
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
  tono = "lima",
  align = "left",
  pie,
}) => {
  const frame = useCurrentFrame();
  const t = frame - desde;
  const palabras = texto.split(" ");
  const grupos = agrupar(palabras, new Set(resalta));
  const { fondo, tinta } = TONOS[tono];

  const salida =
    hasta === undefined
      ? 1
      : interpolate(frame, [hasta, hasta + 10], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

  /** Cada palabra entra por su cuenta, en orden de lectura. */
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
        gap: 20,
        width: "100%",
        paddingLeft: align === "center" ? 0 : margin - 8,
        paddingRight: align === "center" ? 0 : margin - 8,
        opacity: salida,
      }}
    >
      <div
        style={{
          ...tipo.titular,
          fontSize: cuerpo,
          // Muy apretado: es un titular, no un parrafo.
          lineHeight: 1.08,
          textTransform: "uppercase",
          color: color.fgInverse,
          textAlign: align,
          textShadow: "0 4px 22px rgba(14,44,31,0.5), 0 1px 3px rgba(14,44,31,0.55)",
        }}
      >
        {grupos.map((grupo) => {
          const contenido = grupo.palabras.map((palabra, j) => {
            const i = grupo.desde + j;
            return (
              <span key={`${palabra}-${i}`} style={palabraStyle(i)}>
                {palabra}
                {i < palabras.length - 1 ? " " : ""}
              </span>
            );
          });

          if (!grupo.resaltado) {
            return <span key={`normal-${grupo.desde}`}>{contenido}</span>;
          }

          return (
            <span
              key={`resalte-${grupo.desde}`}
              style={{
                backgroundColor: fondo,
                color: tinta,
                // Dentro de la banda el contraste ya lo da el fondo: la
                // sombra ahi solo ensucia.
                textShadow: "none",
                padding: "0.08em 0.1em",
                // Para que la banda se parta bien cuando el titular hace dos
                // lineas, en lugar de dejar un rectangulo suelto.
                boxDecorationBreak: "clone",
                WebkitBoxDecorationBreak: "clone",
              }}
            >
              {contenido}
            </span>
          );
        })}
      </div>

      {pie ? (
        <div
          style={{
            ...tipo.apoyo,
            // En un movil, por debajo de 38 px no se lee de pasada.
            fontSize: Math.max(38, Math.round(cuerpo * 0.4)),
            fontWeight: 700,
            color: color.fgInverse,
            textShadow: "0 3px 16px rgba(14,44,31,0.65), 0 1px 2px rgba(14,44,31,0.7)",
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
