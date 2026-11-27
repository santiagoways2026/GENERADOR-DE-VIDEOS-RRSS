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
