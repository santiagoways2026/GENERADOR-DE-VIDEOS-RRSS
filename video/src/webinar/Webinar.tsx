import { AbsoluteFill, Audio, Composition, Easing, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import "../fuentes";
import { brand, easeOut, fontFamily, fps, paleta } from "../brand/theme";
import { Subtitulos } from "../shorts/Subtitulos";
import datos from "./webinar.json";

/**
 * Anuncio vertical del webinar "Holy Year 2027" (25 de noviembre).
 * Dos versiones con el mismo sistema gráfico (Brandbook 2027):
 *   - "vo": voz en off IA sobre metraje propio.
 *   - "hilary": Hilary a cámara (tomas de los shorts del Xacobeo) y tarjetas finales.
 * Sin logo, sin concha y sin marca escrita. Textos en minúscula de frase.
 */

type Texto = { tipo: string; en: number; dur: number; texto?: string; antes?: string; clave?: string; despues?: string };
type Version = {
  id: string;
  dur: number;
  audio: string | null;
  audioEn?: number;
  voces?: (string | number)[][];
  musica: string;
  musicaVol: number;
  musicaFinal?: number;
  finVoz?: number;
  palabras: { t: string; en: number; fin: number }[];
  planos: (string | number | boolean)[][];
  recursos?: (string | number)[][];
  cams?: (string | number)[][];
  textos: Texto[];
  sinSubs: number[][];
};

const f = (s: number) => Math.round(s * fps);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const curva = Easing.bezier(...easeOut);
const SOMBRA = "0 8px 32px rgba(46, 46, 45, 0.12)";
const IZQ = 96;

/** Fundido con desplazamiento corto de entrada y salida, curva de la marca. */
const useAparece = (dur: number, retraso = 0) => {
  const frame = useCurrentFrame();
  const e = interpolate(frame, [retraso, retraso + 12], [0, 1], { ...clamp, easing: curva });
  const s = interpolate(frame, [dur - 9, dur], [1, 0], { ...clamp, easing: Easing.in(Easing.cubic) });
  return { opacity: Math.min(e, s), translate: `0px ${(1 - e) * 24}px` };
};

const Plano: React.FC<{ src: string; desde: number; dur: number; voz?: boolean; borroso?: boolean }> = ({ src, desde, dur, voz, borroso }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <OffthreadVideo
        src={staticFile(src)}
        trimBefore={f(desde)}
        muted={!voz}
        volume={voz ? (fr) => interpolate(fr, [0, 2, dur - 2, dur], [0, 1, 1, 0], clamp) : undefined}
        style={{ width: "100%", height: "100%", objectFit: "cover", scale: borroso ? 1.2 : interpolate(frame, [0, dur], [voz ? 1.0 : 1.02, voz ? 1.03 : 1.08], clamp), filter: borroso ? "blur(36px) brightness(0.85)" : undefined }}
      />
    </AbsoluteFill>
  );
};


/** Ventana de webcam del webinar: tarjeta redondeada con la sombra de la marca, voz incluida. */
const Webcam: React.FC<{ src: string; desde: number; dur: number; primera: boolean; mudo?: boolean; top?: number }> = ({ src, desde, dur, primera, mudo, top = 240 }) => {
  const frame = useCurrentFrame();
  const e = primera ? interpolate(frame, [0, 12], [0, 1], { ...clamp, easing: curva }) : 1;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 72, right: 72, top, aspectRatio: "16 / 9", borderRadius: 22, overflow: "hidden", boxShadow: "0 8px 32px rgba(46, 46, 45, 0.12)", border: "6px solid #FFFFFF", opacity: e, translate: `0px ${(1 - e) * 24}px` }}>
        <OffthreadVideo
          src={staticFile(src)}
          trimBefore={f(desde)}
          muted={mudo}
          volume={mudo ? undefined : (fr) => interpolate(fr, [0, 2, dur - 2, dur], [0, 1, 1, 0], clamp)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    </AbsoluteFill>
  );
};

/** Texto sobre vídeo: blanco con contorno grafito. */
const sobreVideo: React.CSSProperties = {
  color: brand.white,
  WebkitTextStroke: `12px ${paleta.grafito}`,
  paintOrder: "stroke fill",
  fontWeight: 800,
};

