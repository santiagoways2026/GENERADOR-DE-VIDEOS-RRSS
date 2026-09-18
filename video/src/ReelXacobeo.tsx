import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import "./fuentes";
import { brand, fontFamily, margin, space } from "./brand/theme";
import { Clip } from "./componentes/Clip";
import { Logo } from "./componentes/Logo";
import { Pildora } from "./componentes/Pildora";
import { Cartela } from "./componentes/Cartela";
import { Calendario } from "./graficos/Calendario";
import { Candado } from "./graficos/Candado";
import { LineaTiempo } from "./graficos/LineaTiempo";

/**
 * Reel del Xacobeo 2027.
 *
 * Los cortes no estan puestos a ojo: caen en los arranques de frase de la
 * locucion, detectados midiendo los silencios del audio. Por eso cada
 * bloque empieza justo cuando la voz empieza a decir lo que el rotulo pone.
 *
 * El texto vive siempre en la mitad superior y los graficos en la inferior,
 * para que no se pisen y para que la interfaz de la aplicacion no los tape.
 */

/** Arranques de frase de la locucion, en segundos. */
const B = [0, 4.36, 12.74, 17.75, 26.15, 33.39, 38.54, 44.12];
const f = (segundos: number) => Math.round(segundos * 30);
/** Duracion de un bloque, en fotogramas. */
const dur = (i: number) => f(B[i + 1]) - f(B[i]);

/** Zona inferior donde viven los graficos, despejada de rotulos. */
const Inferior: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{
      justifyContent: "flex-end",
      alignItems: "center",
      padding: margin,
      paddingBottom: 320,
    }}
  >
    {children}
  </AbsoluteFill>
);

