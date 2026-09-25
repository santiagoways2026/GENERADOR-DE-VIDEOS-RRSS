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
 * «How long does it take to walk the Camino de Santiago?». Segunda de la
 * línea de divulgación y se monta igual que `SWDivulgaCompostelaEN`: no es un
 * testimonio, el clip ya viene montado con sus subtítulos palabra a palabra y
 * su chapa de marca, y de la receta del testimonio se aplican sólo el
 * arreglo de la apertura, la placa de cierre y el paso de entrega.
 *
 * **El original viene a 360x640**, que es una cuarta parte del área del clip
 * anterior y un noveno del lienzo de entrega. Se sube a 1080x1920 con lanczos
 * y un paso corto de `hqdn3d` antes, porque a 363 kb/s el bloqueo de la
 * compresión se amplía igual que la imagen; ampliar primero y limpiar después
 * ya no lo quita. Aun así es una ampliación de tres, y se nota: si aparece el
 * original a más resolución, se rehace la base y no hay que tocar nada más.
 *
 * El clip abría con un rótulo pegado, una caja verde con texto blanco arriba
 * a la izquierda, del fotograma 3 al 87, o sea de 0,10 a 2,90. En su sitio va
 * el titular, y para que se lea hay que **quitarle el fondo a la
 * presentadora**: el árbol de detrás tiene ramas finas contra cielo blanco y
 * es el peor sitio posible para poner texto. Eso no se hace desde Remotion:
 * el archivo ya viene con el fondo cambiado, de
 * `herramientas/scripts/recortar-figura.py`.
 *
 * **El final del clip no se usa.** De los 33,90 s que dice el contenedor, los
 * últimos 4,62 son negro y silencio, y antes hay un fundido a negro que
 * arranca en 28,60. La guía no funde a negro: la imagen se corta en 28,25 y
 * la placa de marca entra en 27,95, por encima del fundido.
 */

const FPS = 30;
const f = (s: number) => Math.round(s * FPS);

const MONTAJE = 28.25;
/**
 * La pista acaba en "It depends on you", que se apaga en 27,78. Detrás hay una
 * sílaba suelta del 29,02 al 29,26, ya sobre el fundido a negro del clip, que
 * ahí no dice nada y se va.
 */
const PISTA = 28.1;
const DURACION = 30.9;

const BASE = "montajes/duracion-abre.mp4";
const T = "brutos/testimonios/";
const FUENTE = "Montserrat, Manrope, sans-serif";

/** El movimiento de la guía: fundido más desplazamiento corto. Nunca rebote. */
const SUAVE = Easing.bezier(0.22, 0.61, 0.36, 1);

/** Ver `SWReelCaminoES` para por qué esto no es un porcentaje a pelo. */
const VENTANA = (9 / 16) / (16 / 9);
const mirar = (p: number) => `${(((p - VENTANA / 2) / (1 - VENTANA)) * 100).toFixed(1)}% 50%`;

type Linea = { texto: string; tam: number; color: string };

/** Fundido más subida corta, con relevo entre líneas. */
const entra = (frame: number, desde: number, largo: number) => ({
  opacity: interpolate(frame, [desde, desde + largo], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: SUAVE,
  }),
  transform: `translateY(${interpolate(frame, [desde, desde + largo], [26, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: SUAVE,
  })}px)`,
});

const Lineas: React.FC<{ lineas: Linea[]; largo: number; relevo: number }> = ({
  lineas,
  largo,
  relevo,
}) => {
  const frame = useCurrentFrame();
  return (
    <>
      {lineas.map((l, i) => (
        <div
          key={l.texto}
          style={{
            fontFamily: FUENTE,
            fontSize: l.tam,
            fontWeight: 900,
            lineHeight: 0.94,
            letterSpacing: "-0.03em",
            color: l.color,
            textShadow: "0 6px 26px rgba(24,72,52,0.55)",
            ...entra(frame, relevo * i, largo),
          }}
        >
          {l.texto}
        </div>
      ))}
    </>
  );
};

