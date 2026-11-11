import { AbsoluteFill } from "remotion";
import { brand, fontFamily, radius, shadow, tracking, weight } from "../../brand/theme";
import { Logo } from "../../componentes/Logo";
import { Cabecera } from "./Cabecera";
import type { Ancla, DatosEtapa, Titular } from "./tipos";

/**
 * Mapa de una etapa como imagen fija para la web.
 *
 * La geografía es real: la costa sale de los límites municipales de
 * OpenStreetMap y el trazado, del Camino en OpenStreetMap o de una ruta a pie
 * por las paradas. Los datos los prepara `herramientas/scripts/mapa_etapa.py`.
 *
 * Paleta 2027: mar en niebla, tierra en blanco, ruta en verde Ways, salida y
 * llegada en cajas sendero. El logo va en verde porque cae sobre blanco.
 */

export type PropsMapa = Titular & {
  datos: DatosEtapa;
  entradilla: string;
  /** Dónde va el rótulo de cada parada intermedia respecto a su punto. */
  rotulos: Record<string, { dx: number; dy: number; ancla: Ancla }>;
  /** Lado de la caja de salida y de llegada. */
  ladoSalida: Lado;
  ladoLlegada: Lado;
  /** Nombres de mar y ría, en etiqueta gris. */
  aguas: { x: number; y: number; texto: string; giro?: number }[];
  /** Esquina de la caja del titular. */
  caja: React.CSSProperties;
  norte: { x: number; y: number };
};

type Lado = "izq" | "der" | "abajo";

const Rotulo: React.FC<{ x: number; y: number; texto: string; ancla: Ancla }> = ({ x, y, texto, ancla }) => (
  <text
    x={x}
    y={y}
    textAnchor={ancla}
    fontFamily="Montserrat"
    fontWeight={700}
    fontSize={32}
    fill={brand.grafito}
    stroke={brand.white}
    strokeWidth={10}
    strokeLinejoin="round"
    paintOrder="stroke"
  >
    {texto}
  </text>
);

/** Caja sendero de salida o llegada, con antetítulo en brote. */
const Extremo: React.FC<{ x: number; y: number; ancho: number; etiqueta: string; nombre: string; lado: Lado }> = ({
  x,
  y,
  ancho,
  etiqueta,
  nombre,
  lado,
}) => (
  <div
    style={{
      position: "absolute",
      ...(lado === "abajo"
        ? { top: y + 40, left: x, translate: "-50% 0" }
        : lado === "der"
          ? { top: y - 52, left: x + 40 }
          : { top: y - 52, right: ancho - x + 40 }),
      backgroundColor: brand.sendero,
      color: brand.white,
      borderRadius: radius.md,
      boxShadow: shadow.caja,
      padding: "12px 22px 14px",
      textAlign: lado === "izq" ? "right" : lado === "der" ? "left" : "center",
    }}
  >
    <div
      style={{
        fontSize: 15,
        fontWeight: weight.bold,
        letterSpacing: tracking.antetitulo,
        textTransform: "uppercase",
        color: brand.brote,
      }}
    >
      {etiqueta}
    </div>
    <div style={{ fontSize: 40, fontWeight: weight.extrabold, lineHeight: 1.1 }}>{nombre}</div>
  </div>
);

export const MapaEtapa: React.FC<PropsMapa> = ({
  datos,
  antetitulo,
  titular,
  destacado,
  entradilla,
  rotulos,
  ladoSalida,
  ladoLlegada,
  aguas,
  caja,
  norte,
}) => {
  const { ancho: W, alto: H } = datos;
  const ruta = "M" + datos.ruta.map(([x, y]) => `${x},${y}`).join("L");
  const inicio = datos.paradas[0];
  const fin = datos.paradas[datos.paradas.length - 1];
  const intermedias = datos.paradas.slice(1, -1);

  return (
    <AbsoluteFill style={{ backgroundColor: brand.niebla, fontFamily }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute" }}>
        {/* Tierra: el trazo del mismo color tapa las costuras entre municipios. */}
        <g fill={brand.white} stroke={brand.white} strokeWidth={1.5} fillRule="evenodd">
          {datos.tierra.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>

        {aguas.map((a) => (
          <text
            key={a.texto}
            x={a.x}
            y={a.y}
            textAnchor="middle"
            fontFamily="Montserrat"
            fontWeight={700}
            fontSize={20}
            letterSpacing="0.3em"
            fill={brand.gris}
            transform={`rotate(${a.giro ?? 0} ${a.x} ${a.y})`}
          >
            {a.texto}
          </text>
        ))}

        {/* Ruta: verde Ways con un borde blanco para separarla de la costa. */}
        <path d={ruta} fill="none" stroke={brand.white} strokeWidth={22} strokeLinejoin="round" strokeLinecap="round" />
        <path d={ruta} fill="none" stroke={brand.green} strokeWidth={11} strokeLinejoin="round" strokeLinecap="round" />

        {intermedias.map((p) => {
          const l = rotulos[p.nombre] ?? { dx: 30, dy: 10, ancla: "start" as const };
          return (
            <g key={p.nombre}>
              <circle cx={p.x} cy={p.y} r={13} fill={brand.white} stroke={brand.sendero} strokeWidth={6} />
              <Rotulo x={p.x + l.dx} y={p.y + l.dy} texto={p.nombre} ancla={l.ancla} />
            </g>
          );
        })}

        {[inicio, fin].map((p) => (
          <circle key={p.nombre} cx={p.x} cy={p.y} r={20} fill={brand.sendero} stroke={brand.white} strokeWidth={7} />
        ))}

        <g transform={`translate(${norte.x} ${norte.y})`}>
          <path d="M0,-46 L18,14 L0,4 L-18,14 Z" fill={brand.grafito} />
          <text y={50} textAnchor="middle" fontFamily="Montserrat" fontWeight={700} fontSize={24} fill={brand.grafito}>
            N
          </text>
        </g>
      </svg>

      <Extremo x={inicio.x} y={inicio.y} ancho={W} etiqueta="Salida" nombre={inicio.nombre} lado={ladoSalida} />
      <Extremo x={fin.x} y={fin.y} ancho={W} etiqueta="Llegada" nombre={fin.nombre} lado={ladoLlegada} />

      <div
        style={{
          position: "absolute",
          backgroundColor: brand.white,
          borderRadius: radius.lg,
          boxShadow: shadow.caja,
          padding: "36px 44px 40px",
          maxWidth: 640,
          ...caja,
        }}
      >
        <Cabecera antetitulo={antetitulo} titular={titular} destacado={destacado} tamano={76} />
        <div style={{ marginTop: 20, fontSize: 26, lineHeight: 1.5, color: brand.grafito }}>{entradilla}</div>
      </div>

      {/* Atribución obligatoria de la licencia ODbL de OpenStreetMap. */}
      <div style={{ position: "absolute", left: 72, bottom: 40, fontSize: 16, color: brand.gris }}>
        Mapa: © colaboradores de OpenStreetMap
      </div>

      <Logo variante="verde" ancho={260} style={{ position: "absolute", right: 72, bottom: 72 }} />
    </AbsoluteFill>
  );
};
