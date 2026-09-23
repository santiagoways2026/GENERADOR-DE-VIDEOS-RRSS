/**
 * Design system de Santiago Ways, edicion 2026, traducido a tokens de video.
 * Fuente: "Guia de marca - Santiago Ways", sistema de diseno oficial.
 *
 * Regla de oro: el protagonista es el verde olivo. Blanco + olivo en la
 * mayoria de piezas. Lima y bosque son complementarios de uso puntual.
 * En caso de duda: pintalo verde, ponlo en bold y deja aire.
 */

/* ------------------------------------------------------------------ *
 * COLOR
 * ------------------------------------------------------------------ */

export const brand = {
  /** Verde principal. Fondos, CTAs primarios, titulos sobre claro. */
  green: "#7AA606",
  /** Verde oscuro. Hover, pressed, sombras, verde con mas contraste. */
  greenDark: "#668814",
  white: "#FFFFFF",

  /** Lima. Brushstroke sobre foto, badge de oferta, CTA muy puntual.
   *  Encima siempre texto bosque. Nunca protagonista. */
  lime: "#B0F808",
  limeSoft: "#C5F446",
  limeDeep: "#9DDB07",

  /** Bosque. Tinta por defecto: sustituye al negro. Footers, bloques oscuros. */
  forest: "#184834",
  forestSoft: "#2A6447",
  forestDeep: "#0E2C1F",

  /** Crema. Fondo alternativo para lecturas largas. */
  cream: "#FAF8F2",
} as const;

/** Escalas completas, por si hace falta un paso intermedio. */
export const scale = {
  green: ["#F4F8E6", "#E6F0CC", "#CDE199", "#B0CC66", "#94B833",
          "#7AA606", "#668814", "#4F6B0F", "#38500B", "#243607"],
  lime: ["#F5FDE0", "#ECFBC2", "#D7F784", "#C5F446", "#B0F808",
         "#9DDB07", "#7DAE05", "#5E8404", "#3F5902", "#1F2C01"],
  forest: ["#E8F0EC", "#CDDFD5", "#9BBFAA", "#68A07F", "#408561",
           "#2A6447", "#184834", "#133A2A", "#0E2C1F", "#081B13"],
  neutral: ["#FFFFFF", "#FAF8F2", "#F3F0E7", "#E6E2D6", "#CFCABB",
            "#A8A498", "#76736A", "#4F4D47", "#353330", "#22211F", "#15140F"],
} as const;

/** Tokens semanticos. Usa estos en las escenas, no los colores crudos. */
export const color = {
  /** Texto: bosque, nunca negro puro. */
  fg1: brand.forest,
  fg2: brand.forestSoft,
  fg3: "#76736A",
  /** Texto sobre bloques verdes o bosque. */
  fgInverse: brand.white,
  /** Texto sobre lima: siempre bosque. */
  fgOnLime: brand.forest,

  bg1: brand.white,
  bg2: brand.cream,
  bgBrand: brand.green,
  bgBrandStrong: brand.greenDark,
  bgInk: brand.forest,
  bgAccent: brand.lime,
  bgWash: "#F4F8E6",

  border1: "#E6E2D6",
  borderBrand: brand.green,
} as const;

/* ------------------------------------------------------------------ *
 * TIPOGRAFIA
 * ------------------------------------------------------------------ */

/**
 * Tahoma es la corporativa oficial para PDF y material legacy. En web y
 * video la cascada es Montserrat -> Manrope -> Poppins. Las fuentes se
 * empaquetan con el proyecto para que el render sea identico en cualquier
 * maquina y funcione sin conexion.
 */
export const fontFamily = "Montserrat, Manrope, Poppins, Tahoma, sans-serif";

/** Escala oficial: 12 · 14 · 16 · 18 · 22 · 28 · 36 · 48 · 64 · 88 px. */
export const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  md: 18,
  lg: 22,
  xl: 28,
  "2xl": 36,
  "3xl": 48,
  "4xl": 64,
  /** Titular de impacto para feed: mayusculas, peso 900. */
  impact: 88,
} as const;