/** Subrayado Ways: bloque verde Ways girado -1,5°, plano, sin sombra. */
const Placa: React.FC<{ children: React.ReactNode; tam: number }> = ({ children, tam }) => (
  <span style={{ display: "inline-block", backgroundColor: paleta.verdeWays, color: brand.white, fontWeight: 800, fontSize: tam, padding: "2px 24px 10px", borderRadius: 14, rotate: "-1.5deg" }}>
    {children}
  </span>
);

const Grande: React.FC<{ texto: string; dur: number }> = ({ texto, dur }) => {
  const a = useAparece(dur);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start", paddingTop: 300 }}>
      <div style={{ ...sobreVideo, WebkitTextStroke: `18px ${paleta.grafito}`, fontSize: 300, lineHeight: 1, letterSpacing: "-0.04em", ...a }}>{texto}</div>
    </AbsoluteFill>
  );
};

const Titular: React.FC<{ t: Texto; dur: number }> = ({ t, dur }) => {
  const a = useAparece(dur);
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: (t as { top?: number }).top ?? 300 }}>
      <div style={{ display: "flex", alignItems: "baseline", whiteSpace: "pre", fontSize: 104, lineHeight: 1.1, ...a }}>
        {t.antes ? <span style={sobreVideo}>{t.antes}</span> : null}
        <Placa tam={104}>{t.clave}</Placa>
        {t.despues ? <span style={sobreVideo}>{t.despues}</span> : null}
      </div>
    </AbsoluteFill>
  );
};

const RUTAS = ["French Way from Sarria", "Portuguese Coastal Way", "Shorter stages, slower pace", "Primitive Way"];

