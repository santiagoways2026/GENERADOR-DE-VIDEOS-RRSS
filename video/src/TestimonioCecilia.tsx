import {
  ConfigTestimonio,
  duracionTestimonio,
  TestimonioAnuncio,
} from "./componentes/TestimonioAnuncio";

/**
 * Testimonio de Cecilia y su marido, peregrinos argentinos, para Meta Ads.
 *
 * Sin la marca de agua de Clideo (recorte del 5 % que mantiene el 9:16) y
 * con un fundido de salida al final, para que con el cierre no pase del
 * minuto.
 *
 * El montaje original ya trae los hoteles buenos y termina llegando a la
 * plaza del Obradoiro, así que solo se sustituye el mojón y la muralla del
 * principio por maletas.
 */
const config: ConfigTestimonio = {
  src: "testimonios/cecilia.mp4",
  fin: 57.5,
  cierre: 2.4,
  recursos: [
    {
      nombre: "Maletas",
      desde: 3.17,
      hasta: 9.87,
      lista: [
        { src: "maletas-etiqueta", dura: 2.23 },
        { src: "equipaje-fila", dura: 0.7 },
        { src: "equipaje-portal", dura: 1.2, encuadre: "60% 50%" },
        { src: "maleta-concha", dura: 1.73 },
        { src: "equipaje-etiquetas", dura: 0.93 },
      ],
    },
  ],
  titulares: [
    // Ellos a cámara, al arrancar.
    {
      desde: 0.3,
      hasta: 3.1,
      gancho: "Camino de Santiago",
      destacado: "organizado",
    },
    // Maletas.
    {
      desde: 4.0,
      hasta: 9.7,
      gancho: "Transporte de equipajes",
      destacado: "entre etapas",
    },
    // Habitaciones del montaje original.
    {
      desde: 24.4,
      hasta: 29.0,
      gancho: "Hoteles seleccionados",
      destacado: "y máximo confort",
    },
    // Recepción y pasillo del hotel.
    {
      desde: 37.0,
      hasta: 42.6,
      gancho: "e información detallada\nde tu ruta",
      destacado: "Atención 24/7",
      destacadoArriba: true,
    },
    // Llegada a la plaza del Obradoiro.
    {
      desde: 54.3,
      hasta: 57.5,
      gancho: "Tu Camino",
      destacado: "empieza aquí",
    },
  ],
};

export const TestimonioCecilia: React.FC = () => (
  <TestimonioAnuncio config={config} />
);

export const DURACION_TESTIMONIO_CECILIA = duracionTestimonio(config);
