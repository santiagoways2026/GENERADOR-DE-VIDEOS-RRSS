import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import z11 from "../../public/enero/mapa/galicia-z11.json";
import z9 from "../../public/enero/mapa/galicia-z9.json";
import { c, fuente, sombraTexto } from "./marca";
import { type Punto, RUTAS } from "./rutas";

/**
 * Mapa animado sobre satélite, con el lenguaje de los configuradores de
 * herramientas/mapas-vfx: imagen oscurecida, línea de ruta luminosa que se
 * dibuja, puntos en las localidades y estrella en el destino.
 *
 * Todo vive en píxeles de Web Mercator a zoom 11; la cámara decide qué punto
 * cae en el centro y con qué escala.
 */

const N = 256 * 2 ** 11;
/** Origen local: la esquina de la capa amplia. Con coordenadas absolutas
 *  (unos 250.000 px) Chrome deja de pintar las imágenes. */
const OX = z9.origenX * 4;
const OY = z9.origenY * 4;
export const mundo = (lon: number, lat: number): [number, number] => {
  const s = Math.sin((lat * Math.PI) / 180);
  return [
    ((lon + 180) / 360) * N - OX,
    (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * N - OY,
  ];
};

export type Camara = { x: number; y: number; escala: number };
/** Altura de la pantalla a la que cae el centro de la cámara. */
export const FOCO_Y = 900;

/** Cámara que encuadra unas rutas dentro del ancho y alto útiles. */
export const encuadrar = (
  ids: string[],
  ancho = 760,
  alto = 760,
  max = 1.4,
): Camara => {
  const pts = ids.flatMap((id) => RUTAS[id].map((p) => mundo(p[0], p[1])));
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const [x0, x1, y0, y1] = [
    Math.min(...xs),
    Math.max(...xs),
    Math.min(...ys),
    Math.max(...ys),
  ];
  const escala = Math.min(
    max,
    ancho / Math.max(1, x1 - x0),
    alto / Math.max(1, y1 - y0),
  );
  return { x: (x0 + x1) / 2, y: (y0 + y1) / 2, escala };
};

/** Interpola dos cámaras; la escala en logaritmo, para que el zoom sea uniforme. */
export const mezclar = (a: Camara, b: Camara, t: number): Camara => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
  escala: Math.exp(
    Math.log(a.escala) + (Math.log(b.escala) - Math.log(a.escala)) * t,
  ),
});

/** Curva suave (Catmull-Rom) muestreada como polilínea densa. */
const suavizar = (p: [number, number][], pasos = 16): [number, number][] => {
  if (p.length < 3) return p;
  const out: [number, number][] = [];
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[Math.max(0, i - 1)],
      p1 = p[i],
      p2 = p[i + 1],
      p3 = p[Math.min(p.length - 1, i + 2)];
    for (let k = 0; k < pasos; k++) {
      const t = k / pasos,
        t2 = t * t,
        t3 = t2 * t;
      const f = (a: number, b: number, cc: number, d: number) =>
        0.5 *
        (2 * b +
          (-a + cc) * t +
          (2 * a - 5 * b + 4 * cc - d) * t2 +
          (-a + 3 * b - 3 * cc + d) * t3);
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  out.push(p[p.length - 1]);
  return out;
};

/** Recorta una polilínea a la fracción `t` de su longitud. */
const recortar = (p: [number, number][], t: number): [number, number][] => {
  if (t >= 1) return p;
  if (t <= 0) return [p[0]];
  const tramos = p
    .slice(1)
    .map((q, i) => Math.hypot(q[0] - p[i][0], q[1] - p[i][1]));
  const total = tramos.reduce((a, b) => a + b, 0);
  let falta = total * t;
  const out: [number, number][] = [p[0]];
  for (let i = 0; i < tramos.length; i++) {
    if (falta <= tramos[i]) {
      const r = falta / tramos[i];
      out.push([
        p[i][0] + (p[i + 1][0] - p[i][0]) * r,
        p[i][1] + (p[i + 1][1] - p[i][1]) * r,
      ]);
      return out;
    }
    falta -= tramos[i];
    out.push(p[i + 1]);
  }
  return out;
};

export type RutaEnMapa = {
  id: string;
  /** 0 a 1: cuánto se ha dibujado. */
  progreso: number;
  opacidad?: number;
  /** Rótulos de salida y llegada. */
  rotulos?: boolean;
  /** Número de la ruta junto a la salida. */
  numero?: number;
  /** Nombre corto para el rótulo de salida, si no vale el de la localidad. */
  salida?: string;
};

const Estrella: React.FC<{ x: number; y: number; r: number; o: number }> = ({
  x,
  y,
  r,
  o,
}) => {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 === 0 ? r : r * 0.45;
    return `${x + rr * Math.cos(a)},${y + rr * Math.sin(a)}`;
  }).join(" ");
  return (
    <g opacity={o}>
      <circle
        cx={x}
        cy={y}
        r={r * 1.9}
        fill="rgba(122,166,6,0.28)"
        stroke={c.verde}
        strokeWidth={3}
      />
      <polygon points={pts} fill={c.brote} />
    </g>
  );
};

const Rotulo: React.FC<{
  x: number;
  y: number;
  texto: string;
  o: number;
  lado?: "arriba" | "abajo";
}> = ({ x, y, texto, o, lado = "arriba" }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      transform: `translate(-50%, ${lado === "arriba" ? "-150%" : "60%"})`,
      fontFamily: fuente,
      fontWeight: 800,
      fontSize: 40,
      color: c.blanco,
      whiteSpace: "nowrap",
      textShadow: sombraTexto,
      opacity: o,
    }}
  >
    {texto}
  </div>
);