export const ReelXacobeo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: brand.forest, fontFamily }}>
      <Audio src={staticFile("locucion.mp3")} />

      {/* La marca acompana toda la pieza, no solo el cierre. */}
      <Sequence durationInFrames={f(B[6])} name="Marca">
        <Logo
          variante="blanco"
          ancho={240}
          style={{ position: "absolute", left: margin, bottom: margin, opacity: 0.92 }}
        />
      </Sequence>

      {/* 1 · Si alguna vez has pensado en hacer el Camino */}
      <Sequence durationInFrames={dur(0)} name="1 · Apertura">
        <Sequence durationInFrames={56} name="Llegada a la plaza">
          <Clip src="brutos/01-obradoiro-llegada.mp4" duracion={56} overlay={0.32} />
        </Sequence>
        <Sequence from={56} durationInFrames={dur(0) - 56} name="Catedral">
          <Clip src="brutos/02-catedral-frontal.mp4" duracion={dur(0) - 56} overlay={0.32} />
        </Sequence>
        <Cartela eyebrow="Xacobeo" principal="2027" secundaria="Es Año Santo" desde={8} />
      </Sequence>

      {/* 2 · El 25 de julio cae en domingo */}
      <Sequence from={f(B[1])} durationInFrames={dur(1)} name="2 · Calendario">
        <Sequence durationInFrames={132} name="Catedral torres">
          <Clip src="brutos/03-catedral-torres.mp4" duracion={132} overlay={0.36} />
        </Sequence>
        <Sequence from={132} durationInFrames={dur(1) - 132} name="Catedral frontal">
          <Clip src="brutos/02-catedral-frontal.mp4" duracion={dur(1) - 132} overlay={0.36} />
        </Sequence>
        <Cartela principal="25 de julio" secundaria="cae en domingo" desde={6} />
        <Inferior>
          <Calendario desde={30} />
        </Inferior>
      </Sequence>

      {/* 3 · El anterior fue en 2021, el siguiente en 2032 */}
      <Sequence from={f(B[2])} durationInFrames={dur(2)} name="3 · Línea de tiempo">
        <Sequence durationInFrames={85} name="Campo">
          <Clip src="brutos/04-contraluz.mp4" duracion={85} overlay={0.42} />
        </Sequence>
        <Sequence from={85} durationInFrames={dur(2) - 85} name="Credencial">
          <Clip src="brutos/14-credencial.mp4" duracion={dur(2) - 85} overlay={0.42} />
        </Sequence>
        <Cartela principal="El siguiente" secundaria="en 2032" desde={6} />
        <Inferior>
          <LineaTiempo desde={16} />
        </Inferior>
      </Sequence>

      {/* 4 · Un Año Santo se nota */}
      <Sequence from={f(B[3])} durationInFrames={dur(3)} name="4 · Ambiente">
        <Sequence durationInFrames={90} name="Brazos en alto">
          <Clip src="brutos/05-brazos-alto.mp4" duracion={90} overlay={0.3} />
        </Sequence>
        <Sequence from={90} durationInFrames={105} name="Brindis">
          <Clip src="brutos/06-brindis.mp4" duracion={105} overlay={0.3} />
        </Sequence>
        <Sequence from={195} durationInFrames={dur(3) - 195} name="Compostela">
          <Clip src="brutos/07-compostela.mp4" duracion={dur(3) - 195} overlay={0.3} />
        </Sequence>
        <Cartela principal="Así se vive" secundaria="un Año Santo" desde={6} />
      </Sequence>

      {/* 5 · Quien reserva ahora elige */}
      <Sequence from={f(B[4])} durationInFrames={dur(4)} name="5 · Reservar">
        <Sequence durationInFrames={85} name="Habitación">
          <Clip src="brutos/08-habitacion.mp4" duracion={85} overlay={0.34} />
        </Sequence>
        <Sequence from={85} durationInFrames={70} name="Terraza">
          <Clip src="brutos/09-terraza.mp4" duracion={70} overlay={0.34} />
        </Sequence>
        <Sequence from={155} durationInFrames={dur(4) - 155} name="Vieiras">
          <Clip src="brutos/10-vieiras.mp4" duracion={dur(4) - 155} overlay={0.34} />
        </Sequence>
        <Cartela principal="Reserva ahora" secundaria="y eliges tú" desde={6} />
        <Inferior>
          <Candado desde={60} />
        </Inferior>
      </Sequence>

      {/* 6 · Te lo organizamos todo */}
      <Sequence from={f(B[5])} durationInFrames={dur(5)} name="6 · Servicios">
        <Sequence durationInFrames={90} name="Caminando">
          <Clip src="brutos/11-caminando.mp4" duracion={90} overlay={0.36} />
        </Sequence>
        <Sequence from={90} durationInFrames={dur(5) - 90} name="Flecha">
          <Clip src="brutos/12-flecha.mp4" duracion={dur(5) - 90} overlay={0.36} />
        </Sequence>
        <Cartela principal="Tú solo" secundaria="caminas" desde={6} />
        <Inferior>
          <div style={{ display: "flex", flexDirection: "column", gap: space[3] }}>
            <Pildora etiqueta="1" texto="Equipaje transportado" desde={6} />
            <Pildora etiqueta="2" texto="Hoteles seleccionados" desde={16} />
            <Pildora etiqueta="3" texto="Asistencia 24 h" desde={26} />
          </div>
        </Inferior>
      </Sequence>

      {/* 7 · Escríbenos */}
      <Sequence from={f(B[6])} durationInFrames={dur(6)} name="7 · Cierre">
        <Clip src="brutos/13-cierre-cielo.mp4" duracion={dur(6)} overlay={0.4} />
        <Cartela principal="Tu Camino de 2027" secundaria="empieza hoy" tono="lima" desde={6} />
        <AbsoluteFill
          style={{
            justifyContent: "flex-end",
            alignItems: "center",
            padding: margin,
            paddingBottom: 300,
            gap: space[6],
          }}
        >
          <Logo variante="blanco" ancho={520} />
          <Pildora etiqueta="👇" texto="Link en bio" desde={24} />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export const DURACION_REEL = f(B[B.length - 1]);
