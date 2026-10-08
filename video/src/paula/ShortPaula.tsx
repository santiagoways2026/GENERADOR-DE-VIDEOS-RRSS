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
import { brand, easeOut, fontFamily, format, fps, paleta } from "../brand/theme";
import { Cartela } from "../componentes/Cartela";
import { Cierre } from "../escenas/Cierre";
import { Subtitulos } from "../shorts/Subtitulos";
import datos from "./paula.json";

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

export const ShortPaula: React.FC = () => {
  const total = f(datos.duracion);
  const finVoz = f(datos.finVoz);
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
            seguido={i > 0 && r.en - (datos.recursos[i - 1].en + datos.recursos[i - 1].dur) < 0.1}
          />
        </Sequence>
      ))}

      <Sequence durationInFrames={f(3.4)} name="Titular">
        <Titular lineas={datos.titulo} dur={f(3.4)} />
      </Sequence>

      {datos.cartelas.map((c, i) => (
        <Sequence key={`c${i}`} from={f(c.en)} durationInFrames={f(c.dur)} name={`Cartela ${i + 1}`}>
          <Cartela principal={c.principal} secundaria={c.secundaria} top={ARRIBA} tinta={paleta.grafito} />
        </Sequence>
      ))}

      <Subtitulos palabras={datos.palabras} soloVerde />

      <Sequence from={finVoz} name="Cierre">
        <Cierre duracion={total - finVoz} fondo={paleta.verdeWays} />
      </Sequence>

      <Audio
        src={staticFile(datos.musica.src)}
        volume={(fr) => interpolate(fr, [0, 15, total - 20, total], [0, datos.musica.vol, datos.musica.vol, 0], clamp)}
      />
      <Audio src={staticFile("sfx/impacto.wav")} volume={0.4} />
      {datos.recursos.map((r, i) => (
        <Sequence key={`s${i}`} from={Math.max(0, f(r.en) - 6)} durationInFrames={f(1.5)}>
          <Audio src={staticFile("sfx/whoosh-corto.wav")} volume={0.18} />
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
const Titular: React.FC<{ lineas: string[]; dur: number }> = ({ lineas, dur }) => {
  const frame = useCurrentFrame();
  const fuera = interpolate(frame, [dur - 8, dur], [0, 100], { ...clamp, easing: Easing.in(Easing.cubic) });
  return (
    <Interactive.Div
      name="Titular"
      style={{
        position: "absolute",
        top: ARRIBA,
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
              fontSize: 92,
              lineHeight: 1.04,
              fontWeight: 900,
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              color: brand.white,
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

export const ComposicionPaula: React.FC = () => (
  <Composition
    id="ShortPaula"
    component={ShortPaula}
    durationInFrames={Math.round(datos.duracion * fps)}
    fps={fps}
    width={format.reels.width}
    height={format.reels.height}
  />
);
