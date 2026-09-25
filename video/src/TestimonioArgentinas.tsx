import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from "remotion";
import "./fuentes";
import { brand, fontFamily } from "./brand/theme";
import { Clip } from "./componentes/Clip";
import { Frase } from "./componentes/Frase";
import { Planos } from "./componentes/Planos";
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
 * El texto va suelto, con las palabras clave sobre el bloque olivo del kit,
 * en la mitad superior y por debajo de la franja que tapa la interfaz.
 */

const f = (s: number) => Math.round(s * 30);

/** Fin del testimonio y duración del cierre, en segundos. */
const FIN = 57.55;
const CIERRE = 2.4;

/** Tramo de los platos en el testimonio, que se sustituye. */
const COMIDA = { desde: 12.5, hasta: 18.33 };

/** Frases en pantalla, en segundos del testimonio. */
const FRASES = [
  { desde: 0.4, hasta: 5.7, texto: "Desde *Argentina*\nal Camino de Santiago" },
  // Sobre el comedor del albergue.
  { desde: 7.0, hasta: 12.3, texto: "Todo *organizado*,\netapa a etapa" },
  // Sobre los peregrinos que sustituyen a la comida.
  { desde: 12.8, hasta: 18.1, texto: "Tú solo tienes\nque *disfrutar*" },
  // Un solo CTA, al final.
  { desde: 52.4, hasta: FIN, texto: "*Reserva* tu Camino" },
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

      {FRASES.map((c) => (
        <Sequence
          key={c.texto}
          from={f(c.desde)}
          durationInFrames={f(c.hasta) - f(c.desde)}
          name={c.texto.replace(/[*\n]/g, " ")}
        >
          <Salida duracion={f(c.hasta) - f(c.desde)}>
            <Frase texto={c.texto} />
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
