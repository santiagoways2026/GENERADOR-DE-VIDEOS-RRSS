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
 * Santiago Ways · Camino de Santiago · Traveler Stories.
 * Pieza de marca en ingles para el canal de YouTube, 1280x720 a 30 fps.
 *
 * Parte del montaje de testimonios en ingles ya limpio, sin marca de agua y
 * sin las cartelas de la agencia, y le hace cuatro cosas:
 *
 * 1. Corta los 11,30 s de introduccion musical. El nuevo montaje empieza en
 *    el segundo 11,30 del original, asi que el primer testimonio, que en el
 *    original arranca en 15,77, cae en 4,47.
 * 2. Sustituye SOLO LA IMAGEN en cinco tramos. El audio no se toca en ningun
 *    momento: sigue siendo la pista original, continua, sin un solo corte.
 *    Por eso los planos sustituidos duran exactamente lo mismo que el hueco
 *    que tapan.
 * 3. Pone siete cartelas en ingles, con las placas del kit de motion
 *    graphics: blanca con el dato en bosque, olivo o lima debajo con el
 *    complemento en mayusculas. Entran con el barrido lateral del kit,
 *    27 fotogramas y 14 de relevo, no con un fundido.
 * 4. NO lleva logo: lo coloca el equipo despues. En el cierre queda el hueco
 *    reservado, 230 x 58 px, para que entre sin recolocar el texto.
 *
 * Por que el audio no se corta: la pista trae voz y musica mezcladas en el
 * mismo canal. Cualquier corte dentro de una frase se oye, y cualquier corte
 * en la musica se nota. Recortando solo por delante, la unica juntura queda
 * en el segundo 0, donde no hay nada que romper.
 *
 * Los tiempos salen de transcribir el audio: los primeros 15,77 s del
 * original no tienen voz, son musica, y de ahi que se puedan quitar 11,30 s
 * por delante sin perder una sola palabra.
 */

const FPS = 30;
const f = (s: number) => Math.round(s * FPS);

/** Segundo del original por el que entra el nuevo montaje. */
const RECORTE = 11.3;
/** Duracion final, en segundos. */
const DURACION = 130.17;

/* ------------------------------------------------------------------ *
 * Sustituciones de imagen. El audio de debajo sigue corriendo.
 * ------------------------------------------------------------------ */

type Sustitucion = {
  /** Entrada en el montaje final, en segundos. */
  desde: number;
  /** Salida en el montaje final, en segundos. */
  hasta: number;
  /** Segundo del original del que sale la imagen. */
  origen: number;
  nombre: string;
};

const SUSTITUCIONES: Sustitucion[] = [
  { desde: 0.0, hasta: 2.267, origen: 28.633, nombre: "Apertura · dos caminantes entre muros" },
  { desde: 2.267, hasta: 4.1, origen: 4.933, nombre: "Apertura · caminantes a contraluz" },
  { desde: 17.333, hasta: 19.6, origen: 0.0, nombre: "Releva al plano llevado a la apertura" },
  { desde: 51.167, hasta: 52.467, origen: 66.233, nombre: "Tapa la ducha con el alojamiento rural" },
  { desde: 54.933, hasta: 56.467, origen: 2.9, nombre: "Releva a la fachada rural ya usada" },
];

/**
 * Las cartelas, el cierre y la placa de marca viven en
 * `componentes/CartelaMarca`: Montserrat 900 en minusculas, texto blanco y
 * el verde recuadrando solo lo que sostiene la frase. Salieron de esta
 * pieza y las comparte toda la linea horizontal de marca.
 */

/* ------------------------------------------------------------------ */

