import { Still } from "remotion";
import baionaVigo from "../../datos/etapa-baiona-vigo.json";
import olveiroaCee from "../../datos/etapa-olveiroa-cee.json";
import vigoRedondela from "../../datos/etapa-vigo-redondela.json";
import { MapaEtapa } from "./MapaEtapa";
import { ALTO_PERFIL, ANCHO_PERFIL, PerfilEtapa } from "./PerfilEtapa";
import { altoServicios, ServiciosEtapa, type Localidad } from "./ServiciosEtapa";

/**
 * Las imágenes de cada etapa para la web: mapa, servicios y perfil.
 *
 * Para añadir una etapa: su configuración en `herramientas/scripts/etapas/`,
 * `mapa_etapa.py` para generar los datos y un bloque aquí con los textos.
 * Se exportan en WebP a 1200 px de ancho (ver CLAUDE.md, "Imágenes de etapa").
 */

const LOC_BAIONA_VIGO: Localidad[] = [
  { nombre: "Baiona", hay: [1, 1, 1, 1, 1, 1, 1] },
  { nombre: "Playa América", hay: [0, 1, 0, 0, 1, 1, 0] },
  { nombre: "Saiáns", hay: [0, 1, 1, 1, 1, 1, 0] },
  { nombre: "Canido", hay: [0, 1, 1, 1, 1, 1, 0] },
  { nombre: "Paseo do Lagares", hay: [0, 1, 1, 0, 1, 1, 0] },
  { nombre: "Vigo", hay: [1, 1, 1, 1, 1, 1, 1] },
];

const LOC_OLVEIROA_CEE: Localidad[] = [
  { nombre: "Olveiroa", hay: [1, 1, 1, 1, 1, 1, 1] },
  { nombre: "O Logoso", hay: [0, 1, 0, 0, 1, 1, 0] },
  { nombre: "Hospital", hay: [0, 1, 0, 0, 0, 0, 0] },
  { nombre: "Cee", hay: [1, 1, 1, 1, 1, 1, 1] },
];

const LOC_VIGO_REDONDELA: Localidad[] = [
  { nombre: "Vigo", hay: [1, 1, 1, 1, 1, 1, 1] },
  { nombre: "Teis", hay: [0, 1, 0, 0, 1, 1, 0] },
  { nombre: "A Formiga", hay: [0, 1, 0, 0, 1, 0, 0] },
  { nombre: "Redondela", hay: [1, 1, 1, 1, 1, 1, 1] },
];

