import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import voz from "../../public/enero/voz-en/04.json";
import { fuente, s2f } from "./marca";
import { Montaje, type Toma, Velo } from "./Montaje";
import { Tarjeta } from "./Tarjeta";
import { Subtitulos, Titular } from "./Texto";
import { VozEnOff } from "./VozEnOff";
import type { Voz } from "./subtitulos";

/**
 * Vídeo 4 · Las 5 etapas del Camino desde Sarria.
 * Etapas y kilómetros de santiagoways.com (paquete de 7 días / 6 noches,
 * 111 km). Melide se cuenta como parada opcional que parte la etapa 3.
 * Planos reales del tramo: Portomarín, Castillo de Pambre, pulpo de Melide,
 * Monte do Gozo y Obradoiro.
 */
const V = voz as Voz;
const S = V.segmentos.map((s) => s.ini);
export const DURACION_04_EN = s2f(V.duracion + 1.6);
const FIN = DURACION_04_EN / 30;
const c = (n: string) => `enero/clips/${n}.mp4`;

const TOMAS_04: Toma[] = [
  // Gancho: peregrinos en camino y el mojón de Galicia.
  { src: c("vertical-v67"), ini: 0, fin: 2.6, volumen: 0.12 },
  { src: c("vertical-v140"), ini: 2.6, fin: S[1], volumen: 0.1 },
  // 1 · Sarria a Portomarín: el puente sobre el Miño.
  { src: c("vertical-v94"), ini: S[1], fin: S[1] + 2.4, volumen: 0.12 },
  { src: c("vertical-v79"), ini: S[1] + 2.4, fin: S[2], volumen: 0.1 },
  // 2 · Portomarín a Palas de Rei.
  { src: c("vertical-v89"), ini: S[2], fin: S[2] + 2.1, volumen: 0.1 },
  { src: c("vertical-v104"), ini: S[2] + 2.1, fin: S[3], volumen: 0.12 },
  // 3 · Palas de Rei a Arzúa: Castillo de Pambre y pulpo en Melide.
  { src: c("vertical-v175"), ini: S[3], fin: S[3] + 2.4, velocidad: 0.8 },
  { src: c("vertical-v185"), ini: S[3] + 2.4, fin: S[4], velocidad: 0.78 },
  // 4 · Arzúa a A Rúa: bosque.
  { src: c("vertical-v101"), ini: S[4], fin: S[5], volumen: 0.12 },
  // 5 · A Rúa a Santiago: Monte do Gozo y Obradoiro.
  { src: c("vertical-v189"), ini: S[5], fin: S[5] + 1.5, volumen: 0.1 },
  {
    src: c("santiago-301"),
    ini: S[5] + 1.5,
    fin: S[6],
    encuadre: "58% 50%",
    volumen: 0.1,
  },
  // Cierre: la llegada, a cámara lenta.
  {
    src: c("vertical-v139"),
    ini: S[6],
    fin: FIN,
    velocidad: 0.62,
    volumen: 0.12,
  },
];

const ETAPAS: [string, string][] = [
  ["Sarria to Portomarín", "Stage 1 · 13.7 mi"],
  ["Portomarín to Palas de Rei", "Stage 2 · 15.3 mi"],
  ["Palas de Rei to Arzúa", "Stage 3 · 17.8 mi"],
  ["Arzúa to A Rúa", "Stage 4 · 11.2 mi"],
  ["A Rúa to Santiago", "Stage 5 · 13.5 mi"],
];

export const Video04EN: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#2E2E2D", fontFamily: fuente }}>
    <VozEnOff id="04" carpeta="voz-en" />
    <Montaje tomas={TOMAS_04} />
    <Velo />
    <Sequence durationInFrames={s2f(S[1]) - 2} name="Titular">
      <Titular texto="The 5 stages from [Sarria]" tam={86} arriba={290} />
    </Sequence>
    {ETAPAS.map(([t, d], i) => (
      <Sequence
        key={t}
        from={s2f(S[i + 1]) - 3}
        durationInFrames={s2f(S[i + 2]) - s2f(S[i + 1])}
        name={t}
      >
        <Tarjeta numero={i + 1} titulo={t} dato={d} barre={12} relevo={6} />
      </Sequence>
    ))}
    <Sequence from={s2f(S[6]) - 3} name="Final">
      <Tarjeta
        titulo="69 miles"
        dato="and your Compostela"
        barre={12}
        relevo={6}
      />
    </Sequence>
    <Subtitulos voz={V} arriba={1220} />
  </AbsoluteFill>
);
