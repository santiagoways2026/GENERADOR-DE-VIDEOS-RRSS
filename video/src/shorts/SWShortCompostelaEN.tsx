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
import "../fuentes";

import { brand } from "../brand/theme";
import { PlacaMarca } from "../componentes/CartelaMarca";

/**
 * Santiago Ways · **short** en inglés, 1080x1920 a 30 fps. Primero de la
 * línea; la receta está en «Cómo se monta un short», en el `CLAUDE.md`.
 *
 * Esta **no es un testimonio** y no se monta como uno: el clip ya viene
 * montado, con sus subtítulos palabra a palabra y su chapa de marca en el
 * segundo 26. De la receta del testimonio se aplican el recorte de la marca
 * de agua, la placa de cierre y el paso de entrega.
 *
 * El clip abría con un rótulo pegado, una caja verde con texto blanco arriba
 * del cuadro, del segundo 0,20 al 2,77. En su sitio va un titular grande, y
 * para que se lea hay que **quitarle el fondo a la presentadora**: el bambú
 * de detrás es demasiado ruidoso para poner texto encima. Eso no se puede
 * hacer desde Remotion, así que el fondo ya viene cambiado en el archivo, que
 * lo prepara `herramientas/scripts/recortar-figura.py`.
 *
 * El registro es **Montserrat 900 en caja alta y centrado**. 900 es el máximo
 * de la familia, así que cuando se pide más gruesa lo que sube es el cuerpo.
 *
 * **El final del clip no se usa.** De los 52,60 s que dice el contenedor, los
 * últimos 4,65 son negro y silencio digital, y antes hay un fundido a negro
 * del 47,30 al 47,87. La guía no funde a negro: la imagen se corta en 47,35 y
 * la placa de marca entra en 46,90, por encima del fundido.
 */

const FPS = 30;
const f = (s: number) => Math.round(s * FPS);

const MONTAJE = 47.35;
/**
 * La pista acaba en "decide", que se apaga en 47,38. Detrás hay una sílaba
 * suelta en 47,80-47,94, a -21 dB, que el clip arrastra ya sobre su propio
 * negro; ahí no dice nada y se va.
 */
const PISTA = 47.45;
const DURACION = 50.0;

const BASE = "montajes/compostela-abre.mp4";
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
 * La tarjeta de apertura: velo suave y texto encima.
 *
 * Va sobre el degradado de marca, que es plano, así que basta con el velo,
 * el mismo recurso que llevan las cartelas de la línea. **Las dos líneas en
 * blanco**, que es lo que manda la guía sobre olivo. Medido: el blanco sobre
 * el olivo a pelo da 2,88:1, por debajo del 3:1 que es el mínimo para texto
 * grande; con el velo al 45 % sube a 4,99.
 */
const APERTURA: Linea[] = [
  { texto: "WHAT IS THE CAMINO DE", tam: 66, color: brand.white },
  { texto: "SANTIAGO?", tam: 150, color: brand.white },
];

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
      <AbsoluteFill
        style={{
          background: VELO,
        }}
      />
      <div style={{ textAlign: "center", position: "relative" }}>
        <Lineas lineas={APERTURA} largo={14} relevo={6} />
      </div>
    </AbsoluteFill>
  );
};

/**
 * Los rótulos de ruta: **degradado del verde de marca y las letras en
 * blanco**, que es la combinación de la guía y la que garantiza que el olivo
 * salga en pantalla.
 *
 * Antes iba un velo de bosque con el nombre en color, y ninguna de las tres
 * variantes que se probaron encima de la imagen real aguantaba. Queda
 * anotado lo que dio cada una, medido contra el 10 % más claro del fondo de
 * los cinco tramos:
 *
 * | | Verde de marca | Lima |
 * | --- | --- | --- |
 * | Velo fino de bosque, 0,45 | 1,15 – 1,44 | 2,57 – 3,23 |
 * | Velo cerrado, 0,94 | 3,05 | 6,4 |
 * | Placa opaca de bosque | 3,61 | 8,08 |
 *
 * Con el degradado de marca detrás, el fondo deja de depender del plano: el
 * blanco va sobre olivo siempre. El degradado baja por la escala de verdes de
 * la guía, `#7AA606` arriba y `#668814` a la altura del texto, así que el
 * contraste va de 3,1 a 3,4:1 en vez de los 2,88 que da el olivo a pelo, y
 * **Se apaga en el 23 % del alto, 441 px**, y eso lo fija la presentadora: el
 * pelo le empieza en el 470 y con la cola larga el borde del degradado le
 * cruzaba la frente, que se veía como una mancha sobre la cara. La sombra se
 * queda, que es lo que despega el texto donde el degradado ya está flojo.
 *
 * **Cuerpo 92 para los cinco**, y lo fija el más largo: "CAMINO PRIMITIVO"
 * mide 929 px sobre un lienzo útil de 960.
 */
const RUTA_TAM = 92;
const PIE_TAM = 54;

/** El velo de bosque de la guía, sólo para la tarjeta de apertura. */
const VELO =
  "linear-gradient(to bottom, rgba(24,72,52,0.55) 0%, rgba(24,72,52,0.45) 20%, rgba(24,72,52,0) 34%)";

