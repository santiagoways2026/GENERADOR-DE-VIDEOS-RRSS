import { AbsoluteFill, Img, Interactive, staticFile } from "remotion";
import "../fuentes";
import { brand, fontFamily, paleta } from "../brand/theme";
import portadas from "./portadas.json";

/**
 * Portada de los shorts de Hildary, con el estilo de pegatina que se usa en
 * el resto de vídeos de la marca: foto real a sangre y el titular en tres
 * líneas ligeramente giradas.
 *
 *   1. Grafito con contorno blanco grueso.
 *   2. Placa verde Ways con el texto en blanco y borde blanco.
 *   3. Verde Ways con contorno blanco, la vieira y tres trazos de énfasis.
 *
 * La foto se elige a mano para cada short (portadas.json) y se copia antes a
 * public/portadas/<id>.jpg. Orden de preferencia: fotos propias, fotos de
 * clientes y, solo si hace falta, stock.
 *
 * Todo lo que importa cae dentro del recorte 4:5 de la cuadrícula de
 * Instagram (y 285 a 1635).
 */
type Datos = { id: string; lineas: string[]; encuadre?: string; alto?: number };


export const PortadaShort: React.FC<{ id: string }> = ({ id }) => {
  const d = (portadas as Datos[]).find((x) => x.id === id) as Datos;
  const [uno, dos, tres] = d.lineas;

  // Tarjeta blanca (noviembre de 2026): titular en grafito con la línea clave
  // en placa verde Ways y tres trazos de énfasis, sobre la foto a sangre.
  const t = (x: string, max: number, ancho = 760) => Math.min(max, Math.floor(ancho / (x.length * 0.6)));
  const base = Math.min(t(uno, 150), t(tres, 150));
  return (
    <AbsoluteFill style={{ backgroundColor: brand.green, fontFamily }}>
      <Img
        src={staticFile(`portadas/${d.id}.jpg`)}
        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: d.encuadre ?? "50% 50%" }}
      />
      <Interactive.Div
        name="Titular de la portada"
        style={{
          position: "absolute",
          top: d.alto ?? 330,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            backgroundColor: brand.white,
            borderRadius: 44,
            padding: "36px 52px 44px",
            rotate: "-3deg",
            boxShadow: "0 18px 40px rgba(46, 46, 45, 0.28)",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 8,
          }}
        >
          <span style={{ ...estiloTexto(base), color: paleta.grafito }}>{uno}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <span
              style={{
                ...estiloTexto(Math.min(t(dos, 160, 600), base * 1.15)),
                color: brand.white,
                backgroundColor: paleta.verdeWays,
                borderRadius: 18,
                padding: "2px 28px 12px",
              }}
            >
              {dos}
            </span>
            <Trazos tam={base} />
          </div>
          <span style={{ ...estiloTexto(base), color: paleta.grafito }}>{tres}</span>
        </div>
      </Interactive.Div>
    </AbsoluteFill>
  );

};

const estiloTexto = (tam: number): React.CSSProperties => ({
  fontSize: tam,
  lineHeight: 1.08,
  fontWeight: 800,
  letterSpacing: "-0.03em",
  whiteSpace: "nowrap",
});




/** Tres trazos verdes de énfasis junto a la línea clave. */
const Trazos: React.FC<{ tam: number }> = ({ tam }) => (
  <svg width={tam * 0.9} height={tam * 0.9} viewBox="0 0 90 90" style={{ overflow: "visible" }}>
    {[
      [10, 22, 40, 4],
      [14, 46, 54, 44],
      [10, 70, 40, 88],
    ].map(([x1, y1, x2, y2], i) => (
      <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={paleta.verdeWays} strokeWidth={10} strokeLinecap="round" />
    ))}
  </svg>
);
