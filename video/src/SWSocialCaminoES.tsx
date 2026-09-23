import {
  AbsoluteFill,
  Composition,
  OffthreadVideo,
  Sequence,
  staticFile,
} from "remotion";
import "./fuentes";

import { brand } from "./brand/theme";
import {
  Cartela,
  CierreMarca,
  PlacaMarca,
} from "./componentes/CartelaMarca";

/**
 * Santiago Ways · testimonio en espanol para redes, 1280x720 a 30 fps.
 *
 * Parte de la pieza social antigua, ya limpia: sin la cartela de agencia del
 * principio, sin el fundido del final y sin las dos marcas de agua pegadas
 * en la esquina, la de la herramienta de recorte y el logo viejo. Salieron
 * recortando por abajo, que es el borde que menos imagen se lleva: se pierde
 * el 14,4 % de alto y la imagen vuelve al formato original con un zoom de
 * 1,17x. Se hizo asi y no rellenando el hueco porque el relleno deja una
 * banda blanda sobre la piedra y el contraluz, que es justo lo que hay ahi.
 *
 * La base, `montajes/social-ES-v3.mp4`, la arma `herramientas/scripts`
 * aparte, porque son cambios que mueven la duracion y no se pueden hacer con
 * sustituciones de imagen:
 *
 * - Se quita un tramo de 9,6 s que repetia una idea ya dicha y terminaba a
 *   medias, cortando por el silencio entre frases.
 * - Se quita otro de 5,15 s en el que habla un segundo peregrino al que no
 *   se ve nunca. El montaje original le daba plano justo despues, y ese
 *   plano cayo con el recorte anterior, asi que quedaba una voz sin cara.
 * - Entran 3 s de apertura por delante y 7 s de alojamiento en el hueco que
 *   deja el segundo peregrino, ambos con una cama de ambiente sacada de los
 *   silencios del propio montaje.
 *
 * Encima de eso, esta escena pone:
 *
 * 1. Siete planos de recurso, mudos: el audio que suena es siempre el
 *    continuo de la base. Cuatro rehacen la apertura, uno rompe el plano de
 *    entrevista mas largo y dos rematan la llegada a Santiago.
 * 2. Cuatro cartelas que siguen lo que cuenta el peregrino.
 * 3. El cierre en dos tiempos: la frase final sobre la fachada del
 *    Obradoiro y despues la placa con el logo centrado y la web.
 *
 * Los tiempos salen de transcribir el audio y de medir los cambios de plano,
 * no de mirar la linea de tiempo a ojo.
 */

const FPS = 30;
const f = (s: number) => Math.round(s * FPS);

/** Duracion final, en segundos: 47,15 de montaje mas la placa de marca. */
const DURACION = 55.1;

/**
 * Cuerpo de las cartelas. Mas pequeno que los 72 px de la pieza en ingles:
 * ahi el entrevistado esta a media altura y aqui en primer plano, asi que
 * un titular de tres lineas a 72 le llega a la barbilla. Con este cuerpo
 * todas caben en dos lineas y el texto se queda por debajo de la cara.
 * El titular del cierre si va a 72: detras tiene la catedral, no una cara.
 */
const TAM = 58;

/** El montaje ya recortado, con el audio continuo. */
const BASE = "montajes/social-ES-v3.mp4";
/**
 * El limpio entero, del que salen los planos de recurso. Son tomas que el
 * recorte de audio dejaba fuera, asi que no se repite ninguna: cada una se
 * ve una sola vez en la pieza, solo que en otro sitio.
 */
const RECURSOS = "montajes/social-ES-limpio.mp4";
/** Planos de la biblioteca. Los de `brutos/` son de 1920x1080. */
const B = "brutos/";
const T = "brutos/testimonios/";

/* ------------------------------------------------------------------ *
 * Planos de recurso. Solo imagen: el audio de debajo sigue corriendo.
 * ------------------------------------------------------------------ */

type Insercion = {
  /** Entrada en el montaje final, en segundos. */
  desde: number;
  /** Salida en el montaje final, en segundos. */
  hasta: number;
  /** Segundo del archivo del que sale la imagen. */
  origen: number;
  /** De donde sale. Por defecto, el limpio entero. */
  fuente?: string;
  nombre: string;
};