/**
 * El degradado de marca detrás de los rótulos de ruta, dentro de la escala de
 * verdes de la guía y apagándose antes del tercio de cuadro.
 */
const DEGRADADO_RUTA =
  "linear-gradient(to bottom, rgba(122,166,6,0.97) 0%, rgba(112,151,13,0.95) 16%," +
  " rgba(102,136,20,0.55) 19.5%, rgba(79,107,15,0) 23%)";

const RotuloRuta: React.FC<{ lineas: Linea[]; total: number; rapido?: boolean }> = ({
  lineas,
  total,
  rapido = false,
}) => {
  const frame = useCurrentFrame();
  const largo = rapido ? 8 : 14;
  const salida = interpolate(frame, [total - largo, total], [1, 0], {
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
        <Lineas lineas={lineas} largo={largo} relevo={rapido ? 0 : 5} />
      </div>
    </AbsoluteFill>
  );
};

/**
 * Las rutas, cada una sobre el momento en que ella la nombra. Los límites
 * salen de medir los huecos sin voz, no de repartir a ojo.
 *
 * "MOST POPULAR" y "MOST POPULAR START" no son adornos: ella dice "some
 * routes are more popular" justo antes de la francesa, y "a lot of people
 * start in Sarria" justo antes de Sarria.
 */
const RUTAS: { desde: number; hasta: number; lineas: Linea[]; nombre: string }[] = [
  {
    desde: 20.1,
    hasta: 24.3,
    nombre: "French Way",
    lineas: [
      { texto: "FRENCH WAY", tam: RUTA_TAM, color: brand.white },
      { texto: "MOST POPULAR", tam: PIE_TAM, color: brand.white },
    ],
  },
  {
    desde: 24.45,
    hasta: 26.3,
    nombre: "Portuguese Way",
    lineas: [{ texto: "PORTUGUESE WAY", tam: RUTA_TAM, color: brand.white }],
  },
  {
    desde: 26.55,
    hasta: 27.75,
    nombre: "Northern Way",
    lineas: [{ texto: "NORTHERN WAY", tam: RUTA_TAM, color: brand.white }],
  },
  {
    desde: 27.85,
    hasta: 29.3,
    nombre: "Camino Primitivo",
    lineas: [{ texto: "CAMINO PRIMITIVO", tam: RUTA_TAM, color: brand.white }],
  },
  {
    desde: 34.3,
    hasta: 36.95,
    nombre: "Sarria",
    lineas: [
      { texto: "SARRIA", tam: RUTA_TAM, color: brand.white },
      { texto: "MOST POPULAR START", tam: PIE_TAM, color: brand.white },
    ],
  },
];

/**
 * Los planos de recurso.
 *
 * **La catedral, 11,45-12,95.** Ahí el clip metía una foto fija de la fachada
 * del Obradoiro, con fundido de entrada en 11,53 y de salida en 12,43-12,90.
 * Va en vídeo, que es lo que se pidió, y el hueco se toma completo, con los
 * dos fundidos dentro, para que no asome ni un fotograma de la foto.
 *
 * **La celebración, 45,40-46,75**, sobre "the Camino starts wherever you
 * decide", que es la frase que cierra y gana mucho más sobre gente celebrando
 * que sobre un plano de ella hablando.
 *
 * Ese plano **dura 1,13 s y no hay más**: se buscó en los dos másters de
 * origen y en `testimonios-EN` la toma va del 121,40 al 122,57, o sea 1,17 s
 * enteros. Así que para alargarlo sólo queda bajarle la velocidad, y ahí manda
 * la regla 15: tiene 4,55 de movimiento medio, que es mucho, y por debajo de
 * 0,80 se le empieza a ver el cámara lenta. A 0,80 se queda en 1,37 s.
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
  { desde: 11.45, hasta: 12.95, origen: 0.0, fuente: T + "catedral-nubes.mp4", encuadre: mirar(0.5), nombre: "Recurso · la catedral" },
  { desde: 45.4, hasta: 46.75, origen: 0.0, ritmo: 0.8, fuente: T + "brazos-celebracion.mp4", encuadre: mirar(0.41), nombre: "Recurso · celebracion" },
];

export const SWShortCompostelaEN: React.FC = () => {
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

      <Sequence durationInFrames={f(2.9)} name="1 · What is the Camino">
        <TarjetaApertura total={f(2.9)} />
      </Sequence>

      {RUTAS.map((r, i) => (
        <Sequence
          key={r.desde}
          from={f(r.desde)}
          durationInFrames={f(r.hasta) - f(r.desde)}
          name={`${i + 2} · ${r.nombre}`}
        >
          <RotuloRuta
            lineas={r.lineas}
            total={f(r.hasta) - f(r.desde)}
            rapido={r.lineas.length === 1}
          />
        </Sequence>
      ))}

      <Sequence from={entraPlaca} durationInFrames={total - entraPlaca} name="7 · Placa de marca">
        <PlacaMarca ancho={560} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const SWShortCompostelaENComposition: React.FC = () => (
  <Composition
    id="SWShortCompostelaEN"
    component={SWShortCompostelaEN}
    durationInFrames={f(DURACION)}
    fps={FPS}
    width={1080}
    height={1920}
  />
);
