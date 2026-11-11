/**
 * Datos de una etapa, tal como los escribe
 * `herramientas/scripts/mapa_etapa.py` en `src/datos/etapa-<id>.json`.
 * Todo en píxeles del lienzo `ancho` x `alto`.
 */
export type DatosEtapa = {
  ancho: number;
  alto: number;
  km: number;
  tierra: string[];
  ruta: number[][];
  paradas: { nombre: string; x: number; y: number; km?: number }[];
  /** [km, metros] cada ~100 m, si se pidió. */
  perfil?: number[][];
};

/** El titular de marca: texto y la palabra que va sobre el subrayado Ways. */
export type Titular = {
  antetitulo: string;
  titular: string;
  destacado: string;
};

export type Ancla = "start" | "end" | "middle";