const INSERCIONES: Insercion[] = [
  // La pieza arrancaba con un bosque a contraluz velado y un muro de
  // hormigon al fondo. Se rehace la apertura con planos de 1080p y el
  // bosque se queda, pero mas tarde y mas corto: entra en 5,60.
  { desde: 3.0, hasta: 4.1, origen: 0.0, fuente: B + "camino-abierto.mp4", nombre: "Apertura · camino abierto" },
  { desde: 4.1, hasta: 5.6, origen: 0.0, fuente: B + "pareja-muros.mp4", nombre: "Apertura · pareja entre muros" },
  { desde: 8.7, hasta: 9.8, origen: 0.0, fuente: B + "grupo-mimosas.mp4", nombre: "Apertura · grupo entre mimosas" },
  { desde: 9.8, hasta: 10.75, origen: 0.0, fuente: B + "rio-piedras.mp4", nombre: "Apertura · paso de piedras" },
  // Rompe 4,2 s de entrevista seguida, justo sobre "con la mochila y toda
  // la ropa para varios dias".
  { desde: 39.45, hasta: 41.25, origen: 26.7, nombre: "Mochila · caminante con equipaje" },
  // Llegada a Santiago. El montaje encadenaba tres planos de la catedral
  // casi iguales, todos torres contra nubes, y el corte de en medio se veia.
  // Este pone gente a pie de plaza entre el general y el detalle.
  { desde: 45.0, hasta: 47.05, origen: 0.0, fuente: T + "obradoiro.mp4", nombre: "Llegada · plaza del Obradoiro" },
  // El cierre no se dice sobre la cara del peregrino, se dice sobre la
  // catedral.
  { desde: 47.05, hasta: 52.0, origen: 0.15, fuente: T + "fachada-obradoiro.mp4", nombre: "Cierre · fachada del Obradoiro" },
];


/* ------------------------------------------------------------------ */

export const SWSocialCaminoES: React.FC = () => {
  const total = f(DURACION);
  /** El montaje dura 52,02 s. La placa entra antes de que se acabe. */
  const finMontaje = f(52.02);
  const entraPlaca = f(51.4);
  const entraCierre = f(48.45);

  return (
    // Verde de marca por debajo: si en el cambio a la placa quedase un
    // fotograma al aire, es olivo y no negro. El manual no admite negro puro.
    <AbsoluteFill style={{ backgroundColor: brand.green }}>
      <Sequence durationInFrames={finMontaje} name="Montaje">
        <OffthreadVideo
          src={staticFile(BASE)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Sequence>

      {INSERCIONES.map((s) => (
        <Sequence
          key={s.desde}
          from={f(s.desde)}
          durationInFrames={f(s.hasta) - f(s.desde)}
          name={s.nombre}
        >
          <OffthreadVideo
            src={staticFile(s.fuente ?? RECURSOS)}
            trimBefore={f(s.origen)}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Sequence>
      ))}

      {/* 1 · "venir al Camino de Santiago era un desafio personal" */}
      <Sequence from={f(0.6)} durationInFrames={f(5.4) - f(0.6)} name="1 · Algunos viajes">
        <Cartela
          lineas={[[{ texto: "Algunos viajes" }], [{ texto: "dejan huella", destacado: true }]]}
          pie={["Camino de Santiago"]}
          total={f(5.4) - f(0.6)}
          tam={TAM}
        />
      </Sequence>

      {/* 2 · "estamos muy contentos tanto con la organizacion" */}
      <Sequence from={f(14.2)} durationInFrames={f(18.8) - f(14.2)} name="2 · Tú caminas">
        <Cartela
          lineas={[
            [{ texto: "Tú caminas.", destacado: true }],
            [{ texto: "Nosotros nos ocupamos del resto" }],
          ]}
          total={f(18.8) - f(14.2)}
          tam={TAM}
        />
      </Sequence>

      {/* 3 · "como con los dos alojamientos que llevamos" */}
      <Sequence from={f(23.8)} durationInFrames={f(28.8) - f(23.8)} name="3 · Hoteles">
        <Cartela
          lineas={[[{ texto: "Hoteles" }], [{ texto: "seleccionados", destacado: true }]]}
          pie={["Habitación y baño privados"]}
          total={f(28.8) - f(23.8)}
          tam={TAM}
        />
      </Sequence>

      {/*
        4 · "hemos cogido al mismo tiempo el servicio de recogida de
        equipaje". Cae sobre el plano de las maletas en el portal, que entra
        en 28,55.
      */}
      <Sequence from={f(31.65)} durationInFrames={f(35.85) - f(31.65)} name="4 · Tu mochila">
        <Cartela
          lineas={[[{ texto: "Tu mochila" }], [{ texto: "viaja sola", destacado: true }]]}
          total={f(35.85) - f(31.65)}
          tam={TAM}
        />
      </Sequence>

      <Sequence from={entraCierre} durationInFrames={total - entraCierre} name="6 · Tu Camino empieza aquí">
        <CierreMarca
          lineas={[[{ texto: "Tu Camino" }], [{ texto: "empieza aquí", destacado: true }]]}
          salidaTexto={f(51.3) - entraCierre}
          abajo
        />
      </Sequence>

      <Sequence from={entraPlaca} durationInFrames={total - entraPlaca} name="7 · Placa de marca">
        <PlacaMarca />
      </Sequence>
    </AbsoluteFill>
  );
};

export const SWSocialCaminoESComposition: React.FC = () => (
  <Composition
    id="SWSocialCaminoES"
    component={SWSocialCaminoES}
    durationInFrames={f(DURACION)}
    fps={FPS}
    width={1280}
    height={720}
  />
);
