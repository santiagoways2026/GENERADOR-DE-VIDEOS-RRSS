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
import { brand, easeOut, fontFamily, fps, paleta } from "../brand/theme";
import { Cartela } from "../componentes/Cartela";
import { Calendario } from "../graficos/Calendario";
import { Candado } from "../graficos/Candado";
import { LineaTiempo } from "../graficos/LineaTiempo";
import { Subtitulos } from "../shorts/Subtitulos";
import datos from "./xacobeo.json";

/**
 * Shorts del Xacobeo 2027: Hildary ya grabada en vertical, con su voz y su
 * cierre. Aquí solo se pone encima lo que hace falta, sin tocar el corte.
 *
 * Todo viene resuelto en xacobeo.json (herramientas/scripts/shorts_xacobeo.py),
 * en segundos del propio vídeo.
 *
 * Encuadre de estos brutos: la cara de Hildary queda entre y 520 y 1000. Por
 * encima solo hay árboles y cielo, así que titular y cartelas van en la
 * franja de y 230 a 500, y los subtítulos sobre el torso. La cara no se tapa
 * nunca salvo en las cortinillas de stock o de gráfico, que la sustituyen.
 *
 * Zona segura de TikTok e Instagram: herramientas/zona-segura-redes.png.
 */

type Capa = {
  tipo: "cartela" | "png" | "broll" | "grafico" | "mapa";
  en: number;
  dur: number;
  principal?: string;
  secundaria?: string | null;
  tono?: string;
  src?: string;
  encuadre?: string;
  desde?: number;
  ancho?: number;
  g?: string;
  escala?: number;
  actual?: number;
  texto?: string;
};
export type DatosXacobeo = Omit<(typeof datos)[number], "capas"> & { capas: Capa[] };

const f = (s: number) => Math.round(s * fps);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const salida = Easing.bezier(...easeOut);

/** Franja superior libre, por debajo de la interfaz de la red. */
const ARRIBA = 240;

export const ShortXacobeo: React.FC<{ id: string }> = ({ id }) => {
  const d = (datos as unknown as DatosXacobeo[]).find((x) => x.id === id) as DatosXacobeo;
  const total = f(d.duracion);

  return (
    <AbsoluteFill style={{ backgroundColor: brand.green, fontFamily }}>
      {/* El vídeo de Hildary, entero y con su voz. */}
      <Base src={d.video} zooms={d.zooms} fin={total} />

      {d.capas
        .filter((c) => c.tipo === "broll" || c.tipo === "grafico" || c.tipo === "mapa")
        .map((c, i) => (
          <Sequence key={`k${i}`} from={f(c.en)} durationInFrames={f(c.dur)} name={`Cortinilla ${i + 1}`}>
            <Cortinilla capa={c} dur={f(c.dur)} />
          </Sequence>
        ))}

      <Sequence durationInFrames={f(d.gancho.dur)} name="Gancho">
        <Gancho titulo={d.titulo} acento={d.acento} dur={f(d.gancho.dur)} />
      </Sequence>

      {d.capas
        .filter((c) => c.tipo === "cartela" || c.tipo === "png")
        .map((c, i) => (
          <Sequence key={`c${i}`} from={f(c.en)} durationInFrames={f(c.dur)} name={`Cartela ${i + 1}`}>
            {c.tipo === "cartela" ? (
              <Cartela principal={c.principal ?? ""} secundaria={c.secundaria ?? undefined} top={ARRIBA} tinta={paleta.grafito} />
            ) : (
              <CartelaPng src={c.src ?? ""} ancho={c.ancho ?? 900} dur={f(c.dur)} />
            )}
          </Sequence>
        ))}

      <Subtitulos palabras={d.palabras} soloVerde />

      <Audio
        src={staticFile(d.musica.src)}
        loop
        volume={(fr) => interpolate(fr, [0, 15, total - 20, total], [0, d.musica.vol, d.musica.vol, 0], clamp)}
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

/**
 * Hildary con su voz. En cada arranque de frase el encuadre salta un poco
 * hacia la cara y vuelve en la siguiente: da ritmo sin cortar el plano.
 */
const Base: React.FC<{ src: string; zooms: { en: number; z: number }[]; fin: number }> = ({ src, zooms, fin }) => {
  const frame = useCurrentFrame();
  const t = frame / fps;
  const actual = [...zooms].reverse().find((z) => z.en <= t);
  const z = actual?.z ?? 1;
  // Un salto de cuatro fotogramas, no un corte seco.
  const previo = zooms[zooms.indexOf(actual as (typeof zooms)[number]) - 1]?.z ?? 1;
  const escala = actual ? interpolate(frame, [f(actual.en), f(actual.en) + 4], [previo, z], { ...clamp, easing: salida }) : 1;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <OffthreadVideo
        src={staticFile(src)}
        // El vídeo se corta antes de su final: la voz se apaga en seis fotogramas.
        volume={(fr) => interpolate(fr, [fin - 6, fin], [1, 0], clamp)}
        style={{ width: "100%", height: "100%", objectFit: "cover", scale: escala, transformOrigin: "50% 38%" }}
      />
    </AbsoluteFill>
  );
};

/** Stock, gráfico o mapa a pantalla completa. La voz sigue sonando debajo. */
const Cortinilla: React.FC<{ capa: Capa; dur: number }> = ({ capa, dur }) => {
  const frame = useCurrentFrame();
  const entra = interpolate(frame, [0, 4], [0, 1], clamp);
  const sale = interpolate(frame, [dur - 4, dur], [1, 0], clamp);
  // Paleta 2026: fondo verde Ways.
  const fondo = paleta.verdeWays;

  if (capa.tipo === "broll") {
    return (
      <AbsoluteFill style={{ opacity: Math.min(entra, sale), overflow: "hidden" }}>
        <OffthreadVideo
          src={staticFile(capa.src ?? "")}
          muted
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: capa.encuadre ?? "50% 50%",
            scale: interpolate(frame, [0, dur], [1.04, 1.12], clamp),
          }}
        />
      </AbsoluteFill>
    );
  }

  if (capa.tipo === "mapa") {
    // Los mapas sin titular llevan abajo un contador en español ("km
    // recorridos"): se recortan por encima y se encajan en la zona segura.
    const ESCALA = 0.78;
    return (
      <AbsoluteFill style={{ opacity: Math.min(entra, sale), background: fondo }}>
        <div
          style={{
            position: "absolute",
            left: (1080 - 1080 * ESCALA) / 2 - 40,
            top: 230,
            width: 1080 * ESCALA,
            height: 1280 * ESCALA,
            overflow: "hidden",
            borderRadius: 18,
            boxShadow: "0 24px 48px rgba(46, 46, 45, 0.3)",
            translate: `0px ${interpolate(frame, [0, 12], [24, 0], { ...clamp, easing: salida })}px`,
          }}
        >
          <OffthreadVideo
            src={staticFile(capa.src ?? "")}
            muted
            trimBefore={f(capa.desde ?? 0)}
            style={{ width: 1080 * ESCALA, height: 1920 * ESCALA, display: "block" }}
          />
        </div>
      </AbsoluteFill>
    );
  }

  // Gráfico de marca sobre los verdes, centrado en la zona segura.
  return (
    <AbsoluteFill style={{ opacity: Math.min(entra, sale), background: fondo }}>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 330, paddingRight: 80, paddingLeft: 40 }}>
        <div style={{ scale: capa.escala ?? 1, transformOrigin: "50% 0%" }}>
          {capa.g === "calendario" ? <Calendario idioma="en" desde={4} soloVerde /> : null}
          {capa.g === "linea" ? <LineaTiempo desde={4} actual={capa.actual ?? 2027} texto={capa.texto ?? ""} /> : null}
          {capa.g === "candado" ? <Candado desde={4} texto={capa.texto ?? ""} soloVerde /> : null}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const CartelaPng: React.FC<{ src: string; ancho: number; dur: number }> = ({ src, ancho, dur }) => {
  const frame = useCurrentFrame();
  const derecha = interpolate(frame, [0, 27], [100, 0], { ...clamp, easing: salida });
  const izquierda = interpolate(frame, [dur - 9, dur], [0, 100], { ...clamp, easing: Easing.in(Easing.cubic) });
  return (
    <Img
      src={staticFile(src)}
      style={{
        position: "absolute",
        top: ARRIBA + 10,
        left: (1080 - ancho) / 2,
        width: ancho,
        height: "auto",
        clipPath: `inset(0 ${derecha}% 0 ${izquierda}%)`,
        filter: "drop-shadow(0 10px 22px rgba(46, 46, 45, 0.25))",
      }}
    />
  );
};

