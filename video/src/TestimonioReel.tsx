import { AbsoluteFill, Interactive, OffthreadVideo, Sequence, staticFile } from "remotion";
import "./fuentes";
import { brand, fontFamily, fps, margin } from "./brand/theme";
import { Cartela } from "./componentes/Cartela";
import { Logo } from "./componentes/Logo";
import { Subtitulos } from "./componentes/Subtitulos";
import { Cierre } from "./escenas/Cierre";
import datos from "./testimonios/grace-armando-reel.json";

/**
 * Reel del testimonio de Grace y Armando, Camino Portugués desde Tui.
 *
 * Imagen de la cámara vertical y voz del horizontal, que tiene los micros de
 * solapa limpios; las dos cámaras se sincronizan midiendo el audio. El
 * metraje ya viene cortado, corregido de color y con la voz normalizada
 * desde `herramientas/scripts/montar_testimonio.py`.
 *
 * El titular vive arriba, sobre la fachada, y los subtítulos a la altura del
 * pecho: ninguno de los dos tapa una cara.
 */

const CIERRE = 3 * fps;
const VIDEO = Math.round(datos.duracion * fps);
export const DURACION_TESTIMONIO_REEL = VIDEO + CIERRE;

export const TestimonioReel: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: brand.forest, fontFamily }}>
      <Sequence durationInFrames={VIDEO} name="Testimonio">
        <OffthreadVideo
          src={staticFile("testimonios/grace-armando-reel.mp4")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />

        {/* Velo bosque arriba para que el logo blanco se lea sobre el cielo. */}
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(180deg, rgba(14,44,31,0.55) 0%, rgba(14,44,31,0.18) 26%, rgba(14,44,31,0) 40%)",
          }}
        />
        {/* Y abajo, para que los subtitulos no dependan del fondo. */}
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(0deg, rgba(14,44,31,0.45) 0%, rgba(14,44,31,0.12) 34%, rgba(14,44,31,0) 48%)",
          }}
        />

        <Interactive.Div
          name="Logo"
          style={{ position: "absolute", top: 110, left: margin }}
        >
          <Logo variante="blanco" ancho={300} />
        </Interactive.Div>

        <Cartela
          principal="How was your Camino?"
          secundaria="Grace & Armando · from Tui"
          desde={10}
          top={210}
          escala={0.86}
        />

        <Subtitulos
          palabras={datos.palabras}
          cortes={datos.cortes.map((c) => c.desde)}
          porFrase={3}
          top={1250}
          tamano={66}
        />
      </Sequence>

      <Sequence from={VIDEO} durationInFrames={CIERRE} name="Cierre">
        <Cierre duracion={CIERRE} />
      </Sequence>
    </AbsoluteFill>
  );
};
