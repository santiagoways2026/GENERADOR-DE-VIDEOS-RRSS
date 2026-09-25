import {
  ConfigTestimonio,
  duracionTestimonio,
  TestimonioAnuncio,
} from "./componentes/TestimonioAnuncio";

/**
 * Testimonio de dos peregrinas argentinas, para Meta Ads.
 *
 * Sin la marca de agua de Clideo (recorte del 5 % que mantiene el 9:16) y
 * cortado en la pausa de voz de 53,3 s con un fundido: el tramo final del
 * montaje original mezcla dos músicas y se deja fuera.
 *
 * Sobre el audio, el metraje del albergue se sustituye: maletas donde
 * estaba el comedor, peregrinos disfrutando donde estaban los platos y
 * hoteles donde estaban las literas y la terraza.
 */
const config: ConfigTestimonio = {
  src: "testimonios/argentinas.mp4",
  fin: 53.9,
  cierre: 2.4,
  recursos: [
    {
      nombre: "Maletas",
      desde: 6.07,
      hasta: 12.5,
      lista: [
        { src: "maletas-etiqueta", dura: 2.23 },
        { src: "equipaje-fila", dura: 0.7 },
        { src: "equipaje-portal", dura: 1.2, encuadre: "60% 50%" },
        { src: "maleta-concha", dura: 1.73 },
        { src: "equipaje-etiquetas", dura: 0.93 },
      ],
    },
    {
      nombre: "Peregrinos",
      desde: 12.5,
      hasta: 18.33,
      lista: [
        { src: "pareja-sendero", dura: 2.26, encuadre: "72% 50%" },
        { src: "mirador-grupo", dura: 1.26, encuadre: "18% 50%" },
        { src: "grupo-mimosas", dura: 1.2 },
        { src: "brindis", dura: 2.0, encuadre: "62% 50%" },
      ],
    },
    {
      nombre: "Hoteles",
      desde: 24.23,
      hasta: 32.63,
      lista: [
        { src: "jardin-alojamiento", dura: 4.4 },
        { src: "habitacion-alojamiento", dura: 3.14 },
        { src: "habitacion-piedra", dura: 1.7 },
        { src: "terraza-casa-piedra", dura: 3.13 },
      ],
    },
    {
      // La catedral tapa el final; el audio sigue hasta el fundido.
      nombre: "Catedral",
      desde: 51.0,
      hasta: 53.9,
      overlay: 0.18,
      lista: [
        { src: "catedral-quintana", dura: 2.43, encuadre: "30% 50%" },
        { src: "catedral-berenguela", dura: 1.59 },
      ],
    },
  ],
  titulares: [
    {
      desde: 0.4,
      hasta: 5.8,
      gancho: "Camino de Santiago",
      destacado: "organizado",
    },
    {
      desde: 7.0,
      hasta: 12.3,
      gancho: "Transporte de equipajes",
      destacado: "entre etapas",
    },
    {
      desde: 24.4,
      hasta: 29.2,
      gancho: "Hoteles seleccionados",
      destacado: "y máximo confort",
    },
    {
      desde: 37.0,
      hasta: 42.8,
      gancho: "e información detallada\nde tu ruta",
      destacado: "Atención 24/7",
      destacadoArriba: true,
    },
    {
      desde: 51.2,
      hasta: 53.9,
      gancho: "Tu Camino",
      destacado: "empieza aquí",
    },
  ],
};

export const TestimonioArgentinas: React.FC = () => (
  <TestimonioAnuncio config={config} />
);

export const DURACION_TESTIMONIO_ARGENTINAS = duracionTestimonio(config);
