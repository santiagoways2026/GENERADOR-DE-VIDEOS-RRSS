import { AbsoluteFill, Composition, Img, staticFile } from "remotion";
import "../fuentes";
import { fontFamily, paleta } from "../brand/theme";

/**
 * Miniaturas de YouTube (1280x720) para el vídeo del webinar Holy Year 2027.
 * Brandbook p. 31-32: miniaturas sobrias, titular grande con una sola parte
 * en placa verde Ways. Misma tarjeta blanca que las portadas de los shorts.
 * Tres propuestas para "Probar y comparar" de YouTube; una con Nahema.
 */
type Datos = { id: string; foto: string; lineas: [string, string, string]; encuadre?: string; lado?: "izq" | "der" };

const PORTADAS: Datos[] = [
  { id: "nahema", foto: "portadas/yt-nahema.jpg", lineas: ["Camino 2027:", "Holy Year", "explained"], lado: "der" },
  { id: "obradoiro", foto: "portadas/yt-obradoiro.jpg", lineas: ["Why 2027 is", "a big year", "on the Camino"], encuadre: "50% 42%", lado: "izq" },
  { id: "mojon", foto: "portadas/yt-mojon.jpg", lineas: ["Plan your", "2027 Camino", "the smart way"], encuadre: "50% 55%", lado: "der" },
];

export const PortadaYT: React.FC<{ id: string }> = ({ id }) => {
  const d = PORTADAS.find((p) => p.id === id) as Datos;
  const tam = 74;
  const linea = { fontSize: tam, fontWeight: 800, lineHeight: 1.1, color: paleta.grafito, whiteSpace: "nowrap" as const };
  return (
    <AbsoluteFill style={{ fontFamily, backgroundColor: paleta.verdeWays }}>
      <Img src={staticFile(d.foto)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: d.encuadre ?? "50% 50%" }} />
      <div
        style={{
          position: "absolute",
          top: 120,
          ...(d.lado === "der" ? { right: 56 } : { left: 56 }),
          background: paleta.blanco,
          borderRadius: 30,
          padding: "30px 40px 38px",
          boxShadow: "0 14px 36px rgba(46, 46, 45, 0.28)",
          rotate: "-2deg",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 8,
        }}
      >
        {/* Etiqueta: deja claro que es un webinar */}
        <div
          style={{
            background: paleta.sendero,
            color: paleta.blanco,
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: 3,
            padding: "6px 16px",
            borderRadius: 8,
            marginBottom: 6,
          }}
        >
          FREE WEBINAR
        </div>
        <div style={linea}>{d.lineas[0]}</div>
        <div style={{ position: "relative" }}>
          <div
            style={{
              ...linea,
              color: paleta.blanco,
              background: paleta.verdeWays,
              borderRadius: 14,
              padding: "0 20px 8px",
              marginLeft: -6,
              rotate: "-1.5deg",
            }}
          >
            {d.lineas[1]}
          </div>
          {/* Tres trazos de énfasis */}
          <svg width="44" height="50" viewBox="0 0 44 50" style={{ position: "absolute", right: -50, top: -26 }}>
            {[
              [6, 44, 14, 24],
              [18, 46, 34, 20],
              [24, 50, 42, 40],
            ].map(([x1, y1, x2, y2], k) => (
              <line key={k} x1={x1} y1={y1} x2={x2} y2={y2} stroke={paleta.verdeWays} strokeWidth={6} strokeLinecap="round" />
            ))}
          </svg>
        </div>
        <div style={linea}>{d.lineas[2]}</div>
      </div>
    </AbsoluteFill>
  );
};

export const ComposicionesPortadaYT: React.FC = () => (
  <>
    {PORTADAS.map((p) => (
      <Composition key={p.id} id={`PortadaYT-${p.id}`} component={PortadaYT} defaultProps={{ id: p.id }} durationInFrames={1} fps={25} width={1280} height={720} />
    ))}
  </>
);

/**
 * Variante con la composición de las miniaturas del canal (verde con papel
 * rasgado, etiqueta, titular enorme, catedral y Nahema recortadas) llevada al
 * Brandbook 2027: Montserrat en minúscula de frase, blanco en negrita sobre
 * verde Ways con el degradado de 135°, la parte clave en placa (blanca con
 * letra sendero, porque una placa verde sobre verde no se leería), etiqueta en
 * mayúsculas, tres trazos de énfasis y nada de amarillo ni vieira.
 */
const Rasgado: React.FC<{ arriba?: boolean }> = ({ arriba }) => {
  const pts = Array.from({ length: 49 }, (_, k) => `${k * 27},${18 + ((k * 29) % 13) + ((k * 7) % 5) * 2}`);
  const poly = arriba ? `0,0 1296,0 ${pts.reverse().join(" ")}` : `0,60 1296,60 ${pts.reverse().map((p) => { const [x, y] = p.split(","); return `${x},${60 - Number(y)}`; }).join(" ")}`;
  return (
    <svg width="1280" height="60" viewBox="0 0 1280 60" style={{ position: "absolute", left: 0, ...(arriba ? { top: 0 } : { bottom: 0 }), filter: "drop-shadow(0 4px 8px rgba(46,46,45,0.18))" }}>
      <polygon points={poly} fill={paleta.blanco} />
    </svg>
  );
};

