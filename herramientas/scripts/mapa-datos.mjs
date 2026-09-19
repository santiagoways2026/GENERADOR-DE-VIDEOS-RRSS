/**
 * Genera la geometria del mapa de rutas que usa el reel.
 *
 * El configurador de `herramientas/mapas-vfx` proyecta en el navegador con
 * d3 y descarga la geometria de paises de un CDN. Eso no vale para un render:
 * hace falta que salga igual en cualquier maquina y sin conexion. Aqui la
 * proyeccion se hace una sola vez y se escribe como paths SVG ya calculados.
 *
 *   npm install --no-save world-atlas@2 topojson-client d3-geo
 *   node herramientas/scripts/mapa-datos.mjs
 *
 * Escribe `video/src/graficos/mapa-datos.ts`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { feature } from "topojson-client";
import { geoMercator, geoPath } from "d3-geo";
import atlas from "world-atlas/countries-10m.json" with { type: "json" };

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

/**
 * Las dos vistas del mapa.
 *
 * `noroeste` es la del reel del Xacobeo: cinco rutas sobre el norte
 * peninsular, apaisada porque el encuadre da nueve grados de longitud contra
 * tres de latitud.
 *
 * `peninsula` abre hasta Sevilla y Lisboa para que quepan las siete rutas
 * principales. Hace falta en cuanto una pieza dice en pantalla cuantas son:
 * el espectador las cuenta, y con cinco dibujadas el rotulo miente. Sale casi
 * cuadrada, que en vertical llena mucho mejor.
 */
const VISTAS = {
  noroeste: {
    W: 1000,
    H: 500,
    caja: [
      [-9.9, 40.9],
      [-0.9, 44.0],
    ],
    rutas: ["norte", "frances", "primitivo", "ingles", "portuguesOporto"],
  },
  peninsula: {
    W: 1000,
    H: 1075,
    caja: [
      [-9.8, 36.8],
      [-1.0, 44.0],
    ],
    // Las siete principales que terminan en Santiago.
    rutas: [
      "norte",
      "frances",
      "primitivo",
      "ingles",
      "portugues",
      "portuguesCosta",
      "plata",
    ],
  },
};

/** Las polilineas reales viven dentro del configurador, en `ROUTES`. */
const leerRutas = () => {
  const html = fs.readFileSync(
    path.join(RAIZ, "herramientas/mapas-vfx/mapas-vfx-rutas.html"),
    "utf8",
  );
  const trozo = html
    .slice(html.indexOf("const ROUTES ="), html.indexOf("const STAGES ="))
    .replaceAll("\\n", "\n")
    .replaceAll("\\u002F", "/")
    .replaceAll("\\'", "'");
  const rutas = {};
  const bloque =
    /(\w+):\s*\{\s*label:'([^']+)',\s*from:'([^']*)',\s*km:(\d+),\s*days:(\d+),\s*zoom:([\d.]+),\s*pts:\[(.*?)\]\}/gs;
  for (const m of trozo.matchAll(bloque)) {
    const puntos = [...m[7].matchAll(/\[(-?[\d.]+),(-?[\d.]+),'([^']*)',(\d)\]/g)];
    rutas[m[1]] = {
      label: m[2],
      km: Number(m[4]),
      pts: puntos.map((p) => [Number(p[1]), Number(p[2]), p[3]]),
    };
  }
  return rutas;
};

/** Catmull-Rom densificado. Da una curva suave y, al ser polilinea, una
 *  longitud exacta: hace falta para animar el trazado con `dasharray`. */
const suavizar = (pts, proj, sub = 14) => {
  const P = pts.map(([lon, lat]) => proj([lon, lat]));
  if (P.length < 3) return P;
  const fuera = [P[0]];
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[i - 1] ?? P[i];
    const p1 = P[i];
    const p2 = P[i + 1];
    const p3 = P[i + 2] ?? P[i + 1];
    for (let s = 1; s <= sub; s++) {
      const t = s / sub;
      const t2 = t * t;
      const t3 = t2 * t;
      fuera.push([0, 1].map((e) =>
        0.5 *
        (2 * p1[e] +
          (-p0[e] + p2[e]) * t +
          (2 * p0[e] - 5 * p1[e] + 4 * p2[e] - p3[e]) * t2 +
          (-p0[e] + 3 * p1[e] - 3 * p2[e] + p3[e]) * t3),
      ));
    }
  }
  return fuera;
};

