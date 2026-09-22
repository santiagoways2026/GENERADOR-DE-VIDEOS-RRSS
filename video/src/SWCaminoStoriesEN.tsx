import {
  AbsoluteFill,
  Composition,
  Easing,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import "./fuentes";
import "@fontsource/manrope/latin-600.css";
import "@fontsource/manrope/latin-800.css";
import { brand } from "./brand/theme";

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

const FUENTE = "Manrope, Montserrat, Poppins, sans-serif";
const MARGEN = 64;

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

/* ------------------------------------------------------------------ *
 * Cartelas
 * ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ *
 * Cartelas: las placas del kit, adaptadas a 1280x720
 * ------------------------------------------------------------------ */

/** 896 ms del kit, a 30 fps. */
const BARRIDO = 27;
/** 480 ms de relevo entre placas. */
const RELEVO = 14;
/** Salida: el mismo barrido al reves, mas corto. */
const CIERRE_BARRIDO = 12;

/**
 * Barrido de izquierda a derecha para entrar y de izquierda a derecha para
 * salir, de forma que la placa se descubre y se recoge por el mismo lado.
 */
const barrido = (frame: number, desde: number, total: number) => {
  const entra = interpolate(frame, [desde, desde + BARRIDO], [100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 0.61, 0.36, 1),
  });
  const sale = interpolate(frame, [total - CIERRE_BARRIDO, total], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 0.61, 0.36, 1),
  });
  return `inset(0 ${entra}% 0 ${sale}%)`;
};

/**
 * Dos placas encajadas, como en el kit: la blanca manda y lleva el dato en
 * bosque; la de abajo remata en olivo, o en lima cuando cierra.
 *
 * Van abajo a la izquierda y no arriba, que es donde las pone el manual para
 * los reels verticales: en horizontal la franja superior es donde caen las
 * caras de los entrevistados, y taparlas seria perder la pieza.
 */
const Bloque: React.FC<{
  principal: string;
  secundaria?: string;
  total: number;
  tono?: "olivo" | "lima";
}> = ({ principal, secundaria, total, tono = "olivo" }) => {
  const frame = useCurrentFrame();
  const abajo =
    tono === "lima"
      ? { bg: brand.lime, fg: brand.forest }
      : { bg: brand.green, fg: brand.white };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
        <div
          style={{
            backgroundColor: brand.white,
            padding: "13px 30px 16px",
            borderRadius: "6px 6px 0 0",
            clipPath: barrido(frame, 0, total),
          }}
        >
          <span
            style={{
              display: "block",
              fontFamily: FUENTE,
              fontSize: 44,
              lineHeight: 1,
              fontWeight: 800,
              letterSpacing: "-0.015em",
              color: brand.forest,
              whiteSpace: "nowrap",
            }}
          >
            {principal}
          </span>
        </div>

        {secundaria ? (
          <div
            style={{
              backgroundColor: abajo.bg,
              padding: "10px 30px 12px",
              borderRadius: "0 6px 6px 6px",
              clipPath: barrido(frame, RELEVO, total),
            }}
          >
            <span
              style={{
                display: "block",
                fontFamily: FUENTE,
                fontSize: 21,
                lineHeight: 1.15,
                fontWeight: 900,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: abajo.fg,
                whiteSpace: "nowrap",
              }}
            >
              {secundaria}
            </span>
          </div>
        ) : null}
      </div>
    </>
  );
};

/** El bloque colocado abajo a la izquierda, que es como va en la pieza. */
const Placas: React.FC<{
  principal: string;
  secundaria?: string;
  total: number;
  tono?: "olivo" | "lima";
}> = (props) => (
  <AbsoluteFill
    style={{ justifyContent: "flex-end", alignItems: "flex-start", padding: MARGEN }}
  >
    <Bloque {...props} />
  </AbsoluteFill>
);

/**
 * Cierre. Las mismas placas, con la de abajo en lima, que es el uso que el
 * manual le reserva: rematar.
 *
 * Encima queda el hueco del logo, que coloca el equipo. La banda derecha se
 * deja libre para la pantalla final de YouTube, y no se dibuja ningun boton:
 * un boton pintado dentro del video invita a pulsar donde no hay nada.
 */
const Cierre: React.FC<{ total: number }> = ({ total }) => (
  <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "flex-start", padding: MARGEN }}>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
      {/*
        Hueco reservado para el logo: 230 x 58 px, la proporcion 4:1 del
        archivo oficial. Se deja vacio a proposito, para que al colocarlo no
        haya que recolocar las placas.
      */}
      <div style={{ width: 230, height: 58, marginBottom: 26 }} />
      <Bloque principal="Your Camino starts here." secundaria="santiagoways.com" total={total} tono="lima" />
    </div>
  </AbsoluteFill>
);

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
        <Placas principal="Some journeys stay with you." secundaria="Camino de Santiago · Spain" total={f(4.1)} />
      </Sequence>

      <Sequence from={f(14.6)} durationInFrames={f(19.6) - f(14.6)} name="2 · You walk">
        <Placas principal="You walk." secundaria="We take care of the details" total={f(19.6) - f(14.6)} />
      </Sequence>

      <Sequence from={f(35.633)} durationInFrames={f(39.5) - f(35.633)} name="3 · Luggage transfers">
        <Placas principal="Luggage transfers included." secundaria="From one hotel to the next" total={f(39.5) - f(35.633)} />
      </Sequence>

      {/*
        Cae sobre la habitacion, que entra en pantalla en 00:00:50:00, y sobre
        la frase del viajero: "there's nothing better than laying down in a
        nice clean bed and a shower after a long day of hiking".
      */}
      <Sequence from={f(47.833)} durationInFrames={f(52.3) - f(47.833)} name="4 · Private room">
        <Placas principal="Always a private room." secundaria="And a private bathroom" total={f(52.3) - f(47.833)} />
      </Sequence>

      {/*
        Sobre el patio de piedra y la terraza, que son alojamiento. Empieza en
        56,5 y no antes: entre 54,9 y 56,5 hay un plano de campo, y una cartela
        de hoteles encima de un prado no la sostiene nadie.
      */}
      <Sequence from={f(56.5)} durationInFrames={f(60.8) - f(56.5)} name="5 · Hand-picked hotels">
        <Placas principal="Hand-picked hotels." secundaria="Tested by our own team" total={f(60.8) - f(56.5)} />
      </Sequence>

      {/* Reubicada: donde se pedia pisaba el testimonio de la pareja. */}
      <Sequence from={f(104.35)} durationInFrames={f(107.65) - f(104.35)} name="6 · 24/7 support">
        <Placas principal="24/7 support." secundaria="All along the way" total={f(107.65) - f(104.35)} />
      </Sequence>

      <Sequence from={finCierre} durationInFrames={total - finCierre} name="7 · Cierre de marca">
        <Cierre total={total - finCierre} />
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
