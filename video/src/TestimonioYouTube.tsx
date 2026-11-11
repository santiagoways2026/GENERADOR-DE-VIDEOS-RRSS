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
import { Cierre } from "./escenas/Cierre";
import { Intro } from "./escenas/Intro";
import datos from "./testimonios/grace-armando-yt.json";

/**
 * Testimonio de Grace y Armando para YouTube, en ingles y sin subtitulos.
 *
 * Arranca en frio con su mejor frase, como pide el brief de YouTube: una
 * vivencia, sin saludo ni logo. Despues entra la cabecera de marca y el
 * resto de la entrevista. El metraje ya viene cortado, corregido de color y
 * con la voz limpia desde `herramientas/scripts/montar_testimonio.py`.
 *
 * Es un plano fijo, asi que cada corte alterna entre el plano abierto y uno
 * algo mas cerrado: el salto se lee como un cambio de plano y no como un
 * fallo. El bruto es 4K, de modo que el plano cerrado no pierde definicion.
 *
 * Las cartelas van abajo a la izquierda, sobre el cuerpo: en este encuadre
 * las caras ocupan la mitad superior. Solo tres: quienes son, que ruta
 * hicieron y el unico CTA, al final.
 */

const INTRO = Math.round(2.6 * fps);
const CIERRE = 4 * fps;
const s2f = (s: number) => Math.round(s * fps);
const cortes = datos.cortes;
/** El arranque en frio es el primer fragmento. */
const FRIO = s2f(cortes[0].hasta);
const RESTO = s2f(datos.duracion) - FRIO;
export const DURACION_TESTIMONIO_YT = FRIO + INTRO + RESTO + CIERRE;

/** Fotograma de la pieza en el que empieza el fragmento i. */
const inicio = (i: number) =>
  i === 0 ? 0 : s2f(cortes[i].desde) + INTRO;
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
    <Cartela principal={principal} secundaria={secundaria} top={478} escala={0.5} />
  </Sequence>
);

export const TestimonioYouTube: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: brand.forest, fontFamily }}>
      <Sequence durationInFrames={FRIO} name="Arranque en frío">
        <Metraje desdeSegundo={0} />
      </Sequence>

      <Sequence from={FRIO} durationInFrames={INTRO} name="Cabecera">
        <Intro duracion={INTRO} ancho={460} />
      </Sequence>

      <Sequence from={FRIO + INTRO} durationInFrames={RESTO} name="Entrevista">
        <Metraje desdeSegundo={cortes[0].hasta} />
      </Sequence>

      <Rotulo i={1} principal="Grace & Armando" secundaria="From Australia" />
      <Rotulo i={2} principal="Portuguese Way" secundaria="From Tui to Santiago" />
      <Rotulo
        i={cortes.length - 1}
        principal="Plan your Camino"
        secundaria="Link in the description"
        retardo={1.2}
      />

      <Sequence from={FRIO + INTRO + RESTO} durationInFrames={CIERRE} name="Cierre">
        <Cierre duracion={CIERRE} ancho={460} />
      </Sequence>
    </AbsoluteFill>
  );
};
