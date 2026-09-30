import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import "./fuentes";
import { brand, fontFamily, margin, medioCruce } from "./brand/theme";
import { Bullets } from "./componentes/Bullets";
import { Cartela } from "./componentes/Cartela";
import { Logo } from "./componentes/Logo";
import { Planos } from "./componentes/Planos";
import { Cierre } from "./escenas/Cierre";
import { Calendario } from "./graficos/Calendario";
import { Candado } from "./graficos/Candado";
import { LineaTiempo } from "./graficos/LineaTiempo";

/**
 * English text version of ReelXacobeo (vertical, 1080x1920).
 *
 * This is NOT a translation of the Spanish reel's script — it follows the
 * actual English voiceover ("US Female Voiceover — Lara"), which has its
 * own script: no "Xacobeo" wording, a different services list, and the
 * price-lock line AFTER the services line instead of before. There is no
 * source transcript for it, so `BOUNDS` comes from transcribing the real
 * audio locally with pocketsphinx (offline, no network —
 * @remotion/install-whisper-cpp needs a model download this sandbox's
 * network policy blocks) and reading off the sentence starts. pocketsphinx
 * is a low-accuracy recognizer, so individual words in the transcript are
 * unreliable, but sentence timing and the general content of each beat are
 * solid enough to build the cut list from.
 *
 * The voiceover plays from public/locucion-en-tight.mp3, not the original
 * public/locucion-en.mp3: the raw file has 0.4-1.1 s of dead air at every
 * beat boundary (measured with ffmpeg silencedetect), roughly 4.4 s total,
 * and that dead air was being handed to Planos as extra screen time it had
 * to fill by slowing footage down. Trimming each boundary pause down to a
 * natural ~0.25-0.28 s breath (never touching the words themselves, or any
 * pause inside a beat) shortens every beat by however much its own
 * trailing pause was cut, without moving any `desde` offset: those are
 * measured from each beat's own start, and nothing before that start
 * changed. `BOUNDS` below is remeasured on the tightened file.
 *
 * Footage is reassigned per beat by theme rather than reusing the Spanish
 * cut's block-for-block mapping, since this script has more beats (10)
 * than the Spanish one (7) and two beats (Holy Door / friendship-and-time)
 * have no equivalent there. The five clips from the Spanish "Ambiente"
 * block (brazos-alto, brindis, compostela, credencial, pareja-muros) plus
 * one borrowed from "Servicios" (grupo-peregrinos) are split two-per-beat
 * across beats 3-5 (Holy Door, Friendship, Arrival) so none of them
 * repeats — even a dozen seconds apart, a repeat reads as a mistake.
 * Every clip in public/brutos is used at most once across the whole cut,
 * full stop: two beats (Opening, Brand transition) only had one or two
 * short clips for a much longer block, so even after the audio trim above
 * they still ran real footage at ~38 % and ~35 % speed to fill their
 * screen time. An earlier pass "fixed" that by reusing flecha and
 * escaleras a second time each, which just traded one visible problem for
 * another -- fix it instead by moving portico-sellado out of the Calendar
 * beat's five-clip list (which can spare it) into Brand transition, and
 * flecha out of the Book beat's four-clip list into Opening: reassigned,
 * not duplicated, so each still only appears once.
 */

const BOUNDS = [
  0, 9.049, 18.558, 24.404, 28.929, 35.865, 43.157, 46.552, 55.601, 63.239,
  67.217,
];
const f = (s: number) => Math.round(s * 30);
const dur = (i: number) => f(BOUNDS[i + 1]) - f(BOUNDS[i]);

const Inferior: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{
      justifyContent: "flex-end",
      alignItems: "center",
      padding: margin,
      paddingBottom: 300,
    }}
  >
    {children}
  </AbsoluteFill>
);

