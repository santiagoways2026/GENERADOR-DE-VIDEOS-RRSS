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

/** Julio de 2027, con lunes como primer dia. El 0 es hueco. */
const SEMANAS = [
  [0, 0, 0, 1, 2, 3, 4],
  [5, 6, 7, 8, 9, 10, 11],
  [12, 13, 14, 15, 16, 17, 18],
  [19, 20, 21, 22, 23, 24, 25],
  [26, 27, 28, 29, 30, 31, 0],
];
const DIAS = ["L", "M", "X", "J", "V", "S", "D"];
const DESTACADO = 25;
const COLUMNA_DOMINGO = 6;

const CELDA = 104;
const HUECO = 6;

/**
 * Calendario de julio de 2027 con el 25 marcado en domingo.
 *
 * Esta pensado para entenderse sin leer: primero se ilumina la columna
 * entera de los domingos, y solo despues se enciende el 25 dentro de ella.
 * La vista sigue ese orden y saca la conclusion sola, que es justo lo que
 * hace que 2027 sea Ano Santo.
 */
export const Calendario: React.FC<{ desde?: number }> = ({ desde = 0 }) => {
  const frame = useCurrentFrame();
  const t = frame - desde;

  const anchoRejilla = CELDA * 7 + HUECO * 6;

  // La columna del domingo se tine antes de que se encienda el dia.
  const columna = interpolate(t, [20, 34], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...easeOut),
  });

  return (
    <Interactive.Div
      name="Calendario"
      style={{
        backgroundColor: color.bg1,
        borderRadius: radius.lg,
        boxShadow: shadow.raised,
        overflow: "hidden",
        width: anchoRejilla + space[6] * 2,
        opacity: interpolate(t, [0, 10], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        translate: interpolate(t, [0, 16], ["0px 24px", "0px 0px"], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(...easeOut),
        }),
      }}
    >
      {/* Cabecera en placa olivo, como las cartelas del kit. */}
      <div
        style={{
          backgroundColor: brand.green,
          color: color.fgInverse,
          padding: `${space[4]}px ${space[6]}px`,
          fontSize: fontSize.xl,
          fontWeight: weight.black,
          letterSpacing: tracking.loose,
          textTransform: "uppercase",
        }}
      >
        Julio 2027
      </div>

      <div style={{ padding: space[6], position: "relative" }}>
        {/* Banda vertical que tine la columna de los domingos. */}
        <div
          style={{
            position: "absolute",
            left: space[6] + COLUMNA_DOMINGO * (CELDA + HUECO) - 6,
            top: space[6],
            width: CELDA + 12,
            borderRadius: radius.md,
            backgroundColor: "#F4F8E6",
            height: interpolate(columna, [0, 1], [0, 6 * (CELDA + HUECO) + 8]),
          }}
        />

        <div
          style={{
            position: "relative",
            display: "grid",
            gridTemplateColumns: `repeat(7, ${CELDA}px)`,
            gap: HUECO,
          }}
        >
          {DIAS.map((d, i) => (
            <div
              key={d}
              style={{
                height: CELDA * 0.62,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: fontSize.lg,
                fontWeight: weight.black,
                letterSpacing: tracking.loose,
                color: i === COLUMNA_DOMINGO ? brand.green : color.fg3,
              }}
            >
              {d}
            </div>
          ))}

          {SEMANAS.flat().map((dia, i) => {
            if (dia === 0) return <div key={i} style={{ height: CELDA }} />;
            const esDestacado = dia === DESTACADO;
            const enColumna = i % 7 === COLUMNA_DOMINGO;
            const aparece = 4 + Math.floor(i / 7) * 3;
            return (
              <div
                key={i}
                style={{
                  height: CELDA,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: radius.pill,
                  fontSize: esDestacado ? 52 : 34,
                  fontWeight: esDestacado || enColumna ? weight.black : weight.medium,
                  color: esDestacado
                    ? color.fgInverse
                    : enColumna
                      ? brand.green
                      : color.fg1,
                  backgroundColor: esDestacado ? brand.green : "transparent",
                  opacity: interpolate(t, [aparece, aparece + 8], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                  // El 25 crece cuando la columna ya esta tenida.
                  scale: esDestacado
                    ? interpolate(t, [34, 48], [0.6, 1], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                        easing: Easing.bezier(...easeOut),
                        output: "perceptual-scale",
                      })
                    : 1,
                }}
              >
                {dia}
              </div>
            );
          })}
        </div>
      </div>

      {/* Conclusion, en placa lima con texto bosque. */}
      <div
        style={{
          backgroundColor: brand.lime,
          color: color.fgOnLime,
          padding: `${space[4]}px ${space[6]}px`,
          fontSize: fontSize.xl,
          fontWeight: weight.black,
          letterSpacing: tracking.wide,
          textTransform: "uppercase",
          textAlign: "center",
          clipPath: `inset(0 ${interpolate(t, [48, 68], [100, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(...easeOut),
          })}% 0 0)`,
        }}
      >
        El 25 cae en domingo
      </div>
    </Interactive.Div>
  );
};
