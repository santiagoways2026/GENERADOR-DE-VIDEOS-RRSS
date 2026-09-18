import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import "./fuentes";
import { brand, fontFamily, margin } from "./brand/theme";
import { Bullets } from "./componentes/Bullets";
import { Cartela } from "./componentes/Cartela";
import { Logo } from "./componentes/Logo";
import { Planos } from "./componentes/Planos";
import { Cierre } from "./escenas/Cierre";
import { Calendario } from "./graficos/Calendario";
import { Candado } from "./graficos/Candado";
import { LineaTiempo } from "./graficos/LineaTiempo";

/**
 * Reel del Xacobeo 2027.
 *
 * Los cortes caen en los arranques de frase de la locucion, localizados
 * midiendo los silencios del audio. Dentro de cada bloque, los planos se
 * reparten segun lo que duran de verdad en el bruto: ninguno pasa de 2,75
 * segundos, asi que estirarlos mete el plano siguiente a mitad de escena.
 *
 * Solo dos bloques llevan cartela superior. En el resto habla el grafico,
 * que ya trae su propio titular, o los bullets.
 */

/** Arranques de frase de la locucion, en segundos. */
const B = [0, 4.36, 12.74, 17.75, 26.15, 33.39, 38.54, 44.12];
const f = (s: number) => Math.round(s * 30);
const dur = (i: number) => f(B[i + 1]) - f(B[i]);

/** Zona inferior de los graficos, despejada de cartelas. */
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

export const ReelXacobeo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: brand.forest, fontFamily }}>
      <Audio src={staticFile("locucion.mp3")} />

      {/* La marca acompana la pieza hasta el cierre, que ya es todo marca. */}
      <Sequence durationInFrames={f(B[6])} name="Marca">
        <Logo
          variante="blanco"
          ancho={240}
          style={{ position: "absolute", left: margin, bottom: margin, opacity: 0.92 }}
        />
      </Sequence>

      {/* 1 · El año que viene es el año */}
      <Sequence durationInFrames={dur(0)} name="1 · Apertura">
        <Planos
          total={dur(0)}
          overlay={0.34}
          lista={[
            { src: "plaza", dura: 1.05 },
            { src: "catedral-a", dura: 1.7 },
            { src: "catedral-b", dura: 1.7 },
          ]}
        />
        <Cartela eyebrow="Xacobeo" principal="2027" secundaria="Es Año Santo" desde={8} />
      </Sequence>

      {/* 2 · El 25 de julio cae en domingo */}
      <Sequence from={f(B[1])} durationInFrames={dur(1)} name="2 · Calendario">
        <Planos
          total={dur(1)}
          overlay={0.42}
          lista={[
            { src: "catedral-torres", dura: 1.7 },
            { src: "iglesia-exterior", dura: 1.35 },
            { src: "interior-velas", dura: 2.1 },
            { src: "portico-sellado", dura: 2.0 },
            { src: "manos-sellando", dura: 1.6 },
          ]}
        />
        <Inferior>
          <Calendario desde={24} />
        </Inferior>
      </Sequence>

      {/* 3 · El siguiente no llega hasta 2032 */}
      <Sequence from={f(B[2])} durationInFrames={dur(2)} name="3 · Línea de tiempo">
        <Planos
          total={dur(2)}
          overlay={0.42}
          lista={[
            { src: "campo-flores", dura: 1.7 },
            { src: "contraluz", dura: 1.45 },
            { src: "camino-abierto", dura: 1.2 },
            { src: "tunel-vegetacion", dura: 0.85 },
          ]}
        />
        <Inferior>
          <LineaTiempo desde={12} />
        </Inferior>
      </Sequence>

      {/* 4 · Un Año Santo se nota */}
      <Sequence from={f(B[3])} durationInFrames={dur(3)} name="4 · Ambiente">
        <Planos
          total={dur(3)}
          overlay={0.3}
          lista={[
            { src: "brazos-alto", dura: 1.0 },
            { src: "brindis", dura: 2.0 },
            { src: "compostela", dura: 1.7 },
            { src: "grupo-mimosas", dura: 1.2 },
            { src: "credencial", dura: 1.05 },
            { src: "pareja-muros", dura: 1.55 },
          ]}
        />
        <Cartela principal="Así se vive" secundaria="un Año Santo" desde={6} />
      </Sequence>

      {/* 5 · Quien reserva ahora elige */}
      <Sequence from={f(B[4])} durationInFrames={dur(4)} name="5 · Reservar">
        <Planos
          total={dur(4)}
          overlay={0.4}
          lista={[
            { src: "habitacion", dura: 2.15 },
            { src: "terraza", dura: 2.2 },
            { src: "vieiras", dura: 1.3 },
            { src: "casa-rural", dura: 1.2 },
          ]}
        />
        <Inferior>
          <Candado desde={20} />
        </Inferior>
      </Sequence>

      {/* 6 · Te lo organizamos todo */}
      <Sequence from={f(B[5])} durationInFrames={dur(5)} name="6 · Servicios">
        <Planos
          total={dur(5)}
          overlay={0.46}
          lista={[
            { src: "piernas", dura: 2.25 },
            { src: "pareja-muros", dura: 1.55 },
            { src: "flecha", dura: 1.2 },
            { src: "mesa-exterior", dura: 1.45 },
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
            desde={4}
            items={["Equipaje transportado", "Hoteles seleccionados", "Asistencia 24 h"]}
          />
        </AbsoluteFill>
      </Sequence>

      {/* 7 · Cierre de marca */}
      <Sequence from={f(B[6])} durationInFrames={dur(6)} name="7 · Cierre">
        <Cierre duracion={dur(6)} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const DURACION_REEL = f(B[B.length - 1]);
