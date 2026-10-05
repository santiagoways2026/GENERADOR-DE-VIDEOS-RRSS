/**
 * Design system de Santiago Ways, **Brandbook 2027**, traducido a tokens de
 * video. Fuente: `docs/brandbook-2027.pdf`.
 *
 * Este archivo es la traduccion de la guia: si la guia cambia, se cambia aqui
 * y nada mas. Lo que diga el PDF manda sobre lo que diga este comentario.
 *
 * Regla de oro, segun el ratio 50/30/10/7/3: **el blanco es el principal** y
 * el verde Ways el principal secundario. El verde sendero es el color de
 * resalte y el grafito es la tinta. No hay mas colores.
 *
 * Lo que cambia respecto a la edicion 2026, por si aparece una pieza vieja:
 *
 * | 2026 | 2027 |
 * | --- | --- |
 * | Tinta bosque `#184834` | Grafito `#2E2E2D` |
 * | Verde oscuro `#668814` | Verde sendero `#506718` |
 * | Lima `#B0F808` como acento | **Fuera de la paleta** |
 * | Crema `#FAF8F2` de fondo | Brote `#FAFFEE` |
 * | Cascada Montserrat/Manrope/Poppins/Tahoma | **Montserrat sola** |
 * | Peso maximo 900 | **800, el ExtraBold** |
 * | Titulares en caja alta | **Minuscula de frase**; mayusculas solo en antetitulos |
 * | Degradado 145 grados, tres paradas | **135 grados, de `#7AA606` a `#628A04`, sutil** |
 *
 * Los tokens de 2026 que todavia usan las piezas de `archivo/` estan abajo,
 * en `legacy`, y **no se usan en nada nuevo**.
 */

/* ------------------------------------------------------------------ *
 * COLOR · la paleta cerrada del 2027
 * ------------------------------------------------------------------ */

export const brand = {
  /** 50 % de la pieza. El principal, siempre: da aire y limpieza. */
  white: "#FFFFFF",

  /** Verde Ways, 30 %. El principal secundario. Cajas, lineas, CTAs y la
   *  concha. **Nunca como color de texto sobre blanco.** */
  green: "#7AA606",

  /** Verde sendero, 10 %. El color de resalte: cajas oscuras, palabras clave
   *  y el subrayado en negativo. Blanco encima da 6,4:1. */
  sendero: "#506718",

  /** Grafito, 7 %. **La tinta**, donde antes iba el bosque. Texto principal
   *  y, como mucho, un resalte puntual. Sobre blanco da 13,6:1. */
  grafito: "#2E2E2D",

  /** Apoyo, 3 % entre los tres. */
  gris: "#6F6F6E",
  niebla: "#E8E8E6",
  brote: "#FAFFEE",
} as const;

/**
 * El degradado **solo va en cajas de fondo verde Ways**, a 135 grados y muy
 * sutil: el tono final es un punto mas oscuro y no se debe leer como efecto.
 * Todo lo demas va plano: CTA, etiquetas, antetitulos, subrayados, lineas,
 * barras, textos y la concha.
 */
export const degradado = {
  desde: "#7AA606",
  hasta: "#628A04",
  angulo: 135,
  css: "linear-gradient(135deg, #7AA606 0%, #628A04 100%)",
} as const;

/** Tokens semanticos. Usa estos en las escenas, no los colores crudos. */
export const color = {
  /** Texto: grafito, nunca negro puro. */
  fg1: brand.grafito,
  fg2: brand.gris,
  /** Texto sobre verde Ways, verde sendero o foto. */
  fgInverse: brand.white,
  /** Titulares y palabras resaltadas sobre blanco. */
  fgAccent: brand.sendero,

  bg1: brand.white,
  bg2: brand.brote,
  bgBrand: brand.green,
  bgAccent: brand.sendero,
  bgMuted: brand.niebla,

  border1: brand.niebla,
  borderBrand: brand.green,
} as const;

