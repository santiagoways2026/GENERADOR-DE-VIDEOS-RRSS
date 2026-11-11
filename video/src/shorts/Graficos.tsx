import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { brand, easeOut, fps, paleta } from "../brand/theme";

/**
 * Gráficos limpios para los shorts de Hildary (brandbook 2027).
 *
 * Todos comparten el mismo lenguaje: tarjeta blanca de esquinas 22 px con la
 * sombra de la marca (0 8px 32px grafito al 12 %), texto en grafito o
 * sendero, detalles en verde Ways. Entran con fundido y un desplazamiento
 * corto con la curva de la marca; los elementos internos van escalonados.
 */

const curva = Easing.bezier(...easeOut);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const SOMBRA = "0 8px 32px rgba(46, 46, 45, 0.12), 0 2px 6px rgba(46, 46, 45, 0.08)";
const IZQ = 96; // zona segura: x 85 a 1018
const ARRIBA = 230; // zona segura: y desde 219

/** Entrada y salida estándar: 10 fotogramas, 24 px de recorrido. */
const useEntrada = (dur: number, retraso = 0) => {
  const frame = useCurrentFrame();
  const e = interpolate(frame, [retraso, retraso + 10], [0, 1], { ...clamp, easing: curva });
  const s = interpolate(frame, [dur - 8, dur], [1, 0], { ...clamp, easing: Easing.in(Easing.cubic) });
  return { opacity: Math.min(e, s), translate: `0px ${(1 - e) * 24 - (1 - s) * 12}px` };
};

const Tarjeta: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; fondo?: string }> = ({
  children,
  style,
  fondo = brand.white,
}) => (
  <div style={{ backgroundColor: fondo, borderRadius: 22, boxShadow: SOMBRA, ...style }}>{children}</div>
);

const Antetitulo: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = paleta.verdeWays }) => (
  <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color }}>{children}</div>
);

/* ---------------------------------------------------------------- */

/** "Camino Expert" + la tarjeta de distancias mínimas (100 km a pie, 200 en bici). */
export const ExpertoDistancias: React.FC<{ dur: number }> = ({ dur }) => {
  const a = useEntrada(dur);
  const b = useEntrada(dur, 8);
  const frame = useCurrentFrame();
  const fila = (n: string, u: string, d: number, activo: boolean) => {
    const o = interpolate(frame, [d, d + 10], [0, 1], { ...clamp, easing: curva });
    return (
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, opacity: o, translate: `${(1 - o) * -16}px 0px` }}>
        <span style={{ fontSize: 76, fontWeight: 800, color: activo ? paleta.grafito : "#B9B9B6", letterSpacing: "-0.02em" }}>{n}</span>
        <span style={{ fontSize: 34, fontWeight: 700, color: activo ? paleta.grafito : "#B9B9B6" }}>km</span>
        <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: "0.1em", color: activo ? paleta.verdeWays : "#B9B9B6" }}>{u}</span>
      </div>
    );
  };
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: IZQ, top: ARRIBA, ...a }}>
        <div style={{ fontSize: 72, fontWeight: 800, color: brand.white, WebkitTextStroke: `9px ${paleta.grafito}`, paintOrder: "stroke fill", lineHeight: 1.1 }}>
          Camino Expert
        </div>
        <div style={{ display: "inline-block", marginTop: 6, backgroundColor: paleta.verdeWays, color: brand.white, fontSize: 32, fontWeight: 800, padding: "4px 16px 7px", borderRadius: 8 }}>
          French Way specialist
        </div>
      </div>
      <Tarjeta style={{ position: "absolute", left: IZQ, top: ARRIBA + 180, padding: "22px 30px 24px", ...b }}>
        <Antetitulo color={paleta.gris}>Pilgrim's office</Antetitulo>
        <div style={{ marginTop: 8 }}>
          {fila("100", "WALK", 14, true)}
          {fila("200", "BIKE", 24, frame > 60)}
        </div>
      </Tarjeta>
    </AbsoluteFill>
  );
};