const Portatil: React.FC = () => (
  <svg width="40" height="30" viewBox="0 0 40 30" fill="none" stroke={paleta.sendero} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="3" width="28" height="18" rx="2" />
    <path d="M2 27h36" />
    <path d="M15 14a7 7 0 0 1 10 0" />
    <path d="M18 17.5a3 3 0 0 1 4 0" />
  </svg>
);

export const PortadaCanal: React.FC = () => {
  const linea = { fontFamily, fontWeight: 800, fontSize: 108, lineHeight: 1.05, color: paleta.blanco, whiteSpace: "nowrap" as const, textShadow: "0 6px 18px rgba(46,46,45,0.25)" };
  return (
    <AbsoluteFill style={{ background: "linear-gradient(135deg, #7AA606, #628A04)" }}>
      <Img src={staticFile("portadas/yt-obradoiro-sticker.png")} style={{ position: "absolute", left: 330, bottom: -40, height: 420, rotate: "-3deg", filter: "drop-shadow(0 8px 32px rgba(46,46,45,0.25))" }} />
      <Rasgado arriba />
      <Rasgado />
      <div style={{ position: "absolute", left: 60, top: 78, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, background: paleta.blanco, borderRadius: 16, padding: "10px 24px", fontFamily, fontWeight: 800, fontSize: 40, letterSpacing: 3, color: paleta.sendero, marginBottom: 16 }}>
          <Portatil /> FREE WEBINAR
        </div>
        <div style={linea}>The Camino’s</div>
        <div style={{ position: "relative", marginTop: 8 }}>
          <div style={{ ...linea, color: paleta.sendero, background: paleta.blanco, borderRadius: 18, padding: "0 26px 10px", marginLeft: -8, rotate: "-1.5deg", textShadow: "none", boxShadow: "0 8px 32px rgba(46,46,45,0.12)" }}>big year</div>
          <svg width="60" height="64" viewBox="0 0 44 50" style={{ position: "absolute", right: -70, top: -34 }}>
            {[[6, 44, 14, 24], [18, 46, 34, 20], [24, 50, 42, 40]].map(([x1, y1, x2, y2], k) => (
              <line key={k} x1={x1} y1={y1} x2={x2} y2={y2} stroke={paleta.blanco} strokeWidth={6} strokeLinecap="round" />
            ))}
          </svg>
        </div>
      </div>
      <Img src={staticFile("portadas/yt-nahema-sticker.png")} style={{ position: "absolute", right: -30, bottom: 0, height: 650, rotate: "2deg", transformOrigin: "50% 100%", filter: "drop-shadow(0 8px 32px rgba(46,46,45,0.25))" }} />
    </AbsoluteFill>
  );
};

export const ComposicionPortadaCanal: React.FC = () => (
  <Composition id="PortadaYT-canal" component={PortadaCanal} durationInFrames={1} fps={25} width={1280} height={720} />
);

/**
 * La portada que propuso Paula (Nahema con portátil, catedral y papel
 * rasgado) adaptada al Brandbook 2027: fondo verde Ways con el degradado de
 * 135°, etiqueta en mayúsculas, titular en minúscula de frase y la parte
 * clave en placa. Sin amarillo.
 */
export const PortadaPaula: React.FC = () => {
  const linea = { fontFamily, fontWeight: 800, fontSize: 104, lineHeight: 1.05, color: paleta.blanco, whiteSpace: "nowrap" as const };
  return (
    <AbsoluteFill>
      <Img src={staticFile("portadas/yt-ref-fondo.png")} style={{ width: "100%", height: "100%" }} />
      <div style={{ position: "absolute", left: 60, top: 46, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, background: paleta.blanco, borderRadius: 14, padding: "8px 22px", fontFamily, fontWeight: 800, fontSize: 38, letterSpacing: 3, color: paleta.sendero, marginBottom: 14 }}>
          <Portatil /> WEBINAR
        </div>
        <div style={linea}>The Camino’s</div>
        <div style={{ position: "relative", marginTop: 10 }}>
          <div style={{ ...linea, color: paleta.sendero, background: paleta.blanco, borderRadius: 18, padding: "0 26px 10px", marginLeft: -8, rotate: "-1.5deg" }}>big year</div>
          <svg width="60" height="64" viewBox="0 0 44 50" style={{ position: "absolute", right: -70, top: -34 }}>
            {[[6, 44, 14, 24], [18, 46, 34, 20], [24, 50, 42, 40]].map(([x1, y1, x2, y2], k) => (
              <line key={k} x1={x1} y1={y1} x2={x2} y2={y2} stroke={paleta.blanco} strokeWidth={6} strokeLinecap="round" />
            ))}
          </svg>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const ComposicionPortadaPaula: React.FC = () => (
  <Composition id="PortadaYT-paula" component={PortadaPaula} durationInFrames={1} fps={25} width={1280} height={720} />
);
