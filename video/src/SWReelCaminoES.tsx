import {
  AbsoluteFill,
  Audio,
  Composition,
  OffthreadVideo,
  Sequence,
  staticFile,
} from "remotion";
import "./fuentes";

import { brand } from "./brand/theme";
import { Cartela, CierreMarca, PlacaMarca } from "./componentes/CartelaMarca";

/**
 * Santiago Ways · testimonio en espanol para reels, 1080x1920 a 30 fps.
 *
 * Es la pieza de `SWSocialCaminoES` puesta de pie. **El montaje no cambia**:
 * mismos cortes, mismos planos, mismo audio y mismas cartelas en los mismos
 * segundos. Lo que cambia es lo que cabe en el cuadro y el tamano del texto.
 *
 * Pasar de 16:9 a 9:16 con `cover` deja ver **el 33,75 % del ancho**. No es un
 * recorte menor: de cada plano se va dos tercios de la imagen, y en estos
 * brutos lo que vive en los lados suele ser justo la gente. Asi que aqui cada
 * plano lleva su `encuadre`, medido con
 * `herramientas/scripts/encuadrar.py`, que busca primero la cara, luego lo
 * que se mueve y por ultimo donde esta el detalle. Ninguno se ha dejado en
 * el centro por defecto sin mirarlo.
 *
 * Dos consecuencias de eso que se ven en el codigo:
 *
 * 1. **El montaje base va troceado por sus propios cortes**, uno por plano,
 *    porque cada plano necesita su encuadre. Son 20 tramos.
 * 2. **El audio va aparte y entero**, en un solo `Audio`. Si la pista fuese
 *    con cada trozo de imagen, cada juntura seria un corte de audio, y son
 *    veinte. Asi suena exactamente igual que la pieza horizontal.
 *
 * Las cartelas van mas pequenas que en los otros dos reels: 60 px en vez de
 * 76. Con 76 la linea larga del titular se sale del lienzo, y encogerla hasta
 * que entrase en una sola linea la dejaba en 53, que ya no se lee de lejos.
 */

const FPS = 30;
const f = (s: number) => Math.round(s * FPS);

/** 42,06 de montaje mas la placa de marca. Lo mismo que la horizontal. */
const DURACION = 44.9;

/** El margen del lienzo. En vertical no valen los 64 de la horizontal. */
const MARGEN = 72;
/**
 * Los ultimos 300 px de un reel los tapa la interfaz: la barra de enviar
 * mensaje abajo y los botones de la derecha. Los otros dos reels usan 480,
 * que sobra de margen; aqui son 360, y el motivo esta medido.
 *
 * Al recortar a 9:16 un plano medio de 1280x720 la cara se hace enorme: el
 * recorte amplia 2,67 veces y el entrevistado ocupa del pixel 628 al 1400 de
 * los 1920. Debajo de la barbilla quedan 520 px para el texto y el margen.
 * Con 480 de margen y el titular de dos lineas, el recuadro verde caia justo
 * sobre el bigote, y un rotulo no tapa una cara. Con 360 el bloque arranca en
 * 1444, que es la camiseta.
 */
const MARGEN_ABAJO = 360;
/**
 * 52, no los 76 de los reels en ingles y en aleman: son cartelas mas
 * pequenas, que es lo que se pidio, y ademas el titular largo de esta pieza
 * no cabe de otra forma. "Nosotros nos ocupamos del resto" mide 1320 px a 76
 * y 1042 a 60, sobre un lienzo util de 936; a 52 mide 903 y entra en una
 * linea. Partirlo en tres lineas era la otra salida, pero un bloque de tres
 * lineas sube 70 px mas y vuelve a la barbilla.
 */
const TAM = 52;
const TAM_PIE = 26;
/**
 * El titular del cierre si puede ir mas grande: detras tiene la fachada del
 * Obradoiro, no una cara, asi que no hay nada que tapar. Las dos lineas miden
 * 422 y 567 px a 76 sobre un util de 936, asi que entran holgadas.
 */
