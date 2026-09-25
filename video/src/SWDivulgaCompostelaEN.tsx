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
 * El registro del texto es el que se pidió y es distinto al de las cartelas
 * de testimonio: **Manrope 800 en caja alta y centrado**, no Montserrat 900 en
 * minúscula y a la izquierda. Manrope es de la cascada oficial y 800 es su
 * peso máximo, así que "extra bold" aquí es literalmente el tope.
 */

const FPS = 30;
const f = (s: number) => Math.round(s * FPS);

const DURACION = 52.6;
/** Hasta aquí el fondo es el degradado. Lo fija `recortar-figura.py`. */
const TITULAR_SALE = 2.9;

const BASE = "montajes/compostela-abre.mp4";
const FUENTE = "Manrope, Montserrat, sans-serif";

/**
 * El titular, línea a línea.
 *
 * **Dos líneas y no tres**, y el reparto lo manda su pelo, no el gusto. El
 * modelo que se pasó lleva tres líneas, una de entrada grande, una de enlace
 * pequeña y el sujeto enorme abajo. Aquí no caben: medida sobre siete
 * fotogramas de la tarjeta, la cabeza empieza en el píxel 444 de 1920, y un
 * bloque de tres líneas con esos cuerpos acaba en 442. El texto le caía sobre
 * el pelo.
 *
 * Con dos, el bloque mide 231 px, arranca en 130 y acaba en 361: ochenta
 * píxeles limpios antes de su pelo. Y el sujeto se queda igual de grande, que
 * es lo que da el golpe: 162 px, 914 de ancho sobre un útil de 960, el 95 %.
 * La línea de entrada va pequeña a propósito, de pie de entrada, y el verde
 * lima se lo lleva el nombre.
 */
const LINEAS: { texto: string; tam: number; color: string }[] = [
  { texto: "WHAT IS THE CAMINO DE", tam: 74, color: brand.white },
  { texto: "SANTIAGO?", tam: 162, color: brand.lime },
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
      <div style={{ textAlign: "center" }}>
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
                fontWeight: 800,
                lineHeight: 0.98,
                letterSpacing: "-0.01em",
                color: l.color,
                opacity: o,
                transform: `translateY(${sube}px)`,
                // El degradado de detrás es verde medio en la parte de abajo
                // del titular, asi que el blanco necesita algo de sombra.
                textShadow: "0 6px 28px rgba(8,22,15,0.45)",
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
