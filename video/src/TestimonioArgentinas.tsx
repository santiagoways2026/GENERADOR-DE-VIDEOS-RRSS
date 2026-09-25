import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from "remotion";
import "./fuentes";
import { brand, fontFamily } from "./brand/theme";
import { Clip } from "./componentes/Clip";
import { Planos } from "./componentes/Planos";
import { Titular } from "./componentes/Titular";
import { Cierre } from "./escenas/Cierre";

/**
 * Reel de testimonio para campañas de Meta Ads: dos peregrinas argentinas.
 *
 * El testimonio va entero y con su audio, ya sin la marca de agua de Clideo
 * (recorte del 5 % que mantiene el 9:16). Se corta en la pausa de voz de
 * 57,4 s para que, con el cierre, la pieza no pase del minuto.
 *
 * Los planos de comida del montaje original se tapan con peregrinos
 * disfrutando del Camino; el audio del testimonio sigue por debajo.
 *
 * Los textos son titulares de mensaje directo: gancho en blanco y el
 * servicio sobre el bloque olivo, a la izquierda y en el tercio inferior,
 * por encima de la franja que tapan el texto y los botones del anuncio.
 */

const f = (s: number) => Math.round(s * 30);

/** Fin del testimonio y duración del cierre, en segundos. */
const FIN = 57.55;
const CIERRE = 2.4;

/** Tramo de los platos en el testimonio, que se sustituye. */
const COMIDA = { desde: 12.5, hasta: 18.33 };

/** Titulares en pantalla, en segundos del testimonio. Cada uno cae sobre
 *  el plano que mejor lo ilustra. */
const TITULARES = [
  // Ellas a cámara, al arrancar.
  { desde: 0.4, hasta: 5.8, gancho: "Camino de Santiago", destacado: "organizado" },
  // Peregrinos caminando, en lugar de la comida.
  { desde: 12.8, hasta: 18.1, gancho: "Transporte de equipajes", destacado: "entre etapas" },
  // Habitaciones.
  { desde: 24.4, hasta: 29.2, gancho: "Hoteles seleccionados", destacado: "y máximo confort" },
  // Cruceiro y capilla, en pleno Camino.
  { desde: 37.0, hasta: 42.8, gancho: "Atención 24/7", destacado: "e información detallada\nde tu ruta" },
];

/** Deja salir la frase con un fundido corto en lugar de cortarla en seco. */
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

export const TestimonioArgentinas: React.FC = () => {
  const comida = f(COMIDA.hasta) - f(COMIDA.desde);

  return (
    <AbsoluteFill style={{ backgroundColor: brand.forest, fontFamily }}>
      <Sequence durationInFrames={f(FIN)} name="Testimonio">
        <Clip
          src="testimonios/argentinas.mp4"
          duracion={f(FIN)}
          overlay={0.1}
          zoom={1.03}
        />
      </Sequence>

      {/* Peregrinos felices en lugar de los platos. Van sin sonido: se sigue
          oyendo el testimonio. */}
      <Sequence from={f(COMIDA.desde)} durationInFrames={comida} name="Peregrinos">
        <Planos
          total={comida}
          overlay={0.12}
          lista={[
            { src: "pareja-sendero", dura: 2.26, encuadre: "72% 50%" },
            { src: "mirador-grupo", dura: 1.26, encuadre: "18% 50%" },
            { src: "grupo-mimosas", dura: 1.2 },
            { src: "brindis", dura: 2.0, encuadre: "62% 50%" },
          ]}
        />
      </Sequence>

      {TITULARES.map((c) => (
        <Sequence
          key={c.gancho}
          from={f(c.desde)}
          durationInFrames={f(c.hasta) - f(c.desde)}
          name={c.destacado.replace("\n", " ")}
        >
          <Salida duracion={f(c.hasta) - f(c.desde)}>
            <Titular gancho={c.gancho} destacado={c.destacado} />
          </Salida>
        </Sequence>
      ))}

      <Sequence from={f(FIN)} durationInFrames={f(CIERRE)} name="Cierre">
        <Cierre duracion={f(CIERRE)} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const DURACION_TESTIMONIO_ARGENTINAS = f(FIN) + f(CIERRE);
