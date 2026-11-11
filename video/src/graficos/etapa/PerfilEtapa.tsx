import { AbsoluteFill } from "remotion";
import { brand, fontFamily } from "../../brand/theme";
import { Logo } from "../../componentes/Logo";
import { Cabecera } from "./Cabecera";
import type { DatosEtapa, Titular } from "./tipos";

/**
 * Perfil de una etapa como imagen fija para la web.
 *
 * Distancia medida sobre el trazado de OpenStreetMap y altitud del modelo
 * EU-DEM de 25 m (Copernicus), suavizada. Ambas fuentes van al pie: son
 * cifras en pantalla y el brandbook no admite cifras sin fuente.
 *
 * Área en brote con la línea en verde Ways, que es gráfico y no texto. Las
 * paradas en sendero, con su altitud.
 */

export const ANCHO_PERFIL = 1600;
export const ALTO_PERFIL = 760;

const M = 72;
const X0 = M + 70;
const X1 = ANCHO_PERFIL - M;
const Y0 = 410;
/** Dos filas de rótulos por encima del gráfico, para que no se pisen. */
const FILAS = [300, 364];
const Y1 = ALTO_PERFIL - 120;

const km = (n: number) => n.toLocaleString("es-ES", { maximumFractionDigits: 1 });

export const PerfilEtapa: React.FC<Titular & { datos: DatosEtapa }> = ({ datos, antetitulo, titular, destacado }) => {
  const perfil = datos.perfil ?? [];
  const total = perfil[perfil.length - 1][0];
  const maxAlt = Math.max(...perfil.map((p) => p[1]));
  const techo = Math.max(100, Math.ceil((maxAlt * 1.1) / 50) * 50);
  const x = (k: number) => X0 + (k / total) * (X1 - X0);
  const y = (a: number) => Y1 - (Math.max(0, a) / techo) * (Y1 - Y0);
  const altEn = (k: number) => perfil.reduce((m, p) => (Math.abs(p[0] - k) < Math.abs(m[0] - k) ? p : m))[1];

  const linea = perfil.map(([k, a], i) => `${i ? "L" : "M"}${x(k).toFixed(1)},${y(a).toFixed(1)}`).join("");
  const area = `${linea}L${X1},${Y1}L${X0},${Y1}Z`;
  const pasoAlt = techo <= 200 ? 50 : 100;
  const pasoKm = total > 20 ? 5 : 2;

  return (
    <AbsoluteFill style={{ backgroundColor: brand.white, fontFamily, padding: M }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Cabecera antetitulo={antetitulo} titular={titular} destacado={destacado} />
        <Logo variante="verde" ancho={230} style={{ marginTop: 6 }} />
      </div>

      <svg width={ANCHO_PERFIL} height={ALTO_PERFIL} style={{ position: "absolute", left: 0, top: 0 }}>
        {/* Rejilla de altitud */}
        {Array.from({ length: techo / pasoAlt + 1 }, (_, i) => i * pasoAlt).map((a) => (
          <g key={a}>
            <line x1={X0} x2={X1} y1={y(a)} y2={y(a)} stroke={brand.niebla} strokeWidth={2} />
            <text x={X0 - 16} y={y(a) + 6} textAnchor="end" fontFamily="Montserrat" fontWeight={500} fontSize={18} fill={brand.gris}>
              {a} m
            </text>
          </g>
        ))}

        <path d={area} fill={brand.brote} />
        <path d={linea} fill="none" stroke={brand.green} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" />

        {/* Kilómetros */}
        {Array.from({ length: Math.floor(total / pasoKm) + 1 }, (_, i) => i * pasoKm).map((k) => (
          <text key={k} x={x(k)} y={Y1 + 34} textAnchor="middle" fontFamily="Montserrat" fontWeight={500} fontSize={18} fill={brand.gris}>
            {k} km
          </text>
        ))}
        <line x1={X0} x2={X1} y1={Y1} y2={Y1} stroke={brand.gris} strokeWidth={2} />

        {/* Paradas: rótulo arriba, en la fila libre, y guía hasta el punto. */}
        {(() => {
          let anterior = -Infinity;
          let fila = 1;
          return datos.paradas.map((p, i) => {
            const k = p.km ?? 0;
            const a = altEn(k);
            const px = x(k);
            fila = px - anterior < 260 ? 1 - fila : 0;
            anterior = px;
            const ty = FILAS[fila];
            const ancla = i === 0 ? "start" : i === datos.paradas.length - 1 ? "end" : "middle";
            const tx = i === 0 ? px - 10 : i === datos.paradas.length - 1 ? px + 10 : px;
            return (
              <g key={p.nombre}>
                <line x1={px} x2={px} y1={ty + 12} y2={Y1} stroke={brand.sendero} strokeWidth={2} strokeDasharray="4 6" />
                <circle cx={px} cy={y(a)} r={10} fill={brand.sendero} stroke={brand.white} strokeWidth={4} />
                <text x={tx} y={ty - 26} textAnchor={ancla} fontFamily="Montserrat" fontWeight={700} fontSize={24} fill={brand.grafito}>
                  {p.nombre}
                </text>
                <text x={tx} y={ty} textAnchor={ancla} fontFamily="Montserrat" fontWeight={500} fontSize={20} fill={brand.gris}>
                  {a} m · km {km(k)}
                </text>
              </g>
            );
          });
        })()}
      </svg>

      <div style={{ position: "absolute", left: M, bottom: 32, fontSize: 16, color: brand.gris }}>
        {km(total)} km. Distancia sobre el trazado de OpenStreetMap; altitud del modelo EU-DEM (Copernicus).
      </div>
    </AbsoluteFill>
  );
};