/** Icono de credencial: dos páginas con un sello. */
const IconoCredencial = () => (
  <svg width="76" height="76" viewBox="0 0 64 64" fill="none" stroke={brand.white} strokeWidth="4" strokeLinejoin="round">
    <rect x="8" y="14" width="48" height="36" rx="5" />
    <line x1="32" y1="14" x2="32" y2="50" />
    <circle cx="44" cy="32" r="6" />
    <line x1="16" y1="26" x2="25" y2="26" />
    <line x1="16" y1="34" x2="25" y2="34" />
  </svg>
);

/** "The credential / Included with Santiago Ways" con su icono. */
export const Credencial: React.FC<{ dur: number }> = ({ dur }) => {
  const a = useEntrada(dur);
  const frame = useCurrentFrame();
  const t = interpolate(frame, [6, 16], [0, 1], { ...clamp, easing: curva });
  return (
    <AbsoluteFill>
      <Tarjeta style={{ position: "absolute", left: IZQ, right: IZQ, top: ARRIBA, display: "flex", overflow: "hidden", ...a }}>
        <div style={{ width: 150, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", backgroundImage: "linear-gradient(135deg, #7AA606 0%, #628A04 100%)" }}>
          <IconoCredencial />
        </div>
        <div style={{ padding: "26px 34px 28px", opacity: t, translate: `${(1 - t) * 16}px 0px` }}>
          <div style={{ fontSize: 66, fontWeight: 800, color: paleta.grafito, lineHeight: 1.1 }}>The credential</div>
          <div style={{ fontSize: 38, fontWeight: 700, color: paleta.sendero, marginTop: 6 }}>Included with Santiago Ways</div>
        </div>
      </Tarjeta>
    </AbsoluteFill>
  );
};

/** "Last 100 km / 2 stamps a day": tarjeta sendero con dos sellos que se llenan. */
export const DosSellos: React.FC<{ dur: number }> = ({ dur }) => {
  const a = useEntrada(dur);
  const frame = useCurrentFrame();
  const sello = (d: number) => {
    const p = interpolate(frame, [d, d + 8], [0, 1], { ...clamp, easing: curva });
    return (
      <div style={{ width: 96, height: 96, borderRadius: 48, border: `3px dashed rgba(255,255,255,0.55)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: paleta.verdeWays, scale: 0.6 + 0.4 * p, opacity: p, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="40" height="40" viewBox="0 0 40 40"><path d="M9 21 L17 29 L31 12" fill="none" stroke={brand.white} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
      </div>
    );
  };
  return (
    <AbsoluteFill>
      <Tarjeta fondo={paleta.sendero} style={{ position: "absolute", left: IZQ, right: IZQ, top: ARRIBA, padding: "20px 32px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", ...a }}>
        <div>
          <Antetitulo color="rgba(255,255,255,0.8)">Last 100 km</Antetitulo>
          <div style={{ fontSize: 66, fontWeight: 800, color: brand.white, lineHeight: 1.05, marginTop: 4 }}>2 stamps a day</div>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          {sello(f(1.0))}
          {sello(f(3.3))}
        </div>
      </Tarjeta>
    </AbsoluteFill>
  );
};

/** "Where to get it" con tres puntos que entran escalonados. */
export const DondeSellar: React.FC<{ dur: number }> = ({ dur }) => {
  const a = useEntrada(dur);
  const frame = useCurrentFrame();
  const items = ["Camino associations", "Parishes & pilgrim offices", "Included with Santiago Ways"];
  return (
    <AbsoluteFill>
      <Tarjeta style={{ position: "absolute", left: IZQ, right: IZQ, top: ARRIBA, padding: "28px 36px 32px", ...a }}>
        <div style={{ fontSize: 62, fontWeight: 800, color: paleta.grafito }}>Where to get it</div>
        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
          {items.map((t, i) => {
            const o = interpolate(frame, [10 + i * 7, 20 + i * 7], [0, 1], { ...clamp, easing: curva });
            return (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 16, opacity: o, translate: `${(1 - o) * -16}px 0px` }}>
                <div style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: paleta.verdeWays }} />
                <span style={{ fontSize: 42, fontWeight: i === 2 ? 800 : 600, color: i === 2 ? paleta.sendero : paleta.grafito }}>{t}</span>
              </div>
            );
          })}
        </div>
      </Tarjeta>
    </AbsoluteFill>
  );
};

/** Lista de requisitos: cada paso aparece cuando Hildary lo dice. */
export const Requisitos: React.FC<{ dur: number; pasos: { texto: string; en: number }[]; nota: string; titulo?: string }> = ({ dur, pasos, nota, titulo = "To get your Compostela" }) => {
  const a = useEntrada(dur);
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: IZQ, right: IZQ, top: ARRIBA, ...a }}>
        <div style={{ display: "inline-block", backgroundColor: paleta.sendero, color: brand.white, padding: "8px 18px", borderRadius: 8, fontSize: 28, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          {titulo}
        </div>
        <Tarjeta style={{ marginTop: 12, padding: "14px 0" }}>
          {pasos.map((p, i) => {
            const o = interpolate(frame, [f(p.en), f(p.en) + 10], [0, 1], { ...clamp, easing: curva });
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, padding: "12px 30px", opacity: 0.25 + 0.75 * o, borderTop: i ? `1px solid ${paleta.niebla}` : "none" }}>
                <div style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: o > 0.5 ? paleta.verdeWays : paleta.niebla, color: brand.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800, flexShrink: 0 }}>
                  {o > 0.5 ? "✓" : i + 1}
                </div>
                <span style={{ fontSize: 40, fontWeight: 700, color: paleta.grafito }}>{p.texto}</span>
              </div>
            );
          })}
          {nota ? (
            <div style={{ padding: "14px 30px 4px", borderTop: `1px solid ${paleta.niebla}`, fontSize: 28, fontWeight: 600, color: paleta.gris }}>{nota}</div>
          ) : null}
        </Tarjeta>
      </div>
    </AbsoluteFill>
  );
};

/** CTA final: suscripción y "Ask us below". */
export const Suscribete: React.FC<{ dur: number; pregunta: [number, number] }> = ({ pregunta }) => {
  // Un solo CTA por pieza: el que Hildary dice en voz ("leave them below").
  const frame = useCurrentFrame();
  const q = interpolate(frame, [f(pregunta[0]), f(pregunta[0]) + 10, f(pregunta[1]) - 8, f(pregunta[1])], [0, 1, 1, 0], { ...clamp, easing: curva });
  return (
    <AbsoluteFill>
      <Tarjeta style={{ position: "absolute", left: IZQ, top: ARRIBA, padding: "20px 30px 24px", opacity: q, translate: `0px ${(1 - q) * 20}px` }}>
        <Antetitulo color={paleta.gris}>Questions?</Antetitulo>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 4 }}>
          <span style={{ fontSize: 56, fontWeight: 800, color: paleta.grafito }}>Ask us below</span>
          <div style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: paleta.verdeWays, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="28" height="28" viewBox="0 0 28 28"><path d="M14 5 V22 M7 15 L14 22 L21 15" fill="none" stroke={brand.white} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
        </div>
      </Tarjeta>
    </AbsoluteFill>
  );
};

/** Dato clave genérico: antetítulo y titular, en blanco o en verde sendero. */
export const Dato: React.FC<{ dur: number; ante: string; titulo: string; oscuro?: boolean }> = ({ dur, ante, titulo, oscuro }) => {
  const a = useEntrada(dur);
  const frame = useCurrentFrame();
  const t = interpolate(frame, [5, 15], [0, 1], { ...clamp, easing: curva });
  return (
    <AbsoluteFill>
      <Tarjeta
        fondo={oscuro ? paleta.sendero : brand.white}
        style={{ position: "absolute", left: IZQ, right: IZQ, top: ARRIBA, padding: "22px 34px 26px", ...a }}
      >
        <Antetitulo color={oscuro ? "rgba(255,255,255,0.8)" : paleta.verdeWays}>{ante}</Antetitulo>
        <div style={{ fontSize: 66, fontWeight: 800, lineHeight: 1.08, marginTop: 6, color: oscuro ? brand.white : paleta.grafito, opacity: t, translate: `${(1 - t) * 16}px 0px` }}>
          {titulo}
        </div>
      </Tarjeta>
    </AbsoluteFill>
  );
};

/** Cortinilla verde: un barrido de 12 fotogramas que tapa el corte. */
export const Barrido: React.FC = () => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, 12], [-110, 110], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  return (
    <AbsoluteFill style={{ translate: `${x}% 0px`, background: "linear-gradient(135deg, #7AA606 0%, #628A04 100%)" }} />
  );
};

const f = (s: number) => Math.round(s * fps);
