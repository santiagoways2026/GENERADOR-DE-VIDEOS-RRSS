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

/* ------------------------------------------------------------------ *
 * GEOMETRIA
 *
 * Todo se calcula desde el ancho de la tarjeta en lugar de fijarse a ojo.
 * Antes el paso entre hitos estaba clavado a 273 px y el ultimo ano caia
 * 43 px por fuera del final del rail, asi que el conjunto salia descentrado
 * y la vieira montaba sobre las cifras.
 * ------------------------------------------------------------------ */

const ANCHO = 980;
const PADDING = space[6];
/** Aire entre el borde del contenido y los hitos de los extremos. */
const MARGEN = 96;
const LARGO = ANCHO - PADDING * 2 - MARGEN * 2;
const PASO = LARGO / (HITOS.length - 1);

/** Altura del rail dentro del area del grafico. */
const RAIL = 78;
const GROSOR = 6;
/** Disco que lleva la vieira y monta sobre el rail. */
const DISCO = 88;
/** Los anos empiezan por debajo del disco, sin tocarlo. */
const ANOS = RAIL + 52;
const ALTO = ANOS + 68;

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

  /** Tramo del rail, comun a los tres que se pintan encima. */
  const tramo = {
    position: "absolute" as const,
    top: RAIL - GROSOR / 2,
    height: GROSOR,
    borderRadius: radius.pill,
  };

  return (
    <Interactive.Div
      name="LineaTiempo"
      style={{
        backgroundColor: color.bg1,
        borderRadius: radius.lg,
        boxShadow: shadow.raised,
        padding: PADDING,
        width: ANCHO,
        opacity: entrada(frame, desde).opacity,
        translate: entrada(frame, desde).translate,
      }}
    >
      <div style={{ position: "relative", height: ALTO }}>
        {/* Raíl completo */}
        <div
          style={{ ...tramo, left: MARGEN, width: LARGO, backgroundColor: "#E6E2D6" }}
        />
        {/* Lo ya recorrido, hasta 2027 */}
        <div
          style={{
            ...tramo,
            left: MARGEN,
            backgroundColor: brand.green,
            width: interpolate(t, [14, 40], [0, PASO], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(...easeOut),
            }),
          }}
        />
        {/* La espera hasta el siguiente: el tramo que nadie quiere aguantar. */}
        {resaltaSiguiente === undefined ? null : (
          <div
            style={{
              ...tramo,
              left: MARGEN + indiceActual * PASO,
              backgroundColor: brand.forest,
              width: siguiente * PASO,
            }}
          />
        )}

        {HITOS.map((anio, i) => {
          const x = MARGEN + i * PASO;
          const esActual = anio === ACTUAL;
          const esSiguiente = anio === SIGUIENTE;
          const encendido = interpolate(t, [14 + i * 9, 22 + i * 9], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const apagado = 0.42 + encendido * 0.1;
          const punto = esActual ? 44 : 28 + (esSiguiente ? siguiente * 12 : 0);
          // El siguiente se enciende cuando la locucion dice la cifra.
          const vivo = esActual || (esSiguiente && siguiente > 0.5);
          return (
            <div
              key={anio}
              style={{
                opacity: esActual
                  ? 1
                  : esSiguiente
                    ? apagado + siguiente * (1 - apagado)
                    : apagado,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: x - punto / 2,
                  top: RAIL - punto / 2,
                  width: punto,
                  height: punto,
                  borderRadius: radius.pill,
                  backgroundColor: esActual
                    ? brand.green
                    : vivo
                      ? brand.forest
                      : "#CFCABB",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: x - 90,
                  top: ANOS,
                  width: 180,
                  textAlign: "center",
                  lineHeight: 1,
                  fontSize: esActual
                    ? 60
                    : fontSize["2xl"] + (esSiguiente ? siguiente * 18 : 0),
                  fontWeight: vivo ? weight.black : weight.medium,
                  color: esActual
                    ? brand.green
                    : vivo
                      ? brand.forest
                      : color.fg3,
                }}
              >
                {anio}
              </div>
            </div>
          );
        })}

        {/* La vieira avanza por el raíl, dentro de su disco: monta sobre la
            línea en lugar de apoyarse en ella. */}
        <div
          style={{
            position: "absolute",
            left: MARGEN + avance * PASO - DISCO / 2,
            top: RAIL - DISCO / 2,
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
            style={{ width: 56, height: 56, objectFit: "contain" }}
          />
        </div>
      </div>

      {pie ? (
        <div
          style={{
            marginTop: space[3],
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
