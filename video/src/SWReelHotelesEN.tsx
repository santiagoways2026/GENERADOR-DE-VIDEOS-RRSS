import {
  AbsoluteFill,
  Composition,
  OffthreadVideo,
  Sequence,
  staticFile,
} from "remotion";
import "./fuentes";

import { brand } from "./brand/theme";
import { Cartela, PlacaMarca } from "./componentes/CartelaMarca";

/**
 * Santiago Ways · el testimonio del viajero americano, vertical para stories
 * y TikTok. 1080x1920 a 30 fps.
 *
 * Sale del montaje de testimonios en ingles. El tramo es continuo, del
 * segundo 15,30 al 70,80 del master, y no lleva ni un corte de audio: la
 * pista trae voz y musica en el mismo canal, asi que cualquier juntura por
 * dentro se oiria en la musica. Entra y sale con medio segundo de fundido.
 *
 * Es el mismo hombre de principio a fin, el del grupo de cuatro, y va de por
 * que vino al Camino a por que duerme en hotel y no en un albergue. Lo de los
 * hoteles son sus ultimos 26 segundos, que es donde se concentran los planos
 * de alojamiento y las cartelas.
 *
 * **El encuadre es el problema de esta pieza.** El grupo son cuatro hombres
 * de lado a lado del cuadro, y un recorte a 9:16 se queda con el 33,75 % del
 * ancho: centrado se lleva a dos por delante. Por eso sus planos van
 * reencuadrados al 71 %, que deja al que habla, el de la camiseta turquesa, y
 * a uno de sus companeros. El resto del metraje es plano general y se recorta
 * centrado.
 */

const FPS = 30;
const f = (s: number) => Math.round(s * FPS);

/** Segundo del master por el que entra la pieza. */
const RECORTE = 15.3;
/** Lo que dura el tramo de testimonio. */
const TESTIMONIO = 55.5;
const DURACION = 59.2;

const MASTER = "montajes/testimonios-EN.mp4";
const B = "brutos/";
const T = "brutos/testimonios/";
const V = "brutos/piezas-viejas/";

/** Margen del lienzo vertical, proporcional al de 64 px sobre 1280. */
const MARGEN = 72;
/** En stories y TikTok los ultimos 300 px los tapa la interfaz. */
const MARGEN_ABAJO = 330;
/** Cuerpo de las cartelas. En vertical el cuadro es mas alto y aguanta mas. */
const TAM = 58;
const TAM_PIE = 30;

/**
 * De "donde esta esto en la imagen" a `objectPosition`.
 *
 * No son lo mismo y es facil equivocarse: un 16:9 recortado a 9:16 deja ver
 * el 33,75 % del ancho, asi que `objectPosition: 71%` no centra el recorte en
 * el 71 % de la imagen, sino en el 64 %. La primera version de esta pieza
 * dejaba al que habla cortado por el borde derecho por eso.
 */
const VENTANA = (9 / 16) / (16 / 9);
const mirar = (p: number) => `${(((p - VENTANA / 2) / (1 - VENTANA)) * 100).toFixed(1)}% 50%`;

/* ------------------------------------------------------------------ *
 * Planos de recurso. Solo imagen: el audio es siempre el del master.
 * ------------------------------------------------------------------ */

type Insercion = {
  desde: number;
  hasta: number;
  /** Segundo del archivo del que sale la imagen. */
  origen: number;
  /** De donde sale. Por defecto, el propio master. */
  fuente?: string;
  /** Recorte horizontal. "50% 50%" centra. */
  encuadre?: string;
  nombre: string;
};

/**
 * Los seis planos en los que sale el grupo, reencuadrados para que no se
 * pierda al que habla. Salen del propio master, al mismo segundo: lo unico
 * que cambia es por donde se recorta.
 */
const GRUPO: Array<[number, number]> = [
  [0.0, 4.63],
  [15.6, 18.5],
  [22.83, 25.6],
  [30.33, 31.63],
  [39.6, 41.8],
  [48.47, 49.33],
];

const REENCUADRES: Insercion[] = GRUPO.map(([a, b], i) => ({
  desde: a,
  hasta: b,
  origen: RECORTE + a,
  encuadre: mirar(0.79),
  nombre: `Grupo ${i + 1} · reencuadre`,
}));

