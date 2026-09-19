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
} from "../brand/theme";
import { entrada } from "../componentes/entrada";

const HITOS = [2021, 2027, 2032, 2038];
const ACTUAL = 2027;
const SIGUIENTE = 2032;
/** Separacion entre hitos, en px. */
const PASO = 273;
/** Disco que lleva la vieira y monta sobre el rail. */
const DISCO = 96;

/**
 * Linea de tiempo de Anos Santos. La vieira arranca en 2021 y se para en
 * 2027: cuenta lo de irrepetible sin necesidad de decirlo.
 *
 * Los anos son reales: el Ano Santo cae cuando el 25 de julio es domingo,
 * lo que da un patron de 6, 5, 6 y 11 anos que se repite.
 */
export const LineaTiempo: React.FC<{
  desde?: number;
  /** Remate bajo la linea. Opcional: con los cuatro anos a la vista suele
   *  sobrar, y una linea de texto menos es una linea menos que leer. */
  pie?: string;
  /** Fotograma en el que se enciende el siguiente Ano Santo. Se hace
   *  coincidir con la cifra que dice la locucion, no antes: el dato pesa
   *  mas si el espectador lo ve y lo oye a la vez. */
  resaltaSiguiente?: number;
}> = ({ desde = 0, pie, resaltaSiguiente }) => {
  const frame = useCurrentFrame();
  const t = frame - desde;
  const indiceActual = HITOS.indexOf(ACTUAL);

  // La vieira recorre de un hito al siguiente y se detiene.
  const avance = interpolate(t, [14, 40], [0, indiceActual], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...easeOut),
  });

  const siguiente =
    resaltaSiguiente === undefined
      ? 0
      : interpolate(frame, [resaltaSiguiente, resaltaSiguiente + 12], [0, 1], {
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
            width: interpolate(t, [14, 40], [0, PASO], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(...easeOut),
            }),
          }}
        />
        {/* La espera hasta el siguiente: el tramo que el espectador no va a
            querer aguantar. */}
        {resaltaSiguiente === undefined ? null : (
          <div
            style={{
              position: "absolute",
              top: 108,
              left: 70 + indiceActual * PASO,
              height: 6,
              borderRadius: radius.pill,
              backgroundColor: brand.forest,
              width: siguiente * PASO,
            }}
          />
        )}

        {HITOS.map((anio, i) => {
          const x = 70 + i * PASO;
          const esActual = anio === ACTUAL;
          const esSiguiente = anio === SIGUIENTE;
          const encendido = interpolate(t, [14 + i * 9, 22 + i * 9], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const apagado = 0.42 + encendido * 0.1;
          return (
            <div
              key={anio}
              style={{
                position: "absolute",
                left: x - 60,
                top: 0,
                width: 120,
                textAlign: "center",
                opacity: esActual
                  ? 1
                  : esSiguiente
                    ? apagado + siguiente * (1 - apagado)
                    : apagado,
              }}
            >
              <div
                style={{
                  margin: "92px auto 0",
                  width: esActual ? 44 : 28 + (esSiguiente ? siguiente * 12 : 0),
                  height: esActual ? 44 : 28 + (esSiguiente ? siguiente * 12 : 0),
                  borderRadius: radius.pill,
                  backgroundColor: esActual
                    ? brand.green
                    : esSiguiente && siguiente > 0.5
                      ? brand.forest
                      : "#CFCABB",
                }}
              />
              <div
                style={{
                  marginTop: space[3],
                  fontSize: esActual
                    ? 60
                    : fontSize["2xl"] + (esSiguiente ? siguiente * 18 : 0),
                  fontWeight:
                    esActual || (esSiguiente && siguiente > 0.5)
                      ? weight.black
                      : weight.medium,
                  color: esActual
                    ? brand.green
                    : esSiguiente && siguiente > 0.5
                      ? brand.forest
                      : color.fg3,
                }}
              >
                {anio}
              </div>
            </div>
          );
        })}

        {/* La vieira avanza por el raíl, dentro de su disco. */}
        <div
          style={{
            position: "absolute",
            top: 111 - DISCO / 2,
            left: 70 + avance * PASO - DISCO / 2,
            width: DISCO,
            height: DISCO,
            borderRadius: radius.pill,
            backgroundColor: color.bg1,
            border: `5px solid ${brand.green}`,
            boxShadow: shadow.card,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: interpolate(t, [8, 16], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <CanvasImage
            src={staticFile(logo.isotipo)}
            style={{ width: 62, height: 62, objectFit: "contain" }}
          />
        </div>
      </div>

      {pie ? (
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
          {pie}
        </div>
      ) : null}
    </Interactive.Div>
  );
};
