import {
  AbsoluteFill,
  Audio,
  Composition,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import "./fuentes";

import { brand } from "./brand/theme";
import { Cartela, CierreMarca, PlacaMarca } from "./componentes/CartelaMarca";

/**
 * Santiago Ways · testimonio del grupo, espanol, reel 1080x1920 a 30 fps.
 *
 * El clip viene limpio, a diferencia de los otros dos: **no trae marca de
 * agua** (se comprobo el minimo temporal de cada pixel en los cuatro bordes,
 * que es lo que delata una marca pegada, y no hay ninguno que se quede claro
 * siempre) y **ya abre con la catedral**, asi que no hay que sustituir la
 * apertura. Lo unico que hace esta escena es poner encima las cartelas, dos
 * planos de alojamiento y el cierre de marca.
 *
 * Aqui iba una cuarta cartela, "Asistencia 24/7", sobre el paisaje del 31,0
 * al 35,2. Se ha quitado por dos motivos. Uno de sitio: con ella, los tres
 * ultimos textos iban a 2,1 s y 1,4 s de distancia, y una cartela tarda 1,37 s
 * en acabar de entrar, asi que apenas quedaba pieza sin texto encima. Y otro
 * de fondo: es la unica de las cuatro que no se apoya en nada de lo que dicen.
 * El sitio donde si encajaria es "la atencion muy buena", en 23,5, pero ahi
 * esta la cartela de hoteles. Sin ella quedan 7,7 s seguidos de paisaje sin
 * texto, que es el respiro que la pieza necesitaba.
 *
 * Lo que si hay que tocar es **el final**. El clip dura 42,32 s, pero los dos
 * ultimos segundos son un golpe de viento en el microfono: -6,7 dB de rms con
 * el 82 % de la energia por debajo de 250 Hz, o sea **mas fuerte que las
 * voces**, que van sobre -15. La voz acaba en 39,7 y el ruido empieza a subir
 * en 39,8. Asi que el montaje se corta en 40,10, con la pista bajada a cero
 * entre 39,70 y 40,10, y la placa de marca entra detras. De paso el ultimo
 * plano pasa a ser el grupo con los brazos en alto, que remata mejor que la
 * senda con el mojon que venia despues.
 */

const FPS = 30;
const f = (s: number) => Math.round(s * FPS);

/**
 * El clip dura 42,32 s y se corta en 40,10: los dos ultimos segundos son
 * viento en el microfono, no ambiente.
 */
const MONTAJE = 40.1;
const DURACION = 42.8;
/** La pista baja a cero aqui. La voz acaba en 39,70. */
const FUNDIDO = 39.7;

const MARGEN = 72;
const MARGEN_ABAJO = 480;
/**
 * 70 y no 76, por lo mismo que en `SWReelAsistenciaES`: "organizado en
 * hoteles" con su recuadro mide 919 px a 76 sobre un lienzo util de 936, y
 * las lineas no se parten solas. A 70 baja a 846.
 *
 * El margen inferior se queda en los 480 de siempre: es un plano general de
 * todo el grupo y la barbilla mas baja de la pieza cae en el pixel 883 de los
 * 1920, muy por encima del bloque de texto, que arranca en 1290.
 */
const TAM = 70;
const TAM_PIE = 34;

const BASE = "montajes/testimonio-ES3.mp4";
const B = "brutos/";
const T = "brutos/testimonios/";

/** Ver `SWReelCaminoES` para por que esto no es un porcentaje a pelo. */
const VENTANA = (9 / 16) / (16 / 9);
const mirar = (p: number) => `${(((p - VENTANA / 2) / (1 - VENTANA)) * 100).toFixed(1)}% 50%`;

type Insercion = {
  desde: number;
  hasta: number;
  origen: number;
  fuente: string;
  ritmo?: number;
  encuadre?: string;
  nombre: string;
};

/*
 * El clip ya trae su propio plano de habitacion, del 25,53 al 27,90, y cae
 * justo donde dicen "nos trataron con mucho cariño". Se queda tal cual y los
 * dos planos que se añaden lo rodean, uno por delante y otro por detras, de
 * limite de plano a limite de plano para no dejar restos:
 *
 *   24,27 - 25,53   terraza     (entraba un plano del grupo de 1,26 s)
 *   25,53 - 27,90   la habitacion del propio clip
 *   27,90 - 29,00   habitacion con vistas, la unica de 1080p
 *
 * El plano de las ruinas que habia en 27,90 sigue viendose del 29,00 al
 * 30,43, y detras viene el paisaje, que es lo que ilustra "y el paisaje
 * bellisimo".
 */
const INSERCIONES: Insercion[] = [
  /*
   * De las tres terrazas de la biblioteca, esta es la unica que aguanta el
   * 9:16. `mesa-piedra` tiene el interes en horizontal, la mesa larga, y de
   * pie se queda en dos tercios de pared oscura. `casona-moderna` es una
   * fachada. Aqui entran las mesas, la barandilla de cristal y el valle; el
   * cielo se lleva un tercio del cuadro, que es el precio del formato.
   * Encuadre a 0,25, que es donde estan las mesas: a 0,45 solo queda la
   * vista y a 0,16 se pierde el valle.
   */
  { desde: 24.27, hasta: 25.53, origen: 0.2, fuente: T + "terraza-vistas.mp4", encuadre: mirar(0.25), nombre: "Hoteles · terraza con vistas" },
  { desde: 27.9, hasta: 29.0, origen: 0.05, fuente: B + "habitacion.mp4", encuadre: mirar(0.55), nombre: "Hoteles · habitacion con vistas" },
];

/* ------------------------------------------------------------------ */

export const SWReelGrupoES: React.FC = () => {
  const total = f(DURACION);
  const finMontaje = f(MONTAJE);
  const entraPlaca = f(40.0);
  const entraCierre = f(36.6);

  return (
    <AbsoluteFill style={{ backgroundColor: brand.green }}>
      <Sequence durationInFrames={finMontaje} name="Montaje">
        <OffthreadVideo
          src={staticFile(BASE)}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Sequence>

      {/* La pista va aparte para poder bajarla antes del golpe de viento. */}
      <Sequence durationInFrames={finMontaje} name="Pista">
        <PistaConFundido />
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
              objectPosition: s.encuadre ?? "50% 50%",
            }}
          />
        </Sequence>
      ))}

      {/* 1 · sobre el coro de "excelente, espectacular, muy recomendable" */}
      <Sequence from={f(0.6)} durationInFrames={f(5.4) - f(0.6)} name="1 · Camino organizado">
        <Cartela
          lineas={[
            [{ texto: "Camino de Santiago" }],
            [{ texto: "organizado en hoteles", destacado: true }],
          ]}
          total={f(5.4) - f(0.6)}
          tam={TAM}
          margen={MARGEN}
          margenAbajo={MARGEN_ABAJO}
          tamPie={TAM_PIE}
        />
      </Sequence>

      {/* 2 · sobre el interior de la catedral y el marisco, 17,00-22,10 */}
      <Sequence from={f(17.2)} durationInFrames={f(21.8) - f(17.2)} name="2 · España auténtica">
        <Cartela
          lineas={[
            [{ texto: "Conoce la España" }],
            [{ texto: "más auténtica", destacado: true }],
          ]}
          total={f(21.8) - f(17.2)}
          tam={TAM}
          margen={MARGEN}
          margenAbajo={MARGEN_ABAJO}
          tamPie={TAM_PIE}
        />
      </Sequence>

      {/* 3 · sobre los tres planos de alojamiento, 24,27-29,00 */}
      <Sequence from={f(24.4)} durationInFrames={f(28.9) - f(24.4)} name="3 · Hoteles seleccionados">
        <Cartela
          lineas={[[{ texto: "Hoteles" }], [{ texto: "seleccionados", destacado: true }]]}
          pie={["Habitación y baño privados"]}
          total={f(28.9) - f(24.4)}
          tam={TAM}
          margen={MARGEN}
          margenAbajo={MARGEN_ABAJO}
          tamPie={TAM_PIE}
        />
      </Sequence>

      {/* El cierre, sobre el grupo con los brazos en alto. */}
      <Sequence from={entraCierre} durationInFrames={total - entraCierre} name="5 · Tu Camino empieza aquí">
        <CierreMarca
          lineas={[[{ texto: "Tu Camino" }], [{ texto: "empieza aquí", destacado: true }]]}
          salidaTexto={f(39.9) - entraCierre}
          tam={TAM}
          margen={MARGEN}
          margenAbajo={MARGEN_ABAJO}
          abajo
        />
      </Sequence>

      <Sequence from={entraPlaca} durationInFrames={total - entraPlaca} name="6 · Placa de marca">
        <PlacaMarca />
      </Sequence>
    </AbsoluteFill>
  );
};

/**
 * La pista del clip con la bajada del final.
 *
 * Va en su propio componente porque `volume` necesita el fotograma y la
 * escena de arriba no lo usa para nada mas.
 */
const PistaConFundido: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Audio
      src={staticFile(BASE)}
      volume={interpolate(frame, [f(FUNDIDO), f(MONTAJE)], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })}
    />
  );
};

export const SWReelGrupoESComposition: React.FC = () => (
  <Composition
    id="SWReelGrupoES"
    component={SWReelGrupoES}
    durationInFrames={f(DURACION)}
    fps={FPS}
    width={1080}
    height={1920}
  />
);
