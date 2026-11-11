import { AbsoluteFill } from "remotion";
import { brand, fontFamily, mar, radius, shadow, tracking, weight } from "../../brand/theme";
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
 * Dos estilos:
 * - `claro`: mar en niebla, tierra en blanco, ruta en verde Ways. Logo verde.
 * - `verde`: tierra en verde Ways, agua en el tono `mar`, ruta en blanco con
 *   borde sendero y rótulos blancos en negrita con halo sendero (blanco sobre
 *   verde solo en negrita). Logo blanco, porque cae sobre verde.
 * En los dos, salida y llegada en cajas sendero.
 */

const ESTILOS = {
  claro: {
    mar: brand.niebla, tierra: brand.white, rio: brand.niebla, rioBorde: brand.gris as string | null,
    via: brand.gris, ruta: brand.green, rutaBorde: brand.white, texto: brand.grafito, halo: brand.white,
    rotuloAgua: brand.gris, rotuloAguaHalo: brand.white, referencia: brand.gris, norte: brand.grafito,
    logo: "verde" as const,
  },
  verde: {
    mar, tierra: brand.green, rio: mar, rioBorde: null as string | null,
    via: brand.sendero, ruta: brand.white, rutaBorde: brand.sendero, texto: brand.white, halo: brand.sendero,
    rotuloAgua: brand.sendero, rotuloAguaHalo: mar, referencia: brand.white, norte: brand.white,
    logo: "blanco" as const,
  },
};
type Estilo = keyof typeof ESTILOS;

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
  /** Ríos que no se rotulan (fuera de cuadro o sin interés) y rótulos movidos a mano. */
  rotulosRios?: Record<string, { x: number; y: number; giro?: number } | null>;
  /** Rótulos de lugares de referencia, en gris. */
  lugares?: { x: number; y: number; texto: string }[];
  estilo?: Estilo;
  /** Cuerpo del titular; bajarlo si el nombre es largo y la caja crece. */
  tamanoTitular?: number;
};

type Lado = "izq" | "der" | "abajo" | "arriba";

const Rotulo: React.FC<{ x: number; y: number; texto: string; ancla: Ancla; color: string; halo: string }> = ({
  x,
  y,
  texto,
  ancla,
  color,
  halo,
}) => (
  <text
    x={x}
    y={y}
    textAnchor={ancla}
    fontFamily="Montserrat"
    fontWeight={700}
    fontSize={32}
    fill={color}
    stroke={halo}
    strokeWidth={10}
    strokeLinejoin="round"
    paintOrder="stroke"
  >
    {texto}
  </text>
);