/**
 * Gancho: la pregunta del vídeo en grande, encima de la cabeza de Hildary.
 * Un velo bosque en la parte alta asegura la lectura sobre los árboles.
 */
const Gancho: React.FC<{ titulo: string[]; acento: number; dur: number }> = ({ titulo, acento, dur }) => {
  const frame = useCurrentFrame();
  const fuera = interpolate(frame, [dur - 8, dur], [0, 100], { ...clamp, easing: Easing.in(Easing.cubic) });
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background: "linear-gradient(180deg, rgba(46,46,45,0.5) 0%, rgba(46,46,45,0.28) 22%, rgba(46,46,45,0) 32%)",
          opacity: interpolate(frame, [0, 6, dur - 6, dur], [0, 1, 1, 0], clamp),
        }}
      />
      <Interactive.Div
        name="Titular del gancho"
        style={{
          position: "absolute",
          top: 236,
          left: 56,
          right: 56,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          scale: interpolate(frame, [0, 10], [1.08, 1], { ...clamp, easing: salida }),
          clipPath: `inset(0 0 0 ${fuera}%)`,
        }}
      >
        {titulo.map((linea, i) => {
          const esAcento = i === acento;
          return (
            <div
              key={i}
              style={{
                fontSize: Math.min(96, Math.floor(900 / (linea.length * 0.8))),
                lineHeight: 1.02,
                fontWeight: 900,
                letterSpacing: "-0.02em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                color: brand.white,
                backgroundColor: esAcento ? paleta.verdeWays : "transparent",
                padding: esAcento ? "4px 18px 8px" : 0,
                borderRadius: 10,
                WebkitTextStroke: esAcento ? "0px" : `10px ${paleta.grafito}`,
                paintOrder: "stroke fill",
                clipPath: `inset(0 ${interpolate(frame, [i * 4, i * 4 + 12], [100, 0], { ...clamp, easing: salida })}% 0 0)`,
              }}
            >
              {linea}
            </div>
          );
        })}
      </Interactive.Div>
    </AbsoluteFill>
  );
};