export const SWCaminoStoriesEN: React.FC = () => {
  const total = f(DURACION);
  const finCierre = f(123.0);

  return (
    <AbsoluteFill style={{ backgroundColor: brand.forest }}>
      {/* Base: imagen y audio del montaje limpio, entrando por el 11,30. */}
      <OffthreadVideo
        src={staticFile("montajes/testimonios-EN.mp4")}
        trimBefore={f(RECORTE)}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      {/* Solo imagen. Van mudos: el audio que suena es siempre el de la base. */}
      {SUSTITUCIONES.map((s) => (
        <Sequence
          key={s.desde}
          from={f(s.desde)}
          durationInFrames={f(s.hasta) - f(s.desde)}
          name={s.nombre}
        >
          <OffthreadVideo
            src={staticFile("montajes/testimonios-EN.mp4")}
            trimBefore={f(s.origen)}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Sequence>
      ))}

      <Sequence from={f(0)} durationInFrames={f(4.1)} name="1 · Some journeys stay with you">
        <Cartela
          lineas={[[{ texto: "Some journeys" }], [{ texto: "stay with you", destacado: true }]]}
          pie={["Camino de Santiago", "Spain"]}
          total={f(4.1)}
        />
      </Sequence>

      <Sequence from={f(14.6)} durationInFrames={f(19.6) - f(14.6)} name="2 · You walk">
        <Cartela
          lineas={[
            [{ texto: "You walk.", destacado: true }],
            [{ texto: "We take care" }],
            [{ texto: "of the details" }],
          ]}
          total={f(19.6) - f(14.6)}
        />
      </Sequence>

      <Sequence from={f(35.633)} durationInFrames={f(39.5) - f(35.633)} name="3 · Luggage transfers">
        <Cartela
          lineas={[[{ texto: "Luggage transfers" }], [{ texto: "included", destacado: true }]]}
          pie={["Hotel to hotel"]}
          total={f(39.5) - f(35.633)}
        />
      </Sequence>

      {/*
        Cae sobre la habitacion, que entra en pantalla en 00:00:50:00, y sobre
        la frase del viajero: "there's nothing better than laying down in a
        nice clean bed and a shower after a long day of hiking".
      */}
      <Sequence from={f(47.833)} durationInFrames={f(52.3) - f(47.833)} name="4 · Private room">
        <Cartela
          lineas={[[{ texto: "Always a private" }], [{ texto: "room & bathroom", destacado: true }]]}
          total={f(52.3) - f(47.833)}
          tam={66}
        />
      </Sequence>

      {/*
        Sobre el patio de piedra y la terraza. Empieza en 56,5 y no antes:
        entre 54,9 y 56,5 hay un plano de campo, y una cartela de hoteles
        encima de un prado no la sostiene nadie.
      */}
      <Sequence from={f(56.5)} durationInFrames={f(60.8) - f(56.5)} name="5 · Hand-picked hotels">
        <Cartela
          lineas={[[{ texto: "Hotels" }], [{ texto: "hand-picked & tested", destacado: true }]]}
          pie={["By our own team"]}
          tam={66}
          total={f(60.8) - f(56.5)}
        />
      </Sequence>

      {/* Reubicada: donde se pedia pisaba el testimonio de la pareja. */}
      <Sequence from={f(104.35)} durationInFrames={f(107.65) - f(104.35)} name="6 · 24/7 support">
        <Cartela
          lineas={[[{ texto: "24/7 support", destacado: true }], [{ texto: "all along the way" }]]}
          total={f(107.65) - f(104.35)}
          tam={64}
        />
      </Sequence>

      <Sequence from={finCierre} durationInFrames={total - finCierre} name="7 · Your Camino starts here">
        <CierreMarca
          lineas={[[{ texto: "Your Camino" }], [{ texto: "starts here", destacado: true }]]}
          salidaTexto={f(126.8) - finCierre}
          reservaDerecha={356}
        />
      </Sequence>

      <Sequence from={f(126.8)} durationInFrames={total - f(126.8)} name="8 · Placa de marca">
        <PlacaMarca />
      </Sequence>
    </AbsoluteFill>
  );
};

export const SWCaminoStoriesENComposition: React.FC = () => (
  <Composition
    id="SWCaminoStoriesEN"
    component={SWCaminoStoriesEN}
    durationInFrames={f(DURACION)}
    fps={FPS}
    width={1280}
    height={720}
  />
);
