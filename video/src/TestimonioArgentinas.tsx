import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from "remotion";
import "./fuentes";
import { brand, fontFamily, margin } from "./brand/theme";
import { Cartela } from "./componentes/Cartela";
import { Clip } from "./componentes/Clip";
import { Logo } from "./componentes/Logo";
import { Cierre } from "./escenas/Cierre";

/**
 * Reel de testimonio para campañas de Meta Ads: dos peregrinas argentinas.
 *
 * El testimonio va entero y con su audio, ya sin la marca de agua de Clideo
 * (recorte del 5 % que mantiene el 9:16). Se corta en la pausa de voz de
 * 57,4 s para que, con el cierre, la pieza no pase del minuto.
 *
 * Solo tres cartelas: quién habla, el mensaje de organización sobre los
 * planos del albergue y el CTA. Van en la mitad superior, por encima de
 * las caras, y más bajas que en un reel orgánico para librar la franja que
 * tapa la interfaz de Instagram.
 */

const f = (s: number) => Math.round(s * 30);

/** Fin del testimonio y duración del cierre, en segundos. */
const FIN = 57.55;
const CIERRE = 2.4;

/** Franja superior que ocupa la interfaz de Reels en un anuncio. */
const ARRIBA = 290;

/** Tramos de las cartelas, en segundos del testimonio. */
const CARTELAS = [
  { desde: 0.4, hasta: 5.7, principal: "Desde Argentina", secundaria: "al Camino de Santiago", eyebrow: "Testimonio real" },
  // Sobre los planos del albergue: comedor, platos, habitaciones y terraza.
  { desde: 7.0, hasta: 17.9, principal: "Todo organizado", secundaria: "etapa a etapa" },
  // Un solo CTA, al final.
  { desde: 52.4, hasta: FIN, principal: "Tu Camino, resuelto", secundaria: "Reserva en la web", tono: "lima" as const },
];

/** Deja salir la cartela con un fundido corto en lugar de cortarla en seco. */
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

      {/* La marca acompaña la pieza hasta el cierre, por encima de la franja
          inferior que tapan el texto y los botones del anuncio. */}
      <Sequence durationInFrames={f(FIN)} name="Marca">
        <Logo
          variante="blanco"
          ancho={220}
          style={{ position: "absolute", left: margin, bottom: 440, opacity: 0.92 }}
        />
      </Sequence>

      {CARTELAS.map((c) => (
        <Sequence
          key={c.principal}
          from={f(c.desde)}
          durationInFrames={f(c.hasta) - f(c.desde)}
          name={c.principal}
        >
          <Salida duracion={f(c.hasta) - f(c.desde)}>
            <Cartela
              eyebrow={c.eyebrow}
              principal={c.principal}
              secundaria={c.secundaria}
              tono={c.tono}
              arriba={ARRIBA}
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
