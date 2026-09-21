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
 * Same layout adaptation as the Spanish horizontal cut (cartela top-left,
 * graphics centered and scaled to fit 720px of height). Uses the English
 * voiceover (public/locucion-en.mp3, "US Female Voiceover — Lara"); see the
 * note in ReelXacobeoEN.tsx for how `B` was re-measured from its own
 * silences and where it now outruns the available footage per block.
 */

const B = [0, 6.827, 19.848, 28.549, 40.505, 55.301, 69.824, 71.63];
const f = (s: number) => Math.round(s * 30);
const dur = (i: number) => f(B[i + 1]) - f(B[i]);

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

      <Sequence durationInFrames={f(B[6])} name="Brand">
        <Logo
          variante="blanco"
          ancho={200}
          style={{ position: "absolute", left: margin, bottom: margin, opacity: 0.92 }}
        />
      </Sequence>

      {/* 1 · Next year is the year */}
      <Sequence durationInFrames={dur(0)} name="1 · Opening">
        <Planos
          total={dur(0)}
          overlay={0.34}
          lista={[
            { src: "plaza", dura: 1.05 },
            { src: "catedral-a", dura: 1.7 },
            { src: "catedral-b", dura: 1.7 },
          ]}
        />
        <Cartela principal="Xacobeo 2027" secundaria="It's a Holy Year" desde={8} />
      </Sequence>

      {/* 2 · July 25th falls on a Sunday */}
      <Sequence from={f(B[1])} durationInFrames={dur(1)} name="2 · Calendar">
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
              desde={24}
              hasta={dur(1) - 58}
              mes="July 2027"
              dias={["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]}
              conclusion="The 25th falls on a Sunday"
            />
          </div>
        </Centro>
      </Sequence>

      {/* 3 · The next one isn't until 2032 */}
      <Sequence from={f(B[2])} durationInFrames={dur(2)} name="3 · Timeline">
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

      {/* 4 · A Holy Year is felt */}
      <Sequence from={f(B[3])} durationInFrames={dur(3)} name="4 · Atmosphere">
        <Planos
          total={dur(3)}
          overlay={0.3}
          lista={[
            { src: "brazos-alto", dura: 1.0, encuadre: "34% 50%" },
            { src: "brindis", dura: 2.0, encuadre: "42% 50%" },
            { src: "compostela", dura: 1.7, encuadre: "38% 50%" },
            { src: "credencial", dura: 1.05 },
            { src: "pareja-muros", dura: 1.55, encuadre: "40% 50%" },
          ]}
        />
        <Cartela principal="This is what" secundaria="a Holy Year feels like" desde={6} />
      </Sequence>

      {/* 5 · Whoever books now gets to choose */}
      <Sequence from={f(B[4])} durationInFrames={dur(4)} name="5 · Book">
        <Planos
          total={dur(4)}
          overlay={0.4}
          lista={[
            { src: "casa-rural", dura: 1.2, encuadre: "38% 50%" },
            { src: "fachada-moderna", dura: 1.2, encuadre: "40% 50%" },
            { src: "habitacion", dura: 2.15, encuadre: "62% 50%" },
            { src: "terraza", dura: 2.2, encuadre: "30% 50%" },
            { src: "mesa-exterior", dura: 1.45, encuadre: "40% 50%" },
          ]}
        />
        <Centro>
          <Candado desde={20} texto="Price locked in today" etiqueta="Booking now" />
        </Centro>
      </Sequence>

      {/* 6 · We take care of everything */}
      <Sequence from={f(B[5])} durationInFrames={dur(5)} name="6 · Services">
        <Planos
          total={dur(5)}
          overlay={0.46}
          lista={[
            { src: "piernas", dura: 2.25 },
            { src: "escaleras", dura: 1.2 },
            { src: "flecha", dura: 1.2, encuadre: "58% 50%" },
            { src: "grupo-peregrinos", dura: 0.75 },
            { src: "rio-piedras", dura: 1.0 },
          ]}
        />
        <Centro>
          <div style={{ scale: 0.85 }}>
            <Bullets
              desde={2}
              relevo={17}
              items={[
                "24-hour assistance phone line",
                "Private room and bathroom",
                "Luggage transport",
                "Support vehicle",
                "Navigation app",
              ]}
            />
          </div>
        </Centro>
      </Sequence>

      {/* 7 · Brand close */}
      <Sequence from={f(B[6])} durationInFrames={dur(6)} name="7 · Close">
        <Cierre duracion={dur(6)} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const DURACION_REEL_YOUTUBE_EN = f(B[B.length - 1]);
