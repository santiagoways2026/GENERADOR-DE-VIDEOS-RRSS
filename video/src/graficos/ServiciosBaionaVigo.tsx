import { AbsoluteFill } from "remotion";
import { brand, fontFamily, radius, shadow, tracking, weight } from "../brand/theme";
import { Logo } from "../componentes/Logo";
import { Subrayado } from "../componentes/Subrayado";

/**
 * Tabla de servicios por localidad de la etapa Baiona → Vigo, como imagen fija
 * (1600x1000) para web y redes.
 *
 * Paleta 2027: fondo blanco, tinta grafito, filas alternas en brote. El sí va
 * como círculo verde Ways con la marca en blanco: es un gráfico, no texto, así
 * que el verde Ways puede ir sobre blanco. El no, un guion niebla discreto.
 */

type Servicio = { nombre: string; icono: React.ReactNode };

const trazo = {
  fill: "none",
  stroke: brand.sendero,
  strokeWidth: 2.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Iconos de línea, 40x40, todos con el mismo trazo. */
const SERVICIOS: Servicio[] = [
  {
    nombre: "Asistencia sanitaria",
    icono: <path {...trazo} d="M15 6h10v9h9v10h-9v9H15v-9H6V15h9z" />,
  },
  {
    nombre: "Cafetería",
    icono: (
      <g {...trazo}>
        <path d="M7 15h20v8a8 8 0 0 1-8 8h-4a8 8 0 0 1-8-8z" />
        <path d="M27 18h3a4 4 0 0 1 0 8h-3" />
        <path d="M13 6c-1.5 2 1.5 3 0 5M19 6c-1.5 2 1.5 3 0 5" />
        <path d="M6 35h24" />
      </g>
    ),
  },
  {
    nombre: "Farmacia",
    icono: (
      <g {...trazo}>
        <rect x={6} y={6} width={28} height={28} rx={6} />
        <path d="M20 12v16M12 20h16" />
      </g>
    ),
  },
  {
    nombre: "Cajero",
    icono: (
      <g {...trazo}>
        <rect x={5} y={10} width={30} height={20} rx={3} />
        <circle cx={20} cy={20} r={4} />
        <path d="M10 15v10M30 15v10" />
      </g>
    ),
  },
  {
    nombre: "Restaurante",
    icono: (
      <g {...trazo}>
        <path d="M12 5v30M8 5v8a4 4 0 0 0 8 0V5" />
        <path d="M28 35V5c-4 2-6 7-6 13h6" />
      </g>
    ),
  },
  {
    nombre: "Supermercado",
    icono: (
      <g {...trazo}>
        <path d="M4 7h5l4 18h18l3-12H11" />
        <circle cx={15} cy={31} r={2.5} />
        <circle cx={28} cy={31} r={2.5} />
      </g>
    ),
  },
  {
    nombre: "Información turística",
    icono: (
      <g {...trazo}>
        <circle cx={20} cy={20} r={15} />
        <path d="M20 18v10" />
        <circle cx={20} cy={12.5} r={0.6} strokeWidth={3.4} />
      </g>
    ),
  },
];

/** Un 1 por servicio, en el orden de SERVICIOS. */
const LOCALIDADES: { nombre: string; hay: number[] }[] = [
  { nombre: "Baiona", hay: [1, 1, 1, 1, 1, 1, 1] },
  { nombre: "Playa América", hay: [0, 1, 0, 0, 1, 1, 0] },
  { nombre: "Saiáns", hay: [0, 1, 1, 1, 1, 1, 0] },
  { nombre: "Canido", hay: [0, 1, 1, 1, 1, 1, 0] },
  { nombre: "Paseo do Lagares", hay: [0, 1, 1, 0, 1, 1, 0] },
  { nombre: "Vigo", hay: [1, 1, 1, 1, 1, 1, 1] },
];

const COL_NOMBRE = 320;

const Si = () => (
  <svg width={40} height={40} viewBox="0 0 40 40">
    <circle cx={20} cy={20} r={18} fill={brand.green} />
    <path d="M12 20.5l5.5 5.5L28.5 14" fill="none" stroke={brand.white} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const No = () => <div style={{ width: 22, height: 4, borderRadius: 2, backgroundColor: brand.niebla }} />;

export const ServiciosBaionaVigo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: brand.white, fontFamily, padding: 72 }}>
    {/* Cabecera */}
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
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
          Etapa de Baiona a Vigo
        </div>
        <div
          style={{
            marginTop: 20,
            fontSize: 64,
            lineHeight: 1.1,
            fontWeight: weight.extrabold,
            color: brand.sendero,
          }}
        >
          Qué encontrarás en <Subrayado frame={999}>cada parada</Subrayado>
        </div>
      </div>
      <Logo variante="verde" ancho={230} style={{ marginTop: 6 }} />
    </div>

    {/* Tabla */}
    <div
      style={{
        marginTop: 44,
        flex: 1,
        backgroundColor: brand.white,
        borderRadius: radius.lg,
        boxShadow: shadow.caja,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-end", padding: "26px 0 20px", borderBottom: `2px solid ${brand.niebla}` }}>
        <div
          style={{
            width: COL_NOMBRE,
            paddingLeft: 36,
            fontSize: 15,
            fontWeight: weight.bold,
            letterSpacing: tracking.antetitulo,
            textTransform: "uppercase",
            color: brand.gris,
          }}
        >
          Localidad
        </div>
        {SERVICIOS.map((s) => (
          <div
            key={s.nombre}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              textAlign: "center",
            }}
          >
            <svg width={40} height={40} viewBox="0 0 40 40">
              {s.icono}
            </svg>
            <div style={{ fontSize: 17, lineHeight: 1.2, fontWeight: weight.semibold, color: brand.grafito, maxWidth: 140 }}>
              {s.nombre}
            </div>
          </div>
        ))}
      </div>

      {LOCALIDADES.map((l, i) => (
        <div
          key={l.nombre}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            backgroundColor: i % 2 === 1 ? brand.brote : brand.white,
          }}
        >
          <div style={{ width: COL_NOMBRE, paddingLeft: 36, fontSize: 26, fontWeight: weight.bold, color: brand.grafito }}>
            {l.nombre}
          </div>
          {l.hay.map((h, j) => (
            <div key={j} style={{ flex: 1, display: "flex", justifyContent: "center" }}>
              {h ? <Si /> : <No />}
            </div>
          ))}
        </div>
      ))}
    </div>
  </AbsoluteFill>
);
