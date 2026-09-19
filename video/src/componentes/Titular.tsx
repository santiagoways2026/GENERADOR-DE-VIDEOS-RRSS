import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { brand, color, easeOut, margin, weight } from "../brand/theme";

/**
 * Texto grande directamente sobre la imagen, sin placa debajo.
 *
 * Es el contrapunto de `Cartela` y de `Bullets`. Una pieza entera resuelta a
 * base de placas y listas acaba pareciendo una plantilla, y todas las piezas
 * de la marca acaban pareciendo la misma: esto deja respirar el metraje y
 * cambia el ritmo de lectura.
 *
 * Las palabras entran una a una, con el fundido y el desplazamiento corto de
 * la marca. Se lee como alguien hablando, no como un cartel que aparece.
 *
 * Sin placa hay que resolver la legibilidad de otra forma: va en peso negro
 * y con sombra de bosque, que es la tinta de la marca. Sobre un plano muy
 * claro conviene subir el `overlay` de `Planos`.
 */

/** Lo que tarda en entrar una palabra. */
const PALABRA = 7;
/** Retardo entre una palabra y la siguiente. */
const RELEVO = 4;

export const Titular: React.FC<{
  texto: string;
  desde?: number;
  /** Fotograma en el que empieza a irse. Sin esto se queda hasta el final. */
  hasta?: number;
  cuerpo?: number;
  /** Palabras que van en lima en lugar de en blanco, contando desde cero. */
  destacadas?: number[];
  align?: "left" | "center";
  /** Linea pequena debajo, para el matiz que no cabe en el titular. */
  pie?: string;
}> = ({
  texto,
  desde = 0,
  hasta,
  cuerpo = 96,
  destacadas = [],
  align = "left",
  pie,
}) => {
  const frame = useCurrentFrame();
  const t = frame - desde;
  const palabras = texto.split(" ");

  const salida =
    hasta === undefined
      ? 1
      : interpolate(frame, [hasta, hasta + 10], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

  return (
    <Interactive.Div
      name="Titular"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: align === "center" ? "center" : "flex-start",
        gap: 18,
        width: "100%",
        paddingLeft: align === "center" ? 0 : margin - 8,
        paddingRight: align === "center" ? 0 : margin - 8,
        opacity: salida,
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: align === "center" ? "center" : "flex-start",
          columnGap: cuerpo * 0.24,
          rowGap: cuerpo * 0.04,
          textAlign: align,
        }}
      >
        {palabras.map((palabra, i) => {
          const tp = t - i * RELEVO;
          return (
            <span
              key={`${palabra}-${i}`}
              style={{
                fontSize: cuerpo,
                lineHeight: 1.02,
                fontWeight: weight.black,
                letterSpacing: "-0.02em",
                textTransform: "uppercase",
                color: destacadas.includes(i) ? brand.lime : color.fgInverse,
                // Sin placa, la sombra es lo que separa el texto del plano.
                textShadow: `0 4px 22px rgba(14,44,31,0.55), 0 1px 3px rgba(14,44,31,0.6)`,
                opacity: interpolate(tp, [0, PALABRA], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
                translate: interpolate(tp, [0, PALABRA + 3], ["0px 18px", "0px 0px"], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(...easeOut),
                }),
              }}
            >
              {palabra}
            </span>
          );
        })}
      </div>

      {pie ? (
        <div
          style={{
            fontSize: Math.round(cuerpo * 0.34),
            fontWeight: weight.bold,
            letterSpacing: "0.04em",
            color: color.fgInverse,
            textShadow: "0 3px 16px rgba(14,44,31,0.6)",
            opacity: interpolate(t, [palabras.length * RELEVO, palabras.length * RELEVO + 10], [0, 0.92], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {pie}
        </div>
      ) : null}
    </Interactive.Div>
  );
};