/**
 * Las parejas que da el brandbook, medidas y comprobadas. El minimo para
 * texto grande es 3:1.
 *
 * | Tinta sobre fondo | Ratio | Para que |
 * | --- | --- | --- |
 * | Grafito sobre blanco | 13,6:1 | Todo tipo de texto |
 * | Verde sendero sobre blanco | 6,4:1 | Titulares y palabras en verde |
 * | Blanco sobre verde sendero | 6,4:1 | Cajas oscuras, todo en blanco |
 * | Blanco sobre verde Ways | 2,9:1 | Titulares, CTAs y cajas, **en negrita** |
 * | Grafito sobre niebla | 11,1:1 | Etiquetas y superficies |
 *
 * **Nunca verde sobre verde.** Y el verde Ways no es color de texto sobre
 * blanco: ahi va el verde sendero.
 */

/* ------------------------------------------------------------------ *
 * TIPOGRAFIA
 * ------------------------------------------------------------------ */

/**
 * **Montserrat y nada mas.** La edicion 2026 llevaba una cascada de cuatro
 * familias y Tahoma como corporativa de PDF; el brandbook 2027 las retira:
 * "Tahoma, anticuada y distinta de la web. Montserrat en todas las piezas".
 * Se empaqueta con el proyecto para que el render salga igual en cualquier
 * maquina y sin conexion.
 */
export const fontFamily = "Montserrat, sans-serif";

/**
 * Los pesos que existen. **No hay 900**: el tope de la familia en la guia es
 * el 800, el ExtraBold. Si piden "mas gruesa", el margen esta en el cuerpo.
 */
export const weight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
} as const;

/**
 * La escala de la guia, en px de web. **El video no la usa tal cual**: un
 * lienzo de 1080x1920 pide cuerpos de 70 a 190, y cada pieza los mide contra
 * el ancho util con la fuente empaquetada. Lo que si se respeta es el reparto
 * de pesos y el interlineado.
 */
export const texto = {
  display: { size: 64, line: 1.05, weight: weight.extrabold },
  h1: { size: 48, line: 1.1, weight: weight.extrabold },
  h2: { size: 36, line: 1.15, weight: weight.bold },
  h3: { size: 28, line: 1.2, weight: weight.bold },
  h4: { size: 22, line: 1.2, weight: weight.bold },
  cuerpo: { size: 16, line: 1.5, weight: weight.regular },
  pie: { size: 13, line: 1.4, weight: weight.regular },
  legal: { size: 12, line: 1.4, weight: weight.regular },
  /** Mayusculas, y es el unico sitio donde las hay. */
  antetitulo: { size: 12, line: 1.2, weight: weight.bold, tracking: "0.15em" },
} as const;

export const lineHeight = {
  /** Titulares. */
  tight: 1.1,
  /** Texto de lectura. */
  normal: 1.5,
} as const;

export const tracking = {
  tight: "-0.02em",
  normal: "0",
  /** Antetitulos y etiquetas. */
  antetitulo: "0.15em",
} as const;

/**
 * **Los titulares van en minuscula de frase.** Las mayusculas se reservan a
 * antetitulos y etiquetas. Es lo que mas cambia respecto a 2026 y afecta a
 * cada rotulo que ya esta montado.
 */
export const caja = {
  titular: "none",
  antetitulo: "uppercase",
} as const;

/* ------------------------------------------------------------------ *
 * SUBRAYADO SW
 * ------------------------------------------------------------------ */

/**
 * El recurso tipografico de la marca: un bloque de color detras de las
 * palabras que llevan la promesa.
 *
 * - **Una o dos palabras, una sola vez por titular.**
 * - Girado **-1,5 grados**, como un trazo hecho a mano.
 * - Recto: **sin redondeo y sin sombra**. Siempre en color plano.
 * - Un solo tipo de subrayado por pieza.
 *
 * Tres versiones, y la de la pieza las fija todas:
 *
 * | | Fondo | Subrayado | Letra |
 * | --- | --- | --- | --- |
 * | Por defecto | Blanco o foto | Verde Ways | Blanca |
 * | En negativo | Caja verde Ways | Verde sendero | Blanca |
 * | Excepcion | Blanco, si la pieza ya lleva uno en negativo | Ninguno | Verde Ways |
 */
export const subrayado = {
  giro: -1.5,
  radio: 0,
  porDefecto: { fondo: brand.green, letra: brand.white },
  negativo: { fondo: brand.sendero, letra: brand.white },
  excepcion: { fondo: "transparent", letra: brand.green },
} as const;