const TAM_CIERRE = 76;

const BASE = "montajes/social-ES-v4.mp4";
const RECURSOS = "montajes/social-ES-limpio.mp4";
const B = "brutos/";
const T = "brutos/testimonios/";

/**
 * De "donde esta esto en la imagen" a `objectPosition`.
 *
 * No son lo mismo: como solo se ve el 33,75 % del ancho, un `71 %` no centra
 * el recorte en el 71 % de la imagen sino en el 64 %. Con `cover`, un 16:9 en
 * un lienzo 9:16 solo recorta a lo ancho, asi que la vertical no pinta nada.
 */
const VENTANA = (9 / 16) / (16 / 9);
const mirar = (p: number) => `${(((p - VENTANA / 2) / (1 - VENTANA)) * 100).toFixed(1)}% 50%`;

/* ------------------------------------------------------------------ *
 * El montaje base, plano a plano.
 * ------------------------------------------------------------------ */

type Tramo = {
  desde: number;
  hasta: number;
  /** Donde mirar, en tanto por uno del ancho. */
  p: number;
  nombre: string;
};

/**
 * Los limites salen de medir los cortes del propio montaje, no de repartir a
 * ojo: `planos-visibles.py` los imprime. Los tramos que van tapados por una
 * inserción llevan el encuadre que propone la herramienta y no se han
 * revisado uno a uno, porque no se ven; van marcados.
 */
const MONTAJE: Tramo[] = [
  { desde: 0.0, hasta: 3.3, p: 0.16, nombre: "tapado · campo" },
  // Visible del 4,10 al 5,27. Es el contraluz velado que la pieza evita al
  // abrir, y de pie funciona mejor que tumbado: los troncos son verticales.
  // A 0,84 solo queda tronco; a 0,30 entran la hierba y los peregrinos.
  { desde: 3.3, hasta: 5.27, p: 0.30, nombre: "Contraluz entre troncos" },
  { desde: 5.27, hasta: 7.6, p: 0.75, nombre: "tapado · rio" },
  // El peregrino del fondo esta a la derecha. Por bordes salia 0,20, que es
  // donde estan los arbustos: tienen mas detalle que una persona a cien
  // metros y se lo llevaban de cuadro.
  { desde: 7.6, hasta: 9.5, p: 0.81, nombre: "Peregrino entre la vegetacion" },
  { desde: 9.5, hasta: 10.77, p: 0.45, nombre: "Entrevista 1" },
  { desde: 10.77, hasta: 12.83, p: 0.47, nombre: "Camino arbolado" },
  { desde: 12.83, hasta: 15.6, p: 0.45, nombre: "Entrevista 2" },
  // Visible solo del 15,60 al 16,50: el peregrino del embalse con los brazos
  // en alto.
  { desde: 15.6, hasta: 18.73, p: 0.67, nombre: "Embalse · brazos en alto" },
  { desde: 18.73, hasta: 20.0, p: 0.46, nombre: "tapado · juntura" },
  // Visible del 20,90 al 21,70.
  { desde: 20.0, hasta: 21.7, p: 0.34, nombre: "Dedaleras" },
  { desde: 21.7, hasta: 23.37, p: 0.49, nombre: "Peregrino entre dedaleras" },
  // Las maletas tienen que entrar en cuadro: es el plano del equipaje y
  // debajo esta la cartela que lo dice. A 0,85, que es donde cae la cara,
  // se quedaban fuera las cuatro.
  { desde: 23.37, hasta: 25.0, p: 0.72, nombre: "Maletas en el portal" },
  { desde: 25.0, hasta: 26.43, p: 0.40, nombre: "Grupo en el albergue" },
  { desde: 26.43, hasta: 28.1, p: 0.81, nombre: "Peregrina de azul" },
  { desde: 28.1, hasta: 32.43, p: 0.46, nombre: "Entrevista 3" },
  // La catedral, no la gente que cruza: por movimiento salia 0,84 y se
  // llevaba las torres fuera.
  { desde: 32.43, hasta: 34.9, p: 0.59, nombre: "Catedral desde la plaza" },
  { desde: 34.9, hasta: 37.13, p: 0.34, nombre: "tapado · llegada" },
  { desde: 37.13, hasta: 42.06, p: 0.45, nombre: "tapado · fachada" },
];

