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
import { entrada } from "../componentes/entrada";

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

/**
 * Calendario de julio de 2027 con el 25 marcado en domingo.
 * Cuenta de un vistazo por que 2027 es Ano Santo.
 *
 * La cuadricula entra dia a dia, el 25 se enciende despues y el sello
 * cae al final: tres tiempos para que la vista sepa donde mirar.
 */
export const Calendario: React.FC<{ desde?: number }> = ({ desde = 0 }) => {
  const frame = useCurrentFrame();
  const t = frame - desde;

  return (
    <Interactive.Div
      name="Calendario"
      style={{
        backgroundColor: color.bg1,
        borderRadius: radius.lg,
        boxShadow: shadow.raised,
        padding: space[6],
        width: 760,
        display: "flex",
        flexDirection: "column",
        gap: space[4],
        opacity: entrada(frame, desde).opacity,
        translate: entrada(frame, desde).translate,
      }}
    >
      <div
        style={{
          fontSize: fontSize.xl,
          fontWeight: weight.black,
          letterSpacing: tracking.loose,
          textTransform: "uppercase",
          color: brand.green,
        }}
      >
        Julio 2027
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: space[2],
        }}
      >
        {DIAS.map((d) => (
          <div
            key={d}
            style={{
              textAlign: "center",
              fontSize: fontSize.base,
              fontWeight: weight.bold,
              letterSpacing: tracking.loose,
              color: color.fg3,
            }}
          >
            {d}
          </div>
        ))}

        {SEMANAS.flat().map((dia, i) => {
          if (dia === 0) return <div key={i} />;
          const esDestacado = dia === DESTACADO;
          // Los dias entran en cascada, de arriba abajo y de izquierda a derecha.
          const aparece = 6 + i * 0.6;
          return (
            <div
              key={i}
              style={{
                aspectRatio: "1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: radius.pill,
                fontSize: fontSize.lg,
                fontWeight: esDestacado ? weight.black : weight.medium,
                color: esDestacado ? color.fgInverse : color.fg1,
                // El 25 se enciende cuando ya esta puesta toda la cuadricula.
                backgroundColor: esDestacado
                  ? interpolate(t, [40, 50], [0, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    }) > 0.5
                    ? brand.green
                    : "transparent"
                  : "transparent",
                opacity: interpolate(t, [aparece, aparece + 6], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
                scale: esDestacado
                  ? interpolate(t, [40, 56], [1, 1.12], {
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

      {/* El sello: lima con texto bosque, ligeramente rotado. */}
      <div
        style={{
          alignSelf: "center",
          backgroundColor: brand.lime,
          color: color.fgOnLime,
          borderRadius: radius.md,
          padding: `${space[3]}px ${space[6]}px`,
          fontSize: fontSize.xl,
          fontWeight: weight.black,
          letterSpacing: tracking.loose,
          textTransform: "uppercase",
          rotate: "-2.5deg",
          opacity: interpolate(t, [56, 64], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(t, [56, 72], [1.3, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(...easeOut),
            output: "perceptual-scale",
          }),
        }}
      >
        Domingo
      </div>
    </Interactive.Div>
  );
};