export const ReelXacobeoEN: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: brand.forest, fontFamily }}>
      <Audio src={staticFile("locucion-en-tight.mp3")} />

      <Sequence durationInFrames={f(BOUNDS[9])} name="Brand">
        <Logo
          variante="blanco"
          ancho={240}
          style={{ position: "absolute", left: margin, bottom: margin, opacity: 0.92 }}
        />
      </Sequence>

      {/* 1 · "...reason to celebrate the coming Holy Year".
       * flecha (the waymarker arrow, moved here from the Book beat -- not
       * duplicated, it no longer appears there) opens the piece with the
       * two cathedral shots: on its own, 3.4s of real footage for a 9s
       * block meant this ran near a third speed. It also breaks up two
       * near-identical upward shots of the same towers with something
       * visually distinct. */}
      <Sequence durationInFrames={dur(0)} name="1 · Opening">
        <Planos
          total={dur(0)}
          overlay={0.34}
          lista={[
            { src: "catedral-a", dura: 1.7 },
            { src: "catedral-b", dura: 1.7 },
            { src: "flecha", dura: 1.17, encuadre: "50% 40%" },
          ]}
        />
        <Cartela principal="2027" secundaria="A Holy Year" desde={110} />
      </Sequence>

      {/* 2 · "...falls on a Sunday, Santiago celebrates a Holy Year".
       * portico-sellado moved out to Brand transition below -- manos-sellando
       * already covers the credential-stamping beat, so losing it here
       * still leaves four clips for the block. */}
      <Sequence from={f(BOUNDS[1])} durationInFrames={dur(1)} name="2 · Calendar">
        <Planos
          total={dur(1)}
          overlay={0.42}
          lista={[
            { src: "catedral-torres", dura: 1.7 },
            { src: "iglesia-exterior", dura: 1.35, encuadre: "56% 50%" },
            { src: "interior-velas", dura: 2.1 },
            { src: "manos-sellando", dura: 1.6, encuadre: "28% 50%" },
          ]}
        />
        <Inferior>
          <Calendario
            desde={76}
            hasta={dur(1) - 40}
            mes="July 2027"
            dias={["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]}
            conclusion="The 25th falls on a Sunday"
          />
        </Inferior>
      </Sequence>

      {/* 3 · "...every six, five, or eleven years, and 2027 is one of them" */}
      <Sequence from={f(BOUNDS[2])} durationInFrames={dur(2)} name="3 · Timeline">
        <Planos
          total={dur(2)}
          overlay={0.42}
          lista={[
            { src: "campo-flores", dura: 1.7 },
            { src: "camino-abierto", dura: 1.2 },
            { src: "tunel-vegetacion", dura: 0.85 },
            { src: "grupo-mimosas", dura: 1.2 },
          ]}
        />
        <Inferior>
          <LineaTiempo
            desde={12}
            titulo="Holy Years"
            pie="Every 6, 5, or 11 years"
          />
        </Inferior>
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

      {/* 5 · "A history of friendship, or simply time for yourself...".
       * brindis (the group toast) is back for "a history of friendship" --
       * it's a strong shot and belongs somewhere. "time for yourself"
       * (~31-32.6s on the tightened audio) still needs to land mostly on
       * the solo shots after it, so brindis leads and brazos-alto/contraluz
       * close out the beat. */}
      <Sequence from={f(BOUNDS[4])} durationInFrames={dur(4)} name="5 · Friendship">
        <Planos
          total={dur(4)}
          overlay={0.3}
          lista={[
            { src: "brindis", dura: 2.0, encuadre: "42% 50%" },
            { src: "brazos-alto", dura: 1.0, encuadre: "34% 50%" },
            { src: "contraluz", dura: 1.45 },
          ]}
        />
      </Sequence>

      {/* 6 · "...that moment you finally arrive in Santiago — this is what a Holy Year feels like".
       * "arrive in Santiago" lands around 39.1-40.4s on the tightened audio
       * (local ~3.2-4.5s into the beat), so plaza — the cathedral/square
       * shot — goes second, not first, to sit under those words instead of
       * before them. Zoom is auto-boosted by Planos since this block
       * stretches its footage a lot. */}
      <Sequence from={f(BOUNDS[5])} durationInFrames={dur(5) + medioCruce} name="6 · Arrival">
        <Planos
          total={dur(5)}
          overlay={0.3}
          fundeSalidaBloque
          lista={[
            { src: "pareja-muros", dura: 1.55, encuadre: "40% 50%" },
            { src: "plaza", dura: 1.05 },
            { src: "grupo-peregrinos", dura: 0.75 },
          ]}
        />
        {/* Own Sequence capped at dur(5), not the extended outer one: the
         * outer Sequence runs medioCruce frames past the beat's real end so
         * Planos has room to crossfade its last clip into Brand transition,
         * but Cartela has no exit animation, so left as a direct sibling it
         * just sat there fully visible through that crossfade -- the "This
         * is what a Holy Year feels like" text hanging over the next
         * beat's building shot. Capping it here makes it leave exactly at
         * the beat boundary, same as it always did before the crossfade
         * extended this Sequence. */}
        <Sequence durationInFrames={dur(5)} name="cartela">
          <Cartela principal="This is what" secundaria="a Holy Year feels like" desde={149} />
        </Sequence>
      </Sequence>

      {/* 7 · "With Santiago Ways, your journey is organized from the start".
       * Hard-cutting from Arrival's lively green forest shot into this
       * beat's static building close-up read as a jarring jump, especially
       * with both sides heavily slowed -- crossfades into Arrival instead
       * (see fundeSalidaBloque above). No overlay content in this beat, so
       * shifting its start earlier doesn't touch any desde timing.
       * fachada-moderna alone was 1.2s of real footage for a 3.7s block —
       * the worst stretch in the whole cut, close to a third speed.
       * portico-sellado (moved here from the Calendar beat -- see above,
       * not duplicated) gives it a second real clip instead of stretching
       * one shot further, and it fits the "organized from the start" line
       * arguably better than it fit the calendar countdown anyway: it's a
       * pilgrim being looked after at an office door. */}
      <Sequence
        from={f(BOUNDS[6]) - medioCruce}
        durationInFrames={dur(6) + medioCruce}
        name="7 · Brand transition"
      >
        <Planos
          total={dur(6)}
          overlay={0.34}
          fundeEntradaBloque
          lista={[
            { src: "fachada-moderna", dura: 1.2, encuadre: "40% 50%" },
            { src: "portico-sellado", dura: 2.0, encuadre: "30% 50%" },
          ]}
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
        <AbsoluteFill
          style={{
            justifyContent: "center",
            padding: margin,
            paddingBottom: 200,
          }}
        >
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
        </AbsoluteFill>
      </Sequence>

      {/* 9 · "...lock in your price today — you focus on the experience, we take care of the details".
       * flecha moved out to Opening above -- piernas/escaleras/rio-piedras
       * still cover the physical-journey imagery this beat needs. */}
      <Sequence from={f(BOUNDS[8])} durationInFrames={dur(8)} name="9 · Book">
        <Planos
          total={dur(8)}
          overlay={0.4}
          lista={[
            { src: "piernas", dura: 2.25 },
            { src: "escaleras", dura: 1.2 },
            { src: "rio-piedras", dura: 1.0 },
          ]}
        />
        <Inferior>
          <Candado desde={70} texto="Price locked in today" etiqueta="Booking now" />
        </Inferior>
      </Sequence>

      {/* 10 · "Book your 2027 Camino, walk it with Santiago Ways" */}
      <Sequence from={f(BOUNDS[9])} durationInFrames={dur(9)} name="10 · Close">
        <Cierre duracion={dur(9)} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const DURACION_REEL_EN = f(BOUNDS[BOUNDS.length - 1]);