export const StillsEtapas: React.FC = () => (
  <>
    <Still
      id="MapaBaionaVigo"
      component={MapaEtapa}
      width={baionaVigo.ancho}
      height={baionaVigo.alto}
      defaultProps={{
        datos: baionaVigo,
        antetitulo: "Camino Portugués por la Costa",
        titular: "De Baiona a",
        destacado: "Vigo",
        entradilla: "El recorrido y las localidades por las que pasa la etapa, siempre cerca del mar.",
        rotulos: {
          "Playa América": { dx: 30, dy: 10, ancla: "start" },
          Saiáns: { dx: -30, dy: 10, ancla: "end" },
          Canido: { dx: -30, dy: 10, ancla: "end" },
          "Paseo do Lagares": { dx: 0, dy: 62, ancla: "start" },
        },
        ladoSalida: "izq",
        ladoLlegada: "der",
        aguas: [
          { x: 330, y: 1060, texto: "OCÉANO ATLÁNTICO", giro: -58 },
          { x: 870, y: 330, texto: "RÍA DE VIGO", giro: -24 },
        ],
        caja: { top: 72, left: 72 },
        norte: { x: 1480, y: 1180 },
      }}
    />
    <Still
      id="ServiciosBaionaVigo"
      component={ServiciosEtapa}
      width={1600}
      height={altoServicios(LOC_BAIONA_VIGO.length)}
      defaultProps={{
        antetitulo: "Etapa de Baiona a Vigo",
        titular: "Qué encontrarás en",
        destacado: "cada parada",
        localidades: LOC_BAIONA_VIGO,
      }}
    />

    <Still
      id="MapaVigoRedondela"
      component={MapaEtapa}
      width={vigoRedondela.ancho}
      height={vigoRedondela.alto}
      defaultProps={{
        datos: vigoRedondela,
        antetitulo: "Camino Portugués",
        titular: "De Vigo a",
        destacado: "Redondela",
        entradilla: "El recorrido y las localidades por las que pasa la etapa, asomada a la ría.",
        rotulos: {
          Teis: { dx: 30, dy: 44, ancla: "start" },
          "A Formiga": { dx: 20, dy: -30, ancla: "start" },
          Cedeira: { dx: 0, dy: 60, ancla: "middle" },
        },
        ladoSalida: "abajo",
        ladoLlegada: "der",
        aguas: [{ x: 640, y: 250, texto: "RÍA DE VIGO", giro: -18 }],
        caja: { right: 72, bottom: 150 },
        norte: { x: 1490, y: 150 },
        rotulosRios: {
          "Rego do Inferno": null,
          "Río Louro": null,
          "Río Maceiras": { x: 1040, y: 420, giro: -78 },
          "Río Pexegueiro": { x: 1180, y: 130, giro: -62 },
        },
        lugares: [
          { x: 800, y: 150, texto: "Puente de Rande" },
          { x: 120, y: 190, texto: "Moaña" },
        ],
      }}
    />
    <Still
      id="ServiciosVigoRedondela"
      component={ServiciosEtapa}
      width={1600}
      height={altoServicios(LOC_VIGO_REDONDELA.length)}
      defaultProps={{
        antetitulo: "Etapa de Vigo a Redondela",
        titular: "Qué encontrarás en",
        destacado: "cada parada",
        localidades: LOC_VIGO_REDONDELA,
      }}
    />
    <Still
      id="PerfilVigoRedondela"
      component={PerfilEtapa}
      width={ANCHO_PERFIL}
      height={ALTO_PERFIL}
      defaultProps={{
        datos: vigoRedondela,
        antetitulo: "Perfil de la etapa",
        titular: "Subes, llaneas y",
        destacado: "bajas",
      }}
    />

    <Still
      id="MapaOlveiroaCee"
      component={MapaEtapa}
      width={olveiroaCee.ancho}
      height={olveiroaCee.alto}
      defaultProps={{
        datos: olveiroaCee,
        antetitulo: "Camino a Fisterra",
        titular: "De Olveiroa a",
        destacado: "Cee",
        entradilla: "El recorrido y los lugares por los que pasa la etapa, del monte hasta el mar.",
        rotulos: {
          "O Logoso": { dx: -26, dy: 12, ancla: "end" },
          Hospital: { dx: 0, dy: -30, ancla: "middle" },
          "Marco do Couto": { dx: 0, dy: -30, ancla: "middle" },
          "Ermida das Neves": { dx: 0, dy: 58, ancla: "middle" },
          "San Pedro Mártir": { dx: 0, dy: -30, ancla: "middle" },
        },
        ladoSalida: "der",
        ladoLlegada: "izq",
        aguas: [{ x: 150, y: 790, texto: "RÍA DE CORCUBIÓN", giro: -62 }],
        caja: { left: 480, bottom: 72 },
        norte: { x: 1490, y: 150 },
        rotulosRios: {
          "Rego de Fumes do Cal": null,
          "Rego de Vilarcovo": null,
          "Río de Buxantes das Pozas": null,
        },
        lugares: [],
      }}
    />
    <Still
      id="ServiciosOlveiroaCee"
      component={ServiciosEtapa}
      width={1600}
      height={altoServicios(LOC_OLVEIROA_CEE.length)}
      defaultProps={{
        antetitulo: "Etapa de Olveiroa a Cee",
        titular: "Qué encontrarás en",
        destacado: "cada parada",
        localidades: LOC_OLVEIROA_CEE,
      }}
    />
    <Still
      id="PerfilOlveiroaCee"
      component={PerfilEtapa}
      width={ANCHO_PERFIL}
      height={ALTO_PERFIL}
      defaultProps={{
        datos: olveiroaCee,
        antetitulo: "Perfil de la etapa",
        titular: "Del monte",
        destacado: "al mar",
      }}
    />
  </>
);
