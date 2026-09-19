import type { Cue } from "../componentes/Subtitulos";

/**
 * Subtitulos del short del Camino Frances.
 *
 * Los tiempos son medidos, no repartidos a ojo: cada cue empieza y acaba en
 * un tramo de voz real de `locucion-frances.mp3`, localizado con
 * `silencedetect`. Hay veintinueve tramos y veintinueve cues.
 *
 * El reparto del texto dentro de cada tramo sale del guion del brief, no de
 * una transcripcion del audio: la estructura encaja sin forzar nada (los dos
 * tramos de medio segundo son "Saint Jean?" y "Sarria?"), pero si la locutora
 * se separo del guion en alguna frase, es aqui donde se vera. Conviene
 * repasarlo con el video delante.
 *
 * Cuando haya un SRT de verdad, este archivo se regenera y no se toca a mano:
 *
 *   node herramientas/scripts/srt-a-cues.mjs captions.srt frances
 */
export const SUBTITULOS_FRANCES: Cue[] = [
  { desde: 0.0, hasta: 1.509, texto: "Seven routes lead to Santiago." },
  { desde: 1.931, hasta: 3.557, texto: "Only one is called the French Way." },
  { desde: 3.924, hasta: 5.539, texto: "780 kilometres" },
  { desde: 5.886, hasta: 8.196, texto: "from Saint Jean Pied de Port to Santiago." },
  { desde: 8.676, hasta: 9.779, texto: "33 stages." },
  { desde: 10.175, hasta: 10.932, texto: "Why is it THE one?" },
  { desde: 11.386, hasta: 12.482, texto: "It's the most walked." },
  { desde: 12.76, hasta: 13.929, texto: "The best signposted." },
  {
    desde: 14.436,
    hasta: 16.866,
    texto: "And there's a village, a bed and a café every few kilometres.",
  },
  { desde: 17.118, hasta: 18.281, texto: "And here's what most people don't know:" },
  { desde: 18.651, hasta: 20.054, texto: "you don't have to walk all of it." },
  { desde: 20.526, hasta: 21.894, texto: "The last stretch, Sarria to Santiago," },
  { desde: 22.661, hasta: 24.982, texto: "is the part most pilgrims actually do." },
  { desde: 25.319, hasta: 27.246, texto: "Same route. Same Compostela." },
  { desde: 27.691, hasta: 28.318, texto: "Your bag travels ahead," },
  { desde: 28.786, hasta: 29.788, texto: "your room is waiting," },
  { desde: 30.204, hasta: 31.307, texto: "and someone picks up the phone" },
  { desde: 31.564, hasta: 32.47, texto: "if you need it." },
  { desde: 32.739, hasta: 34.421, texto: "If you've walked the French Way," },
  { desde: 34.811, hasta: 36.098, texto: "tell us in the comments" },
  { desde: 36.372, hasta: 37.829, texto: "where you started." },
  { desde: 38.285, hasta: 38.761, texto: "Saint Jean?" },
  { desde: 39.069, hasta: 39.588, texto: "Sarria?" },
  { desde: 39.858, hasta: 40.763, texto: "Somewhere in between?" },
  { desde: 41.23, hasta: 43.371, texto: "And if you're planning it, ask us anything." },
  {
    desde: 43.712,
    hasta: 46.788,
    texto: "Every stage, where to start, what it costs and when to go:",
  },
  { desde: 47.109, hasta: 48.585, texto: "it's all in our full French Way guide." },
  { desde: 49.035, hasta: 50.258, texto: "The video right below this one." },
  { desde: 50.588, hasta: 51.264, texto: "Buen Camino." },
];