/** Diapositiva 12 del webinar, en tarjeta: las rutas entran escalonadas. */
const Rutas: React.FC<{ dur: number }> = ({ dur }) => {
  const a = useAparece(dur);
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: IZQ, right: IZQ, top: 240, ...a }}>
        <div style={{ backgroundColor: brand.white, borderRadius: 22, boxShadow: SOMBRA, padding: "28px 34px 18px" }}>
          <div style={{ fontSize: 30, fontWeight: 700, color: paleta.verdeWays }}>In the webinar</div>
          <div style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.1, color: paleta.sendero, marginTop: 4 }}>Different routes to Santiago</div>
          {RUTAS.map((r, i) => {
            const o = interpolate(frame, [8 + i * 9, 18 + i * 9], [0, 1], { ...clamp, easing: curva });
            return (
              <div key={r} style={{ display: "flex", alignItems: "center", gap: 18, padding: "14px 0", borderTop: `1px solid ${paleta.niebla}`, marginTop: i ? 0 : 16, opacity: o, translate: `${(1 - o) * 20}px 0px` }}>
                <div style={{ width: 48, height: 48, borderRadius: 24, background: "linear-gradient(135deg, #7AA606 0%, #628A04 100%)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24"><path d="M5 19 C9 15, 8 9, 12 7 S 17 5, 19 4" fill="none" stroke={brand.white} strokeWidth="3" strokeLinecap="round" /><circle cx="5" cy="19" r="2.5" fill={brand.white} /></svg>
                </div>
                <span style={{ fontSize: 38, fontWeight: 700, color: paleta.grafito }}>{r}</span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Tarjeta fija de fecha: caja blanca, letra sendero, subrayado Ways en la fecha. */
const Fecha: React.FC<{ dur: number }> = ({ dur }) => {
  const a = useAparece(dur);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: IZQ, right: IZQ, top: 520, display: "flex", justifyContent: "center", ...a }}>
        <div style={{ backgroundColor: brand.white, borderRadius: 22, boxShadow: SOMBRA, padding: "34px 44px 42px", textAlign: "center" }}>
          <div style={{ fontSize: 64, fontWeight: 800, color: paleta.sendero, lineHeight: 1.1 }}>Free webinar</div>
          <div style={{ fontSize: 44, fontWeight: 700, color: paleta.sendero, marginTop: 14 }}>Wednesday,</div>
          <div style={{ marginTop: 10 }}><Placa tam={64}>November 25</Placa></div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** CTA: caja verde sendero con letra blanca y flecha hacia el botón de la red. */
const Cta: React.FC<{ dur: number }> = ({ dur }) => {
  const a = useAparece(dur);
  const frame = useCurrentFrame();
  const baja = interpolate(frame % 36, [0, 18, 36], [0, 14, 0], { ...clamp, easing: Easing.inOut(Easing.sin) });
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: IZQ, right: IZQ, top: 620, display: "flex", flexDirection: "column", alignItems: "center", gap: 28, ...a }}>
        <div style={{ backgroundColor: paleta.sendero, borderRadius: 22, boxShadow: SOMBRA, padding: "34px 50px 40px", textAlign: "center" }}>
          <div style={{ fontSize: 34, fontWeight: 700, color: "rgba(255,255,255,0.85)" }}>Holy Year 2027 · Free webinar</div>
          <div style={{ fontSize: 72, fontWeight: 800, color: brand.white, lineHeight: 1.1, marginTop: 8 }}>Save your free spot</div>
        </div>
        <div style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: brand.white, display: "flex", alignItems: "center", justifyContent: "center", translate: `0px ${baja}px`, boxShadow: SOMBRA }}>
          <svg width="44" height="44" viewBox="0 0 28 28"><path d="M14 4 V23 M6 15 L14 23 L22 15" fill="none" stroke={paleta.sendero} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Webinar: React.FC<{ id: string }> = ({ id }) => {
  const d = (datos as unknown as Version[]).find((x) => x.id === id) as Version;
  const total = f(d.dur);
  const mv = d.musicaVol;
  const mf = d.musicaFinal ?? mv;
  const fv = Math.min(f(d.finVoz ?? d.dur), total - 40);
  const palabras = d.palabras.filter((p) => !d.sinSubs.some(([a, b]) => p.en >= a && p.en < b));
  return (
    <AbsoluteFill style={{ backgroundColor: paleta.sendero, fontFamily }}>
      {d.planos.map(([src, desde, en, dur, voz], i) => (
        <Sequence key={`p${i}`} from={f(en as number)} durationInFrames={f((en as number) + (dur as number)) - f(en as number)}>
          <Plano src={src as string} desde={desde as number} dur={f(dur as number)} voz={voz === true} borroso={voz === "borroso"} />
        </Sequence>
      ))}
      {(d.recursos ?? []).map(([src, desde, en, dur], i) => (
        <Sequence key={`r${i}`} from={f(en as number)} durationInFrames={f(dur as number)}>
          <Plano src={src as string} desde={desde as number} dur={f(dur as number)} />
        </Sequence>
      ))}
      {(d.cams ?? []).map(([src, desde, en, dur, mudo, top], i) => (
        <Sequence key={`w${i}`} from={f(en as number)} durationInFrames={f((en as number) + (dur as number)) - f(en as number)}>
          <Webcam src={src as string} desde={desde as number} dur={f(dur as number)} primera={i === 0 || Boolean(mudo)} mudo={Boolean(mudo)} top={top as number | undefined} />
        </Sequence>
      ))}
      {d.textos.map((t, i) => (
        <Sequence key={`t${i}`} from={f(t.en)} durationInFrames={f(t.dur)}>
          {t.tipo === "grande" ? <Grande texto={t.texto as string} dur={f(t.dur)} /> : null}
          {t.tipo === "titular" ? <Titular t={t} dur={f(t.dur)} /> : null}
          {t.tipo === "rutas" ? <Rutas dur={f(t.dur)} /> : null}
          {t.tipo === "fecha" ? <Fecha dur={f(t.dur)} /> : null}
          {t.tipo === "cta" ? <Cta dur={f(t.dur) + 30} /> : null}
        </Sequence>
      ))}
      <Subtitulos palabras={palabras} soloVerde cortes={[...d.planos.filter((p) => p[4]).map((p) => p[2] as number), ...(d.cams ?? []).filter((c) => !c[4]).map((c) => c[2] as number)]} />
      {d.audio ? (
        <Sequence from={f(d.audioEn ?? 0)}>
          <Audio src={staticFile(d.audio)} />
        </Sequence>
      ) : null}
      {(d.voces ?? []).map(([src, en], i) => (
        <Sequence key={`v${i}`} from={f(en as number)}>
          <Audio src={staticFile(src as string)} />
        </Sequence>
      ))}
      <Audio
        src={staticFile(d.musica)}
        volume={(fr) => interpolate(fr, [0, 15, fv, fv + 15, total - 20, total], [0, mv, mv, mf, mf, 0], clamp)}
      />
    </AbsoluteFill>
  );
};

export const ComposicionesWebinar: React.FC = () => (
  <>
    {(datos as unknown as Version[]).map((d) => (
      <Composition key={d.id} id={`Webinar-${d.id}`} component={Webinar} defaultProps={{ id: d.id }} durationInFrames={f(d.dur)} fps={fps} width={1080} height={1920} />
    ))}
  </>
);
