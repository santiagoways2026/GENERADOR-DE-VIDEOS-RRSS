import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import "../fuentes";
import { c, cajaPlana, curva, fuente, seguro, sombraTexto } from "./marca";
import { agrupar, type Trozo, trocear, type Voz } from "./subtitulos";

type Tema = "foto" | "claro";

/** Una frase con sus palabras clave en caja verde. */
export const Frase: React.FC<{
  partes: { texto: string; clave: boolean }[];
  tema?: Tema;
}> = ({ partes, tema = "foto" }) => (
  <>
    {agrupar(partes).map((p, i) => {
      // Espacio delante salvo al principio o ante un signo de puntuación.
      const hueco = i > 0 && !/^[,.;:?!]/.test(p.texto) ? " " : "";
      return (
        <React.Fragment key={i}>
          {hueco}
          {p.clave ? (
            <span
              style={{ ...cajaPlana, margin: "0 0.04em", textShadow: "none" }}
            >
              {p.texto}
            </span>
          ) : (
            <span style={{ color: tema === "foto" ? c.blanco : c.grafito }}>
              {p.texto}
            </span>
          )}
        </React.Fragment>
      );
    })}
  </>
);

/** «La [Puerta Santa] ya está abierta» → partes con la clave marcada. */
export const marcar = (texto: string) =>
  texto
    .split(/(\[[^\]]+\])/)
    .filter(Boolean)
    .map((t) =>
      t.startsWith("[")
        ? { texto: t.slice(1, -1), clave: true }
        : { texto: t.trim(), clave: false },
    )
    .filter((p) => p.texto.length > 0);

/** Entrada de marca: fundido y desplazamiento corto, sin rebote. */
export const useEntrada = (desde = 0, dura = 7, desp = 16) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [desde, desde + dura], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...curva),
  });
  return { opacity: t, transform: `translateY(${(1 - t) * desp}px)` };
};

/**
 * Subtítulos quemados, de 2 a 5 palabras, sincronizados con la voz.
 * Van en la franja libre por encima de la interfaz de la app.
 */
export const Subtitulos: React.FC<{
  voz: Voz;
  tema?: Tema;
  /** Borde superior de la franja de subtítulos. */
  arriba?: number;
  tam?: number;
  /** Segmentos que no llevan subtítulo (por ejemplo, si ya hay un rótulo igual). */
  ocultar?: number[];
}> = ({ voz, tema = "foto", arriba = 1190, tam = 64, ocultar = [] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const trozos = React.useMemo(() => trocear(voz), [voz]);
  const actual: Trozo | undefined = trozos.find(
    (tr) => t >= tr.ini && t < tr.fin,
  );
  if (!actual || ocultar.includes(actual.seg)) return null;
  const desde = Math.round(actual.ini * fps);
  return (
    <div
      style={{
        position: "absolute",
        left: seguro.izquierda,
        right: seguro.derecha,
        top: arriba,
        height: 1920 - seguro.abajo - arriba,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
      }}
    >
      <Bloque desde={desde} tema={tema} tam={tam} partes={actual.partes} />
    </div>
  );
};

const Bloque: React.FC<{
  desde: number;
  tema: Tema;
  tam: number;
  partes: Trozo["partes"];
}> = ({ desde, tema, tam, partes }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        fontFamily: fuente,
        fontWeight: 800,
        fontSize: tam,
        lineHeight: 1.3,
        textAlign: "center",
        textShadow: tema === "foto" ? sombraTexto : "none",
        opacity: interpolate(frame, [desde, desde + 4], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        transform: `translateY(${interpolate(
          frame,
          [desde, desde + 6],
          [12, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(...curva),
          },
        )}px)`,
      }}
    >
      <Frase partes={partes} tema={tema} />
    </div>
  );
};

/** Titular grande en la mitad superior, en minúscula de frase. */
export const Titular: React.FC<{
  texto: string;
  tema?: Tema;
  tam?: number;
  arriba?: number;
  desde?: number;
  alinear?: "center" | "left";
}> = ({
  texto,
  tema = "foto",
  tam = 84,
  arriba = 300,
  desde = 0,
  alinear = "center",
}) => {
  const e = useEntrada(desde, 8, 20);
  return (
    <div
      style={{
        position: "absolute",
        left: seguro.izquierda,
        right: seguro.derecha,
        top: arriba,
        textAlign: alinear,
        fontFamily: fuente,
        fontWeight: 800,
        fontSize: tam,
        lineHeight: 1.18,
        letterSpacing: "-0.01em",
        textShadow: tema === "foto" ? sombraTexto : "none",
        ...e,
      }}
    >
      <Frase partes={marcar(texto)} tema={tema} />
    </div>
  );
};