/* ------------------------------------------------------------------ *
 * Planos de recurso. Solo imagen: el audio de debajo sigue corriendo.
 * ------------------------------------------------------------------ */

type Insercion = {
  desde: number;
  hasta: number;
  /** Segundo del archivo del que sale la imagen. */
  origen: number;
  /** Sin esto se usa `RECURSOS`. */
  fuente?: string;
  /** Por debajo de 1 alarga el plano sin repetirlo. */
  ritmo?: number;
  /** `objectPosition`. Se pone con `mirar()`, no a ojo. */
  encuadre?: string;
  nombre: string;
};

/** Mismos planos y mismos segundos que la horizontal. Cambia el encuadre. */
const INSERCIONES: Insercion[] = [
  { desde: 0.0, hasta: 1.5, origen: 0.03, fuente: B + "campo-flores.mp4", encuadre: mirar(0.68), nombre: "Apertura · campo en flor" },
  // A 0,42 el peregrino de la izquierda se parte por la mitad. A 0,68 el
  // grupo entra entero y no hay nadie cortado por el borde.
  { desde: 1.5, hasta: 2.6, origen: 0.0, fuente: B + "camino-abierto.mp4", encuadre: mirar(0.68), nombre: "Apertura · camino abierto" },
  { desde: 2.6, hasta: 4.1, origen: 0.0, fuente: B + "pareja-muros.mp4", encuadre: mirar(0.37), nombre: "Apertura · pareja entre muros" },
  { desde: 5.27, hasta: 6.4, origen: 0.0, fuente: B + "grupo-mimosas.mp4", encuadre: mirar(0.5), nombre: "Apertura · grupo entre mimosas" },
  { desde: 6.4, hasta: 7.6, origen: 0.0, fuente: B + "rio-piedras.mp4", ritmo: 0.8, encuadre: mirar(0.56), nombre: "Apertura · paso de piedras" },
  // A 0,16 solo queda el soportal en sombra; a 0,40 entran el tejado y la
  // galeria, que es lo que dice "casa rural".
  { desde: 16.5, hasta: 17.5, origen: 0.03, fuente: B + "casa-rural.mp4", encuadre: mirar(0.4), nombre: "Alojamiento · casa rural" },
  // La cama tiene que verse: a 0,25 solo quedaba el ventanal.
  { desde: 17.5, hasta: 19.5, origen: 0.1, fuente: B + "habitacion.mp4", encuadre: mirar(0.55), nombre: "Alojamiento · habitacion" },
  { desde: 19.5, hasta: 20.9, origen: 0.0, fuente: T + "bano-ducha.mp4", ritmo: 0.85, encuadre: mirar(0.5), nombre: "Juntura · baño" },
  { desde: 29.5, hasta: 31.3, origen: 26.7, encuadre: mirar(0.45), nombre: "Mochila · caminante con equipaje" },
  // De pie, el peregrino de espaldas con la calle al fondo. A 0,20 se queda
  // en una fachada.
  { desde: 34.45, hasta: 35.75, origen: 0.0, fuente: T + "rua-santiago.mp4", encuadre: mirar(0.5), nombre: "Llegada · calle de Santiago" },
  { desde: 35.75, hasta: 37.05, origen: 0.0, fuente: T + "obradoiro.mp4", encuadre: mirar(0.5), nombre: "Llegada · plaza del Obradoiro" },
  { desde: 37.05, hasta: 42.06, origen: 0.0, fuente: T + "fachada-obradoiro.mp4", encuadre: mirar(0.45), nombre: "Cierre · fachada del Obradoiro" },
];

