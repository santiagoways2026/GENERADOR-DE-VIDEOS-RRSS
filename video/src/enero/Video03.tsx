import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Audio } from "@remotion/media";
import voz from "../../public/enero/voz/03.json";
import { curva, fuente, s2f } from "./marca";
import {
  Atribucion,
  type Camara,
  encuadrar,
  Mapa,
  mezclar,
  mundo,
} from "./Mapa";
import { Montaje, type Toma, Velo } from "./Montaje";
import { Tarjeta } from "./Tarjeta";
import { Subtitulos, Titular } from "./Texto";
import type { Voz } from "./subtitulos";

/**
 * Vídeo 3 · 4 Caminos para hacer en 5 días.
 * Cada ruta: el mapa la dibuja y luego entra un paisaje. Kilómetros y días
 * comprobados en santiagoways.com (noviembre de 2026).
 */
const V = voz as Voz;
const S = V.segmentos.map((s) => s.ini);
export const DURACION_03 = s2f(V.duracion + 1.4);

const RUTAS = [
  { id: "sarria", titulo: "El Francés desde Sarria", dato: "5 días · 111 km" },
  { id: "ferrol", titulo: "El Inglés desde Ferrol", dato: "5 días · 126 km" },
  {
    id: "finisterre",
    titulo: "De Santiago a Finisterre",
    dato: "4 días · 90 km",
  },
  { id: "lugo", titulo: "El Primitivo desde Lugo", dato: "5 días · 111 km" },
];

/**
 * Paisaje de cada ruta, del banco de vídeo. En el banco no hay planos de
 * Ferrol ni de la costa de Finisterre: esas dos rutas se quedan en el mapa,
 * que se acerca a las rías o al cabo, donde el satélite ya enseña el mar.
 */
export const PAISAJES_03: Toma[][] = [
  [
    {
      src: "enero/clips/sarria-216.mp4",
      ini: 0,
      fin: 2.0,
      encuadre: "56% 50%",
      volumen: 0.12,
    },
    { src: "enero/clips/vertical-v144.mp4", ini: 0, fin: 2.2, volumen: 0.12 },
  ],
  [],
  [],
  [
    { src: "enero/clips/vertical-v58.mp4", ini: 0, fin: 4.6, volumen: 0.12 },
    { src: "enero/clips/vertical-v182.mp4", ini: 0, fin: 3.84, volumen: 0.12 },
  ],
];

/** Punto al que se acerca la cámara en las rutas sin paisaje. */
const ACERCAR: Record<string, [number, number]> = {
  ferrol: [-8.2, 43.45],
  finisterre: [-9.24, 42.92],
};

const TODAS = RUTAS.map((r) => r.id);
const GENERAL: Camara = encuadrar(TODAS, 900, 760);
const ease = Easing.bezier(...curva);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Parte de cada bloque de ruta que ocupa el mapa; el resto es paisaje. */
const PARTE_MAPA = 0.56;

const Gancho: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <Mapa
        camara={mezclar(
          { ...GENERAL, escala: GENERAL.escala * 0.8 },
          GENERAL,
          interpolate(f, [0, 60], [0, 1], { ...clamp, easing: ease }),
        )}
        rutas={RUTAS.map((r, i) => ({
          id: r.id,
          progreso: interpolate(f, [8 + i * 6, 70 + i * 6], [0, 1], {
            ...clamp,
            easing: ease,
          }),
          numero: i + 1,
        }))}
        santiago={interpolate(f, [0, 10], [0, 1], clamp)}
      />
      <Titular texto="4 Caminos para hacer en [5 días]" tam={82} arriba={290} />
      <Atribucion />
    </>
  );
};

