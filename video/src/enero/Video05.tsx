import React from "react";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import voz from "../../public/enero/voz/05.json";
import { c, cajaPlana, fuente, s2f, seguro, sombraTexto } from "./marca";
import { Boton } from "./Boton";
import { Montaje, type Toma, Velo } from "./Montaje";
import { Subtitulos, Titular, useEntrada } from "./Texto";
import type { Voz } from "./subtitulos";

/**
 * Vídeo 5 · Semana Santa en Año Santo. Es la pieza comercial del mes:
 * un único CTA, pedir presupuesto. Domingo de Resurrección de 2027: 28 de marzo.
 */
const V = voz as Voz;
const S = V.segmentos.map((s) => s.ini);
export const DURACION_05 = s2f(V.duracion + 1.8);
const FIN = DURACION_05 / 30;

export const TOMAS_05: Toma[] = [
  // Gancho: la casa de la glicinia en flor, sin caras bajo el titular.
  {
    src: "enero/fotos/casa-glicinia.jpg",
    ini: 0,
    fin: 2.8,
    encuadre: "22% 50%",
    zoom: [1.12, 1.0],
  },
  {
    src: "enero/clips/portomarin-38.mp4",
    ini: 2.8,
    fin: S[1],
    encuadre: "48% 50%",
    volumen: 0.12,
  },
  // Los meses que se llenan antes: prados y peregrinos sonrientes.
  {
    src: "enero/clips/sarria-231.mp4",
    ini: S[1],
    fin: S[1] + 2.4,
    encuadre: "62% 50%",
    volumen: 0.12,
  },
  {
    src: "enero/clips/portomarin-39.mp4",
    ini: S[1] + 2.4,
    fin: S[1] + 4.9,
    encuadre: "66% 50%",
    volumen: 0.12,
  },
  {
    src: "enero/clips/vertical-v196.mp4",
    ini: S[1] + 4.9,
    fin: S[2],
    zoom: [1.05, 1.1],
    volumen: 0.12,
  },
  // 5 etapas desde Sarria y la habitación de cada noche.
  {
    src: "enero/clips/sarria-215.mp4",
    ini: S[2],
    fin: S[2] + 2.0,
    encuadre: "66% 50%",
    volumen: 0.1,
  },
  {
    src: "enero/clips/sarria-28.mp4",
    ini: S[2] + 2.0,
    fin: S[3],
    encuadre: "55% 50%",
  },
  // El equipaje viaja solo; llegada al Obradoiro con sol.
  {
    src: "enero/clips/sarria-10.mp4",
    ini: S[3],
    fin: S[3] + 1.8,
    encuadre: "42% 50%",
  },
  {
    src: "enero/clips/vertical-v22.mp4",
    ini: S[3] + 1.8,
    fin: S[4],
    volumen: 0.14,
  },
  // Cierre: la habitación al final de la etapa.
  { src: "enero/clips/vertical-v55.mp4", ini: S[4], fin: FIN, velocidad: 0.62 },
];

/** Fechas de la Semana Santa de 2027 en caja verde. */
const Fechas: React.FC = () => {
  const e = useEntrada(4, 8, 16);
  return (
    <div
      style={{
        position: "absolute",
        top: 520,
        left: seguro.izquierda,
        right: seguro.derecha,
        textAlign: "center",
        fontFamily: fuente,
        fontSize: 76,
        textShadow: sombraTexto,
        ...e,
      }}
    >
      <span style={{ ...cajaPlana, textShadow: "none", color: c.blanco }}>
        21 al 28 de marzo
      </span>
    </div>
  );
};

export const Video05: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#2E2E2D", fontFamily: fuente }}>
    <Audio src={staticFile("enero/voz/05.mp3")} />
    <Montaje tomas={TOMAS_05} />
    <Velo />
    <Sequence durationInFrames={s2f(S[1]) - 2} name="Gancho">
      <Titular texto="Semana Santa en [Año Santo]" tam={88} arriba={290} />
      <Fechas />
    </Sequence>
    <Sequence from={s2f(S[4])} name="CTA">
      <Boton texto="Pide tu presupuesto" arriba={340} tam={62} />
    </Sequence>
    <Subtitulos voz={V} arriba={1220} />
  </AbsoluteFill>
);
