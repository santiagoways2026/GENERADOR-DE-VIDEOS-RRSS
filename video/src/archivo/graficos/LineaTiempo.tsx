import {
  CanvasImage,
  Easing,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {
  brand,
  color,
  easeOut,
  fontSize,
  logo,
  radius,
  shadow,
  space,
  tracking,
  weight,
} from "../../brand/theme";
import { entrada } from "../../componentes/entrada";

const HITOS = [2021, 2027, 2032, 2038];
const ACTUAL = 2027;

/**
 * Linea de tiempo de Anos Santos. La vieira arranca en 2021 y se para en
 * 2027: cuenta lo de irrepetible sin necesidad de decirlo.
 *
 * Los anos son reales: el Ano Santo cae cuando el 25 de julio es domingo,
 * lo que da un patron de 6, 5, 6 y 11 anos que se repite.
 */
export const LineaTiempo: React.FC<{ desde?: number }> = ({ desde = 0 }) => {
  const frame = useCurrentFrame();
  const t = frame - desde;
  const indiceActual = HITOS.indexOf(ACTUAL);

  // La vieira recorre de un hito al siguiente y se detiene.
  const avance = interpolate(t, [14, 40], [0, indiceActual], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...easeOut),
  });

  return (
    <Interactive.Div
      name="LineaTiempo"
      style={{
        backgroundColor: color.bg1,
        borderRadius: radius.lg,
        boxShadow: shadow.raised,
        padding: `${space[7]}px ${space[6]}px ${space[6]}px`,
        width: 980,
        opacity: entrada(frame, desde).opacity,
        translate: entrada(frame, desde).translate,
      }}
    >
      <div style={{ position: "relative", height: 190 }}>
        {/* Raíl */}
        <div
          style={{
            position: "absolute",
            top: 108,
            left: 70,
            right: 70,
            height: 6,
            borderRadius: radius.pill,
            backgroundColor: "#E6E2D6",
          }}
        />
        {/* Tramo recorrido */}
        <div
          style={{
            position: "absolute",
            top: 108,
            left: 70,
            height: 6,
            borderRadius: radius.pill,
            backgroundColor: brand.green,
            width: interpolate(t, [14, 40], [0, 273], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(...easeOut),
            }),
          }}
        />

        {HITOS.map((anio, i) => {
          const x = 70 + i * 273;
          const esActual = anio === ACTUAL;
          const encendido = interpolate(t, [14 + i * 9, 22 + i * 9], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={anio}
              style={{
                position: "absolute",
                left: x - 60,
                top: 0,
                width: 120,
                textAlign: "center",
                opacity: esActual ? 1 : 0.42 + encendido * 0.1,
              }}
            >
              <div
                style={{
                  margin: "92px auto 0",
                  width: esActual ? 44 : 28,
                  height: esActual ? 44 : 28,
                  borderRadius: radius.pill,
                  backgroundColor: esActual ? brand.green : "#CFCABB",
                }}
              />
              <div
                style={{
                  marginTop: space[3],
                  fontSize: esActual ? 60 : fontSize["2xl"],
                  fontWeight: esActual ? weight.black : weight.medium,
                  color: esActual ? brand.green : color.fg3,
                }}
              >
                {anio}
              </div>
            </div>
          );
        })}

        {/* La vieira avanza por el raíl */}
        <CanvasImage
          src={staticFile(logo.isotipo)}
          style={{
            position: "absolute",
            top: 8,
            left: 70 + avance * 273 - 44,
            width: 104,
            height: 104,
            objectFit: "contain",
            opacity: interpolate(t, [8, 16], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        />
      </div>

      <div
        style={{
          marginTop: space[4],
          textAlign: "center",
          fontSize: fontSize.xl,
          fontWeight: weight.bold,
          letterSpacing: tracking.loose,
          textTransform: "uppercase",
          color: color.fg3,
        }}
      >
        Cada 6, 5 u 11 años
      </div>
    </Interactive.Div>
  );
};
