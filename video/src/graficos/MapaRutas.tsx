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
import { LIENZO, RUTAS, SANTIAGO, TIERRA } from "./mapa-datos";

/**
 * El mapa de rutas. Es el grafico que mas trabaja de la pieza.
 *
 * Al espectador americano hay que situarlo: no sabe donde esta Galicia ni
 * que el Camino son varias rutas. El mapa lo cuenta sin locucion. Las lineas
 * se trazan una a una desde su origen y todas mueren en el mismo punto, que
 * es la idea entera: muchos caminos, una catedral.
 *
 * La geometria viene precalculada de `mapa-datos.ts`, generado a partir de
 * las polilineas reales del configurador de `herramientas/mapas-vfx`.
 */

/** Lo que tarda en trazarse una ruta. */
const TRAZO = 34;
/** Retardo entre una ruta y la siguiente. */
const RELEVO = 9;

export const MapaRutas: React.FC<{
  desde?: number;
  /** Fotograma del bloque en el que se enciende Santiago. Se hace coincidir
   *  con el momento en que la locucion dice el nombre de la ciudad. Va en
   *  fotogramas de la escena, no relativos a `desde`. */
  destino?: number;
  titulo?: string;
}> = ({ desde = 0, destino = 96, titulo = "Northern Spain" }) => {
  const frame = useCurrentFrame();
  const t = frame - desde;

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

  return (
    <Interactive.Div
      name="MapaRutas"
      style={{
        backgroundColor: color.bg1,
        borderRadius: radius.lg,
        boxShadow: shadow.raised,
        overflow: "hidden",
        width: 936,
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
        }}
      >
        {titulo}
      </div>

      <svg
        viewBox={`0 0 ${LIENZO.ancho} ${LIENZO.alto}`}
        style={{ display: "block", width: "100%", backgroundColor: scale.green[0] }}
      >
        {/* Tierra: Espana, Portugal y Francia. El mar se queda en el verde
            mas claro de la escala, un paso por debajo, para que la costa se
            lea sin sacar un azul que la marca no tiene. */}
        <path
          d={TIERRA}
          fill={scale.green[2]}
          stroke={scale.green[5]}
          strokeWidth={1.6}
          strokeLinejoin="round"
        />

        {/* Los paises, en tenue: sin esto el espectador no sabe que mira. */}
        <text
          x={640}
          y={300}
          textAnchor="middle"
          fill={scale.green[4]}
          fontSize={30}
          fontWeight={weight.black}
          letterSpacing="6"
          opacity={0.75}
        >
          SPAIN
        </text>
        <text
          x={95}
          y={455}
          textAnchor="middle"
          fill={scale.green[4]}
          fontSize={20}
          fontWeight={weight.black}
          letterSpacing="4"
          opacity={0.6}
        >
          PORTUGAL
        </text>

        {RUTAS.map((ruta, i) => {
          const inicio = 16 + i * RELEVO;
          // El trazo se descubre con dasharray: el recorrido se ve avanzar.
          const avance = interpolate(t, [inicio, inicio + TRAZO], [1, 0], {
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
                strokeWidth={9}
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
          cx={SANTIAGO.x}
          cy={SANTIAGO.y}
          r={14 + llegada * 24}
          fill={brand.lime}
          opacity={(1 - llegada) * 0.5}
        />
        <circle
          cx={SANTIAGO.x}
          cy={SANTIAGO.y}
          r={13}
          fill={brand.forest}
          stroke={brand.lime}
          strokeWidth={6}
          opacity={interpolate(t, [24, 36], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
        />
        <g opacity={llegada}>
          <line
            x1={SANTIAGO.x}
            y1={SANTIAGO.y + 18}
            x2={SANTIAGO.x}
            y2={SANTIAGO.y + 44}
            stroke={brand.forest}
            strokeWidth={4}
          />
          <text
            x={36}
            y={SANTIAGO.y + 74}
            textAnchor="start"
            fill={brand.forest}
            fontSize={26}
            fontWeight={weight.black}
            letterSpacing="1"
          >
            SANTIAGO DE COMPOSTELA
          </text>
        </g>
      </svg>
    </Interactive.Div>
  );
};
