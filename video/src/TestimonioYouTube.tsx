import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import "./fuentes";
import { brand, fontFamily, fps } from "./brand/theme";
import { Cartela } from "./componentes/Cartela";
import { Pregunta } from "./componentes/Pregunta";
import { Cierre } from "./escenas/Cierre";
import { Intro } from "./escenas/Intro";
import datos from "./testimonios/grace-armando-yt.json";

/**
 * Testimonio de Grace y Armando para YouTube, en ingles y sin subtitulos.
 *
 * Abre con la cabecera de marca y entra directo con su presentacion,
 * "Hola, I'm Grace". Solo quedan sus respuestas, encadenadas como si fuera
 * un unico relato: las preguntas de la entrevista se han quitado y los
 * murmullos de fondo entre frases se bajan al preparar la voz. El metraje
 * llega cortado, corregido de color y con la voz limpia desde
 * `herramientas/scripts/montar_testimonio.py`.
 *
 * Es un plano fijo, asi que cada corte alterna entre el plano abierto y uno
 * algo mas cerrado: el salto se lee como un cambio de plano y no como un
 * fallo. El bruto es 4K, de modo que el plano cerrado no pierde definicion.
 *
 * Las cartelas van abajo a la izquierda, sobre el cuerpo: en este encuadre
 * las caras ocupan la mitad superior. Solo dos: quienes son y el unico
 * CTA, al final. Las preguntas van abajo a la izquierda, debajo de las
 * cartelas cuando coinciden, sin tapar caras.
 */

const INTRO = Math.round(2.6 * fps);
const CIERRE = 4 * fps;
const s2f = (s: number) => Math.round(s * fps);
const cortes = datos.cortes;
const VIDEO = s2f(datos.duracion);
export const DURACION_TESTIMONIO_YT = INTRO + VIDEO + CIERRE;

/** Fotograma de la pieza en el que empieza el fragmento i. */
const inicio = (i: number) => s2f(cortes[i].desde) + INTRO;
const largo = (i: number) => s2f(cortes[i].hasta) - s2f(cortes[i].desde);

/** El metraje, con el plano cerrado en los cortes impares. */
const Metraje: React.FC<{ desdeSegundo: number }> = ({ desdeSegundo }) => {
  const frame = useCurrentFrame();
  const t = desdeSegundo + frame / fps;
  const i = cortes.findIndex((c) => t >= c.desde && t < c.hasta);
  const cerrado = i % 2 === 1;

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <OffthreadVideo
        src={staticFile("testimonios/grace-armando-yt.mp4")}
        trimBefore={desdeSegundo > 0 ? s2f(desdeSegundo) : undefined}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          scale: cerrado ? 1.16 : 1,
          transformOrigin: "50% 30%",
        }}
      />
    </AbsoluteFill>
  );
};

const Rotulo: React.FC<{
  i: number;
  principal: string;
  secundaria: string;
  /** Segundos desde el arranque del fragmento. */
  retardo?: number;
}> = ({ i, principal, secundaria, retardo = 0.6 }) => (
  <Sequence
    from={inicio(i) + s2f(retardo)}
    durationInFrames={largo(i) - s2f(retardo)}
    name={`Cartela · ${principal}`}
  >
    <Cartela
      principal={principal}
      secundaria={secundaria}
      top={478}
      escala={0.5}
    />
  </Sequence>
);

/**
 * Las preguntas de la entrevista, por fragmentos (primero y ultimo,
 * inclusive). Su voz no esta en el montaje: se leen en la esquina.
 */
const PREGUNTAS: [number, number, string][] = [
  [1, 1, "Who did you travel with?"],
  [2, 2, "How was the luggage transfer?"],
  [3, 4, "And the hotels?"],
  [5, 5, "Why an organised Camino?"],
  [6, 6, "What was your favourite moment?"],
  [7, 7, "Any difficult moments?"],
  [8, 8, "How did it feel to arrive?"],
  [9, 10, "Why are you doing the Camino?"],
  [12, 12, "Your Camino in one word?"],
  [13, 13, "Would you do it again?"],
];

export const TestimonioYouTube: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: brand.forest, fontFamily }}>
      <Sequence durationInFrames={INTRO} name="Cabecera">
        <Intro duracion={INTRO} ancho={460} plano />
      </Sequence>

      <Sequence from={INTRO} durationInFrames={VIDEO} name="Entrevista">
        <Metraje desdeSegundo={0} />
      </Sequence>

      {PREGUNTAS.map(([a, b, texto]) => {
        const desde = inicio(a) + s2f(0.3);
        const duracion = inicio(b) + largo(b) - desde;
        return (
          <Sequence
            key={texto}
            from={desde}
            durationInFrames={duracion}
            name={`Pregunta · ${texto}`}
          >
            <Pregunta
              texto={texto}
              duracion={duracion}
              bottom={36}
              left={40}
              escala={0.55}
            />
          </Sequence>
        );
      })}

      <Rotulo
        i={0}
        principal="Grace & Armando"
        secundaria="From Australia · Portuguese Way"
      />
      <Rotulo
        i={cortes.length - 1}
        principal="Plan your Camino"
        secundaria="Link in the description"
        retardo={1.2}
      />

      <Sequence from={INTRO + VIDEO} durationInFrames={CIERRE} name="Cierre">
        <Cierre duracion={CIERRE} ancho={460} plano />
      </Sequence>
    </AbsoluteFill>
  );
};
