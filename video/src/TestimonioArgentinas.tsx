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
 * 53,3 s, con un fundido de salida sobre esa pausa: el tramo final del
 * montaje original mezcla dos músicas y se deja fuera.
 *
 * Sobre el audio del testimonio, el metraje del albergue se sustituye:
 * maletas donde estaba el comedor, peregrinos disfrutando donde estaban
 * los platos y hoteles donde estaban las literas y la terraza.
 *
 * Los textos son titulares de mensaje directo: gancho en blanco y el
 * servicio sobre el bloque olivo, a la izquierda y en el tercio inferior,
 * por encima de la franja que tapan el texto y los botones del anuncio.
 */

const f = (s: number) => Math.round(s * 30);

/** Fin del testimonio y duración del cierre, en segundos. */
const FIN = 53.9;
const CIERRE = 2.4;

/** Tramos del testimonio que se tapan con metraje de recurso; el audio del
 *  testimonio sigue por debajo. */
const MALETAS = { desde: 6.07, hasta: 12.5 };
const COMIDA = { desde: 12.5, hasta: 18.33 };
const HOTELES = { desde: 24.23, hasta: 32.63 };

/** Titulares en pantalla, en segundos del testimonio. Cada uno cae sobre
 *  el plano que mejor lo ilustra. */
const TITULARES = [
  // Ellas a cámara, al arrancar.
  { desde: 0.4, hasta: 5.8, gancho: "Camino de Santiago", destacado: "organizado" },
  // Maletas, en lugar del comedor.
  { desde: 7.0, hasta: 12.3, gancho: "Transporte de equipajes", destacado: "entre etapas" },
  // Hoteles.
  { desde: 24.4, hasta: 29.2, gancho: "Hoteles seleccionados", destacado: "y máximo confort" },
  // Cruceiro y capilla, en pleno Camino.
  {
    desde: 37.0,
    hasta: 42.8,
    gancho: "e información detallada\nde tu ruta",
    destacado: "Atención 24/7",
    destacadoArriba: true,
  },
  // Cierre sobre la catedral, justo antes del logo.
  { desde: 51.2, hasta: FIN, gancho: "Tu Camino", destacado: "empieza aquí" },
];

/** La catedral tapa el final del testimonio; su audio sigue por debajo
 *  hasta el fundido. */
const CATEDRAL = { desde: 51.0, hasta: FIN };

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

      {/* Maletas en lugar del comedor del albergue. */}
      <Sequence
        from={f(MALETAS.desde)}
        durationInFrames={f(MALETAS.hasta) - f(MALETAS.desde)}
        name="Maletas"
      >
        <Planos
          total={f(MALETAS.hasta) - f(MALETAS.desde)}
          overlay={0.12}
          lista={[
            { src: "maletas-etiqueta", dura: 2.23 },
            { src: "equipaje-fila", dura: 0.7 },
            { src: "equipaje-portal", dura: 1.2, encuadre: "60% 50%" },
            { src: "maleta-concha", dura: 1.73 },
            { src: "equipaje-etiquetas", dura: 0.93 },
          ]}
        />
      </Sequence>

      {/* Hoteles en lugar de las habitaciones y la terraza del albergue. */}
      <Sequence
        from={f(HOTELES.desde)}
        durationInFrames={f(HOTELES.hasta) - f(HOTELES.desde)}
        name="Hoteles"
      >
        <Planos
          total={f(HOTELES.hasta) - f(HOTELES.desde)}
          overlay={0.12}
          lista={[
            { src: "jardin-alojamiento", dura: 4.4 },
            { src: "habitacion-alojamiento", dura: 3.14 },
            { src: "habitacion-piedra", dura: 1.7 },
            { src: "terraza-casa-piedra", dura: 3.13 },
          ]}
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

      <Sequence
        from={f(CATEDRAL.desde)}
        durationInFrames={f(CATEDRAL.hasta) - f(CATEDRAL.desde)}
        name="Catedral"
      >
        <Planos
          total={f(CATEDRAL.hasta) - f(CATEDRAL.desde)}
          overlay={0.18}
          lista={[
            { src: "catedral-quintana", dura: 2.43, encuadre: "30% 50%" },
            { src: "catedral-berenguela", dura: 1.59 },
          ]}
        />
      </Sequence>

      {TITULARES.map((c) => (
        <Sequence
          key={c.destacado}
          from={f(c.desde)}
          durationInFrames={f(c.hasta) - f(c.desde)}
          name={c.destacado}
        >
          <Salida duracion={f(c.hasta) - f(c.desde)}>
            <Titular
              gancho={c.gancho}
              destacado={c.destacado}
              destacadoArriba={"destacadoArriba" in c && c.destacadoArriba}
            />
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
