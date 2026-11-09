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
import { Credencial } from "../graficos/Credencial";
import { DistanciaDetras } from "../graficos/DistanciaDetras";
import { PreguntaDetras } from "../graficos/PreguntaDetras";
import { Orbita } from "../componentes/Orbita";
import { AvisoSellos } from "../graficos/AvisoSellos";

/**
 * Hilary · Cómo conseguir la Compostela (pieza 03).
 *
 * La base es la pieza ya editada: subtítulos palabra a palabra, tarjetas y
 * banners van quemados en la imagen. Todo lo que se añade aquí respeta eso.
 *
 * Efectos con firma, uno por bloque y nunca dos en menos de seis segundos:
 * - 0 s: zoom de entrada en el gancho.
 * - 2,4 s: caja con los mínimos de distancia por detrás de Hilary.
 * - 8,7 s: la tarjeta de la credencial rehecha encima de la quemada, que
 *   tenía demasiado texto y a 26 px.
 * - 16 s: el aviso de los sellos rehecho encima del quemado, con la regla
 *   sola y los dos sellos cayendo cuando la voz los dice.
 * - 24,5 s: la lista de requisitos sobre el plano de la fuente.
 * - 33,6 s: orbit de vuelta a Hilary. El bloque final queda quieto: es el CTA.
 * - 36,2 s: "Ask us below", por detrás de Hilary, reforzando lo que dice.
 *
 * Por debajo van los recursos que no se notan: zoom de énfasis en las
 * palabras clave, empuje lento en los planos de recurso largos y barrido
 * olivo en los cambios de bloque.
 *
 * Los tiempos salen de la transcripción por palabra y de los cortes medidos
 * con detección de escena, no a ojo.
 */

const VIDEO = "hilary/03-compostela.mp4";
/** Recortes de Hilary con fondo transparente, generados con
 *  herramientas/scripts/recortar.py, y el fondo sin ella para el orbit. */
const RECORTE_DATO = { src: "hilary/03-recorte-dato.webm", desde: 70, dur: 126 };
const RECORTE_FINAL = { src: "hilary/03-recorte-final.webm", desde: 1078, dur: 102 };
const ORBIT = {
  figura: "hilary/03-recorte-orbit.webm",
  fondo: "hilary/03-fondo-orbit.mp4",
  // Tiene que acabar antes de que entre el banner quemado de redes (fotograma
  // 1022): si lo pilla, el banner gira desenfocado con el fondo.
  dur: 22,
};
export const DURACION_COMPOSTELA = 1380;

/** Cortes de plano reales, en fotogramas a 30 fps. */
const CORTE = {
  credencial: 193,
  sellando: 384,
  sello2: 482,
  fuente: 736,
  sellando2: 877,
  final: 1008,
  credencialEntra: 261,
  credencialSale: 370,
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
  leaveThem: 1086, // "leave them below"
  comments: 1171, // "the comments"
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
  // El bloque final entra con el orbit y luego queda quieto: es el CTA.
  [CORTE.final, 1],
  [DURACION_COMPOSTELA, 1],
];

/**
 * El metraje y todo lo que tiene que moverse con él. Lo que va dentro se
 * escala junto: la tarjeta de detrás y el recorte siguen pegados a Hilary
 * aunque haya un zoom de énfasis.
 */
const Base: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill
        style={{
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
      >
        <OffthreadVideo src={staticFile(VIDEO)} style={{ width: "100%", height: "100%" }} />
        {children}
      </AbsoluteFill>
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
      <Base>
        {/* Dato detrás de Hilary: fondo, tarjeta y ella recortada encima. */}
        <DistanciaDetras
          entrada={RECORTE_DATO.desde + 2}
          aPie={VOZ.cien}
          enBici={VOZ.doscientos}
          salida={CORTE.credencial - 16}
          fuente="Pilgrim's Office"
        />
        <Sequence from={RECORTE_DATO.desde} durationInFrames={RECORTE_DATO.dur} name="Recorte de Hilary">
          <OffthreadVideo
            src={staticFile(RECORTE_DATO.src)}
            transparent
            muted
            style={{ width: "100%", height: "100%" }}
          />
        </Sequence>

        {/* Refuerzo del CTA de la voz, también por detrás de Hilary. */}
        <PreguntaDetras entrada={VOZ.leaveThem} salida={VOZ.comments - 18} />
        <Sequence from={RECORTE_FINAL.desde} durationInFrames={RECORTE_FINAL.dur} name="Recorte final">
          <OffthreadVideo
            src={staticFile(RECORTE_FINAL.src)}
            transparent
            muted
            style={{ width: "100%", height: "100%" }}
          />
        </Sequence>
      </Base>

      {/* Cambios de bloque. El último lo hace el orbit. */}
      {[CORTE.credencial, CORTE.sellando, CORTE.fuente].map((c) => (
        <Sequence key={c} from={c - MEDIA} durationInFrames={TOTAL} name={`Transición ${c}`}>
          <Transicion />
        </Sequence>
      ))}

      <Credencial entrada={CORTE.credencialEntra} salida={CORTE.credencialSale} />

      {/* Tapa el aviso quemado, que tenía dos frases largas, con la regla sola. */}
      <AvisoSellos entrada={CORTE.sello2} golpes={[VOZ.two, VOZ.stamps2 + 2]} salida={606} />

      <Sequence from={CORTE.fuente + 4} durationInFrames={CORTE.final - CORTE.fuente - 4} name="Requisitos">
        <Requisitos salida={CORTE.final - CORTE.fuente - 4 - 16} aviso={VOZ.justRemember - CORTE.fuente - 4} />
      </Sequence>

      {/* Orbit de vuelta a Hilary: gira y se funde con el plano original. */}
      <Sequence from={CORTE.final} durationInFrames={ORBIT.dur} name="Orbit">
        <OrbitaConSalida />
      </Sequence>

      {/* El cierre de la casa sustituye a la cartela verde plana del original. */}
      <Sequence from={CORTE.cierre} name="Cierre">
        <Cierre duracion={DURACION_COMPOSTELA - CORTE.cierre} />
      </Sequence>
    </AbsoluteFill>
  );
};

const OrbitaConSalida: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        opacity: interpolate(frame, [ORBIT.dur - 6, ORBIT.dur], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      <Orbita fondo={ORBIT.fondo} figura={ORBIT.figura} duracion={ORBIT.dur - 6} giro={10} />
    </AbsoluteFill>
  );
};
