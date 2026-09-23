import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import "./fuentes";
import { brand, fontFamily, margin } from "./brand/theme";
import { Bullets } from "./componentes/Bullets";
import { Cartela } from "./componentes/Cartela";
import { Logo } from "./componentes/Logo";
import { Planos } from "./componentes/Planos";
import { Cierre } from "./escenas/Cierre";
import { Calendario } from "./graficos/Calendario";
import { Candado } from "./graficos/Candado";
import { LineaTiempo } from "./graficos/LineaTiempo";

/**
 * English text version of ReelXacobeoYoutube (horizontal, 1280x720).
 *
 * Same beats, same footage plan, and same layout adaptation (cartela
 * top-left, graphics centered and scaled to fit 720px of height) as the
 * Spanish horizontal cut — see the notes in ReelXacobeoEN.tsx for how
 * `BOUNDS` was measured from the real English audio with pocketsphinx and
 * why the footage per beat doesn't match the Spanish reel's grouping.
 */

const BOUNDS = [
  0, 9.9, 19.83, 26.22, 31.26, 38.58, 46.44, 50.13, 59.76, 67.65, 71.63,
];
const f = (s: number) => Math.round(s * 30);
const dur = (i: number) => f(BOUNDS[i + 1]) - f(BOUNDS[i]);

const Centro: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{
      justifyContent: "center",
      alignItems: "center",
      padding: margin,
    }}
  >
    {children}
  </AbsoluteFill>
);