/** Alojamiento, que es lo que la pieza pone en valor. */
const HOTELES: Insercion[] = [
  // "Having somebody Sherpa your belongings from town to town"
  { desde: 31.7, hasta: 33.4, origen: 0.0, fuente: V + "pazo-blanco.mp4", nombre: "Fachada · pazo blanco" },
  // "there's nothing better than laying down in a nice clean bed"
  { desde: 43.9, hasta: 45.95, origen: 0.05, fuente: B + "habitacion.mp4", encuadre: mirar(0.66), nombre: "Cama · habitacion con ventanal" },
  // "and a shower"
  { desde: 45.95, hasta: 47.1, origen: 0.03, fuente: T + "bano-ducha.mp4", nombre: "Ducha" },
  // "after a long day of hiking"
  { desde: 47.1, hasta: 48.4, origen: 0.05, fuente: V + "habitacion-granate.mp4", nombre: "Cama · granate" },
  // "I won't be sleeping in a tent"
  { desde: 49.4, hasta: 51.1, origen: 0.05, fuente: V + "habitacion-ventanal.mp4", nombre: "Cama · ventanal" },
  // "or at some hostel"
  { desde: 51.1, hasta: 52.5, origen: 0.05, fuente: V + "bano-lavabo.mp4", nombre: "Bano · lavabo" },
  // "so I'm glad we're doing it this way"
  { desde: 52.5, hasta: 54.4, origen: 0.1, fuente: V + "galeria-hotel.mp4", nombre: "Galeria del hotel" },
];

const INSERCIONES = [...REENCUADRES, ...HOTELES];

/* ------------------------------------------------------------------ */

export const SWReelHotelesEN: React.FC = () => {
  const total = f(DURACION);
  const finTestimonio = f(TESTIMONIO);
  const entraPlaca = f(55.4);

  return (
    // Verde de marca por debajo: si en el cambio a la placa quedase un
    // fotograma al aire, es olivo y no negro.
    <AbsoluteFill style={{ backgroundColor: brand.green }}>
      <Sequence durationInFrames={finTestimonio} name="Testimonio">
        <OffthreadVideo
          src={staticFile(MASTER)}
          trimBefore={f(RECORTE)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Sequence>

      {INSERCIONES.map((s) => (
        <Sequence
          key={`${s.nombre}-${s.desde}`}
          from={f(s.desde)}
          durationInFrames={f(s.hasta) - f(s.desde)}
          name={s.nombre}
        >
          <OffthreadVideo
            src={staticFile(s.fuente ?? MASTER)}
            trimBefore={f(s.origen)}
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

      {/* 1 · "I've had the trail on my bucket list for about 10 years" */}
      <Sequence from={f(0.8)} durationInFrames={f(5.6) - f(0.8)} name="1 · Some journeys">
        <Cartela
          lineas={[[{ texto: "Some journeys" }], [{ texto: "stay with you", destacado: true }]]}
          pie={["Camino de Santiago"]}
          total={f(5.6) - f(0.8)}
          tam={TAM}
          margen={MARGEN}
          margenAbajo={MARGEN_ABAJO}
          tamPie={TAM_PIE}
        />
      </Sequence>

      {/* 2 · "Having somebody Sherpa your belongings from town to town" */}
      <Sequence from={f(30.0)} durationInFrames={f(35.4) - f(30.0)} name="2 · Tu equipaje">
        <Cartela
          lineas={[[{ texto: "Your luggage" }], [{ texto: "travels for you", destacado: true }]]}
          pie={["Hotel to hotel, every stage"]}
          total={f(35.4) - f(30.0)}
          tam={TAM}
          margen={MARGEN}
          margenAbajo={MARGEN_ABAJO}
          tamPie={TAM_PIE}
        />
      </Sequence>

      {/* 3 · "nothing better than laying down in a nice clean bed and a shower" */}
      <Sequence from={f(43.4)} durationInFrames={f(48.4) - f(43.4)} name="3 · Cama limpia">
        <Cartela
          lineas={[[{ texto: "A clean bed" }], [{ texto: "and a hot shower", destacado: true }]]}
          pie={["Waiting for you every night"]}
          total={f(48.4) - f(43.4)}
          tam={TAM}
          margen={MARGEN}
          margenAbajo={MARGEN_ABAJO}
          tamPie={TAM_PIE}
        />
      </Sequence>

      {/* 4 · "I won't be sleeping in a tent or at some hostel" */}
      <Sequence from={f(49.5)} durationInFrames={f(54.6) - f(49.5)} name="4 · Habitacion privada">
        <Cartela
          lineas={[[{ texto: "Always private" }], [{ texto: "room & bathroom", destacado: true }]]}
          pie={["Hand-picked hotels"]}
          total={f(54.6) - f(49.5)}
          tam={TAM}
          margen={MARGEN}
          margenAbajo={MARGEN_ABAJO}
          tamPie={TAM_PIE}
        />
      </Sequence>

      <Sequence from={entraPlaca} durationInFrames={total - entraPlaca} name="5 · Placa de marca">
        <PlacaMarca ancho={620} hueco={300} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const SWReelHotelesENComposition: React.FC = () => (
  <Composition
    id="SWReelHotelesEN"
    component={SWReelHotelesEN}
    durationInFrames={f(DURACION)}
    fps={FPS}
    width={1080}
    height={1920}
  />
);
