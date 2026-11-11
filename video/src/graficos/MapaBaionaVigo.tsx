import { AbsoluteFill } from "remotion";
import { brand, fontFamily, radius, shadow, tracking, weight } from "../brand/theme";
import { Logo } from "../componentes/Logo";
import { Subrayado } from "../componentes/Subrayado";
import geo from "../datos/etapa-baiona-vigo.json";

/**
 * Mapa de la etapa Baiona → Vigo del Camino Portugués por la Costa, como
 * imagen fija (1600x1600) para web y redes.
 *
 * La geografía es real: la costa sale de los límites municipales de
 * OpenStreetMap y el trazado, de una ruta a pie por las paradas de la etapa.
 * Se regenera con los datos de `datos/etapa-baiona-vigo.json`.
 *
 * Paleta 2027: mar en niebla, tierra en blanco, ruta en verde Ways, salida y
 * llegada en cajas sendero. El logo va en verde porque cae sobre blanco.
 */

const S = geo.tamano;
const ruta = "M" + geo.ruta.map(([x, y]) => `${x},${y}`).join("L");

/** Dónde va cada rótulo respecto a su punto, para no pisar la línea. */
const LADO: Record<string, { dx: number; dy: number; ancla: "start" | "end" }> = {
  "Playa América": { dx: 30, dy: 10, ancla: "start" },
  "Saiáns": { dx: -30, dy: 10, ancla: "end" },
  "Canido": { dx: -30, dy: 10, ancla: "end" },
  "Paseo do Lagares": { dx: 0, dy: 62, ancla: "start" },
};

const Rotulo: React.FC<{ x: number; y: number; texto: string; ancla: "start" | "end" | "middle" }> = ({
  x,
  y,
  texto,
  ancla,
}) => (
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

const Agua: React.FC<{ x: number; y: number; texto: string; giro?: number }> = ({ x, y, texto, giro = 0 }) => (
  <text
    x={x}
    y={y}
    textAnchor="middle"
    fontFamily="Montserrat"
    fontWeight={700}
    fontSize={20}
    letterSpacing="0.3em"
    fill={brand.gris}
    transform={`rotate(${giro} ${x} ${y})`}
  >
    {texto}
  </text>
);

/** Caja sendero de salida o llegada, con antetítulo en brote. */
const Extremo: React.FC<{ x: number; y: number; etiqueta: string; nombre: string; lado: "izq" | "der" }> = ({
  x,
  y,
  etiqueta,
  nombre,
  lado,
}) => (
  <div
    style={{
      position: "absolute",
      top: y - 52,
      ...(lado === "der" ? { left: x + 40 } : { right: S - x + 40 }),
      backgroundColor: brand.sendero,
      color: brand.white,
      borderRadius: radius.md,
      boxShadow: shadow.caja,
      padding: "12px 22px 14px",
      textAlign: lado === "der" ? "left" : "right",
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

export const MapaBaionaVigo: React.FC = () => {
  const inicio = geo.paradas[0];
  const fin = geo.paradas[geo.paradas.length - 1];
  const intermedias = geo.paradas.slice(1, -1);

  return (
    <AbsoluteFill style={{ backgroundColor: brand.niebla, fontFamily }}>
      <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`} style={{ position: "absolute" }}>
        {/* Tierra: el trazo del mismo color tapa las costuras entre municipios. */}
        <g fill={brand.white} stroke={brand.white} strokeWidth={1.5} fillRule="evenodd">
          {geo.tierra.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>

        <Agua x={330} y={1060} texto="OCÉANO ATLÁNTICO" giro={-58} />
        <Agua x={870} y={330} texto="RÍA DE VIGO" giro={-24} />

        {/* Ruta: verde Ways con un borde blanco para separarla de la costa. */}
        <path d={ruta} fill="none" stroke={brand.white} strokeWidth={22} strokeLinejoin="round" strokeLinecap="round" />
        <path d={ruta} fill="none" stroke={brand.green} strokeWidth={11} strokeLinejoin="round" strokeLinecap="round" />

        {intermedias.map((p) => {
          const l = LADO[p.nombre];
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

        {/* Norte */}
        <g transform="translate(1480 1180)">
          <path d="M0,-46 L18,14 L0,4 L-18,14 Z" fill={brand.grafito} />
          <text y={50} textAnchor="middle" fontFamily="Montserrat" fontWeight={700} fontSize={24} fill={brand.grafito}>
            N
          </text>
        </g>
      </svg>

      <Extremo x={inicio.x} y={inicio.y} etiqueta="Salida" nombre="Baiona" lado="izq" />
      <Extremo x={fin.x} y={fin.y} etiqueta="Llegada" nombre="Vigo" lado="der" />

      {/* Titular */}
      <div
        style={{
          position: "absolute",
          top: 72,
          left: 72,
          backgroundColor: brand.white,
          borderRadius: radius.lg,
          boxShadow: shadow.caja,
          padding: "36px 44px 40px",
          maxWidth: 640,
        }}
      >
        <div
          style={{
            display: "inline-block",
            backgroundColor: brand.green,
            color: brand.white,
            fontSize: 16,
            fontWeight: weight.bold,
            letterSpacing: tracking.antetitulo,
            textTransform: "uppercase",
            borderRadius: radius.md,
            padding: "6px 12px",
          }}
        >
          Camino Portugués por la Costa
        </div>
        <div
          style={{
            marginTop: 22,
            fontSize: 76,
            lineHeight: 1.1,
            fontWeight: weight.extrabold,
            color: brand.sendero,
          }}
        >
          De Baiona a <Subrayado frame={999}>Vigo</Subrayado>
        </div>
        <div style={{ marginTop: 20, fontSize: 26, lineHeight: 1.5, color: brand.grafito }}>
          El recorrido y las localidades por las que pasa la etapa, siempre cerca del mar.
        </div>
      </div>

      {/* Atribución obligatoria de la licencia ODbL de OpenStreetMap. */}
      <div style={{ position: "absolute", left: 72, bottom: 40, fontSize: 16, color: brand.gris }}>
        Mapa: © colaboradores de OpenStreetMap
      </div>

      <Logo variante="verde" ancho={260} style={{ position: "absolute", right: 72, bottom: 72 }} />
    </AbsoluteFill>
  );
};