export const ReelXacobeoYoutubeEN: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: brand.forest, fontFamily }}>
      <Audio src={staticFile("locucion-en.mp3")} />

      <Sequence durationInFrames={f(BOUNDS[9])} name="Brand">
        <Logo
          variante="blanco"
          ancho={200}
          style={{ position: "absolute", left: margin, bottom: margin, opacity: 0.92 }}
        />
      </Sequence>

      {/* 1 · "...reason to celebrate the coming Holy Year" */}
      <Sequence durationInFrames={dur(0)} name="1 · Opening">
        <Planos
          total={dur(0)}
          overlay={0.34}
          lista={[
            { src: "catedral-a", dura: 1.7 },
            { src: "catedral-b", dura: 1.7 },
          ]}
        />
        <Cartela principal="2027" secundaria="A Holy Year" desde={110} />
      </Sequence>

      {/* 2 · "...falls on a Sunday, Santiago celebrates a Holy Year" */}
      <Sequence from={f(BOUNDS[1])} durationInFrames={dur(1)} name="2 · Calendar">
        <Planos
          total={dur(1)}
          overlay={0.42}
          lista={[
            { src: "catedral-torres", dura: 1.7 },
            { src: "iglesia-exterior", dura: 1.35, encuadre: "56% 50%" },
            { src: "interior-velas", dura: 2.1 },
            { src: "manos-sellando", dura: 1.6, encuadre: "28% 50%" },
            { src: "portico-sellado", dura: 2.0, encuadre: "30% 50%" },
          ]}
        />
        <Centro>
          <div style={{ scale: 0.68 }}>
            <Calendario
              desde={76}
              hasta={dur(1) - 40}
              mes="July 2027"
              dias={["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]}
              conclusion="The 25th falls on a Sunday"
            />
          </div>
        </Centro>
      </Sequence>

      {/* 3 · "...every six, five, or eleven years, and 2027 is one of them" */}
      <Sequence from={f(BOUNDS[2])} durationInFrames={dur(2)} name="3 · Timeline">
        <Planos
          total={dur(2)}
          overlay={0.42}
          lista={[
            { src: "campo-flores", dura: 1.7 },
            { src: "contraluz", dura: 1.45 },
            { src: "camino-abierto", dura: 1.2 },
            { src: "tunel-vegetacion", dura: 0.85 },
            { src: "grupo-mimosas", dura: 1.2 },
          ]}
        />
        <Centro>
          <LineaTiempo desde={12} pie="Every 6, 5, or 11 years" />
        </Centro>
      </Sequence>

      {/* 4 · "The cathedral's Holy Door opens, welcoming pilgrims from around the world" */}
      <Sequence from={f(BOUNDS[3])} durationInFrames={dur(3)} name="4 · Holy Door">
        <Planos
          total={dur(3)}
          overlay={0.3}
          lista={[
            { src: "credencial", dura: 1.05 },
            { src: "compostela", dura: 1.7, encuadre: "38% 50%" },
          ]}
        />
      </Sequence>

      {/* 5 · "A history of friendship, or simply time for yourself..." */}
      <Sequence from={f(BOUNDS[4])} durationInFrames={dur(4)} name="5 · Friendship">
        <Planos
          total={dur(4)}
          overlay={0.3}
          lista={[
            { src: "brazos-alto", dura: 1.0, encuadre: "34% 50%" },
            { src: "brindis", dura: 2.0, encuadre: "42% 50%" },
          ]}
        />
      </Sequence>

      {/* 6 · "...the moment you finally arrive in Santiago — this is what a Holy Year feels like" */}
      <Sequence from={f(BOUNDS[5])} durationInFrames={dur(5)} name="6 · Arrival">
        <Planos
          total={dur(5)}
          overlay={0.3}
          lista={[
            { src: "plaza", dura: 1.05 },
            { src: "pareja-muros", dura: 1.55, encuadre: "40% 50%" },
            { src: "grupo-peregrinos", dura: 0.75 },
          ]}
        />
        <Cartela principal="This is what" secundaria="a Holy Year feels like" desde={149} />
      </Sequence>

      {/* 7 · "With Santiago Ways, your journey is organized from the start" */}
      <Sequence from={f(BOUNDS[6])} durationInFrames={dur(6)} name="7 · Brand transition">
        <Planos
          total={dur(6)}
          overlay={0.34}
          lista={[{ src: "fachada-moderna", dura: 1.2, encuadre: "40% 50%" }]}
        />
      </Sequence>

      {/* 8 · "Carefully selected accommodations, luggage transfers, 24-hour phone support, offline navigation, and your complete itinerary" */}
      <Sequence from={f(BOUNDS[7])} durationInFrames={dur(7)} name="8 · Services">
        <Planos
          total={dur(7)}
          overlay={0.46}
          lista={[
            { src: "casa-rural", dura: 1.2, encuadre: "38% 50%" },
            { src: "habitacion", dura: 2.15, encuadre: "62% 50%" },
            { src: "terraza", dura: 2.2, encuadre: "30% 50%" },
            { src: "mesa-exterior", dura: 1.45, encuadre: "40% 50%" },
          ]}
        />
        <Centro>
          <div style={{ scale: 0.85 }}>
            <Bullets
              desde={2}
              relevo={17}
              items={[
                "Carefully selected accommodations",
                "Luggage transfers",
                "24-hour phone support",
                "Offline navigation",
                "Complete itinerary",
              ]}
            />
          </div>
        </Centro>
      </Sequence>

      {/* 9 · "...lock in your price today — you focus on the experience, we take care of the details" */}
      <Sequence from={f(BOUNDS[8])} durationInFrames={dur(8)} name="9 · Book">
        <Planos
          total={dur(8)}
          overlay={0.4}
          lista={[
            { src: "piernas", dura: 2.25 },
            { src: "escaleras", dura: 1.2 },
            { src: "flecha", dura: 1.2, encuadre: "58% 50%" },
            { src: "rio-piedras", dura: 1.0 },
          ]}
        />
        <Centro>
          <Candado desde={70} texto="Price locked in today" etiqueta="Booking now" />
        </Centro>
      </Sequence>

      {/* 10 · "Book your 2027 Camino, walk it with Santiago Ways" */}
      <Sequence from={f(BOUNDS[9])} durationInFrames={dur(9)} name="10 · Close">
        <Cierre duracion={dur(9)} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const DURACION_REEL_YOUTUBE_EN = f(BOUNDS[BOUNDS.length - 1]);
