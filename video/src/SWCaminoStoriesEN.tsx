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
 * 3. Pone seis cartelas en ingles.
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

/** Entradas y salidas suaves, 7 fotogramas. Sin rebote. */
const suave = (frame: number, total: number, fade = 7) =>
  interpolate(frame, [0, fade, total - fade, total], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 0.61, 0.36, 1),
  });

/** Degradado suave por detras del texto, en vez de una caja opaca. */
const Velo: React.FC<{ lado: "abajo" | "todo"; opacidad: number }> = ({ lado, opacidad }) => (
  <AbsoluteFill
    style={{
      background:
        lado === "abajo"
          ? `linear-gradient(to top, rgba(10,26,18,${opacidad}) 0%, rgba(10,26,18,${
              opacidad * 0.55
            }) 34%, rgba(10,26,18,0) 62%)`
          : `linear-gradient(105deg, rgba(10,26,18,${opacidad}) 0%, rgba(10,26,18,${
              opacidad * 0.6
            }) 45%, rgba(10,26,18,0.12) 100%)`,
    }}
  />
);

const Cartela: React.FC<{
  titular: string;
  apoyo?: string;
  total: number;
  /** El titular a dos lineas se parte aqui, no por ancho de caja. */
  segunda?: string;
}> = ({ titular, segunda, apoyo, total }) => {
  const frame = useCurrentFrame();
  const o = suave(frame, total);
  const y = interpolate(frame, [0, 10], [14, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 0.61, 0.36, 1),
  });

  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Velo lado="abajo" opacidad={0.62} />
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "flex-start",
          padding: MARGEN,
          transform: `translateY(${y}px)`,
        }}
      >
        <div style={{ maxWidth: 820 }}>
          <div
            style={{
              fontFamily: FUENTE,
              fontWeight: 800,
              fontSize: 46,
              lineHeight: 1.12,
              color: brand.white,
              letterSpacing: "-0.015em",
              textShadow: "0 2px 18px rgba(8,22,15,0.45)",
            }}
          >
            {titular}
            {segunda ? (
              <>
                <br />
                {segunda}
              </>
            ) : null}
          </div>
          {apoyo ? (
            <div
              style={{
                marginTop: 12,
                fontFamily: FUENTE,
                fontWeight: 600,
                fontSize: 21,
                letterSpacing: "0.04em",
                color: brand.white,
                opacity: 0.86,
              }}
            >
              <span style={{ color: brand.lime, marginRight: 10 }}>—</span>
              {apoyo}
            </div>
          ) : null}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/**
 * Cierre. Se deja libre la banda inferior derecha del cuadro para la
 * pantalla final de YouTube: aqui no se dibuja ningun boton, porque un boton
 * pintado dentro del video invita a pulsar donde no hay nada.
 */
const Cierre: React.FC<{ total: number }> = ({ total }) => {
  const frame = useCurrentFrame();
  const o = suave(frame, total, 8);
  const y = interpolate(frame, [0, 14], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 0.61, 0.36, 1),
  });

  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Velo lado="todo" opacidad={0.68} />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "flex-start",
          padding: MARGEN,
          paddingRight: 470,
          transform: `translateY(${y}px)`,
        }}
      >
        <div
          style={{
            fontFamily: FUENTE,
            fontWeight: 800,
            fontSize: 52,
            lineHeight: 1.1,
            color: brand.white,
            letterSpacing: "-0.015em",
            textShadow: "0 2px 20px rgba(8,22,15,0.5)",
          }}
        >
          Your Camino
          <br />
          starts here.
        </div>

        {/*
          Hueco reservado para el logo, que se coloca fuera de aqui.
          Caja de 230 x 58 px, la proporcion 4:1 del archivo oficial, pegada
          al margen izquierdo de 64 px. Se deja vacia a proposito: asi el
          texto de arriba y el de abajo no se mueven cuando entre.
        */}
        <div style={{ marginTop: 30, width: 230, height: 58 }} />

        <div
          style={{
            marginTop: 22,
            fontFamily: FUENTE,
            fontWeight: 600,
            fontSize: 22,
            letterSpacing: "0.05em",
            color: brand.lime,
          }}
        >
          Explore our Camino trips
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
          titular="Some journeys stay with you."
          apoyo="Camino de Santiago, Spain"
          total={f(4.1)}
        />
      </Sequence>

      <Sequence from={f(14.6)} durationInFrames={f(19.6) - f(14.6)} name="2 · You walk">
        <Cartela titular="You walk." segunda="We take care of the details." total={f(19.6) - f(14.6)} />
      </Sequence>

      <Sequence from={f(35.633)} durationInFrames={f(39.5) - f(35.633)} name="3 · Luggage transfers">
        <Cartela titular="Luggage transfers included." total={f(39.5) - f(35.633)} />
      </Sequence>

      <Sequence from={f(47.833)} durationInFrames={f(52.467) - f(47.833)} name="4 · Comfortable stays">
        <Cartela titular="Comfortable stays." segunda="Time to recharge." total={f(52.467) - f(47.833)} />
      </Sequence>

      {/* Reubicada: donde se pedia pisaba el testimonio de la pareja. */}
      <Sequence from={f(104.45)} durationInFrames={f(107.6) - f(104.45)} name="5 · 24/7 support">
        <Cartela titular="24/7 support along the way." total={f(107.6) - f(104.45)} />
      </Sequence>

      <Sequence from={finCierre} durationInFrames={total - finCierre} name="6 · Cierre de marca">
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
