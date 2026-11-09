/**
 * Sistema de diseño de Santiago Ways, Brandbook 2027, traducido a tokens de
 * vídeo. Fuente: `docs/brandbook-2027.pdf`.
 *
 * Sustituye a la guía de 2026. El rebranding es continuista: se conserva el
 * verde Ways y la concha, y se cierra la paleta. Lima y bosque desaparecen
 * ("variantes de verde lima y oscuro sin aprobar"), la tinta pasa a ser el
 * grafito y la tipografía es Montserrat sola.
 *
 * Proporción orientativa por pieza: blanco 50 %, verde Ways 30 %, verde
 * sendero 10 %, grafito 7 %, apoyo 3 %. En piezas con foto cuenta el color de
 * cajas y textos, no la imagen.
 */

/* ------------------------------------------------------------------ *
 * COLOR · paleta cerrada, sin escalas intermedias
 * ------------------------------------------------------------------ */

export const brand = {
  /** Blanco. El principal, siempre: da aire a todas las piezas. */
  white: "#FFFFFF",
  /** Verde Ways. Cajas, líneas, CTA y concha. Nunca texto sobre blanco. */
  green: "#7AA606",
  /** Final del degradado de las cajas verdes. Solo para eso. */
  greenEnd: "#628A04",
  /** Verde sendero. Resalte: cajas oscuras y palabras clave en verde. */
  sendero: "#506718",
  /** Grafito. Texto principal. Sustituye al bosque como tinta. */
  grafito: "#2E2E2D",
  /** Apoyo: gris para textos secundarios. */
  gris: "#6F6F6E",
  /** Apoyo: niebla para superficies y etiquetas. */
  niebla: "#E8E8E6",
  /** Apoyo: brote, superficie clara con un punto de verde. */
  brote: "#FAFFEE",
} as const;

/**
 * Qué letra va sobre qué fondo, con los contrastes del brandbook,
 * comprobados con la fórmula de la WCAG:
 *
 * - Grafito sobre blanco, 13,6:1: todo tipo de texto.
 * - Verde sendero sobre blanco, 6,4:1: titulares y palabras en verde.
 * - Blanco sobre verde sendero, 6,4:1: cajas oscuras, todo en blanco.
 * - Grafito sobre niebla, 11,1:1: etiquetas y superficies.
 * - Blanco sobre verde Ways, 2,9:1: SOLO titulares, CTA y cajas en negrita.
 * - Verde Ways sobre blanco: cajas, líneas y concha; nunca texto.
 * - Nunca verde sobre verde.
 */
export const color = {
  fg1: brand.grafito,
  fg2: brand.gris,
  fgInverse: brand.white,
  /** Palabras y titulares en verde sobre blanco. */
  fgAccent: brand.sendero,

  bg1: brand.white,
  bgSoft: brand.niebla,
  bgBrote: brand.brote,
  bgBrand: brand.green,
  bgStrong: brand.sendero,

  line: brand.green,
  border: brand.niebla,
} as const;

/**
 * Degradado: solo en cajas de fondo verde Ways, a 135°, de verde Ways arriba
 * a la izquierda a #628A04 abajo a la derecha. Tan sutil que no se note como
 * efecto. CTA, etiquetas, antetítulos, subrayados, líneas, barras, textos y
 * concha van siempre planos, y el blanco y el sendero también.
 */
export const gradient = {
  cajaVerde: `linear-gradient(135deg, ${brand.green} 0%, ${brand.greenEnd} 100%)`,
} as const;

/** Toda caja lleva esta sombra para separarse del blanco. Botones, etiquetas
 *  y subrayados, sin sombra. */
export const shadow = {
  caja: "0 8px 32px rgba(46, 46, 45, 0.12)",
} as const;

/** Velo sobre metraje cuando el texto blanco no tiene contraste. Grafito, no
 *  negro: el brandbook pide "un overlay oscuro suave". */
export const velo = (opacidad: number) => `rgba(46, 46, 45, ${opacidad})`;

/* ------------------------------------------------------------------ *
 * TIPOGRAFÍA · Montserrat, una sola familia
 * ------------------------------------------------------------------ */

/** Empaquetada en `fuentes.ts` para que el render sea idéntico sin conexión. */
export const fontFamily = "Montserrat, sans-serif";

/** Pesos permitidos: de 400 a 800. No hay 900. */
export const weight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
} as const;

/**
 * Escala oficial para web, en px. Titulares siempre en minúscula de frase;
 * mayúsculas solo en antetítulos y etiquetas.
 */
