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

/**
 * Montserrat para los titulares: es la primera de la cascada oficial del
 * manual. Van en peso 900, el negro, que es el grosor de la referencia que
 * paso el equipo. Todas las letras en blanco, tambien las recuadradas.
 */
const FUENTE = "Montserrat, Manrope, Poppins, sans-serif";
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
 * Cartelas: texto blanco, con el verde subrayando lo que importa
 * ------------------------------------------------------------------ */

/** 896 ms del kit, a 30 fps. */
const BARRIDO = 27;
/** 480 ms de relevo entre lineas. */
const RELEVO = 14;
/** Salida: el mismo barrido, mas corto. */
const CIERRE_BARRIDO = 12;

/**
 * Barrido lateral del kit: la linea se descubre de izquierda a derecha y se
 * recoge por el mismo lado. No es un fundido, que es lo que pide el manual.
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

/** Un trozo de linea. Si va destacado, se le pone la caja verde detras. */
type Trozo = { texto: string; destacado?: boolean };

/**
 * Una linea de cartela.
 *
 * Todo el texto va en blanco. El verde no hace de fondo de la linea entera,
 * solo recuadra las palabras que sostienen el mensaje, que es lo que deja
 * leer la frase de un vistazo sin que el rotulo se coma el plano.
 */
const Linea: React.FC<{
  trozos: Trozo[];
  tam: number;
  frame: number;
  desde: number;
  total: number;
}> = ({ trozos, tam, frame, desde, total }) => (
  <div
    style={{
      display: "flex",
      flexWrap: "nowrap",
      alignItems: "center",
      clipPath: barrido(frame, desde, total),
      marginTop: 6,
    }}
  >
    {trozos.map((t, i) => (
      <span
        key={i}
        style={{
          fontFamily: FUENTE,
          fontSize: tam,
          lineHeight: 1.02,
          fontWeight: 900,
          letterSpacing: "-0.02em",
          textTransform: "uppercase",
          color: brand.white,
          whiteSpace: "pre",
          backgroundColor: t.destacado ? brand.green : "transparent",
          padding: t.destacado ? `${Math.round(tam * 0.14)}px ${Math.round(tam * 0.26)}px` : 0,
          borderRadius: t.destacado ? 6 : 0,
          marginRight: i < trozos.length - 1 ? Math.round(tam * 0.22) : 0,
          textShadow: t.destacado ? "none" : "0 2px 16px rgba(8,22,15,0.55)",
        }}
      >
        {t.texto}
      </span>
    ))}
  </div>
);

/** Cartela de dos lineas, abajo a la izquierda, con un pie opcional. */
const Cartela: React.FC<{
  arriba: Trozo[];
  abajo: Trozo[];
  pie?: string;
  total: number;
  tam?: number;
}> = ({ arriba, abajo, pie, total, tam = 54 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{ justifyContent: "flex-end", alignItems: "flex-start", padding: MARGEN }}
    >
      {/* Un velo muy suave: sin el, el blanco se pierde sobre un cielo claro. */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to top, rgba(10,26,18,0.55) 0%, rgba(10,26,18,0.26) 30%, rgba(10,26,18,0) 58%)",
        }}
      />
      <div style={{ position: "relative" }}>
        <Linea trozos={arriba} tam={tam} frame={frame} desde={0} total={total} />
        <Linea trozos={abajo} tam={tam} frame={frame} desde={RELEVO} total={total} />
        {pie ? (
          <div
            style={{
              marginTop: 14,
              fontFamily: FUENTE,
              fontSize: 19,
              fontWeight: 600,
              letterSpacing: "0.10em",
              textTransform: "uppercase",
              color: brand.white,
              opacity: 0.88,
              clipPath: barrido(frame, RELEVO * 2, total),
              textShadow: "0 2px 14px rgba(8,22,15,0.55)",
            }}
          >
            {pie}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

/**
 * Cierre de marca.
 *
 * Vuelve al overlay de la version anterior, que dejaba la catedral detras y
 * el bloque de marca delante, pero con el mismo lenguaje de las cartelas
 * nuevas: blanco con el verde recuadrando lo que remata.
 *
 * Arriba queda el hueco del logo, que coloca el equipo.
 * La banda derecha se deja libre para la pantalla final de YouTube, y no se
 * dibuja ningun boton: uno pintado dentro del video invita a pulsar donde no
 * hay nada.
 */
const Cierre: React.FC<{ total: number }> = ({ total }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: o }}>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(105deg, rgba(10,26,18,0.80) 0%, rgba(10,26,18,0.62) 46%, rgba(10,26,18,0.18) 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "flex-start",
          padding: MARGEN,
          paddingRight: 420,
        }}
      >
        {/*
          Hueco reservado para el logo: 230 x 58 px, la proporcion 4:1 del
          archivo oficial. Vacio a proposito, para que al colocarlo no haya
          que recolocar nada.
        */}
        <div style={{ width: 230, height: 58, marginBottom: 30 }} />

        <Linea
          trozos={[{ texto: "Your Camino" }]}
          tam={58}
          frame={frame}
          desde={0}
          total={total}
        />
        <Linea
          trozos={[{ texto: "starts here", destacado: true }]}
          tam={58}
          frame={frame}
          desde={RELEVO}
          total={total}
        />

        <div
          style={{
            marginTop: 26,
            fontFamily: FUENTE,
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: "0.06em",
            color: brand.white,
            clipPath: barrido(frame, RELEVO * 2, total),
          }}
        >
          santiagoways.com
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

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
          arriba={[{ texto: "Some journeys" }]}
          abajo={[{ texto: "stay with you", destacado: true }]}
          pie="Camino de Santiago · Spain"
          total={f(4.1)}
        />
      </Sequence>

      <Sequence from={f(14.6)} durationInFrames={f(19.6) - f(14.6)} name="2 · You walk">
        <Cartela
          arriba={[{ texto: "You walk." }]}
          abajo={[{ texto: "We take care of the details", destacado: true }]}
          total={f(19.6) - f(14.6)}
          tam={50}
        />
      </Sequence>

      <Sequence from={f(35.633)} durationInFrames={f(39.5) - f(35.633)} name="3 · Luggage transfers">
        <Cartela
          arriba={[{ texto: "Luggage transfers" }]}
          abajo={[{ texto: "included", destacado: true }, { texto: "hotel to hotel" }]}
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
          arriba={[{ texto: "Always a" }]}
          abajo={[{ texto: "private room & bathroom", destacado: true }]}
          total={f(52.3) - f(47.833)}
          tam={50}
        />
      </Sequence>

      {/*
        Sobre el patio de piedra y la terraza. Empieza en 56,5 y no antes:
        entre 54,9 y 56,5 hay un plano de campo, y una cartela de hoteles
        encima de un prado no la sostiene nadie.
      */}
      <Sequence from={f(56.5)} durationInFrames={f(60.8) - f(56.5)} name="5 · Hand-picked hotels">
        <Cartela
          arriba={[{ texto: "Hotels" }]}
          abajo={[{ texto: "hand-picked & tested", destacado: true }]}
          pie="By our own team"
          total={f(60.8) - f(56.5)}
        />
      </Sequence>

      {/* Reubicada: donde se pedia pisaba el testimonio de la pareja. */}
      <Sequence from={f(104.35)} durationInFrames={f(107.65) - f(104.35)} name="6 · 24/7 support">
        <Cartela
          arriba={[{ texto: "24/7 support" }]}
          abajo={[{ texto: "all along the way", destacado: true }]}
          total={f(107.65) - f(104.35)}
        />
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
