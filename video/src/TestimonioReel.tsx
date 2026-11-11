import { AbsoluteFill, OffthreadVideo, Sequence, staticFile } from "remotion";
import "./fuentes";
import { brand, fontFamily, fps } from "./brand/theme";
import { Gancho } from "./componentes/Gancho";
import { Subtitulos } from "./componentes/Subtitulos";
import { TarjetaDato } from "./componentes/TarjetaDato";
import { Cierre } from "./escenas/Cierre";
import datos from "./testimonios/grace-armando-reel.json";

/**
 * Reel del testimonio de Grace y Armando, Camino Portugues desde Tui.
 *
 * Sigue el lenguaje de los reels ya publicados de la marca: titular de
 * arranque con la palabra clave en placa olivo, tarjetas de dato arriba,
 * subtitulos en caja normal con la palabra activa en olivo y cierre en
 * olivo liso. Sin logo encima del metraje: la marca va en el cierre.
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
        <Gancho lineas={["How was your"]} destacado="Camino?" duracion={gancho} />
      </Sequence>

      {/* 2 · La ruta. */}
      <Sequence from={desde(1)} durationInFrames={largo(1)} name="Dato · ruta">
        <TarjetaDato antetitulo="Portuguese Way" dato="From Tui to Santiago" />
      </Sequence>

      {/* 4 · El equipaje. */}
      <Sequence from={desde(3)} durationInFrames={largo(3)} name="Dato · equipaje">
        <TarjetaDato
          antetitulo="Luggage transfer"
          dato="Hotel to hotel, every stage"
          variante="olivo"
        />
      </Sequence>

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