/**
 * La tarjeta de apertura: el degradado de marca detrás de ella y el titular
 * encima, las tres líneas en blanco, que es lo que manda la guía sobre olivo.
 *
 * **Tres líneas y no dos**, al revés que en la pieza anterior. Ahí el pelo de
 * la presentadora empezaba en el píxel 444 y no cabía una tercera; aquí el
 * plano es algo más abierto y empieza en el 572, medido sobre diez fotogramas
 * de la tarjeta ya compuesta. El bloque mide 314 px y acaba en el 444, con
 * 128 px limpios por debajo.
 *
 * Los cuerpos los fija el ancho, no el alto: «CAMINO?» mide 930 px a 190
 * sobre un lienzo útil de 960. La frase entera en dos líneas no entra, «HOW
 * LONG DOES IT TAKE TO» ya mide 996 px al cuerpo pequeño.
 */
const APERTURA: Linea[] = [
  { texto: "HOW LONG DOES IT", tam: 72, color: brand.white },
  { texto: "TAKE TO WALK THE", tam: 72, color: brand.white },
  { texto: "CAMINO?", tam: 190, color: brand.white },
];

/** El velo de bosque de la guía, sólo para la tarjeta de apertura. */
const VELO =
  "linear-gradient(to bottom, rgba(24,72,52,0.55) 0%, rgba(24,72,52,0.45) 20%, rgba(24,72,52,0) 34%)";

const TarjetaApertura: React.FC<{ total: number }> = ({ total }) => {
  const frame = useCurrentFrame();
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
      <AbsoluteFill style={{ background: VELO }} />
      <div style={{ textAlign: "center", position: "relative" }}>
        <Lineas lineas={APERTURA} largo={14} relevo={6} />
      </div>
    </AbsoluteFill>
  );
};

/**
 * Los rótulos: **degradado del verde de marca y las letras en blanco**, que es
 * la combinación de la guía y la que garantiza que el olivo salga en pantalla.
 * Es la misma de `SWDivulgaCompostelaEN`, donde está medido por qué no va el
 * texto en color sobre un velo fino: el verde de marca sobre el fondo real da
 * de 1,15 a 1,44 de contraste y la lima de 2,57 a 3,23, con el mínimo en 3:1.
 *
 * El degradado baja por la escala de verdes de la guía, `#7AA606` arriba y
 * `#668814` a la altura del texto, así que el blanco va de 3,1 a 3,4:1 en vez
 * de los 2,88 que da el olivo a pelo.
 *
 * **Se apaga en el 23 % del alto, 441 px**, por encima de su pelo, que aquí
 * empieza en el 572.
 */
const RUTA_TAM = 92;
const PIE_TAM = 54;

const DEGRADADO_RUTA =
  "linear-gradient(to bottom, rgba(122,166,6,0.97) 0%, rgba(112,151,13,0.95) 16%," +
  " rgba(102,136,20,0.55) 19.5%, rgba(79,107,15,0) 23%)";

const Rotulo: React.FC<{ lineas: Linea[]; total: number }> = ({ lineas, total }) => {
  const frame = useCurrentFrame();
  const salida = interpolate(frame, [total - 14, total], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: 150,
        opacity: salida,
      }}
    >
      <AbsoluteFill style={{ background: DEGRADADO_RUTA }} />
      <div style={{ textAlign: "center", position: "relative" }}>
        <Lineas lineas={lineas} largo={14} relevo={5} />
      </div>
    </AbsoluteFill>
  );
};

/**
 * Dos rótulos, cada uno sobre el tramo en que ella da esa duración. Los
 * límites salen de medir los huecos sin voz uno a uno:
 *
 * - 4,38-5,92 «if you do the full French Camino», 6,56-7,54 «it takes around
 *   four to five weeks».
 * - 12,42-12,94 «from Sarria», 14,66-15,28 «five to seven days».
 *
 * **El pie lleva la cifra y no un adorno.** La pieza va de cuánto se tarda,
 * así que el titular pone la ruta y el pie lo que dura; si el pie repitiera lo
 * que dice el titular, sobraría.
 */
const ROTULOS: { desde: number; hasta: number; lineas: Linea[]; nombre: string }[] = [
  {
    desde: 5.15,
    hasta: 7.95,
    nombre: "Full French Way",
    lineas: [
      { texto: "FULL FRENCH WAY", tam: RUTA_TAM, color: brand.white },
      { texto: "4 TO 5 WEEKS", tam: PIE_TAM, color: brand.white },
    ],
  },
  {
    desde: 12.4,
    hasta: 15.85,
    nombre: "Sarria",
    lineas: [
      { texto: "SARRIA", tam: RUTA_TAM, color: brand.white },
      { texto: "5 TO 7 DAYS", tam: PIE_TAM, color: brand.white },
    ],
  },
];

