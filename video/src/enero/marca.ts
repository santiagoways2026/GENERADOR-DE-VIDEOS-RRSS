/**
 * Tokens del Brandbook 2027 para los verticales de enero.
 *
 * El Brandbook 2027 sustituye a la paleta de 2026 que hay en brand/theme.ts:
 * aquí la tinta es el grafito y el segundo verde es el verde sendero.
 */
export const c = {
  verde: "#7AA606",
  verdeOscuro: "#628A04",
  sendero: "#506718",
  grafito: "#2E2E2D",
  blanco: "#FFFFFF",
  niebla: "#E8E8E6",
  brote: "#FAFFEE",
} as const;

export const fuente = "Montserrat, sans-serif";

export const FPS = 30;
export const ANCHO = 1080;
export const ALTO = 1920;

/** Zonas que tapa la interfaz de Reels, TikTok y Shorts. */
export const seguro = { arriba: 250, abajo: 420, derecha: 120, izquierda: 72 } as const;

/** Caja verde de los subtítulos: plana, girada, sin redondeo ni sombra. */
export const cajaPlana = {
  backgroundColor: c.verde,
  color: c.blanco,
  fontWeight: 800,
  padding: "0.02em 0.22em 0.06em",
  transform: "rotate(-1.5deg)",
  display: "inline-block",
} as const;

/** Caja de las cifras en los gráficos: con degradado y sombra suave. */
export const cajaGrafico = {
  backgroundImage: `linear-gradient(135deg, ${c.verde}, ${c.verdeOscuro})`,
  color: c.blanco,
  boxShadow: "0 8px 32px rgba(46, 46, 45, 0.12)",
} as const;

/** Sombra suave para que el texto blanco se lea sobre foto. */
export const sombraTexto =
  "0 2px 6px rgba(46, 46, 45, 0.55), 0 6px 24px rgba(46, 46, 45, 0.45)";

/** Curva de la marca: salida suave, nunca rebote. */
export const curva = [0.22, 0.61, 0.36, 1] as const;

export const s2f = (s: number) => Math.round(s * FPS);
