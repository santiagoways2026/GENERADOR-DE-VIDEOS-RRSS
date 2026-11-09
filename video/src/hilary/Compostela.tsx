import {
  AbsoluteFill,
  Easing,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import "../fuentes";
import { brand, color, easeOut, fontFamily, margin, tracking, weight } from "../brand/theme";
import { Bullets } from "../componentes/Bullets";
import { MEDIA, TOTAL, Transicion } from "../componentes/Transicion";
import { Cierre } from "../escenas/Cierre";
import { Distancias } from "../graficos/Distancias";
import { Sellos } from "../graficos/Sellos";

/**
 * Hilary · Cómo conseguir la Compostela (pieza 03).
 *
 * La base es la pieza ya editada: subtítulos palabra a palabra, tarjetas y
 * banners van quemados en la imagen. Todo lo que se añade aquí respeta eso:
 *
 * - Los subtítulos ocupan de 1275 a 1450 px de alto. Los gráficos van debajo,
 *   desde 1480, sobre la camiseta oscura, que es la zona limpia.
 * - El zoom de énfasis solo entra en tramos sin tarjeta quemada ancha: un
 *   zoom ahí recortaría los bordes de la tarjeta.
 * - Los gráficos nuevos solo aparecen donde la parte de arriba o de abajo
 *   está libre, para no apilarse con lo que ya había.
 *
 * Los tiempos salen de la transcripción por palabra y de los cortes medidos
 * con detección de escena, no a ojo.
 */

const VIDEO = "hilary/03-compostela.mp4";
export const DURACION_COMPOSTELA = 1380;

/** Cortes de plano reales, en fotogramas a 30 fps. */
const CORTE = {
  credencial: 193,
  sellando: 384,
  sello2: 482,
  fuente: 736,
  sellando2: 877,
  final: 1008,
  cierre: 1335,
};

/** Palabras clave de la locución, en fotogramas. */
const VOZ = {
  cien: 77, // "100"
  doscientos: 138, // "200"
  stamps: 431, // "stamps" en "you collect stamps"
  two: 582, // "two" en "two stamps per day"
  stamps2: 591,
  justRemember: 828,
};

/**
 * Escala del metraje en cada fotograma. Los saltos caen en cortes de plano,
 * donde no se ven; los acercamientos, en la palabra que se quiere subrayar.
 */
const ZOOM: [number, number][] = [
  [0, 1.08],
  [15, 1],
  [VOZ.cien, 1],
  [VOZ.cien + 6, 1.05],
  [VOZ.doscientos, 1.05],
  [VOZ.doscientos + 6, 1.09],
  [CORTE.credencial - 0.01, 1.09],
  [CORTE.credencial, 1],
  [VOZ.stamps, 1],
  [VOZ.stamps + 6, 1.08],
  [CORTE.sello2 - 0.01, 1.08],
  [CORTE.sello2, 1],
  [CORTE.fuente, 1],
  [CORTE.sellando2 - 0.01, 1.05],
  [CORTE.sellando2, 1],
  [CORTE.final - 0.01, 1.05],
  [CORTE.final, 1],
  [DURACION_COMPOSTELA, 1],
];

const Base: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <OffthreadVideo
        src={staticFile(VIDEO)}
        style={{
          width: "100%",
          height: "100%",
          // El origen va a la altura de la cara, así el acercamiento la centra.
          transformOrigin: "50% 40%",
          scale: interpolate(
            frame,
            ZOOM.map(([f]) => f),
            ZOOM.map(([, s]) => s),
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(...easeOut),
            },
          ),
        }}
      />
    </AbsoluteFill>
  );
};

/** Requisitos en el plano de la fuente, que tiene la parte de arriba libre. */
const Requisitos: React.FC<{ salida: number; aviso: number }> = ({ salida, aviso }) => {
  const frame = useCurrentFrame();
  const fade = (desde: number, hasta: number, a: number, b: number) =>
    interpolate(frame, [desde, hasta], [a, b], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  return (
    <AbsoluteFill
      style={{
        padding: margin,
        paddingTop: 200,
        alignItems: "stretch",
        opacity: fade(salida, salida + 8, 1, 0),
      }}
    >
      <div
        style={{
          alignSelf: "flex-start",
          backgroundColor: brand.forest,
          color: brand.lime,
          fontSize: 26,
          fontWeight: weight.black,
          letterSpacing: tracking.loose,
          textTransform: "uppercase",
          padding: "10px 18px",
          borderRadius: "6px 6px 0 0",
          marginBottom: 12,
          opacity: fade(4, 14, 0, 1),
        }}
      >
        To get your Compostela
      </div>
      <Bullets
        desde={12}
        relevo={20}
        items={["Walk 100 km or cycle 200", "Carry your credential", "2 stamps a day, last 100 km"]}
      />
      <div
        style={{
          alignSelf: "flex-start",
          marginTop: 16,
          backgroundColor: brand.forest,
          color: color.fgInverse,
          fontSize: 26,
          fontWeight: weight.bold,
          letterSpacing: tracking.loose,
          textTransform: "uppercase",
          padding: "8px 16px",
          borderRadius: 6,
          opacity: fade(aviso, aviso + 12, 0, 1),
        }}
      >
        Source: Pilgrim's Office · check before you go
      </div>
    </AbsoluteFill>
  );
};

export const HilaryCompostela: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: brand.forest, fontFamily }}>
      <Base />

      {/* Cambios de bloque. En el resto de cortes no: cansaría. */}
      {[CORTE.credencial, CORTE.sellando, CORTE.fuente, CORTE.final].map((c) => (
        <Sequence key={c} from={c - MEDIA} durationInFrames={TOTAL} name={`Transición ${c}`}>
          <Transicion />
        </Sequence>
      ))}

      <Distancias
        aPie={VOZ.cien}
        enBici={VOZ.doscientos}
        salida={CORTE.credencial - 14}
        fuente="Source: Pilgrim's Office, Santiago"
      />

      <Sellos
        desde={VOZ.two - 12}
        golpes={[VOZ.two, VOZ.stamps2 + 2]}
        texto="Every day · last 100 km"
        salida={627 - 10}
      />

      <Sequence from={CORTE.fuente + 4} durationInFrames={CORTE.final - CORTE.fuente - 4} name="Requisitos">
        <Requisitos salida={CORTE.final - CORTE.fuente - 4 - 16} aviso={VOZ.justRemember - CORTE.fuente - 4} />
      </Sequence>

      {/* El cierre de la casa sustituye a la cartela verde plana del original. */}
      <Sequence from={CORTE.cierre} name="Cierre">
        <Cierre duracion={DURACION_COMPOSTELA - CORTE.cierre} />
      </Sequence>
    </AbsoluteFill>
  );
};
