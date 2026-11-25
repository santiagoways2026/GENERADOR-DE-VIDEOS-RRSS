import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import voz from "../../public/enero/voz/04.json";
import { fuente, s2f } from "./marca";
import { Montaje, type Toma, Velo } from "./Montaje";
import { Tarjeta } from "./Tarjeta";
import { VozEnOff } from "./VozEnOff";
import { Subtitulos, Titular } from "./Texto";
import type { Voz } from "./subtitulos";

/**
 * Vídeo 4 · Las 6 etapas del Camino desde Ourense.
 * En el banco no hay imágenes de Ourense, las termas, Cea ni Oseira: se usa
 * paisaje gallego genérico y ningún rótulo dice que el plano sea ese sitio.
 * Los rótulos son los nombres de las etapas, no de lo que se ve.
 * Kilómetros comprobados en santiagoways.com: 119,5 km.
 */
const V = voz as Voz;
const S = V.segmentos.map((s) => s.ini);
export const DURACION_04 = s2f(V.duracion + 1.6);
const FIN = DURACION_04 / 30;

export const TOMAS_04: Toma[] = [
  // Gancho: agua y bosque, sin decir que sean las termas.
  { src: "enero/clips/vertical-v115.mp4", ini: 0, fin: S[1], volumen: 0.14 },
  // 1 · Ourense a Cea, la villa del pan: pan gallego.
  {
    src: "enero/clips/vertical-v109.mp4",
    ini: S[1],
    fin: S[1] + 1.3,
    velocidad: 0.8,
    volumen: 0.1,
  },
  {
    src: "enero/clips/sarria-73.mp4",
    ini: S[1] + 1.3,
    fin: S[2],
    encuadre: "40% 50%",
  },
  // 2 · Cea a Casarellos: aldea.
  { src: "enero/clips/vertical-v57.mp4", ini: S[2], fin: S[3], volumen: 0.12 },
  // 3 · Casarellos a Lalín: hórreo.
  { src: "enero/clips/vertical-v51.mp4", ini: S[3], fin: S[4], volumen: 0.1 },
  // 4 · Lalín a Silleda: bosque.
  { src: "enero/clips/vertical-v101.mp4", ini: S[4], fin: S[5], volumen: 0.12 },
  // 5 · Silleda a Ponte Ulla: puente de piedra.
  {
    src: "enero/clips/vertical-v106.mp4",
    ini: S[5],
    fin: S[6],
    desde: 1.2,
    volumen: 0.12,
  },
  // 6 · Ponte Ulla a Santiago: Santiago a la vista.
  { src: "enero/clips/vertical-v189.mp4", ini: S[6], fin: S[7], volumen: 0.12 },
  // Cierre: la Compostela y el Monte do Gozo.
  {
    src: "enero/clips/santiago-160.mp4",
    ini: S[7],
    fin: S[7] + 3.0,
    velocidad: 0.78,
    encuadre: "50% 50%",
    volumen: 0.12,
  },
  {
    src: "enero/clips/vertical-v122.mp4",
    ini: S[7] + 3.0,
    fin: FIN,
    volumen: 0.1,
  },
];

const ETAPAS = [
  "Ourense a Cea",
  "Cea a Casarellos",
  "Casarellos a Lalín",
  "Lalín a Silleda",
  "Silleda a Ponte Ulla",
  "Ponte Ulla a Santiago",
];

export const Video04: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#2E2E2D", fontFamily: fuente }}>
    <VozEnOff id="04" />
    <Montaje tomas={TOMAS_04} />
    <Velo />
    <Sequence durationInFrames={s2f(S[1]) - 2} name="Titular">
      <Titular texto="Las 6 etapas desde [Ourense]" tam={86} arriba={290} />
    </Sequence>
    {ETAPAS.map((e, i) => (
      <Sequence
        key={e}
        from={s2f(S[i + 1]) - 3}
        durationInFrames={s2f(S[i + 2]) - s2f(S[i + 1])}
        name={e}
      >
        <Tarjeta
          numero={i + 1}
          titulo={e}
          dato={`Etapa ${i + 1} de 6`}
          barre={12}
          relevo={6}
        />
      </Sequence>
    ))}
    <Sequence from={s2f(S[7]) - 3} name="Final">
      <Tarjeta titulo="Unos 119,5 km" dato="y la Compostela" />
    </Sequence>
    {/* En las etapas 3 a 6 el rótulo ya dice lo mismo que la voz. */}
    <Subtitulos voz={V} arriba={1220} ocultar={[3, 4, 5, 6]} />
  </AbsoluteFill>
);
