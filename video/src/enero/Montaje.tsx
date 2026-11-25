import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { curva, s2f } from "./marca";

export type Toma = {
  /** Ruta dentro de public/, por ejemplo «enero/clips/v12.mp4». */
  src: string;
  /** Segundo del montaje en que entra y en que sale. */
  ini: number;
  fin: number;
  /** Segundo del archivo por el que entra el corte. */
  desde?: number;
  /** Encuadre del recorte: «50% 50%» centra. */
  encuadre?: string;
  /** Zoom lento de principio a fin (fotos: movimiento obligatorio). */
  zoom?: [number, number];
  /** Paneo horizontal en px durante la toma (fotos). */
  paneo?: number;
  /** Volumen del sonido original del clip. */
  volumen?: number;
  /** Velocidad del clip, para alargar una toma corta sin congelarla. */
  velocidad?: number;
};

const esFoto = (src: string) => /\.(jpe?g|png|webp)$/i.test(src);

/** Oscurece arriba y abajo para que se lean el titular y los subtítulos. */
export const Velo: React.FC<{ fuerza?: number }> = ({ fuerza = 1 }) => (
  <AbsoluteFill
    style={{
      backgroundImage: `linear-gradient(to bottom,
        rgba(46,46,45,${0.5 * fuerza}) 0%,
        rgba(46,46,45,${0.12 * fuerza}) 30%,
        rgba(46,46,45,0) 45%,
        rgba(46,46,45,${0.1 * fuerza}) 58%,
        rgba(46,46,45,${0.55 * fuerza}) 82%,
        rgba(46,46,45,${0.35 * fuerza}) 100%)`,
    }}
  />
);

const Capa: React.FC<{
  toma: Toma;
  dura: number;
  fundido: number;
  primera: boolean;
}> = ({ toma, dura, fundido, primera }) => {
  const f = useCurrentFrame();
  const [z0, z1] = toma.zoom ?? (esFoto(toma.src) ? [1.04, 1.14] : [1.0, 1.06]);
  const escala = interpolate(f, [0, dura], [z0, z1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.33, 0, 0.67, 1),
  });
  const x = interpolate(f, [0, dura], [0, toma.paneo ?? 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const estilo: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: toma.encuadre ?? "50% 50%",
    transform: `translateX(${x}px) scale(${escala})`,
  };
  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        opacity:
          primera || fundido === 0
            ? 1
            : interpolate(f, [0, fundido], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(...curva),
              }),
      }}
    >
      {esFoto(toma.src) ? (
        <Img src={staticFile(toma.src)} style={estilo} />
      ) : (
        <OffthreadVideo
          src={staticFile(toma.src)}
          trimBefore={toma.desde ? Math.round(toma.desde * 30) : undefined}
          playbackRate={toma.velocidad ?? 1}
          volume={toma.volumen ?? 0}
          style={estilo}
        />
      )}
    </AbsoluteFill>
  );
};

/**
 * Encadena tomas en el tiempo del montaje. Con `fundido` cada toma entra
 * fundiéndose sobre la anterior, que se alarga lo justo para que no quede
 * hueco; sin él, corte seco.
 */
export const Montaje: React.FC<{ tomas: Toma[]; fundido?: number }> = ({
  tomas,
  fundido = 0,
}) => (
  <>
    {tomas.map((t, i) => {
      const desde = s2f(t.ini);
      const hasta = s2f(t.fin) + (i < tomas.length - 1 ? fundido : 0);
      return (
        <Sequence
          key={`${t.src}-${i}`}
          from={desde}
          durationInFrames={hasta - desde}
          name={t.src}
        >
          <Capa
            toma={t}
            dura={hasta - desde}
            fundido={fundido}
            primera={i === 0}
          />
        </Sequence>
      );
    })}
  </>
);
