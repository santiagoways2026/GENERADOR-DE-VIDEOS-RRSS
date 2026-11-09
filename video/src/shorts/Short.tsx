import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  Interactive,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import "../fuentes";
import { brand, easeOut, fontFamily, fps, margin, paleta } from "../brand/theme";
import { Cartela } from "../componentes/Cartela";
import { Barrido, Credencial, DondeSellar, DosSellos, ExpertoDistancias, Requisitos, Suscribete } from "./Graficos";
import { Cierre } from "../escenas/Cierre";
import { Subtitulos } from "./Subtitulos";
import datos from "./shorts.json";

/**
 * Short vertical sacado del vídeo largo de Hildary.
 *
 * Todo el montaje viene resuelto en shorts.json, en segundos de salida:
 * lo genera herramientas/scripts/shorts_hilary.py a partir de la
 * transcripción, así que aquí solo se pinta.
 *
 * Capas, de abajo arriba: Hildary hablando, B-roll sincronizado con la voz,
 * cartelas y CTA en la franja superior, subtítulos palabra a palabra sobre
 * el torso, el gancho inicial y el cierre de marca.
 */

export type DatosShort = (typeof datos)[number];

const f = (s: number) => Math.round(s * fps);
/** Frames de un tramo sin huecos por redondeo entre tramos contiguos. */
const tramo = (en: number, dur: number) => ({
  from: f(en),
  durationInFrames: Math.max(1, f(en + dur) - f(en)),
});

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const salida = Easing.bezier(...easeOut);

/** Hildary queda algo a la derecha del centro en el bruto horizontal. */
const ENCUADRE = "55% 38%";

/**
 * Zona segura de TikTok e Instagram en 1080x1920 (plantilla en
 * herramientas/zona-segura-redes.png): de y 115 a 958 se puede usar de x 46 a
 * 1033, salvo el bloque central de y 133 a 216; de y 958 a 1545, solo hasta
 * x 886, porque a la derecha van los botones. Por debajo de 1545, nada.
 */
export const SEGURA = { arriba: 250, izquierda: 60, derecha: 1020, derechaAbajo: 876, corte: 958, abajo: 1545 };

/** Barrido lateral del kit: 27 fotogramas. */
const BARRIDO = 27;

