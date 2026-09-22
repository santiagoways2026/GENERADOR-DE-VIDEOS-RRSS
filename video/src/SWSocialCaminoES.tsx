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
 * Sobre esa base, la pieza hace cuatro cosas:
 *
 * 1. Le da ritmo. El testimonio original tenia un tramo de 9,6 s que repetia
 *    la misma idea dos veces y terminaba en una frase a medias. Se quita
 *    entero, cortando por los silencios entre frases, y el montaje pasa de
 *    57,3 s a 47,2 s. No hay musica de fondo, solo ambiente, asi que el
 *    corte por silencio no deja juntura audible; aun asi lleva un fundido de
 *    60 ms a cada lado para que no chasquee.
 * 2. Reparte tres planos de recurso que ese corte dejaba fuera. Van mudos,
 *    solo imagen: el audio que suena siempre es el continuo del montaje. Uno
 *    acorta el plano mas largo de la apertura, otro tapa justo la juntura
 *    del corte y el tercero rompe el plano mas largo de entrevista.
 * 3. Pone cinco cartelas que siguen lo que el peregrino va contando, con el
 *    lenguaje de la linea: Montserrat 900 en blanco y el verde de marca
 *    recuadrando solo lo que sostiene la frase.
 * 4. Cierra en dos tiempos, como la pieza en ingles: la frase final sobre el
 *    ultimo plano y despues la placa con el logo centrado y la web.
 *
 * Los tiempos salen de transcribir el audio y de medir los cambios de plano,
 * no de mirar la linea de tiempo a ojo.
 */

const FPS = 30;
const f = (s: number) => Math.round(s * FPS);

/** Duracion final, en segundos: 47,15 de montaje mas la placa de marca. */
const DURACION = 50.2;

/**
 * Cuerpo de las cartelas. Mas pequeno que los 72 px de la pieza en ingles:
 * ahi el entrevistado esta a media altura y aqui en primer plano, asi que
 * un titular de tres lineas a 72 le llega a la barbilla. Con este cuerpo
 * todas caben en dos lineas y el texto se queda por debajo de la cara.
 * El titular del cierre si va a 72: detras tiene la catedral, no una cara.
 */
const TAM = 58;

/** El montaje ya recortado, con el audio continuo. */
const BASE = "montajes/social-ES.mp4";
/**
 * El limpio entero, del que salen los planos de recurso. Son tomas que el
 * recorte de audio dejaba fuera, asi que no se repite ninguna: cada una se
 * ve una sola vez en la pieza, solo que en otro sitio.
 */
const RECURSOS = "montajes/social-ES-limpio.mp4";
/** La fachada del Obradoiro, de la biblioteca de planos recurso. */
const OBRADOIRO = "brutos/testimonios/fachada-obradoiro.mp4";

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
  // La apertura se quedaba 6,2 s en el mismo contraluz. Se corta a los 4,25
  // y entra el camino abierto, que ademas enlaza con el plano siguiente.
  { desde: 5.8, hasta: 7.75, origen: 28.62, nombre: "Apertura · camino abierto" },
  // Tapa la juntura del corte de audio, que cae en 25,10, y de paso se come
  // los cuatro fotogramas sueltos del plano que quedaba cortado ahi.
  { desde: 24.55, hasta: 26.35, origen: 32.1, nombre: "Juntura · dos caminantes" },
  // Rompe los 4,2 s de entrevista seguida, justo sobre "con la mochila y
  // toda la ropa para varios dias".
  { desde: 34.6, hasta: 36.4, origen: 26.7, nombre: "Mochila · caminante con equipaje" },
  // El cierre no se dice sobre la cara del peregrino, se dice sobre la
  // catedral. La fachada del Obradoiro viene de la biblioteca de recursos,
  // que no la ha usado nadie en esta pieza: los dos planos de catedral que
  // ya lleva son mas abiertos y desde otro sitio, asi que esto es un
  // acercamiento, no una toma repetida.
  {
    desde: 42.35,
    hasta: 47.15,
    origen: 0.15,
    fuente: OBRADOIRO,
    nombre: "Cierre · fachada del Obradoiro",
  },
];

/* ------------------------------------------------------------------ */

export const SWSocialCaminoES: React.FC = () => {
  const total = f(DURACION);
  /** El montaje dura 47,15 s. La placa entra antes de que se acabe. */
  const finMontaje = f(47.15);
  const entraPlaca = f(46.55);
  const entraCierre = f(43.6);

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
      <Sequence from={f(0.4)} durationInFrames={f(5.3) - f(0.4)} name="1 · Algunos viajes">
        <Cartela
          lineas={[[{ texto: "Algunos viajes" }], [{ texto: "dejan huella", destacado: true }]]}
          pie={["Camino de Santiago", "España"]}
          total={f(5.3) - f(0.4)}
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

      {/* 3 · "como con los dos alojamientos que llevamos" */}
      <Sequence from={f(17.4)} durationInFrames={f(21.6) - f(17.4)} name="3 · Hoteles">
        <Cartela
          lineas={[[{ texto: "Hoteles" }], [{ texto: "seleccionados", destacado: true }]]}
          pie={["Habitación y baño privados"]}
          total={f(21.6) - f(17.4)}
          tam={TAM}
        />
      </Sequence>

      {/*
        4 · "hemos cogido al mismo tiempo el servicio de recogida de
        equipaje". Cae sobre el plano de las maletas en el portal, que entra
        en 28,55.
      */}
      <Sequence from={f(26.8)} durationInFrames={f(31.0) - f(26.8)} name="4 · Tu mochila">
        <Cartela
          lineas={[[{ texto: "Tu mochila" }], [{ texto: "viaja sola", destacado: true }]]}
          total={f(31.0) - f(26.8)}
          tam={TAM}
        />
      </Sequence>

      <Sequence from={entraCierre} durationInFrames={total - entraCierre} name="6 · Tu Camino empieza aquí">
        <CierreMarca
          lineas={[[{ texto: "Tu Camino" }], [{ texto: "empieza aquí", destacado: true }]]}
          salidaTexto={f(46.45) - entraCierre}
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
