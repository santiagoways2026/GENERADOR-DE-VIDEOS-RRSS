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

/** Duracion final, en segundos: 42,06 de montaje mas la placa de marca. */
const DURACION = 44.9;

/**
 * Cuerpo de las cartelas. Mas pequeno que los 72 px de la pieza en ingles:
 * ahi el entrevistado esta a media altura y aqui en primer plano, asi que
 * un titular de tres lineas a 72 le llega a la barbilla. Con este cuerpo
 * todas caben en dos lineas y el texto se queda por debajo de la cara.
 * El titular del cierre si va a 72: detras tiene la catedral, no una cara.
 */
const TAM = 58;

/**
 * El montaje ya recortado, con el audio continuo y **sin un solo hueco sin
 * voz**. Las versiones anteriores metian tres segundos de ambiente por
 * delante y siete en el bloque de alojamiento, sintetizados, y sonaban a
 * eco: sintetizar con fase aleatoria dispersa la fase, que es lo que hace un
 * reverberador. Pegar silencios de verdad tampoco llega, en los 57,3 s del
 * limpio hay 2,71 s de ambiente aprovechable y harian falta 10,3. Asi que
 * esos diez segundos se han ido y la pieza dura lo que dura el testimonio.
 * Los planos que vivian ahi siguen, pero como inserciones sobre la voz.
 */
const BASE = "montajes/social-ES-v4.mp4";
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
  // hormigon al fondo. Se tapa con tres planos de 1080p sobre la primera
  // frase, que es la del desafio personal.
  { desde: 0.0, hasta: 1.5, origen: 0.03, fuente: B + "campo-flores.mp4", nombre: "Apertura · campo en flor" },
  { desde: 1.5, hasta: 2.6, origen: 0.0, fuente: B + "camino-abierto.mp4", nombre: "Apertura · camino abierto" },
  { desde: 2.6, hasta: 4.1, origen: 0.0, fuente: B + "pareja-muros.mp4", nombre: "Apertura · pareja entre muros" },
  { desde: 5.7, hasta: 6.8, origen: 0.0, fuente: B + "grupo-mimosas.mp4", nombre: "Apertura · grupo entre mimosas" },
  { desde: 6.8, hasta: 7.75, origen: 0.0, fuente: B + "rio-piedras.mp4", nombre: "Apertura · paso de piedras" },
  // Alojamiento, sobre "los dos alojamientos que llevamos". Antes eran siete
  // segundos con la voz parada; ahora van encima de la frase que los nombra.
  { desde: 16.5, hasta: 17.5, origen: 0.03, fuente: B + "casa-rural.mp4", nombre: "Alojamiento · casa rural" },
  { desde: 17.5, hasta: 19.5, origen: 0.1, fuente: B + "habitacion.mp4", nombre: "Alojamiento · habitacion" },
  // Rompe 4,2 s de entrevista seguida, justo sobre "con la mochila y toda
  // la ropa para varios dias".
  { desde: 29.5, hasta: 31.3, origen: 26.7, nombre: "Mochila · caminante con equipaje" },
  // Llegada a Santiago. El montaje encadenaba tres planos de la catedral casi
  // iguales, todos torres contra nubes, y los cortes se veian como saltos.
  // Ahora va de lejos a cerca y con gente en medio: la calle, la plaza y la
  // fachada.
  { desde: 34.45, hasta: 35.75, origen: 0.0, fuente: T + "rua-santiago.mp4", nombre: "Llegada · calle de Santiago" },
  { desde: 35.75, hasta: 37.05, origen: 0.0, fuente: T + "obradoiro.mp4", nombre: "Llegada · plaza del Obradoiro" },
  // El cierre no se dice sobre la cara del peregrino, se dice sobre la
  // catedral.
  { desde: 37.05, hasta: 42.06, origen: 0.0, fuente: T + "fachada-obradoiro.mp4", nombre: "Cierre · fachada del Obradoiro" },
];


/* ------------------------------------------------------------------ */

export const SWSocialCaminoES: React.FC = () => {
  const total = f(DURACION);
  /** El montaje dura 42,06 s. La placa entra antes de que se acabe. */
  const finMontaje = f(42.06);
  const entraPlaca = f(41.2);
  const entraCierre = f(38.4);

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
      <Sequence from={f(0.6)} durationInFrames={f(5.2) - f(0.6)} name="1 · Algunos viajes">
        <Cartela
          lineas={[[{ texto: "Algunos viajes" }], [{ texto: "dejan huella", destacado: true }]]}
          pie={["Camino de Santiago"]}
          total={f(5.2) - f(0.6)}
          tam={TAM}
        />
      </Sequence>

      {/* 2 · "estamos muy contentos tanto con la organizacion" */}
      <Sequence from={f(11.2)} durationInFrames={f(15.8) - f(11.2)} name="2 · Tú caminas">
        <Cartela
          lineas={[
            [{ texto: "Tú caminas.", destacado: true }],
            [{ texto: "Nosotros nos ocupamos del resto" }],
          ]}
          total={f(15.8) - f(11.2)}
          tam={TAM}
        />
      </Sequence>

      {/* 3 · sobre "como con los dos alojamientos que llevamos", 16,68-19,52 */}
      <Sequence from={f(16.6)} durationInFrames={f(20.8) - f(16.6)} name="3 · Hoteles">
        <Cartela
          lineas={[[{ texto: "Hoteles" }], [{ texto: "seleccionados", destacado: true }]]}
          pie={["Habitación y baño privados"]}
          total={f(20.8) - f(16.6)}
          tam={TAM}
        />
      </Sequence>

      {/*
        4 · sobre "hemos cogido al mismo tiempo el servicio de recogida de
        equipaje", 20,07-24,89. Con el corte del segundo peregrino fuera, la
        frase ya se oye entera: antes se quedaba en "recogida de".
      */}
      <Sequence from={f(21.4)} durationInFrames={f(25.8) - f(21.4)} name="4 · Tu mochila">
        <Cartela
          lineas={[[{ texto: "Tu mochila" }], [{ texto: "viaja sola", destacado: true }]]}
          total={f(25.8) - f(21.4)}
          tam={TAM}
        />
      </Sequence>

      <Sequence from={entraCierre} durationInFrames={total - entraCierre} name="6 · Tu Camino empieza aquí">
        <CierreMarca
          lineas={[[{ texto: "Tu Camino" }], [{ texto: "empieza aquí", destacado: true }]]}
          salidaTexto={f(41.1) - entraCierre}
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