export const Short: React.FC<{ id: string }> = ({ id }) => {
  const d = datos.find((x) => x.id === id) as DatosShort;
  const total = f(d.duracion);
  const finVoz = f(d.cierre.en);

  return (
    <AbsoluteFill style={{ backgroundColor: paleta.verdeWays, fontFamily }}>
      {/* Hildary hablando, cortada y pegada del vídeo limpio con su propio
          audio: imagen y voz salen del mismo clip, así que no pueden
          descuadrarse. El B-roll va encima y la voz sigue sonando debajo.
          Cada tramo alterna el encuadre para que el corte se lea como un
          cambio de plano. */}
      <Golpes golpes={(d as { golpes?: Golpe[] }).golpes ?? []}>
        {d.video.map((v, i) => (
          <Sequence key={`v${i}`} {...tramo(v.en, v.dur)} name={`Plano ${i + 1}`}>
            <PlanoHabla src={v.src} zoom={v.zoom} dur={f(v.en + v.dur) - f(v.en)} />
          </Sequence>
        ))}
      </Golpes>

      {d.broll.map((b, i) => (
        <Sequence key={`b${i}`} {...tramo(b.en, b.dur)} name={`B-roll ${i + 1}`}>
          {/* Si enlaza con el anterior, entra en seco: un fundido dejaría ver
              a Hildary un instante entre los dos. */}
          <BRoll
            src={b.src}
            desde={b.desde}
            modo={b.modo}
            dur={f(b.dur)}
            seguido={i > 0 && b.en - (d.broll[i - 1].en + d.broll[i - 1].dur) < 0.2}
            vel={"vel" in b ? (b.vel as number) : 1}
          />
        </Sequence>
      ))}

      {d.capas.map((c, i) => (
        <Sequence key={`c${i}`} {...tramo(c.en, c.dur)} name={`Cartela ${i + 1}`}>
          {(c as { tipo?: string }).tipo === "grafico" ? (
            <Grafico c={c as unknown as CapaGrafico} />
          ) : (c as { tipo?: string }).tipo === "cartela" ? (
            <Cartela
              principal={(c as { principal?: string }).principal ?? ""}
              secundaria={(c as { secundaria?: string }).secundaria}
              top={SEGURA.arriba}
              tinta={paleta.grafito}
            />
          ) : (
            <CartelaPng src={c.src} ancho={c.ancho} dur={f(c.dur)} />
          )}
        </Sequence>
      ))}

      {/* Sin rótulo "Camino Expert": no hay cartela del kit para él y no se escribe a mano. */}

      <Sequence durationInFrames={f(d.gancho.dur)} name="Gancho">
        <Gancho titulo={d.titulo} acento={d.acento} src={d.gancho.src} />
      </Sequence>

      {/* Los subtítulos acompañan toda la pieza, gancho incluido. */}
      <Sequence durationInFrames={finVoz} name="Subtítulos">
        <Subtitulos palabras={d.palabras} soloVerde trasTitular={d.gancho.dur} />
      </Sequence>

      <Sequence from={finVoz} durationInFrames={total - finVoz} name="Cierre">
        <Cierre duracion={total - finVoz} fondo={paleta.verdeWays} />
      </Sequence>

      {/* Música de fondo y efectos. La voz no va aquí: sale de cada plano. */}
      <Audio
        src={staticFile(d.musica.src)}
        trimBefore={f(d.musica.desde)}
        loop
        volume={(fr) =>
          interpolate(fr, [0, 12, finVoz - 6, finVoz + 6, total - 12, total], [0, d.musica.vol, d.musica.vol, 0.16, 0.16, 0], clamp)
        }
      />
      {d.sfx.map((s, i) => (
        <Sequence key={`s${i}`} from={f(s.en)} durationInFrames={f(1.5)} name={`Efecto ${i + 1}`}>
          <Audio src={staticFile(s.src)} volume={s.vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */

type CapaGrafico = { g: string; dur: number; pasos?: { texto: string; en: number }[]; nota?: string; pregunta?: [number, number] };

/** Gráficos propios del short (Graficos.tsx), elegidos por nombre. */
const Grafico: React.FC<{ c: CapaGrafico }> = ({ c }) => {
  const dur = f(c.dur);
  if (c.g === "experto") return <ExpertoDistancias dur={dur} />;
  if (c.g === "credencial") return <Credencial dur={dur} />;
  if (c.g === "sellos") return <DosSellos dur={dur} />;
  if (c.g === "donde") return <DondeSellar dur={dur} />;
  if (c.g === "requisitos") return <Requisitos dur={dur} pasos={c.pasos ?? []} nota={c.nota ?? ""} />;
  if (c.g === "suscribete") return <Suscribete dur={dur} pregunta={c.pregunta ?? [0, 0]} />;
  if (c.g === "barrido") return <Barrido />;
  return null;
};

type Golpe = { en: number; hasta: number; escala: number };

/**
 * Acercamientos de cámara en las frases clave: el plano de Hildary se cierra
 * despacio, se mantiene y vuelve también despacio antes de `hasta`.
 */
const Golpes: React.FC<{ golpes: Golpe[]; children: React.ReactNode }> = ({ golpes, children }) => {
  const frame = useCurrentFrame();
  const t = frame / fps;
  const g = golpes.find((x) => t >= x.en && t < x.hasta);
  // Entrada y salida lentas (1,2 s y 0,8 s) con la curva de la marca: se nota
  // el acercamiento, pero nunca como un corte.
  const escala = g
    ? interpolate(frame, [f(g.en), f(g.en + 1.2), f(g.hasta - 0.8), f(g.hasta)], [1, g.escala, g.escala, 1], {
        ...clamp,
        easing: Easing.inOut(Easing.cubic),
      })
    : 1;
  return <AbsoluteFill style={{ scale: escala, transformOrigin: "50% 32%" }}>{children}</AbsoluteFill>;
};

/** Un tramo ya cortado del vídeo limpio, con su voz. Se pega tal cual. */
const PlanoHabla: React.FC<{ src: string; zoom: number; dur: number }> = ({ src, zoom, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <OffthreadVideo
        src={staticFile(src)}
        // Fundido de dos fotogramas en cada corte para que no chasquee.
        volume={(fr) => interpolate(fr, [0, 2, dur - 2, dur], [0, 1, 1, 0], clamp)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: ENCUADRE,
          // Acercamiento muy lento dentro del plano para que nunca quede quieto.
          scale: interpolate(frame, [0, dur], [zoom, zoom * 1.035], clamp),
          transformOrigin: "55% 30%",
        }}
      />
    </AbsoluteFill>
  );
};

const BRoll: React.FC<{ src: string; desde: number; modo: string; dur: number; seguido?: boolean; vel?: number }> = ({
  src,
  desde,
  modo,
  dur,
  seguido = false,
  // Un recurso alargado para enlazar con el siguiente va algo más lento.
  vel = 1,
}) => {
  const frame = useCurrentFrame();
  const entra = seguido ? 1 : interpolate(frame, [0, 3], [0, 1], clamp);
  const video = (style: React.CSSProperties) => (
    <OffthreadVideo src={staticFile(src)} trimBefore={f(desde)} playbackRate={vel} muted style={style} />
  );

  if (modo === "mapa") {
    // Mapa vertical: trae sus propios textos (titular arriba, etapa y km
    // abajo) que a tamaño completo caen bajo la interfaz de la red y bajo los
    // subtítulos. Reducido al 66 % y recortado antes de la marca de agua,
    // todo queda entre y 250 y 1240 y a la izquierda de los botones.
    const ESCALA = 0.66;
    return (
      <AbsoluteFill style={{ opacity: entra, backgroundColor: paleta.verdeWays }}>
        {video({ width: "100%", height: "100%", objectFit: "cover", filter: "blur(40px)", scale: 1.25, opacity: 0.7 })}
        <div
          style={{
            position: "absolute",
            left: 150,
            top: 120,
            width: 1080 * ESCALA,
            height: 1700 * ESCALA,
            overflow: "hidden",
            borderRadius: 18,
            boxShadow: "0 24px 48px rgba(46, 46, 45, 0.3)",
            translate: `0px ${interpolate(frame, [0, 12], [24, 0], { ...clamp, easing: salida })}px`,
          }}
        >
          {video({ width: 1080 * ESCALA, height: 1920 * ESCALA, display: "block" })}
        </div>
      </AbsoluteFill>
    );
  }

  if (modo === "tarjeta") {
    // Gráfico horizontal: encajado entero sobre una versión desenfocada de sí mismo.
    return (
      <AbsoluteFill style={{ opacity: entra, backgroundColor: paleta.verdeWays }}>
        {video({ width: "100%", height: "100%", objectFit: "cover", filter: "blur(36px)", scale: 1.2 })}
        <AbsoluteFill style={{ backgroundColor: "rgba(46, 46, 45, 0.3)" }} />
        {/* Encajado entero por encima de y 958, donde no llegan los botones. */}
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 410 }}>
          <div
            style={{
              width: 960,
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0 24px 48px rgba(46, 46, 45, 0.3)",
              translate: `0px ${interpolate(frame, [0, 12], [24, 0], { ...clamp, easing: salida })}px`,
            }}
          >
            {video({ width: "100%", display: "block" })}
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ opacity: entra, overflow: "hidden" }}>
      {video({
        width: "100%",
        height: "100%",
        objectFit: "cover",
        scale: interpolate(frame, [0, dur], [1.02, 1.1], clamp),
      })}
    </AbsoluteFill>
  );
};

/** Cartela o CTA del kit, en PNG, con el barrido lateral de entrada y salida. */
const CartelaPng: React.FC<{ src: string; ancho: number; dur: number }> = ({ src, ancho, dur }) => {
  const frame = useCurrentFrame();
  const derecha = interpolate(frame, [0, BARRIDO], [100, 0], { ...clamp, easing: salida });
  const izquierda = interpolate(frame, [dur - 9, dur], [0, 100], { ...clamp, easing: Easing.in(Easing.cubic) });
  return (
    <AbsoluteFill>
      <Img
        src={staticFile(src)}
        style={{
          position: "absolute",
          top: SEGURA.arriba,
          left: ancho >= 900 ? (1080 - ancho) / 2 : margin,
          width: Math.min(ancho, SEGURA.derecha - SEGURA.izquierda),
          height: "auto",
          clipPath: `inset(0 ${derecha}% 0 ${izquierda}%)`,
          filter: "drop-shadow(0 10px 22px rgba(46, 46, 45, 0.25))",
        }}
      />
    </AbsoluteFill>
  );
};

/** El rótulo de experta del vídeo largo, solo si la franja superior está libre. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const ExpertoSiCabe: React.FC<{ d: DatosShort }> = ({ d }) => {
  const a = d.gancho.dur + 0.3;
  const b = a + 3.2;
  const libre = d.capas.every((c) => c.en > b + 0.2 || c.en + c.dur < a);
  const brollEncima = d.broll.some((x) => x.en < b && x.en + x.dur > a);
  if (!libre || brollEncima) return null;
  return (
    <Sequence from={f(a)} durationInFrames={f(b - a)} name="Camino Expert">
      <Cartela principal="Camino Expert" secundaria="French Way specialist" desde={0} top={SEGURA.arriba} tinta={paleta.grafito} />
    </Sequence>
  );
};

/* ------------------------------------------------------------------ */

/**
 * Gancho: el titular grande sobre el plano real de Hildary, sin cartela
 * blanca (el equipo la descartó en noviembre de 2026).
 */
const Gancho: React.FC<{ titulo: string[]; acento: number; src: string }> = ({ titulo, acento }) => {
  // Sin cartela blanca: el titular va sobre el plano real de Hildary, con un
  // velo grafito suave arriba para que se lea sobre el fondo.
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background: "linear-gradient(180deg, rgba(46,46,45,0.5) 0%, rgba(46,46,45,0.28) 22%, rgba(46,46,45,0) 34%)",
          opacity: interpolate(frame, [0, 6], [0, 1], clamp),
        }}
      />
      <Interactive.Div
        name="Titular del gancho"
        style={{
          position: "absolute",
          top: 160,
          left: 56,
          right: 56,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          scale: interpolate(frame, [0, 10], [1.08, 1], { ...clamp, easing: salida }),
        }}
      >
        {titulo.map((linea, i) => (
          <div
            key={i}
            style={{
              // Brandbook 2027: minúscula de frase, Montserrat 800 (unos 0,66 em por letra).
              fontSize: Math.min(92, Math.floor(900 / (linea.length * 0.66))),
              lineHeight: 1.1,
              fontWeight: 800,
              letterSpacing: "-0.01em",
              color: brand.white,
              backgroundColor: i === acento ? paleta.verdeWays : "transparent",
              padding: i === acento ? "2px 20px 8px" : 0,
              borderRadius: 10,
              whiteSpace: "nowrap",
              WebkitTextStroke: i === acento ? "0px" : `10px ${paleta.grafito}`,
              paintOrder: "stroke fill",
              clipPath: `inset(0 ${interpolate(frame, [i * 4, i * 4 + 12], [100, 0], { ...clamp, easing: salida })}% 0 0)`,
            }}
          >
            {linea}
          </div>
        ))}
      </Interactive.Div>
    </AbsoluteFill>
  );
};