/**
 * Los planos de recurso, uno por rótulo y los dos sobre la cifra, no sobre el
 * nombre: así el rótulo cae sobre el paisaje y no sobre su cara, y la base
 * vuelve a ella en cuanto sigue hablando.
 *
 * **El camino abierto, 6,55-7,90**, sobre «around four to five weeks»: lo que
 * dice cinco semanas es la distancia, y eso es un plano general con los
 * peregrinos pequeños y el valle detrás. Sale de `brutos/`, que va a 1080p:
 * recortar un 16:9 a vertical deja el 33,75 % del ancho, así que en un plano
 * general la resolución del origen se nota más que en ningún otro sitio.
 * Dura 1,17 s y hacen falta 1,35, así que va a `ritmo` 0,85, que en un plano
 * donde la gente ocupa poco no se lee como cámara lenta.
 *
 * **El mojón, 14,55-15,85**, sobre «five to seven days», que es el tramo de
 * Sarria: el mojón de piedra con la vieira y la flecha es literalmente la
 * imagen de los últimos 100 km. Dura 3,2 s y se usan 1,3, **pero no desde el
 * principio**: hasta el segundo 1,6 la peregrina que cruza tapa el mojón
 * entero y el plano es un primer plano de espaldas. Desde ahí sale de cuadro
 * y queda el mojón limpio, así que `origen` va en 1,6.
 *
 * **Los dos encuadres se corrigieron a ojo**, que es la regla: `encuadrar.py`
 * proponía `mirar(0.43)` en el mojón, por la cara de la peregrina que cruza, y
 * eso dejaba el plano en un primer plano de espaldas y piernas con el mojón
 * fuera de cuadro. A `mirar(0.25)` entra el mojón entero. El primer plano que
 * se probó, `peregrino-embalse`, se cayó por lo mismo: recortado a vertical es
 * un peregrino colocándose la mochila, y el degradado del rótulo le cortaba la
 * cabeza.
 */
type Insercion = {
  desde: number;
  hasta: number;
  origen: number;
  fuente: string;
  /** Por debajo de 1 alarga el plano sin repetirlo. */
  ritmo?: number;
  encuadre: string;
  nombre: string;
};

const INSERCIONES: Insercion[] = [
  { desde: 6.55, hasta: 7.9, origen: 0.0, ritmo: 0.85, fuente: "brutos/camino-abierto.mp4", encuadre: mirar(0.42), nombre: "Recurso · el camino abierto" },
  { desde: 14.55, hasta: 15.85, origen: 1.6, fuente: T + "mojon-peregrinas.mp4", encuadre: mirar(0.21), nombre: "Recurso · el mojon" },
];

export const SWDivulgaDuracionEN: React.FC = () => {
  const total = f(DURACION);
  const entraPlaca = f(27.95);

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

      {INSERCIONES.map((s) => (
        <Sequence
          key={s.desde}
          from={f(s.desde)}
          durationInFrames={f(s.hasta) - f(s.desde)}
          name={s.nombre}
        >
          <OffthreadVideo
            src={staticFile(s.fuente)}
            trimBefore={f(s.origen)}
            playbackRate={s.ritmo ?? 1}
            muted
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: s.encuadre,
            }}
          />
        </Sequence>
      ))}

      <Sequence durationInFrames={f(2.9)} name="1 · How long">
        <TarjetaApertura total={f(2.9)} />
      </Sequence>

      {ROTULOS.map((r, i) => (
        <Sequence
          key={r.desde}
          from={f(r.desde)}
          durationInFrames={f(r.hasta) - f(r.desde)}
          name={`${i + 2} · ${r.nombre}`}
        >
          <Rotulo lineas={r.lineas} total={f(r.hasta) - f(r.desde)} />
        </Sequence>
      ))}

      <Sequence from={entraPlaca} durationInFrames={total - entraPlaca} name="4 · Placa de marca">
        <PlacaMarca ancho={560} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const SWDivulgaDuracionENComposition: React.FC = () => (
  <Composition
    id="SWDivulgaDuracionEN"
    component={SWDivulgaDuracionEN}
    durationInFrames={f(DURACION)}
    fps={FPS}
    width={1080}
    height={1920}
  />
);
