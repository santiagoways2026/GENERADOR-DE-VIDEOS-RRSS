import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { brand, easeOut, fontFamily, scale, weight } from "../brand/theme";

/**
 * Perfil de altitud de Sarria a Santiago, para el bloque "El día duro no es
 * el que parece".
 *
 * Cuenta tres cosas, una detrás de otra y nunca a la vez: el perfil completo
 * se dibuja de izquierda a derecha; después se ilumina la etapa de Palas de
 * Rei a Arzúa, con el corte de Melide; y al final la bajada a Portomarín. El
 * resto se apaga mientras habla cada foco, porque con esta audiencia dos
 * elementos informativos a la vez compiten.
 *
 * Contraste: el texto va en bosque sobre crema o en blanco sobre bosque, las
 * dos combinaciones por encima de 9:1. No se usa blanco sobre olivo, que se
 * queda en 2,88:1.
 *
 * Datos: los del configurador `herramientas/mapas-vfx`, ruta `cien`. Las
 * distancias por etapa coinciden con Gronze; las altitudes son aproximadas y
 * así lo dice el pie.
 *
 * Con esos puntos, Palas de Rei a Arzúa sale como una bajada suave: el
 * muestreo es demasiado grueso para recoger los repechos. No se inventa un
 * perfil en sierra; la placa da el desnivel acumulado, que es lo que lo
 * explica. Gronze anota en torno a 490 m de subida y el configurador 560, de
 * ahí el "casi 500". Con un GPX real el perfil enseñaría los repechos solo.
 */

/** Pares [km acumulado, metros]. */
const ALTITUD: [number, number][] = [
  [0, 440], [5, 580], [12, 640], [18, 500], [22.2, 350], [26, 580], [31, 640],
  [34, 726], [40, 620], [47, 565], [53, 455], [60, 400], [68, 380], [75.5, 390],
  [82, 450], [88, 400], [94.6, 285], [100, 300], [108, 370], [112, 300],
  [116.6, 246],
];
const TOTAL = 116.6;

/** Final de etapa en km acumulados, con el nombre del pueblo. */
const PUEBLOS: [number, string][] = [
  [0, "Sarria"],
  [22.2, "Portomarín"],
  [47, "Palas de Rei"],
  [75.5, "Arzúa"],
  [94.6, "O Pedrouzo"],
  [116.6, "Santiago"],
];

const DURA = { ini: 47, fin: 75.5 };
/** Palas de Rei a Melide son unos 14,4 km según Gronze. */
const MELIDE = 61.4;
const BAJADA = { ini: 18, fin: 22.2 };

/* Geometría del lienzo de 1280x720. */
const X0 = 96;
const X1 = 1184;
const Y_TECHO = 250;
const Y_SUELO = 540;
const ALT_MIN = 200;
const ALT_MAX = 800;

const x = (km: number) => X0 + (km / TOTAL) * (X1 - X0);
const y = (m: number) =>
  Y_SUELO - ((m - ALT_MIN) / (ALT_MAX - ALT_MIN)) * (Y_SUELO - Y_TECHO);

/** Curva suave que pasa por todos los puntos: Catmull-Rom pasada a Bézier. */
const curva = (pts: [number, number][]) => {
  const p = pts.map(([km, m]) => [x(km), y(m)]);
  let d = `M ${p[0][0]} ${p[0][1]}`;
  for (let i = 0; i < p.length - 1; i++) {
    const a = p[i - 1] ?? p[i];
    const b = p[i];
    const c = p[i + 1];
    const e = p[i + 2] ?? c;
    d += ` C ${b[0] + (c[0] - a[0]) / 6} ${b[1] + (c[1] - a[1]) / 6}, ${
      c[0] - (e[0] - b[0]) / 6
    } ${c[1] - (e[1] - b[1]) / 6}, ${c[0]} ${c[1]}`;
  }
  return d;
};

const LINEA = curva(ALTITUD);
const AREA = `${LINEA} L ${X1} ${Y_SUELO} L ${X0} ${Y_SUELO} Z`;

