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
import { brand, easeOut, fontFamily, fps, margin } from "../brand/theme";
import { Cartela } from "../componentes/Cartela";
import { Logo } from "../componentes/Logo";
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

/** Barrido lateral del kit: 27 fotogramas. */
const BARRIDO = 27;

export const Short: React.FC<{ id: string }> = ({ id }) => {
  const d = datos.find((x) => x.id === id) as DatosShort;
  const total = f(d.duracion);
  const finVoz = f(d.cierre.en);

  return (
    <AbsoluteFill style={{ backgroundColor: brand.forest, fontFamily }}>
      {/* Hildary hablando, cortada y pegada del vídeo limpio con su propio
          audio: imagen y voz salen del mismo clip, así que no pueden
          descuadrarse. El B-roll va encima y la voz sigue sonando debajo.
          Cada tramo alterna el encuadre para que el corte se lea como un
          cambio de plano. */}
      {d.video.map((v, i) => (
        <Sequence key={`v${i}`} {...tramo(v.en, v.dur)} name={`Plano ${i + 1}`}>
          <PlanoHabla src={v.src} zoom={v.zoom} dur={f(v.en + v.dur) - f(v.en)} />
        </Sequence>
      ))}

      {d.broll.map((b, i) => (
        <Sequence key={`b${i}`} {...tramo(b.en, b.dur)} name={`B-roll ${i + 1}`}>
          <BRoll src={b.src} desde={b.desde} modo={b.modo} dur={f(b.dur)} />
        </Sequence>
      ))}

      {d.capas.map((c, i) => (
        <Sequence key={`c${i}`} {...tramo(c.en, c.dur)} name={`Cartela ${i + 1}`}>
          <CartelaPng src={c.src} ancho={c.ancho} dur={f(c.dur)} />
        </Sequence>
      ))}

      <ExpertoSiCabe d={d} />

      <Sequence durationInFrames={f(d.gancho.dur)} name="Gancho">
        <Gancho titulo={d.titulo} acento={d.acento} src={d.gancho.src} />
      </Sequence>

      {/* La marca y los subtítulos acompañan toda la pieza, gancho incluido. */}
      <Sequence durationInFrames={finVoz} name="Marca">
        <Logo
          variante="blanco"
          ancho={200}
          style={{ position: "absolute", left: 60, top: 110, opacity: 0.95 }}
        />
      </Sequence>

      <Sequence durationInFrames={finVoz} name="Subtítulos">
        <Subtitulos palabras={d.palabras} />
      </Sequence>

      <Sequence from={finVoz} durationInFrames={total - finVoz} name="Cierre">
        <Cierre duracion={total - finVoz} />
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

const BRoll: React.FC<{ src: string; desde: number; modo: string; dur: number }> = ({ src, desde, modo, dur }) => {
  const frame = useCurrentFrame();
  const entra = interpolate(frame, [0, 3], [0, 1], clamp);
  const video = (style: React.CSSProperties) => (
    <OffthreadVideo src={staticFile(src)} trimBefore={f(desde)} muted style={style} />
  );

  if (modo === "tarjeta") {
    // Gráfico horizontal: encajado entero sobre una versión desenfocada de sí mismo.
    return (
      <AbsoluteFill style={{ opacity: entra, backgroundColor: brand.forest }}>
        {video({ width: "100%", height: "100%", objectFit: "cover", filter: "blur(36px)", scale: 1.2 })}
        <AbsoluteFill style={{ backgroundColor: "rgba(14, 44, 31, 0.45)" }} />
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <div
            style={{
              width: 1000,
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0 24px 48px rgba(14, 44, 31, 0.45)",
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
          top: 250,
          left: ancho >= 900 ? (1080 - ancho) / 2 : margin,
          width: ancho,
          height: "auto",
          clipPath: `inset(0 ${derecha}% 0 ${izquierda}%)`,
          filter: "drop-shadow(0 10px 22px rgba(14, 44, 31, 0.35))",
        }}
      />
    </AbsoluteFill>
  );
};

/** El rótulo de experta del vídeo largo, solo si la franja superior está libre. */
const ExpertoSiCabe: React.FC<{ d: DatosShort }> = ({ d }) => {
  const a = d.gancho.dur + 0.3;
  const b = a + 3.2;
  const libre = d.capas.every((c) => c.en > b + 0.2 || c.en + c.dur < a);
  const brollEncima = d.broll.some((x) => x.en < b && x.en + x.dur > a);
  if (!libre || brollEncima) return null;
  return (
    <Sequence from={f(a)} durationInFrames={f(b - a)} name="Camino Expert">
      <Cartela principal="Camino Expert" secundaria="French Way specialist" desde={0} />
    </Sequence>
  );
};

/* ------------------------------------------------------------------ */

/**
 * Gancho: el titular grande detrás de Hildary, recortada sin fondo sobre los
 * verdes de la marca. El texto queda por detrás de la cabeza para dar
 * profundidad, pero la frase se lee entera por encima.
 */
const Gancho: React.FC<{ titulo: string[]; acento: number; src: string }> = ({ titulo, acento, src }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 80% at 50% 30%, ${brand.greenDark} 0%, ${brand.forest} 55%, ${brand.forestDeep} 100%)`,
      }}
    >
      <Interactive.Div
        name="Titular del gancho"
        style={{
          position: "absolute",
          top: 230,
          left: 56,
          right: 56,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          scale: interpolate(frame, [0, 10], [1.08, 1], { ...clamp, easing: salida }),
        }}
      >
        {titulo.map((linea, i) => (
          <div
            key={i}
            style={{
              // Montserrat 900 en mayúsculas ocupa unos 0,8 em por letra.
              fontSize: Math.min(124, Math.floor(950 / (linea.length * 0.8))),
              lineHeight: 1.04,
              fontWeight: 900,
              letterSpacing: "-0.02em",
              textTransform: "uppercase",
              color: i === acento ? brand.lime : brand.white,
              whiteSpace: "nowrap",
              textShadow: "0 6px 24px rgba(14, 44, 31, 0.5)",
              clipPath: `inset(0 ${interpolate(frame, [i * 4, i * 4 + 12], [100, 0], { ...clamp, easing: salida })}% 0 0)`,
            }}
          >
            {linea}
          </div>
        ))}
      </Interactive.Div>

      <AbsoluteFill
        style={{
          opacity: interpolate(frame, [2, 10], [0, 1], clamp),
          translate: `0px ${interpolate(frame, [2, 14], [330, 300], { ...clamp, easing: salida })}px`,
          scale: 0.86,
        }}
      >
        <OffthreadVideo
          src={staticFile(src)}
          transparent
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
