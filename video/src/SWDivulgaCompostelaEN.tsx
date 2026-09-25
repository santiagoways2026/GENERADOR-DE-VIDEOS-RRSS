import {
  AbsoluteFill,
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

/**
 * Santiago Ways · pieza de divulgación en inglés, reel 1080x1920 a 30 fps.
 *
 * Esta **no es un testimonio** y no se monta como uno: no lleva las cartelas
 * del kit ni el cierre de marca, porque el clip ya viene montado, con sus
 * subtítulos palabra a palabra y su chapa de marca en el minuto 26. Lo único
 * que se cambia es la apertura.
 *
 * El clip abría con un rótulo pegado, una caja verde con texto blanco arriba
 * del cuadro, del segundo 0,20 al 2,77. En su sitio va un titular grande, y
 * para que se lea hay que **quitarle el fondo a la presentadora**: el bambú
 * de detrás es demasiado ruidoso para poner texto encima.
 *
 * Eso no se puede hacer desde Remotion, así que el fondo ya viene cambiado en
 * el archivo, que lo prepara `herramientas/scripts/recortar-figura.py`. Aquí
 * sólo va el texto.
 *
 * El registro del texto es **Montserrat 900 en caja alta y centrado**. Lo de
 * caja alta y centrado es lo que separa este formato de las cartelas de
 * testimonio, que van en minúscula y a la izquierda; el peso es el mismo,
 * porque 900 es el máximo de la familia y es lo que la guía llama el negro.
 * Se pidió "más gruesa" y ahí no queda margen: lo que se ha subido es el
 * cuerpo, que es donde sí lo hay, hasta que la línea larga roza el lienzo.
 */

const FPS = 30;
const f = (s: number) => Math.round(s * FPS);

const DURACION = 52.6;
/** Hasta aquí el fondo es el degradado. Lo fija `recortar-figura.py`. */
const TITULAR_SALE = 2.9;

const BASE = "montajes/compostela-abre.mp4";
const FUENTE = "Montserrat, Manrope, sans-serif";

/**
 * El titular, línea a línea.
 *
 * **Dos líneas y no tres**, y el reparto lo manda su pelo, no el gusto. El
 * modelo que se pasó lleva tres líneas, una de entrada grande, una de enlace
 * pequeña y el sujeto enorme abajo. Aquí no caben: medida sobre siete
 * fotogramas de la tarjeta, la cabeza empieza en el píxel 444 de 1920, y un
 * bloque de tres líneas acaba por debajo de eso. El texto le caía en el pelo.
 *
 * **Los cuerpos los fija el ancho, no el alto.** Montserrat 900 en caja alta
 * es bastante más ancha que Manrope: "SANTIAGO?" mide 918 px a 150 sobre un
 * lienzo útil de 960, así que a 155 ya se sale. La línea de entrada va a 66,
 * que son 883. Los dos están al 92 y al 96 % del ancho, que es el tope real
 * de esta pieza: de ahí no se puede subir sin partir las líneas.
 *
 * Con esos cuerpos el bloque mide 203 px, arranca en 130 y acaba en 333:
 * ciento diez píxeles limpios antes de su pelo.
 */
const LINEAS: { texto: string; tam: number; color: string }[] = [
  { texto: "WHAT IS THE CAMINO DE", tam: 66, color: brand.white },
  { texto: "SANTIAGO?", tam: 150, color: brand.lime },
];

/** El movimiento de la guía: fundido más desplazamiento corto. Nunca rebote. */
const SUAVE = Easing.bezier(0.22, 0.61, 0.36, 1);
/** Fotogramas de relevo entre línea y línea. */
const RELEVO = 6;
const ENTRADA = 14;

const Titular: React.FC = () => {
  const frame = useCurrentFrame();
  const total = f(TITULAR_SALE);
  // Se recoge antes de que el fondo vuelva al bambú, no a la vez: si salen
  // juntos parece que se ha cortado el plano.
  const salida = interpolate(frame, [total - 12, total], [1, 0], {
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
      {/*
        Velo de bosque detrás del titular, el mismo recurso que llevan las
        cartelas de la línea y por el mismo motivo. Aquí hace falta más que
        allí: el verde de marca es bastante más claro que el bosque que tenía
        antes esta tarjeta, y encima el degradado de la placa de cierre pone
        su extremo claro justo arriba, que es donde va el texto. Medido, la
        lima sobre olivo puro da 2,23:1 de contraste, por debajo del 3:1 que
        es el mínimo para texto grande, y el blanco 2,88. Con el velo al 45 %
        suben a 3,87 y 4,99, y el fondo sigue leyéndose como verde de marca.
      */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(24,72,52,0.55) 0%, rgba(24,72,52,0.45) 20%, rgba(24,72,52,0) 34%)",
        }}
      />
      <div style={{ textAlign: "center", position: "relative" }}>
        {LINEAS.map((l, i) => {
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
                // El degradado es verde de marca, mas claro que el bosque
                // que habia antes, asi que el blanco necesita mas sombra.
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

export const SWDivulgaCompostelaEN: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: brand.green }}>
    <OffthreadVideo
      src={staticFile(BASE)}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
    <Sequence durationInFrames={f(TITULAR_SALE)} name="Titular">
      <Titular />
    </Sequence>
  </AbsoluteFill>
);

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