const BloqueRuta: React.FC<{ i: number; dura: number }> = ({ i, dura }) => {
  const f = useCurrentFrame();
  const r = RUTAS[i];
  const paisaje = PAISAJES_03[i];
  const soloMapa = paisaje.length === 0;
  const finMapa = soloMapa
    ? Math.round(dura * 0.62)
    : Math.round(dura * PARTE_MAPA);
  const desde = i === 0 ? GENERAL : encuadrar([RUTAS[i - 1].id], 760, 640);
  const hacia = encuadrar([r.id], 760, 640);
  let cam = mezclar(
    desde,
    hacia,
    interpolate(f, [0, 22], [0, 1], { ...clamp, easing: ease }),
  );
  if (soloMapa) {
    const [x, y] = mundo(...ACERCAR[r.id]);
    const cerca: Camara = { x, y, escala: Math.min(1.6, hacia.escala * 2.6) };
    cam = mezclar(
      cam,
      cerca,
      interpolate(f, [finMapa - 4, dura], [0, 1], { ...clamp, easing: ease }),
    );
  }
  const duraPaisaje = dura - finMapa + 8;
  const sumaTomas = paisaje.reduce((a, t) => a + (t.fin - t.ini), 0);
  let t0 = 0;
  const tomas = paisaje.map((t) => {
    const d = ((t.fin - t.ini) / sumaTomas) * (duraPaisaje / 30);
    const out = { ...t, desde: t.desde ?? 0, ini: t0, fin: t0 + d };
    t0 += d;
    return out;
  });
  return (
    <>
      <Mapa
        camara={cam}
        rutas={[
          ...RUTAS.filter((_, k) => k !== i).map((o) => ({
            id: o.id,
            progreso: 1,
            opacidad: 0.28,
          })),
          {
            id: r.id,
            progreso: interpolate(f, [10, finMapa - 6], [0, 1], {
              ...clamp,
              easing: Easing.bezier(0.45, 0, 0.55, 1),
            }),
            salida: r.id === "finisterre" ? "Santiago" : undefined,
            rotulos: true,
          },
        ]}
      />
      <Atribucion />
      {soloMapa ? null : (
        <Sequence from={finMapa - 8} name="Paisaje">
          <AbsoluteFill
            style={{
              opacity: interpolate(f - (finMapa - 8), [0, 8], [0, 1], clamp),
            }}
          >
            <Montaje tomas={tomas} />
            <Velo />
          </AbsoluteFill>
        </Sequence>
      )}
      <Tarjeta numero={i + 1} titulo={r.titulo} dato={r.dato} desde={4} />
    </>
  );
};

const Cierre: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <Mapa
        camara={mezclar(
          encuadrar(["lugo"], 760, 640),
          GENERAL,
          interpolate(f, [0, 24], [0, 1], { ...clamp, easing: ease }),
        )}
        rutas={RUTAS.map((r, i) => ({ id: r.id, progreso: 1, numero: i + 1 }))}
      />
      <Titular texto="¿Cuál es el [tuyo]?" tam={88} arriba={300} desde={6} />
      <Atribucion />
    </>
  );
};

export const Video03: React.FC = () => {
  const b = [0, ...S.slice(1).map((s) => s2f(s) - 4), DURACION_03];
  return (
    <AbsoluteFill style={{ backgroundColor: "#0d1b2a", fontFamily: fuente }}>
      <Audio src={staticFile("enero/voz/03.mp3")} />
      <Sequence from={b[0]} durationInFrames={b[1] - b[0]} name="Gancho">
        <Gancho />
      </Sequence>
      {RUTAS.map((r, i) => (
        <Sequence
          key={r.id}
          from={b[i + 1]}
          durationInFrames={b[i + 2] - b[i + 1]}
          name={r.titulo}
        >
          <BloqueRuta i={i} dura={b[i + 2] - b[i + 1]} />
        </Sequence>
      ))}
      <Sequence from={b[5]} durationInFrames={b[6] - b[5]} name="Cierre">
        <Cierre />
      </Sequence>
      <Subtitulos voz={V} arriba={1250} />
    </AbsoluteFill>
  );
};