/* ------------------------------------------------------------------ */

export const SWReelCaminoES: React.FC = () => {
  const total = f(DURACION);
  const finMontaje = f(42.06);
  const entraPlaca = f(41.2);
  const entraCierre = f(38.4);

  return (
    <AbsoluteFill style={{ backgroundColor: brand.green }}>
      {/* La pista entera, de una pieza: ningun corte de imagen la toca. */}
      <Sequence durationInFrames={finMontaje} name="Pista">
        <Audio src={staticFile(BASE)} />
      </Sequence>

      {MONTAJE.map((t) => (
        <Sequence
          key={t.desde}
          from={f(t.desde)}
          durationInFrames={f(t.hasta) - f(t.desde)}
          name={`Montaje · ${t.nombre}`}
        >
          <OffthreadVideo
            src={staticFile(BASE)}
            trimBefore={f(t.desde)}
            muted
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: mirar(t.p),
            }}
          />
        </Sequence>
      ))}

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

      {/* 1 · "venir al Camino de Santiago era un desafio personal" */}
      <Sequence from={f(0.6)} durationInFrames={f(5.2) - f(0.6)} name="1 · Algunos viajes">
        <Cartela
          lineas={[[{ texto: "Algunos viajes" }], [{ texto: "dejan huella", destacado: true }]]}
          pie={["Camino de Santiago"]}
          total={f(5.2) - f(0.6)}
          tam={TAM}
          margen={MARGEN}
          margenAbajo={MARGEN_ABAJO}
          tamPie={TAM_PIE}
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
          margen={MARGEN}
          margenAbajo={MARGEN_ABAJO}
          tamPie={TAM_PIE}
        />
      </Sequence>

      {/* 3 · sobre "como con los dos alojamientos que llevamos", 16,68-19,52 */}
      <Sequence from={f(16.6)} durationInFrames={f(20.8) - f(16.6)} name="3 · Hoteles">
        <Cartela
          lineas={[[{ texto: "Hoteles" }], [{ texto: "seleccionados", destacado: true }]]}
          pie={["Habitación y baño privados"]}
          total={f(20.8) - f(16.6)}
          tam={TAM}
          margen={MARGEN}
          margenAbajo={MARGEN_ABAJO}
          tamPie={TAM_PIE}
        />
      </Sequence>

      {/* 4 · sobre "el servicio de recogida de equipaje", 20,07-24,89 */}
      <Sequence from={f(21.4)} durationInFrames={f(25.8) - f(21.4)} name="4 · Tu mochila">
        <Cartela
          lineas={[[{ texto: "Tu mochila" }], [{ texto: "viaja sola", destacado: true }]]}
          total={f(25.8) - f(21.4)}
          tam={TAM}
          margen={MARGEN}
          margenAbajo={MARGEN_ABAJO}
          tamPie={TAM_PIE}
        />
      </Sequence>

      <Sequence from={entraCierre} durationInFrames={total - entraCierre} name="6 · Tu Camino empieza aquí">
        <CierreMarca
          lineas={[[{ texto: "Tu Camino" }], [{ texto: "empieza aquí", destacado: true }]]}
          salidaTexto={f(41.1) - entraCierre}
          tam={TAM_CIERRE}
          margen={MARGEN}
          margenAbajo={MARGEN_ABAJO}
          abajo
        />
      </Sequence>

      <Sequence from={entraPlaca} durationInFrames={total - entraPlaca} name="7 · Placa de marca">
        <PlacaMarca />
      </Sequence>
    </AbsoluteFill>
  );
};

export const SWReelCaminoESComposition: React.FC = () => (
  <Composition
    id="SWReelCaminoES"
    component={SWReelCaminoES}
    durationInFrames={f(DURACION)}
    fps={FPS}
    width={1080}
    height={1920}
  />
);
