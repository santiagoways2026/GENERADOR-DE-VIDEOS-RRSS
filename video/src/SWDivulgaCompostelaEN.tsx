import {
  AbsoluteFill,
  Audio,
  Composition,
  Easing,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import "./fuentes";

import { brand } from "./brand/theme";
import { PlacaMarca } from "./componentes/CartelaMarca";

/**
 * Santiago Ways · pieza de divulgación en inglés, reel 1080x1920 a 30 fps.
 *
 * Esta **no es un testimonio** y no se monta como uno: el clip ya viene
 * montado, con sus subtítulos palabra a palabra y su chapa de marca en el
 * segundo 26. De la receta del testimonio sólo se aplican el recorte de la
 * marca de agua y el paso de entrega.
 *
 * El clip abría con un rótulo pegado, una caja verde con texto blanco arriba
 * del cuadro, del segundo 0,20 al 2,77. En su sitio va un titular grande, y
 * para que se lea hay que **quitarle el fondo a la presentadora**: el bambú
 * de detrás es demasiado ruidoso para poner texto encima. Eso no se puede
 * hacer desde Remotion, así que el fondo ya viene cambiado en el archivo, que
 * lo prepara `herramientas/scripts/recortar-figura.py`. Aquí va el texto.
 *
 * El registro es **Montserrat 900 en caja alta y centrado**. Lo de caja alta y
 * centrado es lo que separa este formato de las cartelas de testimonio, que
 * van en minúscula y a la izquierda; el peso es el mismo, porque 900 es el
 * máximo de la familia y es lo que la guía llama el negro. Se pidió "más
 * gruesa" y ahí no queda margen: lo que se sube es el cuerpo, hasta que la
 * línea larga roza el lienzo.
 *
 * **El final del clip no se usa.** De los 52,60 s que dice el contenedor, los
 * últimos 4,65 son negro y silencio digital, y antes hay un fundido a negro
 * de medio segundo, del 47,30 al 47,87. La guía no funde a negro: las piezas
 * cierran con la placa de marca. Así que la imagen se corta en 47,35 y la
 * placa entra por encima del fundido.
 *
 * **Pero la pista sigue hasta 47,95**, y por eso va aparte. La última palabra
 * es "decide", y su final cae en 47,80-47,90, o sea ya sobre el negro del
 * clip. Cortando la pista con la imagen se oiría "deci-". Así se acaba de
 * decir por debajo de la placa, que es como cierran las otras piezas.
 */

const FPS = 30;
const f = (s: number) => Math.round(s * FPS);

/**
 * El montaje acaba donde empieza el fundido a negro del clip, no donde acaba
 * el archivo. Detrás va la placa de marca.
 */
const MONTAJE = 47.35;
/** La pista dura un poco más que la imagen: ver la cabecera. */
const PISTA = 47.95;
const DURACION = 50.0;

const BASE = "montajes/compostela-abre.mp4";
const FUENTE = "Montserrat, Manrope, sans-serif";

/** El movimiento de la guía: fundido más desplazamiento corto. Nunca rebote. */
const SUAVE = Easing.bezier(0.22, 0.61, 0.36, 1);
const RELEVO = 6;
const ENTRADA = 14;
/** Fotogramas que tarda el rótulo en recogerse, al final de su tramo. */
const SALIDA = 12;

type Linea = { texto: string; tam: number; color: string };

/**
 * Rótulo de esta línea: caja alta, centrado y arriba del cuadro.
 *
 * **Arriba y no abajo**, que es donde van las cartelas de testimonio, por dos
 * cosas: el clip ya trae sus propios subtítulos quemados a media altura, y la
 * presentadora ocupa de la mitad para abajo. Medida sobre siete fotogramas,
 * su cabeza empieza en el píxel 444 de 1920, así que el rótulo vive por
 * encima de eso.
 *
 * Lleva **velo de bosque detrás**, el mismo recurso que las cartelas de la
 * línea y por el mismo motivo. Aquí hace falta más que allí: el fondo es o el
 * verde de marca, que es claro, o directamente el bambú. Medido sobre el
 * olivo, la lima da 2,23:1 de contraste y el blanco 2,88, por debajo del 3:1
 * que es el mínimo para texto grande; con el velo al 45 % suben a 3,87 y
 * 4,99, y el fondo se sigue leyendo como verde de marca.
 */
const Rotulo: React.FC<{ lineas: Linea[]; total: number }> = ({ lineas, total }) => {
  const frame = useCurrentFrame();
  const salida = interpolate(frame, [total - SALIDA, total], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: 130,
        opacity: salida,
      }}
    >
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(24,72,52,0.55) 0%, rgba(24,72,52,0.45) 20%, rgba(24,72,52,0) 34%)",
        }}
      />
      <div style={{ textAlign: "center", position: "relative" }}>
        {lineas.map((l, i) => {
          const desde = RELEVO * i;
          const o = interpolate(frame, [desde, desde + ENTRADA], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: SUAVE,
          });
          const sube = interpolate(frame, [desde, desde + ENTRADA], [26, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: SUAVE,
          });
          return (
            <div
              key={l.texto}
              style={{
                fontFamily: FUENTE,
                fontSize: l.tam,
                fontWeight: 900,
                lineHeight: 0.94,
                letterSpacing: "-0.03em",
                color: l.color,
                opacity: o,
                transform: `translateY(${sube}px)`,
                textShadow: "0 6px 26px rgba(24,72,52,0.55)",
              }}
            >
              {l.texto}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/**
 * El titular de apertura.
 *
 * **Dos líneas y no tres.** El modelo que se pasó lleva tres, una de entrada
 * grande, una de enlace pequeña y el sujeto enorme abajo. Con esos cuerpos el
 * bloque acaba por debajo del píxel 444, que es donde empieza su pelo. Con
 * dos, el bloque mide 203 px, arranca en 130 y acaba en 333.
 *
 * **Los cuerpos los fija el ancho, no el alto.** Montserrat 900 en caja alta
 * es bastante más ancha que Manrope: "SANTIAGO?" mide 918 px a 150 sobre un
 * lienzo útil de 960, así que a 155 ya se sale.
 */
const APERTURA: Linea[] = [
  { texto: "WHAT IS THE CAMINO DE", tam: 66, color: brand.white },
  { texto: "SANTIAGO?", tam: 150, color: brand.lime },
];

/**
 * El rótulo de la ruta, sobre "the French Way starts in France, crossing the
 * Pyrenees", que va del 19,6 al 23,9. Entra en 20,1, justo cuando la nombra,
 * y se queda hasta 24,0; del 22,2 en adelante cae sobre el plano del puente,
 * que es donde mejor se lee.
 *
 * "MOST POPULAR" no es un adorno: un segundo antes ella dice "some routes are
 * more popular", así que el pie recoge lo que acaba de decir.
 */
const RUTA: Linea[] = [
  { texto: "FRENCH WAY", tam: 125, color: brand.lime },
  { texto: "MOST POPULAR", tam: 68, color: brand.white },
];

export const SWDivulgaCompostelaEN: React.FC = () => {
  const total = f(DURACION);
  const entraPlaca = f(46.9);

  return (
    <AbsoluteFill style={{ backgroundColor: brand.green }}>
      <Sequence durationInFrames={f(MONTAJE)} name="Montaje">
        <OffthreadVideo
          src={staticFile(BASE)}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Sequence>

      <Sequence durationInFrames={f(PISTA)} name="Pista">
        <Audio src={staticFile(BASE)} />
      </Sequence>

      <Sequence durationInFrames={f(2.9)} name="1 · What is the Camino">
        <Rotulo lineas={APERTURA} total={f(2.9)} />
      </Sequence>

      <Sequence from={f(20.1)} durationInFrames={f(24.0) - f(20.1)} name="2 · French Way">
        <Rotulo lineas={RUTA} total={f(24.0) - f(20.1)} />
      </Sequence>

      <Sequence from={entraPlaca} durationInFrames={total - entraPlaca} name="3 · Placa de marca">
        <PlacaMarca />
      </Sequence>
    </AbsoluteFill>
  );
};

export const SWDivulgaCompostelaENComposition: React.FC = () => (
  <Composition
    id="SWDivulgaCompostelaEN"
    component={SWDivulgaCompostelaEN}
    durationInFrames={f(DURACION)}
    fps={FPS}
    width={1080}
    height={1920}
  />
);
