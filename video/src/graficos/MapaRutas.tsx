import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import {
  brand,
  color,
  easeOut,
  fontSize,
  radius,
  scale,
  shadow,
  space,
  tracking,
  weight,
} from "../brand/theme";
import { VISTAS } from "./mapa-datos";

/**
 * El mapa de rutas. Es el grafico que mas trabaja de las piezas didacticas.
 *
 * A quien no conoce el Camino hay que situarlo: no sabe donde esta Galicia ni
 * que el Camino son varias rutas. El mapa lo cuenta sin locucion. Las lineas
 * se trazan una a una desde su origen y todas mueren en el mismo punto, que
 * es la idea entera: muchos caminos, una catedral.
 *
 * Dos vistas, en `mapa-datos.ts`. La `noroeste` es apaisada y lleva cinco
 * rutas; la `peninsula` abre hasta Sevilla y Lisboa para que quepan las
 * siete principales. **Si la pieza dice en pantalla cuantas rutas hay, tiene
 * que usar la peninsular**: el espectador las cuenta.
 *
 * Con `soloRuta` dibuja una sola y le pone el cuentakilometros, que es otra
 * forma de contar lo larga que es.
 */

/**
 * Los paises, rotulados en tenue. Sin esto el espectador no sabe que mira.
 *
 * Solo en la vista apaisada: en la peninsular las siete rutas cruzan el
 * centro y un rotulo ahi estorba mas de lo que sitúa.
 */
const PAISES: Record<string, { texto: string; x: number; y: number; cuerpo: number }[]> = {
  noroeste: [
    { texto: "SPAIN", x: 640, y: 300, cuerpo: 30 },
    { texto: "PORTUGAL", x: 95, y: 455, cuerpo: 20 },
  ],
  peninsula: [],
};

/** Grosor del trazo por vista. La peninsular abarca el doble de terreno,
 *  asi que necesita mas cuerpo para que las rutas no se afinen. */
const GROSOR = { noroeste: 9, peninsula: 13 } as const;

/** Lo que tarda en trazarse una ruta cuando se dibujan todas. */
const TRAZO = 34;
/** Retardo entre una ruta y la siguiente. */
const RELEVO = 9;

export const MapaRutas: React.FC<{
  desde?: number;
  /** Fotograma de la escena en el que se enciende Santiago. Se hace coincidir
   *  con el momento en que la locucion dice el nombre de la ciudad. */
  destino?: number;
  titulo?: string;
  vista?: "noroeste" | "peninsula";
  /** Clave de una ruta para dibujar solo esa, con su cuentakilometros. */
  soloRuta?: string;
  /** Fotogramas que tarda en trazarse, cuando va una sola ruta. */
  traza?: number;
  ancho?: number;
}> = ({
  desde = 0,
  destino = 96,
  titulo = "Northern Spain",
  vista = "noroeste",
  soloRuta,
  traza = 96,
  ancho = 936,
}) => {
  const frame = useCurrentFrame();
  const t = frame - desde;
  const { lienzo, tierra, santiago, rutas } = VISTAS[vista];

  const dibujadas = soloRuta ? rutas.filter((r) => r.clave === soloRuta) : rutas;
  const unica = soloRuta ? dibujadas[0] : undefined;

  const aparece = interpolate(t, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // El punto de destino crece cuando ya han llegado las primeras rutas.
  const llegada = interpolate(frame, [destino, destino + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...easeOut),
  });

  /** Kilometros recorridos, para el cuentakilometros de una sola ruta. */
  const km = unica
    ? Math.round(
        interpolate(t, [6, 6 + traza], [0, unica.km], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(...easeOut),
        }) / 5,
      ) * 5
    : 0;

  return (
    <Interactive.Div
      name="MapaRutas"
      style={{
        backgroundColor: color.bg1,
        borderRadius: radius.lg,
        boxShadow: shadow.raised,
        overflow: "hidden",
        width: ancho,
        opacity: aparece,
        translate: interpolate(t, [0, 18], ["0px 24px", "0px 0px"], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(...easeOut),
        }),
      }}
    >
      {/* Cabecera en placa olivo, como el resto de graficos del kit. */}
      <div
        style={{
          backgroundColor: brand.green,
          color: color.fgInverse,
          padding: `${space[4]}px ${space[6]}px`,
          fontSize: fontSize.xl,
          fontWeight: weight.black,
          letterSpacing: tracking.loose,
          textTransform: "uppercase",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: space[5],
        }}
      >
        <span>{titulo}</span>
        {unica ? (
          // El cuentakilometros avanza con el trazo: la cifra se ve crecer.
          <span style={{ fontSize: 46, letterSpacing: tracking.tight }}>
            {km} km
          </span>
        ) : null}
      </div>

      <svg
        viewBox={`0 0 ${lienzo.ancho} ${lienzo.alto}`}
        style={{ display: "block", width: "100%", backgroundColor: scale.green[0] }}
      >
        {/* Tierra: Espana, Portugal y Francia. El mar se queda en el verde
            mas claro de la escala, un paso por debajo, para que la costa se
            lea sin sacar un azul que la marca no tiene. */}
        <path
          d={tierra}
          fill={scale.green[2]}
          stroke={scale.green[5]}
          strokeWidth={1.6}
          strokeLinejoin="round"
        />

        {PAISES[vista].map((pais) => (
          <text
            key={pais.texto}
            x={pais.x}
            y={pais.y}
            textAnchor="middle"
            fill={scale.green[4]}
            fontSize={pais.cuerpo}
            fontWeight={weight.black}
            letterSpacing={pais.cuerpo / 5}
            opacity={0.7}
          >
            {pais.texto}
          </text>
        ))}

        {dibujadas.map((ruta, i) => {
          const inicio = soloRuta ? 6 : 16 + i * RELEVO;
          const cuanto = soloRuta ? traza : TRAZO;
          // El trazo se descubre con dasharray: el recorrido se ve avanzar.
          const avance = interpolate(t, [inicio, inicio + cuanto], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(...easeOut),
          });
          return (
            <g key={ruta.clave}>
              <path
                d={ruta.d}
                fill="none"
                stroke={brand.green}
                strokeWidth={GROSOR[vista] + (soloRuta ? 2 : 0)}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={ruta.largo}
                strokeDashoffset={ruta.largo * avance}
              />
              {/* Punto de partida de cada ruta. */}
              <circle
                cx={ruta.ox}
                cy={ruta.oy}
                r={9}
                fill={color.bg1}
                stroke={brand.green}
                strokeWidth={5}
                opacity={interpolate(t, [inicio, inicio + 8], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })}
              />
            </g>
          );
        })}

        {/* Santiago: donde converge todo. */}
        <circle
          cx={santiago.x}
          cy={santiago.y}
          r={14 + llegada * 24}
          fill={brand.lime}
          opacity={(1 - llegada) * 0.5}
        />
        <circle
          cx={santiago.x}
          cy={santiago.y}
          r={13}
          fill={brand.forest}
          stroke={brand.lime}
          strokeWidth={6}
          opacity={interpolate(t, [24, 36], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
        />
      </svg>
    </Interactive.Div>
  );
};