const fundido = (f: number, desde: number, dur = 12) =>
  interpolate(f, [desde, desde + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const avance = (f: number, desde: number, dur: number) =>
  interpolate(f, [desde, desde + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...easeOut),
  });

/** Placa de texto del foco activo: blanco sobre bosque. */
const Placa: React.FC<{
  titulo: string;
  texto: string;
  izquierda: number;
  opacidad: number;
}> = ({ titulo, texto, izquierda, opacidad }) => (
  <div
    style={{
      position: "absolute",
      top: 112,
      left: Math.min(Math.max(izquierda, X0), X1 - 520),
      width: 520,
      backgroundColor: brand.forest,
      color: brand.white,
      borderRadius: 8,
      padding: "16px 22px 18px",
      opacity: opacidad,
      translate: `0px ${interpolate(opacidad, [0, 1], [12, 0])}px`,
    }}
  >
    <div
      style={{
        fontSize: 18,
        fontWeight: weight.black,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: brand.lime,
      }}
    >
      {titulo}
    </div>
    <div style={{ marginTop: 6, fontSize: 26, fontWeight: weight.bold, lineHeight: 1.25 }}>
      {texto}
    </div>
  </div>
);

export const PerfilSarria: React.FC<{
  /** Fotograma en que empieza a dibujarse el perfil. */
  dibujo?: number;
  /** Fotograma en que se ilumina Palas de Rei a Arzúa. */
  focoDura?: number;
  /** Fotograma en que aparece el corte de Melide. */
  focoMelide?: number;
  /** Fotograma en que se pasa a la bajada a Portomarín. */
  focoBajada?: number;
}> = ({ dibujo = 15, focoDura = 140, focoMelide = 215, focoBajada = 300 }) => {
  const f = useCurrentFrame();

  const trazo = avance(f, dibujo, 90);
  // Cada foco apaga al anterior: nunca hay dos explicaciones en pantalla.
  const enDura = fundido(f, focoDura) * (1 - fundido(f, focoBajada));
  const enMelide = fundido(f, focoMelide) * (1 - fundido(f, focoBajada));
  const enBajada = fundido(f, focoBajada);
  const apagado = 1 - 0.55 * Math.max(enDura, enBajada);

  return (
    <AbsoluteFill style={{ backgroundColor: brand.cream, fontFamily }}>
      <Interactive.Div name="Título" style={{ position: "absolute", top: 40, left: X0 }}>
        <div
          style={{
            fontSize: 40,
            fontWeight: weight.extrabold,
            color: brand.forest,
            opacity: fundido(f, 0, 15),
          }}
        >
          De Sarria a Santiago
        </div>
        <div
          style={{
            marginTop: 4,
            fontSize: 22,
            fontWeight: weight.bold,
            color: scale.forest[5],
            opacity: fundido(f, 8, 15) * (1 - Math.max(enDura, enBajada)),
          }}
        >
          116,6 km en 5 etapas · ningún puerto de montaña
        </div>
      </Interactive.Div>

      <svg width={1280} height={720} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <clipPath id="revelado">
            <rect x={0} y={0} width={X0 + trazo * (X1 - X0)} height={720} />
          </clipPath>
          {/* Los tramos resaltados son la misma curva recortada: si se trazan
              aparte con menos puntos, se despegan del perfil. */}
          <clipPath id="tramoDura">
            <rect x={x(DURA.ini)} y={0} width={x(DURA.fin) - x(DURA.ini)} height={720} />
          </clipPath>
          <clipPath id="tramoBajada">
            <rect x={x(BAJADA.ini)} y={0} width={x(BAJADA.fin) - x(BAJADA.ini)} height={720} />
          </clipPath>
        </defs>

        {/* Banda de la etapa dura, detrás del perfil. */}
        <rect
          x={x(DURA.ini)}
          y={Y_TECHO - 20}
          width={x(DURA.fin) - x(DURA.ini)}
          height={Y_SUELO - Y_TECHO + 20}
          fill={scale.green[1]}
          opacity={enDura}
        />

        <g clipPath="url(#revelado)">
          <path d={AREA} fill={brand.green} opacity={0.28 * apagado} />
          <path
            d={LINEA}
            fill="none"
            stroke={scale.green[7]}
            strokeWidth={5}
            strokeLinejoin="round"
            opacity={apagado}
          />
        </g>

        {/* La etapa dura repasada en bosque, más gruesa. */}
        <path
          d={LINEA}
          clipPath="url(#tramoDura)"
          fill="none"
          stroke={brand.forest}
          strokeWidth={8}
          opacity={enDura}
        />

        {/* La bajada a Portomarín, igual. */}
        <path
          d={LINEA}
          clipPath="url(#tramoBajada)"
          fill="none"
          stroke={brand.forest}
          strokeWidth={8}
          opacity={enBajada}
        />

        {/* Corte de Melide. */}
        <line
          x1={x(MELIDE)}
          x2={x(MELIDE)}
          y1={Y_TECHO - 20}
          y2={Y_SUELO}
          stroke={brand.forest}
          strokeWidth={3}
          strokeDasharray="8 8"
          opacity={enMelide}
        />
        <text
          x={x(MELIDE) + 12}
          y={Y_SUELO - 18}
          textAnchor="start"
          fontSize={22}
          fontWeight={weight.extrabold}
          fill={brand.forest}
          opacity={enMelide}
        >
          Melide
        </text>

        {/* Suelo y pueblos de final de etapa. */}
        <line x1={X0} x2={X1} y1={Y_SUELO} y2={Y_SUELO} stroke={scale.forest[2]} strokeWidth={2} />
        {PUEBLOS.map(([km, nombre], i) => {
          const visible = fundido(f, dibujo + (km / TOTAL) * 90 - 4, 10);
          const ancla = i === 0 ? "start" : i === PUEBLOS.length - 1 ? "end" : "middle";
          return (
            <g key={nombre} opacity={visible}>
              <line
                x1={x(km)}
                x2={x(km)}
                y1={Y_SUELO}
                y2={Y_SUELO + 12}
                stroke={brand.forest}
                strokeWidth={2}
              />
              <text
                x={x(km)}
                y={Y_SUELO + 42}
                textAnchor={ancla}
                fontSize={22}
                fontWeight={weight.bold}
                fill={brand.forest}
              >
                {nombre}
              </text>
              <text
                x={x(km)}
                y={Y_SUELO + 68}
                textAnchor={ancla}
                fontSize={18}
                fontWeight={weight.regular}
                fill={scale.forest[5]}
              >
                {`km ${km.toLocaleString("es-ES")}`}
              </text>
            </g>
          );
        })}
      </svg>

      <Interactive.Div name="Focos">
        <Placa
          titulo="Palas de Rei → Arzúa · 28,5 km"
          texto="En el perfil parece que baja. Pero en total subes casi 500 metros, en cuestas pequeñas."
          izquierda={x(DURA.ini) - 60}
          opacidad={enDura * (1 - enMelide)}
        />
        <Placa
          titulo="Se puede partir en Melide"
          texto="Dos días cortos en lugar de uno largo."
          izquierda={x(MELIDE) - 260}
          opacidad={enMelide}
        />
        <Placa
          titulo="Bajada a Portomarín"
          texto="Lo que castiga las rodillas es bajar. Escalones de piedra que resbalan con lluvia."
          izquierda={x(BAJADA.ini) - 40}
          opacidad={enBajada}
        />
      </Interactive.Div>

      <div
        style={{
          position: "absolute",
          left: X0,
          bottom: 28,
          fontSize: 16,
          color: scale.forest[5],
          opacity: fundido(f, dibujo + 90),
        }}
      >
        Distancias por etapa: Gronze. Perfil de altitud aproximado.
      </div>
    </AbsoluteFill>
  );
};

export const DURACION_PERFIL = 420;