export const Mapa: React.FC<{
  camara: Camara;
  rutas: RutaEnMapa[];
  /** Estrella en Santiago. */
  santiago?: number;
  /** Oscurecido del satélite, de 0 a 1. */
  velo?: number;
}> = ({ camara, rutas, santiago = 1, velo = 0.42 }) => {
  const { x: cx, y: cy, escala: s } = camara;
  const pantalla = (p: [number, number]): [number, number] => [
    540 + s * (p[0] - cx),
    FOCO_Y + s * (p[1] - cy),
  ];
  const [sx, sy] = pantalla(mundo(-8.545, 42.881));
  return (
    <AbsoluteFill style={{ backgroundColor: "#0d1b2a", overflow: "hidden" }}>
      {/* Cada capa se coloca ya en coordenadas de pantalla: con una
          transformación anidada Chrome deja de pintarlas. */}
      <Img
        src={staticFile("enero/mapa/galicia-z9.jpg")}
        style={{
          position: "absolute",
          left: 540 - s * cx,
          top: FOCO_Y - s * cy,
          width: z9.ancho * 4 * s,
          height: z9.alto * 4 * s,
          maxWidth: "none",
        }}
      />
      <Img
        src={staticFile("enero/mapa/galicia-z11.jpg")}
        style={{
          position: "absolute",
          left: 540 + s * (z11.origenX - OX - cx),
          top: FOCO_Y + s * (z11.origenY - OY - cy),
          width: z11.ancho * s,
          height: z11.alto * s,
          maxWidth: "none",
        }}
      />
      <AbsoluteFill
        style={{
          backgroundColor: `rgba(46,46,45,${velo})`,
          backgroundImage:
            "linear-gradient(to bottom, rgba(46,46,45,0.55) 0%, rgba(46,46,45,0) 32%, rgba(46,46,45,0) 60%, rgba(46,46,45,0.6) 85%)",
        }}
      />
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <filter id="halo" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
        </defs>
        {rutas.map((r) => {
          const base = RUTAS[r.id].map((p: Punto) =>
            pantalla(mundo(p[0], p[1])),
          );
          const linea = recortar(suavizar(base), r.progreso);
          const d =
            "M" +
            linea.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join("L");
          const cabeza = linea[linea.length - 1];
          const o = r.opacidad ?? 1;
          return (
            <g key={r.id} opacity={o}>
              <path
                d={d}
                fill="none"
                stroke={c.verde}
                strokeWidth={22}
                strokeOpacity={0.55}
                filter="url(#halo)"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={d}
                fill="none"
                stroke={c.verde}
                strokeWidth={10}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={d}
                fill="none"
                stroke={c.brote}
                strokeWidth={3}
                strokeOpacity={0.85}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {RUTAS[r.id].map((p, i) => {
                if (!p[3] || i === RUTAS[r.id].length - 1) return null;
                // El punto aparece cuando la línea llega a él.
                const fr = i / (RUTAS[r.id].length - 1);
                if (r.progreso < fr - 0.001) return null;
                const [x, y] = base[i];
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r={9}
                    fill={c.grafito}
                    stroke={c.brote}
                    strokeWidth={4}
                  />
                );
              })}
              {r.progreso > 0 && r.progreso < 1 ? (
                <circle
                  cx={cabeza[0]}
                  cy={cabeza[1]}
                  r={12}
                  fill={c.brote}
                  stroke={c.verde}
                  strokeWidth={5}
                />
              ) : null}
            </g>
          );
        })}
        <Estrella x={sx} y={sy} r={18} o={santiago} />
      </svg>
      {rutas.map((r) => {
        if (!r.rotulos && !r.numero) return null;
        const pts = RUTAS[r.id];
        const [x0, y0] = pantalla(mundo(pts[0][0], pts[0][1]));
        const fin = pts[pts.length - 1];
        const [x1, y1] = pantalla(mundo(fin[0], fin[1]));
        const o = (r.opacidad ?? 1) * Math.min(1, r.progreso * 6);
        const oFin =
          (r.opacidad ?? 1) * Math.max(0, Math.min(1, (r.progreso - 0.85) * 7));
        return (
          <React.Fragment key={r.id}>
            {r.numero ? (
              <div
                style={{
                  position: "absolute",
                  left: x0,
                  top: y0,
                  transform: "translate(-50%, -135%)",
                  backgroundImage: `linear-gradient(135deg, ${c.verde}, ${c.verdeOscuro})`,
                  color: c.blanco,
                  fontFamily: fuente,
                  fontWeight: 800,
                  fontSize: 52,
                  width: 74,
                  height: 74,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 8px 32px rgba(46, 46, 45, 0.25)",
                  opacity: o,
                }}
              >
                {r.numero}
              </div>
            ) : null}
            {r.rotulos ? (
              <>
                <Rotulo x={x0} y={y0} texto={r.salida ?? pts[0][2]} o={o} />
                <Rotulo
                  x={x1}
                  y={y1}
                  texto={
                    fin[2] === "Santiago de Compostela" ? "Santiago" : fin[2]
                  }
                  o={oFin}
                  lado="abajo"
                />
              </>
            ) : null}
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

/** Atribución obligatoria de la imagen de satélite. */
export const Atribucion: React.FC = () => (
  <div
    style={{
      position: "absolute",
      left: 72,
      top: 1478,
      fontFamily: fuente,
      fontSize: 18,
      fontWeight: 600,
      color: "rgba(255,255,255,0.7)",
    }}
  >
    {z11.atribucion}
  </div>
);
