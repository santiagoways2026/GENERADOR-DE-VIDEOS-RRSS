import {
  AbsoluteFill,
  Audio,
  Composition,
  Easing,
  Interactive,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import "../fuentes";
import { brand, easeOut, fontFamily, format, fps, paleta, EFECTOS } from "../brand/theme";
import { Dato } from "../shorts/Graficos";
import { Cierre } from "../escenas/Cierre";
import { Subtitulos } from "../shorts/Subtitulos";
import datosPaula from "./paula.json";
import equipo from "./equipo.json";

type Datos = typeof datosPaula;

/**
 * Short de Paula en el mojón: cinco tomas del mismo plano con su propio audio
 * (herramientas/scripts/short_paula.py). Los cortes entre tomas quedan bajo un
 * recurso de metraje propio, así no se ve el salto de un mismo encuadre.
 *
 * El plano es abierto: se acerca hacia Paula (a la izquierda del mojón) y
 * alterna dos acercamientos entre tomas.
 */

const f = (s: number) => Math.round(s * fps);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const salida = Easing.bezier(...easeOut);
const ARRIBA = 240;

export const ShortPaula: React.FC<{ id?: string }> = ({ id }) => {
  const datos = (id ? (equipo as unknown as Datos[]).find((x) => (x as unknown as { id: string }).id === id) : datosPaula) as Datos;
  const total = f(datos.duracion);
  const finVoz = f(datos.finVoz);
  // El titular dura 3,4 s salvo que el short pida menos (si la primera frase
  // se dice muy pronto, así entra con subtítulos).
  const durTitular = (datos as { tituloDur?: number }).tituloDur ?? 3.4;
  return (
    <AbsoluteFill style={{ backgroundColor: paleta.verdeWays, fontFamily }}>
      {datos.planos.map((p, i) => (
        <Sequence key={`p${i}`} from={f(p.en)} durationInFrames={f(p.en + p.dur) - f(p.en)} name={`Toma ${i + 1}`}>
          <Toma src={p.src} desde={p.desde} zoom={p.zoom} dur={f(p.en + p.dur) - f(p.en)} />
        </Sequence>
      ))}

      {datos.recursos.map((r, i) => (
        <Sequence key={`r${i}`} from={f(r.en)} durationInFrames={f(r.dur)} name={`Recurso ${i + 1}`}>
          <Recurso
            src={r.src}
            desde={r.desde}
            dur={f(r.dur)}
            // Pegado al anterior entra en seco: un fundido dejaba ver a Paula un fotograma.
            // Si arranca a la vez que una toma, también en seco: el fundido
            // dejaba ver unos fotogramas de la toma nueva (un salto de plano).
            seguido={
              (i > 0 && r.en - (datos.recursos[i - 1].en + datos.recursos[i - 1].dur) < 0.1) ||
              datos.planos.some((p) => Math.abs(p.en - r.en) < 0.05)
            }
          />
        </Sequence>
      ))}

      <Sequence durationInFrames={f(durTitular)} name="Titular">
        {(datos as { tituloCaja?: string[] }).tituloCaja ? (
          <TitularCaja lineas={(datos as unknown as { tituloCaja: string[] }).tituloCaja} ante={(datos as { tituloAnte?: string }).tituloAnte} dur={f(durTitular)} top={(datos as { tituloTop?: number }).tituloTop} maxTam={(datos as { tituloTam?: number }).tituloTam} />
        ) : (
          <Titular lineas={datos.titulo} dur={f(durTitular)} top={(datos as { tituloTop?: number }).tituloTop} />
        )}
      </Sequence>

      {datos.cartelas.map((c, i) => (
        <Sequence key={`c${i}`} from={f(c.en)} durationInFrames={f(c.dur)} name={`Cartela ${i + 1}`}>
          {/* Estilo aprobado (nov. 2026): tarjeta limpia, una en verde sendero y otra en blanco. */}
          <Dato dur={f(c.dur)} ante={c.secundaria} titulo={c.principal} oscuro={i % 2 === 0} top={(datos as { cartelasTop?: number }).cartelasTop} />
        </Sequence>
      ))}

      {/* Arriba si en el plano la cara queda a la altura de los subtítulos. */}
      <Subtitulos
        palabras={datos.palabras}
        soloVerde
        trasTitular={durTitular}
        cortes={datos.planos.map((q) => q.en)}
        top={(datos as { subtitulosArriba?: unknown }).subtitulosArriba === true ? 620 : undefined}
        arriba={Array.isArray((datos as { subtitulosArriba?: unknown }).subtitulosArriba) ? ((datos as unknown as { subtitulosArriba: [number, number][] }).subtitulosArriba) : undefined}
      />

      {/* Sin cartela final en los shorts que lo piden: el último plano cierra y el bucle sigue. */}
      {(datos as { sinCierre?: boolean }).sinCierre ? null : (
        <Sequence from={finVoz} name="Cierre">
          <Cierre duracion={total - finVoz} fondo={paleta.verdeWays} />
        </Sequence>
      )}

      {/* Sin música si el volumen es 0: solo voz y efectos. */}
      {datos.musica.vol > 0 ? (
      <Audio
          src={staticFile(datos.musica.src)}
          volume={(fr) => interpolate(fr, [0, 15, total - 20, total], [0, datos.musica.vol, datos.musica.vol, 0], clamp)}
        />
      ) : null}
      <Audio src={staticFile("sfx/impacto.wav")} volume={0.4 * EFECTOS} />
      {datos.recursos.map((r, i) => (
        <Sequence key={`s${i}`} from={Math.max(0, f(r.en) - 6)} durationInFrames={f(1.5)}>
          <Audio src={staticFile("sfx/whoosh-corto.wav")} volume={0.18 * EFECTOS} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

/** Una toma con su voz, con un acercamiento lento hacia Paula. */
const Toma: React.FC<{ src: string; desde: number; zoom: number; dur: number }> = ({ src, desde, zoom, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <OffthreadVideo
        src={staticFile(src)}
        trimBefore={f(desde)}
        volume={(fr) => interpolate(fr, [0, 2, dur - 2, dur], [0, 1, 1, 0], clamp)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          scale: interpolate(frame, [0, dur], [zoom, zoom * 1.03], clamp),
          transformOrigin: "38% 32%",
        }}
      />
    </AbsoluteFill>
  );
};

/** Metraje propio a pantalla completa; la voz sigue debajo. */
const Recurso: React.FC<{ src: string; desde: number; dur: number; seguido: boolean }> = ({ src, desde, dur, seguido }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: seguido ? 1 : interpolate(frame, [0, 3], [0, 1], clamp), overflow: "hidden" }}>
      <OffthreadVideo
        src={staticFile(src)}
        trimBefore={f(desde)}
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover", scale: interpolate(frame, [0, dur], [1.02, 1.08], clamp) }}
      />
    </AbsoluteFill>
  );
};

/** Titular de entrada, encima de la cabeza de Paula. */
const Titular: React.FC<{ lineas: string[]; dur: number; top?: number }> = ({ lineas, dur, top = ARRIBA }) => {
  const frame = useCurrentFrame();
  const fuera = interpolate(frame, [dur - 8, dur], [0, 100], { ...clamp, easing: Easing.in(Easing.cubic) });
  return (
    <Interactive.Div
      name="Titular"
      style={{
        position: "absolute",
        top,
        left: 60,
        right: 60,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        clipPath: `inset(0 0 0 ${fuera}%)`,
      }}
    >
      {lineas.map((l, i) => {
        const acento = i === lineas.length - 1;
        return (
          <div
            key={i}
            style={{
              // Brandbook 2027: minúscula de frase y Montserrat 800.
              fontSize: 92,
              lineHeight: 1.1,
              fontWeight: 800,
              whiteSpace: "nowrap",
              color: brand.white,
              // Brandbook 2027: el subrayado SW, placa verde Ways con letra blanca.
              backgroundColor: acento ? paleta.verdeWays : "transparent",
              padding: acento ? "4px 18px 8px" : 0,
              borderRadius: 10,
              WebkitTextStroke: acento ? "0px" : `10px ${paleta.grafito}`,
              paintOrder: "stroke fill",
              clipPath: `inset(0 ${interpolate(frame, [i * 4, i * 4 + 12], [100, 0], { ...clamp, easing: salida })}% 0 0)`,
            }}
          >
            {l}
          </div>
        );
      })}
    </Interactive.Div>
  );
};

/**
 * Titular del gancho en tarjeta blanca, igual que la portada: grafito, y la
 * parte entre corchetes en placa verde Ways girada -1,5°. Antetítulo opcional
 * en verde sendero.
 */
const TitularCaja: React.FC<{ lineas: string[]; ante?: string; dur: number; top?: number; maxTam?: number }> = ({ lineas, ante, dur, top = 260, maxTam = 84 }) => {
  const frame = useCurrentFrame();
  const e = interpolate(frame, [0, 12], [0, 1], { ...clamp, easing: salida });
  const s = interpolate(frame, [dur - 9, dur], [1, 0], { ...clamp, easing: Easing.in(Easing.cubic) });
  const limpio = (l: string) => l.replace(/[[\]]/g, "");
  const tam = Math.min(maxTam, ...lineas.map((l) => Math.floor(700 / (limpio(l).length * 0.6))));
  return (
    <Interactive.Div name="Titular" style={{ position: "absolute", top, left: 96, right: 96, display: "flex", justifyContent: "center", opacity: Math.min(e, s), translate: `0px ${(1 - e) * 24}px` }}>
      <div style={{ backgroundColor: brand.white, borderRadius: 32, boxShadow: "0 8px 32px rgba(46, 46, 45, 0.12)", padding: "26px 40px 32px", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 6 }}>
        {ante ? <div style={{ fontSize: 32, fontWeight: 700, color: paleta.sendero, marginBottom: 6 }}>{ante}</div> : null}
        {lineas.map((l, k) => (
          <div key={k} style={{ fontSize: tam, lineHeight: 1.1, fontWeight: 800, letterSpacing: "-0.02em", whiteSpace: "nowrap", color: paleta.grafito }}>
            {l.split(/(\[[^\]]+\])/).filter(Boolean).map((t, n) =>
              t.startsWith("[") ? (
                <span key={n} style={{ display: "inline-block", color: brand.white, backgroundColor: paleta.verdeWays, borderRadius: 12, padding: "0px 16px 6px", margin: "0 2px", rotate: "-1.5deg" }}>{t.slice(1, -1)}</span>
              ) : (
                <span key={n} style={{ whiteSpace: "pre" }}>{t}</span>
              ),
            )}
          </div>
        ))}
      </div>
    </Interactive.Div>
  );
};

export const ComposicionPaula: React.FC = () => (
  <>
    <Composition
      id="ShortPaula"
      component={ShortPaula}
      durationInFrames={Math.round(datosPaula.duracion * fps)}
      fps={fps}
      width={format.reels.width}
      height={format.reels.height}
    />
    {/* Shorts del equipo: `npx remotion render Equipo-s2-perderse`. */}
    {(equipo as unknown as (Datos & { id: string })[]).map((d) => (
      <Composition
        key={d.id}
        id={`Equipo-${d.id}`}
        component={ShortPaula}
        defaultProps={{ id: d.id }}
        durationInFrames={Math.round(d.duracion * fps)}
        fps={fps}
        width={format.reels.width}
        height={format.reels.height}
      />
    ))}
  </>
);
