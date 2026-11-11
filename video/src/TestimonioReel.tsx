import { AbsoluteFill, OffthreadVideo, Sequence, staticFile } from "remotion";
import "./fuentes";
import { brand, fontFamily, fps, zonaSegura } from "./brand/theme";
import { Gancho } from "./componentes/Gancho";
import { Subtitulos } from "./componentes/Subtitulos";
import { Pregunta } from "./componentes/Pregunta";
import { Cierre } from "./escenas/Cierre";
import datos from "./testimonios/grace-armando-reel.json";

/**
 * Reel del testimonio de Grace y Armando, Camino Portugues desde Tui.
 *
 * Sigue el lenguaje de los reels ya publicados de la marca: titular de
 * arranque con la palabra clave en placa olivo, la pregunta de cada
 * respuesta en una tarjeta arriba a la derecha,
 * subtitulos en caja normal con la palabra activa en olivo y cierre en
 * olivo liso. Sin logo encima del metraje: la marca va en el cierre. Todo
 * el texto queda dentro de la zona segura de TikTok e Instagram.
 *
 * Imagen de la camara vertical y voz del horizontal, que tiene los micros
 * de solapa limpios; las dos camaras se sincronizan midiendo el audio. El
 * metraje llega cortado, corregido de color y con la voz limpia desde
 * `herramientas/scripts/montar_testimonio.py`.
 */

const CIERRE = 3 * fps;
const VIDEO = Math.round(datos.duracion * fps);
export const DURACION_TESTIMONIO_REEL = VIDEO + CIERRE;

const s2f = (s: number) => Math.round(s * fps);
const corte = (i: number) => datos.cortes[i];
const desde = (i: number, retardo = 0.4) => s2f(corte(i).desde + retardo);
const largo = (i: number, retardo = 0.4) =>
  s2f(corte(i).hasta) - s2f(corte(i).desde + retardo);

/** Pregunta de cada fragmento. El primero ya lleva el titular de arranque. */
const PREGUNTAS: [number, string][] = [
  [1, "Who did you travel with?"],
  [2, "How was the luggage transfer?"],
  [3, "What was your favourite moment?"],
  [4, "How did it feel to arrive?"],
  [6, "Your Camino in one word?"],
  [7, "Would you do it again?"],
];

export const TestimonioReel: React.FC = () => {
  const gancho = Math.min(s2f(corte(0).hasta), s2f(4.6));

  return (
    <AbsoluteFill style={{ backgroundColor: brand.forest, fontFamily }}>
      <Sequence durationInFrames={VIDEO} name="Testimonio">
        <OffthreadVideo
          src={staticFile("testimonios/grace-armando-reel.mp4")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Sequence>

      {/* 1 · Hola, I'm Grace: el titular de arranque. */}
      <Sequence durationInFrames={gancho} name="Gancho">
        <Gancho
          lineas={["How was your"]}
          destacado="Camino?"
          duracion={gancho}
        />
      </Sequence>

      {/* Las preguntas de la entrevista: su voz no esta en el montaje. */}
      {PREGUNTAS.map(([i, texto]) => (
        <Sequence
          key={texto}
          from={desde(i, 0.3)}
          durationInFrames={largo(i, 0.3)}
          name={`Pregunta · ${texto}`}
        >
          <Pregunta
            texto={texto}
            duracion={largo(i, 0.3)}
            top={zonaSegura.top + 24}
            right={zonaSegura.right}
            ancho={620}
          />
        </Sequence>
      ))}

      <Sequence durationInFrames={VIDEO} name="Subtítulos">
        <Subtitulos
          palabras={datos.palabras}
          cortes={datos.cortes.map((c) => c.desde)}
        />
      </Sequence>

      <Sequence from={VIDEO} durationInFrames={CIERRE} name="Cierre">
        <Cierre duracion={CIERRE} plano />
      </Sequence>
    </AbsoluteFill>
  );
};
