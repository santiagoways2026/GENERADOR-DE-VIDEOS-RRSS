import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, staticFile } from "remotion";
import { c, cajaGrafico, fuente } from "./marca";
import { encuadrar, Mapa } from "./Mapa";
import { Velo } from "./Montaje";
import { Titular } from "./Texto";

/**
 * Miniaturas 1080x1920 (obligatorias en Shorts): el mejor fotograma, el
 * titular en minúscula de frase y una o dos palabras en caja verde.
 */
const Fondo: React.FC<{ src: string; desde?: number; encuadre?: string }> = ({
  src,
  desde = 0,
  encuadre = "50% 50%",
}) => {
  const estilo: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: encuadre,
  };
  return /\.(jpe?g|png)$/i.test(src) ? (
    <Img src={staticFile(src)} style={estilo} />
  ) : (
    <OffthreadVideo
      src={staticFile(src)}
      trimBefore={Math.round(desde * 30)}
      muted
      style={estilo}
    />
  );
};

const Titulo: React.FC<{ texto: string; tema?: "foto" | "claro" }> = ({
  texto,
  tema = "foto",
}) => <Titular texto={texto} tema={tema} tam={112} arriba={330} desde={-30} />;

export const Mini01: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: fuente }}>
    <Fondo src="enero/clips/vertical-v24.mp4" desde={2} />
    <Velo fuerza={1.2} />
    <Titulo texto="La [Puerta Santa] ya está abierta" />
  </AbsoluteFill>
);

export const Mini02: React.FC = () => (
  <AbsoluteFill
    style={{
      fontFamily: fuente,
      backgroundImage: `linear-gradient(180deg, ${c.blanco} 0%, ${c.niebla} 100%)`,
    }}
  >
    <Titulo texto="4 curiosidades del [Año Santo]" tema="claro" />
    <div
      style={{
        position: "absolute",
        top: 860,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          ...cajaGrafico,
          fontSize: 260,
          fontWeight: 800,
          padding: "0 60px",
          lineHeight: 1.15,
        }}
      >
        2027
      </div>
    </div>
  </AbsoluteFill>
);

export const Mini03: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: fuente }}>
    <Mapa
      camara={(() => {
        // Se baja el mapa para que el titular no pise el número de Ferrol, y se
        // desplaza a la izquierda para dejar libre la franja derecha.
        const cam = encuadrar(
          ["sarria", "ferrol", "finisterre", "lugo"],
          780,
          720,
        );
        return {
          ...cam,
          x: cam.x + 40 / cam.escala,
          y: cam.y - 230 / cam.escala,
        };
      })()}
      rutas={["sarria", "ferrol", "finisterre", "lugo"].map((id, i) => ({
        id,
        progreso: 1,
        numero: i + 1,
      }))}
    />
    <Titulo texto="4 Caminos en [5 días]" />
  </AbsoluteFill>
);

export const Mini04: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: fuente }}>
    <Fondo src="enero/clips/vertical-v115.mp4" desde={3} />
    <Velo fuerza={1.2} />
    <Titulo texto="Las 6 etapas desde [Ourense]" />
  </AbsoluteFill>
);

export const Mini05: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: fuente }}>
    <Fondo src="enero/fotos/casa-glicinia.jpg" encuadre="22% 50%" />
    <Velo fuerza={1.2} />
    <Titulo texto="Semana Santa en [Año Santo]" />
  </AbsoluteFill>
);
