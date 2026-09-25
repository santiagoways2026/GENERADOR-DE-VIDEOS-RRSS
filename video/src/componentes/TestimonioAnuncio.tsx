import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from "remotion";
import "../fuentes";
import { brand, fontFamily } from "../brand/theme";
import { Clip } from "./Clip";
import { Plano, Planos } from "./Planos";
import { Titular } from "./Titular";
import { Cierre } from "../escenas/Cierre";

/**
 * Reel de testimonio para anuncios de Meta.
 *
 * El testimonio va entero y con su audio. Encima se tapan tramos con
 * metraje de recurso (maletas, hoteles, peregrinos) sin cortar la voz, y
 * los titulares de mensaje directo caen sobre el plano que ilustran.
 * Termina en el cierre de marca.
 *
 * Todos los tiempos van en segundos del testimonio.
 */

export type Recurso = {
  nombre: string;
  desde: number;
  hasta: number;
  lista: Plano[];
  overlay?: number;
};

export type TitularEnPantalla = {
  desde: number;
  hasta: number;
  gancho: string;
  destacado: string;
  destacadoArriba?: boolean;
};

export type ConfigTestimonio = {
  /** Archivo en public, ya sin marca de agua y con el audio fundido. */
  src: string;
  /** Segundo en que termina el testimonio. */
  fin: number;
  cierre: number;
  recursos: Recurso[];
  titulares: TitularEnPantalla[];
};

const f = (s: number) => Math.round(s * 30);

export const duracionTestimonio = (c: ConfigTestimonio) =>
  f(c.fin) + f(c.cierre);

/** Deja salir el titular con un fundido corto en lugar de cortarlo en seco. */
const Salida: React.FC<{ duracion: number; children: React.ReactNode }> = ({
  duracion,
  children,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        opacity: interpolate(frame, [duracion - 9, duracion], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const TestimonioAnuncio: React.FC<{ config: ConfigTestimonio }> = ({
  config,
}) => {
  const { src, fin, cierre, recursos, titulares } = config;

  return (
    <AbsoluteFill style={{ backgroundColor: brand.forest, fontFamily }}>
      <Sequence durationInFrames={f(fin)} name="Testimonio">
        <Clip src={src} duracion={f(fin)} overlay={0.1} zoom={1.03} />
      </Sequence>

      {/* Los recursos van sin sonido: se sigue oyendo el testimonio. */}
      {recursos.map((r) => (
        <Sequence
          key={r.nombre}
          from={f(r.desde)}
          durationInFrames={f(r.hasta) - f(r.desde)}
          name={r.nombre}
        >
          <Planos
            total={f(r.hasta) - f(r.desde)}
            overlay={r.overlay ?? 0.12}
            lista={r.lista}
          />
        </Sequence>
      ))}

      {titulares.map((c) => (
        <Sequence
          key={c.destacado}
          from={f(c.desde)}
          durationInFrames={f(c.hasta) - f(c.desde)}
          name={c.destacado}
        >
          <Salida duracion={f(c.hasta) - f(c.desde)}>
            <Titular
              gancho={c.gancho}
              destacado={c.destacado}
              destacadoArriba={c.destacadoArriba}
            />
          </Salida>
        </Sequence>
      ))}

      <Sequence from={f(fin)} durationInFrames={f(cierre)} name="Cierre">
        <Cierre duracion={f(cierre)} />
      </Sequence>
    </AbsoluteFill>
  );
};
