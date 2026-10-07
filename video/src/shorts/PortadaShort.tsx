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

const CONTORNO = 30;

export const PortadaShort: React.FC<{ id: string }> = ({ id }) => {
  const d = (portadas as Datos[]).find((x) => x.id === id) as Datos;
  const [uno, dos, tres] = d.lineas;
  const tam = (t: string, max: number) => Math.min(max, Math.floor(1580 / Math.max(t.length, 6)));

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
          top: d.alto ?? 430,
          left: 40,
          right: 40,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          rotate: "-4deg",
          filter: "drop-shadow(0 14px 26px rgba(46, 46, 45, 0.35))",
        }}
      >
        <Linea texto={uno} tam={tam(uno, 160)} color={paleta.grafito} />
        <div
          style={{
            backgroundColor: paleta.verdeWays,
            border: `12px solid ${brand.white}`,
            borderRadius: 30,
            padding: "0px 34px 14px",
            margin: "-6px 0",
            position: "relative",
            zIndex: 1,
          }}
        >
          <span style={{ ...estiloTexto(tam(dos, 140)), color: brand.white }}>{dos}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Linea texto={tres} tam={tam(tres, 160)} color={paleta.verdeWays} />
          <Vieira tam={Math.max(120, tam(tres, 160) * 1.05)} />
        </div>
      </Interactive.Div>
    </AbsoluteFill>
  );
};

const estiloTexto = (tam: number): React.CSSProperties => ({
  fontSize: tam,
  lineHeight: 1.08,
  fontWeight: 900,
  letterSpacing: "-0.03em",
  whiteSpace: "nowrap",
});

const Linea: React.FC<{ texto: string; tam: number; color: string }> = ({ texto, tam, color }) => (
  <span
    style={{
      ...estiloTexto(tam),
      color,
      WebkitTextStroke: `${CONTORNO}px ${brand.white}`,
      paintOrder: "stroke fill",
      position: "relative",
      zIndex: 2,
    }}
  >
    {texto}
  </span>
);

/** Vieira amarilla con contorno grafito y tres trazos verdes, como en la referencia. */
const Vieira: React.FC<{ tam: number }> = ({ tam }) => (
  <svg width={tam * 1.5} height={tam * 1.1} viewBox="0 0 150 110" style={{ overflow: "visible", marginTop: -tam * 0.1 }}>
    <g transform="rotate(-8 55 60)">
      {/* Halo blanco, para que la vieira se lea como pegatina. */}
      <path d={CONCHA} fill={brand.white} stroke={brand.white} strokeWidth={22} strokeLinejoin="round" />
      <path d={CONCHA} fill="#F4B63A" stroke={paleta.grafito} strokeWidth={5} strokeLinejoin="round" />
      {[-52, -30, -10, 10, 30, 52].map((a) => (
        <line
          key={a}
          x1={55}
          y1={86}
          x2={55 + Math.sin((a * Math.PI) / 180) * 70}
          y2={86 - Math.cos((a * Math.PI) / 180) * 70}
          stroke={paleta.grafito}
          strokeWidth={3.5}
          strokeLinecap="round"
        />
      ))}
    </g>
    {[
      [118, 14, 140, -4],
      [124, 46, 150, 42],
      [116, 78, 138, 98],
    ].map(([x1, y1, x2, y2], i) => (
      <g key={i}>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={brand.white} strokeWidth={17} strokeLinecap="round" />
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={paleta.verdeWays} strokeWidth={9} strokeLinecap="round" />
      </g>
    ))}
  </svg>
);

// Abanico de la concha y las dos orejas de la base.
const CONCHA =
  "M55 100 L36 96 L30 104 L20 98 L26 88 C6 70 0 40 14 22 C26 6 44 0 55 0 C66 0 84 6 96 22 C110 40 104 70 84 88 L90 98 L80 104 L74 96 Z";