const rutasFuente = leerRutas();
const paises = feature(atlas, atlas.objects.countries).features;
const PENINSULA = new Set(["Spain", "Portugal", "France"]);

/** Proyecta una vista entera: tierra, rutas y el punto de destino. */
const construir = ({ W, H, caja, rutas }) => {
  const proj = geoMercator().fitExtent(
    [
      [0, 0],
      [W, H],
    ],
    { type: "MultiPoint", coordinates: caja },
  );
  // Sin recorte el path arrastra la geometria del mundo entero.
  proj.clipExtent([
    [0, 0],
    [W, H],
  ]);
  const dibujar = geoPath(proj).digits(1);

  const tierra = paises
    .filter((c) => PENINSULA.has(c.properties.name))
    .map((c) => dibujar(c))
    .filter(Boolean)
    .join(" ");

  const trazados = rutas.map((clave) => {
    const r = rutasFuente[clave];
    if (!r) throw new Error(`No existe la ruta ${clave} en el configurador.`);
    const pts = suavizar(r.pts.map((pt) => [pt[0], pt[1]]), proj);
    let largo = 0;
    for (let i = 1; i < pts.length; i++) {
      largo += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    }
    const [ox, oy] = proj(r.pts[0].slice(0, 2));
    return {
      clave,
      label: r.label,
      origen: r.pts[0][2],
      km: r.km,
      d: pts.map((pt, i) => `${i ? "L" : "M"}${pt[0].toFixed(1)} ${pt[1].toFixed(1)}`).join(""),
      largo: Math.ceil(largo),
      ox: Number(ox.toFixed(1)),
      oy: Number(oy.toFixed(1)),
    };
  });

  const [sx, sy] = proj([-8.545, 42.881]);
  return {
    lienzo: { ancho: W, alto: H },
    tierra,
    santiago: { x: Number(sx.toFixed(1)), y: Number(sy.toFixed(1)) },
    rutas: trazados,
  };
};

const vistas = Object.fromEntries(
  Object.entries(VISTAS).map(([nombre, spec]) => [nombre, construir(spec)]),
);

const salida = `/**
 * Geometria de los mapas de rutas, ya proyectada.
 *
 * Sale de las polilineas reales del configurador de \`herramientas/mapas-vfx\`
 * y de la geometria de paises de Natural Earth a escala 1:10 m, proyectadas
 * en Mercator.
 *
 * Se precalcula para que el render sea identico en cualquier maquina y no
 * dependa ni de d3 ni de descargar nada.
 *
 * NO SE EDITA A MANO. Lo genera \`herramientas/scripts/mapa-datos.mjs\`.
 */

export type RutaMapa = {
  clave: string;
  /** Nombre de la ruta en espanol. Fuera del mercado espanol no se rotula. */
  label: string;
  /** Localidad de partida. */
  origen: string;
  km: number;
  /** Trazado proyectado. */
  d: string;
  /** Longitud en px, para animar el dibujado con \`strokeDasharray\`. */
  largo: number;
  /** Punto de partida, donde se enciende el destello de salida. */
  ox: number;
  oy: number;
};

export type VistaMapa = {
  lienzo: { ancho: number; alto: number };
  /** Espana, Portugal y Francia, recortadas al lienzo. */
  tierra: string;
  /** Santiago de Compostela: el punto donde converge todo. */
  santiago: { x: number; y: number };
  rutas: RutaMapa[];
};

/**
 * \`noroeste\`: cinco rutas sobre el norte peninsular, apaisada.
 * \`peninsula\`: las siete principales, casi cuadrada. Se usa cuando la pieza
 * dice en pantalla cuantas rutas hay, porque el espectador las cuenta.
 */
export const VISTAS: Record<"noroeste" | "peninsula", VistaMapa> =
  ${JSON.stringify(vistas, null, 2)};
`;

fs.writeFileSync(path.join(RAIZ, "video/src/graficos/mapa-datos.ts"), salida);
for (const [nombre, v] of Object.entries(vistas)) {
  console.log(`${nombre}: ${v.rutas.length} rutas · lienzo ${v.lienzo.ancho}x${v.lienzo.alto} · Santiago en ${v.santiago.x},${v.santiago.y}`);
  for (const r of v.rutas) console.log(`   ${r.clave.padEnd(16)} ${String(r.km).padStart(4)} km  ${r.largo} px desde ${r.origen}`);
}
