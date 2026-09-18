/**
 * Design system de Santiago Ways, traducido a tokens para vídeo.
 * Fuente: BrandBook oficial (repo santiagoways2026/Brandbook).
 *
 * Regla de oro del manual: el verde #7AA606 es el protagonista absoluto.
 * Nunca usar colores fuera de esta paleta.
 */

export const color = {
  /** Verde Principal. Fondos primarios, títulos, CTAs. */
  green: "#7AA606",
  /** Verde Oscuro. Sombras y textos sobre verde claro. */
  greenDark: "#668814",
  /** Blanco. Texto sobre verde, fondo limpio. Contraste máximo. */
  white: "#FFFFFF",
  /** Negro/gris oscuro. Textos secundarios sobre blanco o foto. */
  ink: "#1A1A1A",
} as const;

/**
 * El manual especifica Tahoma. Tahoma no existe en el Chrome headless que
 * usa Remotion para renderizar, asi que el vídeo saldria con otra fuente
 * sin avisar. Usamos sustitutas de Google Fonts, que se embeben en el
 * render y garantizan un resultado identico en cualquier maquina:
 *   - Titulares: Montserrat 800 (el peso black que ya usais en IG).
 *   - Cuerpo: Open Sans (humanista y compacta, la mas cercana a Tahoma).
 * Si teneis la licencia de Tahoma o preferis otra sustituta, se cambia aqui.
 */
export const font = {
  head: "Montserrat",
  body: "Open Sans",
} as const;

/** Escala tipografica para vertical 1080x1920. En video el texto va grande. */
export const size = {
  hero: 128,
  title: 92,
  subtitle: 54,
  body: 42,
  caption: 32,
} as const;

export const weight = {
  black: 800,
  bold: 700,
  regular: 400,
} as const;

/** Interlineado 120-140% segun el manual. */
export const lineHeight = {
  tight: 1.05,
  normal: 1.3,
} as const;

/** Lienzo por defecto: vertical, el formato de Reels, TikTok y carruseles. */
export const canvas = {
  width: 1080,
  height: 1920,
  fps: 30,
} as const;

/** Margen de seguridad: nada importante fuera de esto en vertical. */
export const safePadding = 96;