/* ------------------------------------------------------------------ *
 * ESPACIADO, RADIOS, SOMBRAS
 * ------------------------------------------------------------------ */

/** Grid de 8 pt. */
export const space = {
  1: 4, 2: 8, 3: 12, 4: 16, 5: 24, 6: 32, 7: 48, 8: 64, 9: 96, 10: 128,
} as const;

export const radius = {
  md: 8,
  lg: 12,
  xl: 20,
  pill: 999,
  /** El subrayado SW no lleva redondeo. */
  subrayado: 0,
} as const;

/**
 * **Solo las cajas llevan sombra**, suave y en grafito al 12 %. Botones,
 * etiquetas y subrayados van sin sombra.
 */
export const shadow = {
  caja: "0 8px 32px rgba(46, 46, 45, 0.12)",
} as const;

/* ------------------------------------------------------------------ *
 * MOVIMIENTO
 * ------------------------------------------------------------------ */

/**
 * El brandbook 2027 no trae apartado de movimiento, asi que **se mantiene el
 * de 2026**, que si lo definia: entradas cortas, easing de salida,
 * desplazamiento corto y cero rebote. Queda anotado que viene de la edicion
 * anterior y no del libro nuevo.
 */
export const easeOut = [0.22, 0.61, 0.36, 1] as const;

/** Duraciones de entrada en fotogramas, a 30 fps. */
export const duration = {
  fast: 6,
  base: 12,
  slow: 18,
} as const;

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

/** Margenes minimos 56 px. Se usa mas para dejar aire. */
export const margin = 72;

/* ------------------------------------------------------------------ *
 * LOGO
 * ------------------------------------------------------------------ */

/**
 * "Santiago Ways" nunca se escribe como texto: la marca escrita es siempre el
 * archivo oficial.
 *
 * - **Sobre blanco, el logo va en verde Ways; sobre cualquier otro fondo, en
 *   blanco.** Eso incluye toda la foto, que es casi todo el video.
 * - El horizontal, arriba a la izquierda, con un ancho de un cuarto de pieza.
 * - El **isotipo**, arriba a la derecha, como firma. En video funciona como
 *   marca de agua desde 24 px de ancho.
 * - Area de respeto: X es la mitad de la altura de la concha, y nada entra
 *   ahi.
 * - La concha **siempre entera**: ni recortada, ni girada, ni como trama.
 *
 * Los minimos son de **ancho**, no de alto, y cambian respecto a 2026.
 */
export const logo = {
  /** Sobre blanco o brote. */
  verde: "logo/santiago-ways-verde.png",
  /** Sobre verde, grafito o foto. */
  blanco: "logo/santiago-ways-blanco.png",
  /** Isotipo suelto: firma, avatar, marca de agua. */
  isotipo: "logo/isotipo-verde.png",
  /** Anchos minimos en digital. */
  minAnchoHorizontal: 140,
  minAnchoVertical: 160,
  minAnchoIsotipo: 24,
} as const;

/* ------------------------------------------------------------------ *
 * LEGACY · edicion 2026
 * ------------------------------------------------------------------ */

/**
 * **Fuera de la paleta 2027.** Esta aqui porque las piezas de `archivo/` se
 * siguen renderizando y las usan: el reel del Xacobeo, las cartelas del kit y
 * los graficos de dato. **No se usa en nada nuevo.**
 *
 * El brandbook 2027 lo dice explicitamente en el punto de partida: "Variantes
 * de verde lima y oscuro sin aprobar. Paleta cerrada y codigos unicos".
 */
export const legacy = {
  lime: "#B0F808",
  limeSoft: "#C5F446",
  limeDeep: "#9DDB07",
  forest: "#184834",
  forestSoft: "#2A6447",
  forestDeep: "#0E2C1F",
  greenDark: "#668814",
  cream: "#FAF8F2",
  /** La escala de verdes de 2026, de la que salia el degradado de tres paradas. */
  scaleGreen: ["#F4F8E6", "#E6F0CC", "#CDE199", "#B0CC66", "#94B833",
               "#7AA606", "#668814", "#4F6B0F", "#38500B", "#243607"],
} as const;