export const weight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
} as const;

export const lineHeight = {
  tight: 1.1,
  snug: 1.25,
  normal: 1.5,
  relaxed: 1.7,
} as const;

export const tracking = {
  tight: "-0.02em",
  normal: "0",
  wide: "0.02em",
  loose: "0.08em",
} as const;

/* ------------------------------------------------------------------ *
 * ESPACIADO, RADIOS, SOMBRAS
 * ------------------------------------------------------------------ */

/** Grid de 8 pt. */
export const space = {
  1: 4, 2: 8, 3: 12, 4: 16, 5: 24, 6: 32, 7: 48, 8: 64, 9: 96, 10: 128,
} as const;

export const radius = {
  /** Componentes: botones, inputs. */
  md: 8,
  /** Cards. */
  lg: 12,
  xl: 20,
  pill: 999,
} as const;

/** Sombras tintadas hacia bosque, nunca negro. */
export const shadow = {
  card: "0 4px 12px rgba(24, 72, 52, 0.10), 0 1px 2px rgba(24, 72, 52, 0.05)",
  raised: "0 12px 28px rgba(24, 72, 52, 0.14), 0 2px 6px rgba(24, 72, 52, 0.06)",
  brand: "0 12px 24px rgba(122, 166, 6, 0.28)",
} as const;

/* ------------------------------------------------------------------ *
 * MOVIMIENTO
 * ------------------------------------------------------------------ */

/**
 * La guia define el movimiento en milisegundos, pensando en interfaz web:
 * 120 ms hover, 220 ms paneles, 420 ms pagina, con fade + slide-up de
 * 8 a 12 px y nunca bounce. En video esas duraciones son casi imperceptibles,
 * asi que se escalan a fotogramas manteniendo la regla: entradas cortas,
 * easing de salida, desplazamiento corto, cero rebote.
 */
export const easeOut = [0.22, 0.61, 0.36, 1] as const;

/** Duraciones de entrada en fotogramas, a 30 fps. */
export const duration = {
  fast: 6,
  base: 12,
  slow: 18,
} as const;

/**
 * Fotogramas de cruce a cada lado de un corte interno entre planos.
 *
 * El fundido visible que se aprecia es solo el de entrada del plano que
 * llega (el de salida del que se va queda tapado detras, a la misma
 * opacidad plena): con 8 fotogramas (~0,27 s) el cruce se nota suave sin
 * dejar de ser un corte rapido.
 */
export const medioCruce = 8;

/** Desplazamiento vertical de entrada. La guia pide 8-12 px en web;
 *  en un lienzo de 1080 px de ancho equivale a este rango. */
export const slideUp = 24;

/* ------------------------------------------------------------------ *
 * LIENZO
 * ------------------------------------------------------------------ */

/** Formatos sociales oficiales. */
export const format = {
  reels: { width: 1080, height: 1920 },
  feed: { width: 1080, height: 1080 },
  youtube: { width: 1280, height: 720 },
} as const;

export const fps = 30;

/** Margenes minimos 56 px. Se usa mas para dejar aire. */
export const margin = 72;

/* ------------------------------------------------------------------ *
 * LOGO
 * ------------------------------------------------------------------ */

/**
 * "Santiago Ways" nunca se escribe como texto: ni en mayusculas, ni junto
 * al isotipo, ni como lockup tipografico. La marca escrita es siempre el
 * archivo oficial. Nunca sobre lima, nunca full-color sobre imagen, nunca
 * delinear, rotar ni usar como mascara.
 * Tamano minimo digital: 60 px de alto, 180 px de ancho.
 */
export const logo = {
  /** Sobre blanco o crema. */
  verde: "logo/santiago-ways-verde.png",
  /** Sobre olivo, bosque o foto. */
  blanco: "logo/santiago-ways-blanco.png",
  /** Isotipo suelto: favicon, avatar, sellos pequenos. */
  isotipo: "logo/isotipo-verde.png",
  minHeight: 60,
  minWidth: 180,
} as const;