/** Caja sendero de salida o llegada, con antetítulo en brote. */
const Extremo: React.FC<{ x: number; y: number; ancho: number; alto: number; etiqueta: string; nombre: string; lado: Lado }> = ({
  x,
  y,
  ancho,
  alto,
  etiqueta,
  nombre,
  lado,
}) => (
  <div
    style={{
      position: "absolute",
      ...(lado === "abajo"
        ? { top: y + 40, left: Math.min(Math.max(x, 170), ancho - 170), translate: "-50% 0" }
        : lado === "arriba"
          ? // Encima del punto, sin salirse por la derecha.
            { bottom: alto - y + 40, right: Math.max(56, ancho - x - 120) }
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
  rotulosRios = {},
  lugares = [],
  estilo = "claro",
  tamanoTitular = 76,
}) => {
  const E = ESTILOS[estilo];
  const { ancho: W, alto: H } = datos;
  const ruta = "M" + datos.ruta.map(([x, y]) => `${x},${y}`).join("L");
  const inicio = datos.paradas[0];
  const fin = datos.paradas[datos.paradas.length - 1];
  const intermedias = datos.paradas.slice(1, -1);

  return (
    <AbsoluteFill style={{ backgroundColor: E.mar, fontFamily }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute" }}>
        {/* Tierra: el trazo del mismo color tapa las costuras entre municipios. */}
        <g fill={E.tierra} stroke={E.tierra} strokeWidth={1.5} fillRule="evenodd">
          {datos.tierra.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>

        {/* Agua dulce: embalses y ríos en el mismo niebla que el mar. */}
        <g fill={E.rio}>
          {(datos.agua ?? []).map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
        {/* Ríos como cauce: borde gris fino y agua niebla, para que no se
            confundan con las carreteras, que van en una sola línea gris. */}
        {E.rioBorde ? (
        <g fill="none" stroke={E.rioBorde} strokeLinecap="round" strokeLinejoin="round">
          {(datos.rios ?? []).map((r, i) => (
            <path key={i} d={r.d} strokeWidth={r.principal ? 13 : 6} />
          ))}
        </g>
        ) : null}
        <g fill="none" stroke={E.rio} strokeLinecap="round" strokeLinejoin="round">
          {(datos.rios ?? []).map((r, i) => (
            <path key={i} d={r.d} strokeWidth={r.principal ? 10 : 3.5} />
          ))}
        </g>

        {/* Referencias: autopistas y tren, finos y en gris para no competir con la ruta. */}
        <g fill="none" stroke={E.via} strokeLinecap="round" strokeLinejoin="round">
          {(datos.autopistas ?? []).map((a, i) => (
            <path key={i} d={a.d} strokeWidth={a.puente ? 4 : 2.5} />
          ))}
          {(datos.tren ?? []).map((d, i) => (
            <path key={i} d={d} strokeWidth={1.6} strokeDasharray="6 5" />
          ))}
        </g>

        {(datos.rotulosRios ?? []).map((r) => {
          const ajuste = rotulosRios[r.nombre];
          if (ajuste === null) return null;
          const { x, y, giro } = { ...r, ...ajuste };
          return (
            <text
              key={r.nombre}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="Montserrat"
              fontWeight={600}
              fontSize={19}
              fill={E.referencia}
              stroke={E.halo}
              strokeWidth={6}
              paintOrder="stroke"
              transform={`rotate(${giro ?? 0} ${x} ${y})`}
            >
              {r.nombre}
            </text>
          );
        })}

        {lugares.map((l) => (
          <text
            key={l.texto}
            x={l.x}
            y={l.y}
            textAnchor="middle"
            fontFamily="Montserrat"
            fontWeight={600}
            fontSize={22}
            fill={E.referencia}
            stroke={E.halo}
            strokeWidth={6}
            paintOrder="stroke"
          >
            {l.texto}
          </text>
        ))}

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
            fill={E.rotuloAgua}
            transform={`rotate(${a.giro ?? 0} ${a.x} ${a.y})`}
          >
            {a.texto}
          </text>
        ))}

        {/* Ruta: verde Ways con un borde blanco para separarla de la costa. */}
        <path d={ruta} fill="none" stroke={E.rutaBorde} strokeWidth={22} strokeLinejoin="round" strokeLinecap="round" />
        <path d={ruta} fill="none" stroke={E.ruta} strokeWidth={11} strokeLinejoin="round" strokeLinecap="round" />

        {intermedias.map((p) => {
          const l = rotulos[p.nombre] ?? { dx: 30, dy: 10, ancla: "start" as const };
          return (
            <g key={p.nombre}>
              <circle cx={p.x} cy={p.y} r={13} fill={brand.white} stroke={brand.sendero} strokeWidth={6} />
              <Rotulo x={p.x + l.dx} y={p.y + l.dy} texto={p.nombre} ancla={l.ancla} color={E.texto} halo={E.halo} />
            </g>
          );
        })}

        {[inicio, fin].map((p) => (
          <circle key={p.nombre} cx={p.x} cy={p.y} r={20} fill={brand.sendero} stroke={brand.white} strokeWidth={7} />
        ))}

        <g transform={`translate(${norte.x} ${norte.y})`}>
          <path d="M0,-46 L18,14 L0,4 L-18,14 Z" fill={E.norte} />
          <text y={50} textAnchor="middle" fontFamily="Montserrat" fontWeight={700} fontSize={24} fill={E.norte}>
            N
          </text>
        </g>
      </svg>

      <Extremo x={inicio.x} y={inicio.y} ancho={W} alto={H} etiqueta="Salida" nombre={inicio.nombre} lado={ladoSalida} />
      <Extremo x={fin.x} y={fin.y} ancho={W} alto={H} etiqueta="Llegada" nombre={fin.nombre} lado={ladoLlegada} />

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
        <Cabecera antetitulo={antetitulo} titular={titular} destacado={destacado} tamano={tamanoTitular} />
        <div style={{ marginTop: 20, fontSize: 26, lineHeight: 1.5, color: brand.grafito }}>{entradilla}</div>
      </div>

      {/* Atribución obligatoria de la licencia ODbL de OpenStreetMap. */}
      <div
        style={{
          position: "absolute",
          left: 64,
          bottom: 34,
          fontSize: 16,
          color: brand.gris,
          backgroundColor: brand.white,
          padding: "4px 8px",
          borderRadius: radius.md,
        }}
      >
        Mapa: © colaboradores de OpenStreetMap
      </div>

      <Logo variante={E.logo} ancho={260} style={{ position: "absolute", right: 72, bottom: 72 }} />
    </AbsoluteFill>
  );
};
