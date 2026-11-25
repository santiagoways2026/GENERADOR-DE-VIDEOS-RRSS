import React from "react";
import { AbsoluteFill, interpolate, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import voz from "../../public/enero/voz/01.json";
import { fuente, s2f } from "./marca";
import { Boton } from "./Boton";
import { Montaje, type Toma, Velo } from "./Montaje";
import { VozEnOff } from "./VozEnOff";
import { Subtitulos, Titular } from "./Texto";
import type { Voz } from "./subtitulos";

/**
 * Vídeo 1 · La Puerta Santa ya está abierta.
 * Ritmo lento y fundidos largos. No hay planos de la Puerta Santa abierta:
 * se ve la fachada de la Quintana y la voz cuenta que ya está abierta.
 */
const V = voz as Voz;
export const DURACION_01 = s2f(V.duracion + 2.3);
const FIN = DURACION_01 / 30;

export const TOMAS_01: Toma[] = [
  // Gancho: la Puerta Santa en la Quintana, a cámara lenta.
  {
    src: "enero/clips/vertical-v24.mp4",
    ini: 0,
    fin: 5.6,
    velocidad: 0.8,
    volumen: 0.18,
    zoom: [1.02, 1.1],
  },
  // El 25 de julio, día del Apóstol.
  {
    src: "enero/clips/santiago-159.mp4",
    ini: 5.6,
    fin: 8.6,
    velocidad: 0.75,
    encuadre: "64% 50%",
    volumen: 0.12,
  },
  { src: "enero/clips/vertical-v190.mp4", ini: 8.6, fin: 11.9, volumen: 0.12 },
  // 2027 y los peregrinos que llegarán.
  {
    src: "enero/fotos/pinaculos.jpg",
    ini: 11.9,
    fin: 13.9,
    encuadre: "40% 50%",
    zoom: [1.12, 1.02],
  },
  { src: "enero/clips/vertical-v23.mp4", ini: 13.9, fin: 16.4, volumen: 0.15 },
  {
    src: "enero/clips/santiago-153.mp4",
    ini: 16.4,
    fin: 18.4,
    velocidad: 0.9,
    encuadre: "46% 50%",
    volumen: 0.15,
  },
  // Cierre: la Puerta Santa de nuevo, en foto, con aire para el texto.
  {
    src: "enero/fotos/puerta-santa.jpg",
    ini: 18.4,
    fin: FIN,
    encuadre: "50% 60%",
    zoom: [1.14, 1.0],
  },
];

export const Video01: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#2E2E2D", fontFamily: fuente }}>
    <VozEnOff id="01" />
    {/* Campanas sintetizadas: presentes al principio y al final, bajas bajo la voz. */}
    <Audio
      src={staticFile("enero/audio/campanas.wav")}
      volume={(f) =>
        interpolate(
          f,
          [0, 12, 45, 150, 540, 600, DURACION_01 - 20, DURACION_01],
          [0, 0.55, 0.3, 0.16, 0.16, 0.32, 0.32, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        )
      }
    />
    <Montaje tomas={TOMAS_01} fundido={12} />
    <Velo />
    <Sequence durationInFrames={s2f(5.5)} name="Titular">
      <Titular
        texto="La [Puerta Santa] ya está abierta"
        tam={88}
        arriba={290}
      />
    </Sequence>
    <Sequence from={s2f(V.segmentos[3].ini + 0.4)} name="CTA">
      <Boton texto="Cuéntanos en comentarios" arriba={980} tam={50} />
    </Sequence>
    <Subtitulos voz={V} arriba={1220} />
  </AbsoluteFill>
);