export const fontSize = {
  /** Display · 800 · interlineado 1,05. */
  display: 64,
  /** H1 · 800 · 1,1. */
  h1: 48,
  /** H2 · 700 · 1,15. */
  h2: 36,
  /** H3 · 700 · 1,2. */
  h3: 28,
  /** H4 · 700 · 1,2. */
  h4: 22,
  /** Texto · 400 · 1,5. */
  texto: 16,
  /** Pie o legal · 400 · 1,4. */
  pie: 13,
  /** Antetítulo · MAYÚSCULAS · 700 · +0,15 em. */
  antetitulo: 12,
} as const;

/**
 * Escala para pantalla, la del propio brandbook: etiqueta 24 Bold, titular 72
 * ExtraBold, titular de sección 44 Bold, lectura 32 Regular. Referida a un
 * lienzo de 1920 px; en 1280x720 se multiplica por 2/3 y en vertical de 1080
 * se usa tal cual.
 */
export const videoSize = {
  titular: 72,
  seccion: 44,
  lectura: 32,
  etiqueta: 24,
} as const;

export const lineHeight = {
  titular: 1.1,
  subtitular: 1.2,
  texto: 1.5,
} as const;

export const tracking = {
  normal: "0",
  /** Antetítulos y etiquetas en mayúsculas. */
  antetitulo: "0.15em",
} as const;

/**
 * El subrayado Ways: un bloque de color plano detrás de una o dos palabras,
 * una sola vez por titular, girado -1,5° como un trazo hecho a mano. Recto,
 * sin redondeo ni sombra. Un solo tipo de subrayado por pieza:
 *
 * 1. Por defecto, sobre blanco o foto: bloque verde Ways, letra blanca.
 * 2. En negativo, sobre caja verde Ways: bloque sendero, letra blanca.
 * 3. Excepción, si la pieza ya lleva uno en negativo: letra verde Ways, sin
 *    bloque.
 */
export const subrayado = {
  giro: -1.5,
} as const;

/* ------------------------------------------------------------------ *
 * ESPACIADO Y RADIOS
 * ------------------------------------------------------------------ */

/** Grid de 8 pt. */
export const space = {
  1: 4, 2: 8, 3: 12, 4: 16, 5: 24, 6: 32, 7: 48, 8: 64, 9: 96, 10: 128,
} as const;

export const radius = {
  md: 8,
  /** Cajas. */
  lg: 12,
  pill: 999,
} as const;

/* ------------------------------------------------------------------ *
 * MOVIMIENTO
 * ------------------------------------------------------------------ */

/**
 * El brandbook no fija el movimiento, así que se mantiene el criterio previo:
 * entradas cortas, easing de salida, desplazamiento corto, cero rebote.
 */
export const easeOut = [0.22, 0.61, 0.36, 1] as const;

/** Duraciones de entrada en fotogramas, a 30 fps. */
export const duration = {
  fast: 6,
  base: 12,
  slow: 18,
} as const;

/** Desplazamiento vertical de entrada, en un lienzo de 1080 de ancho. */
export const slideUp = 24;

/* ------------------------------------------------------------------ *
 * LIENZO
 * ------------------------------------------------------------------ */

export const format = {
  reels: { width: 1080, height: 1920 },
  feed: { width: 1080, height: 1080 },
  youtube: { width: 1280, height: 720 },
} as const;

export const fps = 30;

/** Márgenes mínimos 56 px. Se usa más para dejar aire. */
export const margin = 72;

/* ------------------------------------------------------------------ *
 * LOGO
 * ------------------------------------------------------------------ */

/**
 * La marca nunca se escribe como texto: siempre el archivo oficial.
 *
 * - Sobre blanco, en verde Ways; sobre cualquier otro fondo, en blanco.
 * - Área de respeto: X, la mitad de la altura de la concha.
 * - En vídeo (YouTube, reels), el isotipo funciona como marca de agua desde
 *   24 px, arriba a la derecha. Nunca sobre caras.
 * - La concha, siempre entera: nunca recortada, girada ni usada como trama.
 *   Admite usarse como marca de agua muy suave.
 *
 * Anchos mínimos digitales: horizontal 140 px, vertical 160 px, isotipo
 * 24 px.
 */
export const logo = {
  verde: "logo/santiago-ways-verde.png",
  blanco: "logo/santiago-ways-blanco.png",
  isotipo: "logo/isotipo-verde.png",
  isotipoBlanco: "logo/isotipo-blanco.png",
  minWidth: 140,
  minWidthIsotipo: 24,
} as const;
