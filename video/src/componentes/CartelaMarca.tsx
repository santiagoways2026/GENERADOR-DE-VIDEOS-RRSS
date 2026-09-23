import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { brand, scale } from "../brand/theme";
import { Logo } from "./Logo";

/**
 * Las cartelas de las piezas horizontales de marca, y el cierre que las
 * remata. Salio de la pieza en ingles para YouTube y la usan todas las
 * piezas de esa linea, asi que vive aqui y no dentro de una escena.
 *
 * El acuerdo con el equipo, punto por punto:
 *
 * - Montserrat en peso 900. Minusculas con la inicial en mayuscula, nunca
 *   caja alta: en mayusculas la misma fuente se lee mas estrecha y mas
 *   plana, porque se pierden los ascendentes y descendentes.
 * - Todas las letras en blanco. El verde no hace de fondo de la linea
 *   entera: solo recuadra las palabras que sostienen el mensaje.
 * - Cuerpo grande, 72 px, partiendo la frase en varias lineas antes que
 *   encogerla para que quepa en una.
 * - Abajo a la izquierda, con 64 px de margen, sobre un velo muy suave.
 * - Entran con el barrido lateral del kit, 27 fotogramas y 14 de relevo
 *   entre lineas, y salen con el mismo barrido en 12. Nunca con un fundido.
 * - El cierre va en dos tiempos: primero el overlay con la frase final
 *   sobre el ultimo plano, despues la placa de marca con el logo centrado
 *   sobre el verde olivo con degradado, y la web debajo en blanco.
 */

export const FUENTE = "Montserrat, Manrope, Poppins, sans-serif";
export const MARGEN = 64;

/** 896 ms del kit, a 30 fps. */
export const BARRIDO = 27;
/** 480 ms de relevo entre lineas. */
export const RELEVO = 14;
/** Salida: el mismo barrido, mas corto. */
export const CIERRE_BARRIDO = 12;

const CURVA = Easing.bezier(0.22, 0.61, 0.36, 1);

/**
 * Barrido lateral del kit: la linea se descubre de izquierda a derecha y se
 * recoge por el mismo lado. No es un fundido, que es lo que pide el manual.
 */
export const barrido = (frame: number, desde: number, total: number) => {
  const entra = interpolate(frame, [desde, desde + BARRIDO], [100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: CURVA,
  });
  const sale = interpolate(frame, [total - CIERRE_BARRIDO, total], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: CURVA,
  });
  return `inset(0 ${entra}% 0 ${sale}%)`;
};

/** Un trozo de linea. Si va destacado, se le pone la caja verde detras. */
export type Trozo = { texto: string; destacado?: boolean };

export const Linea: React.FC<{
  trozos: Trozo[];
  tam: number;
  frame: number;
  desde: number;
  total: number;
}> = ({ trozos, tam, frame, desde, total }) => (
  <div
    style={{
      display: "flex",
      flexWrap: "nowrap",
      alignItems: "center",
      clipPath: barrido(frame, desde, total),
      marginTop: 6,
    }}
  >
    {trozos.map((t, i) => (
      <span
        key={i}
        style={{
          fontFamily: FUENTE,
          fontSize: tam,
          lineHeight: 1.02,
          fontWeight: 900,
          letterSpacing: "-0.025em",
          color: brand.white,
          whiteSpace: "pre",
          backgroundColor: t.destacado ? brand.green : "transparent",
          padding: t.destacado
            ? `${Math.round(tam * 0.14)}px ${Math.round(tam * 0.26)}px`
            : 0,
          borderRadius: t.destacado ? 6 : 0,
          marginRight: i < trozos.length - 1 ? Math.round(tam * 0.22) : 0,
          textShadow: t.destacado ? "none" : "0 2px 16px rgba(8,22,15,0.55)",
        }}
      >
        {t.texto}
      </span>
    ))}
  </div>
);

/** Cartela de una a tres lineas, abajo a la izquierda, con pie opcional. */
export const Cartela: React.FC<{
  lineas: Trozo[][];
  /** Pie al pie del titular. Varias entradas, varias lineas. */
  pie?: string[];
  total: number;
  tam?: number;
  /** El margen del lienzo. 64 en horizontal; en vertical hay que subirlo. */
  margen?: number;
  /**
   * Margen inferior aparte. En vertical hay que separarse mucho mas del
   * borde: en stories y en TikTok los ultimos 300 px los tapa la interfaz,
   * la barra de "enviar mensaje" y los botones de la derecha.
   */
  margenAbajo?: number;
  /** Cuerpo del pie. En vertical se queda pequeno con el valor de siempre. */
  tamPie?: number;
}> = ({
  lineas,
  pie,
  total,
  tam = 72,
  margen = MARGEN,
  margenAbajo,
  tamPie = 21,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "flex-start",
        padding: margen,
        paddingBottom: margenAbajo ?? margen,
      }}
    >
      {/* Un velo muy suave: sin el, el blanco se pierde sobre un cielo claro. */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to top, rgba(10,26,18,0.58) 0%, rgba(10,26,18,0.28) 34%, rgba(10,26,18,0) 64%)",
        }}
      />
      <div style={{ position: "relative" }}>
        {lineas.map((l, i) => (
          <Linea key={i} trozos={l} tam={tam} frame={frame} desde={RELEVO * i} total={total} />
        ))}
        {pie ? (
          <div
            style={{
              marginTop: 18,
              fontFamily: FUENTE,
              fontSize: tamPie,
              fontWeight: 700,
              lineHeight: 1.3,
              letterSpacing: "0.01em",
              color: brand.white,
              clipPath: barrido(frame, RELEVO * lineas.length, total),
              textShadow: "0 2px 14px rgba(8,22,15,0.55)",
            }}
          >
            {pie.map((l) => (
              <div key={l}>{l}</div>
            ))}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

/**
 * Primer tiempo del cierre: el ultimo plano se queda detras, oscurecido, y
 * delante entra la frase final con el mismo lenguaje de las cartelas.
 *
 * `reservaDerecha` deja libre la banda donde YouTube pone la pantalla final.
 * En las piezas de redes no hace falta y va a cero. No se dibuja ningun
 * boton: uno pintado dentro del video invita a pulsar donde no hay nada.
 *
 * `abajo` baja la frase al mismo sitio que las cartelas. Se usa cuando el
 * ultimo plano es un primer plano de alguien: a media altura el recuadro
 * verde cae sobre la cara, y un rotulo no tapa una cara.
 */
export const CierreMarca: React.FC<{
  lineas: Trozo[][];
  /** Fotograma en el que la frase se recoge, para dejar paso a la placa. */
  salidaTexto: number;
  tam?: number;
  reservaDerecha?: number;
  abajo?: boolean;
}> = ({ lineas, salidaTexto, tam = 72, reservaDerecha = 0, abajo = false }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: o }}>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(105deg, rgba(10,26,18,0.80) 0%, rgba(10,26,18,0.62) 46%, rgba(10,26,18,0.18) 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          justifyContent: abajo ? "flex-end" : "center",
          alignItems: "flex-start",
          padding: MARGEN,
          paddingRight: MARGEN + reservaDerecha,
        }}
      >
        {lineas.map((l, i) => (
          <Linea
            key={i}
            trozos={l}
            tam={tam}
            frame={frame}
            desde={RELEVO * i}
            total={salidaTexto}
          />
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/**
 * Segundo tiempo del cierre: la placa de marca.
 *
 * El logo va centrado en el centro exacto del cuadro y entra con un
 * desvanecimiento sobre el plano, que se apaga detras. Blanco sobre el verde
 * olivo de marca, que es lo que manda el manual: el archivo blanco es ademas
 * el de alta resolucion, asi que aguanta el tamano grande sin ampliarse.
 *
 * El fondo lleva un degradado suave dentro de la propia escala de verdes de
 * la guia, para que la placa no sea un plano de color liso. La pieza termina
 * aqui, en la marca, sin fundido a negro.
 */
export const PlacaMarca: React.FC<{
  web?: string;
  ancho?: number;
  /** Separacion de la web respecto al centro. Mas en vertical. */
  hueco?: number;
}> = ({ web = "santiagoways.com", ancho = 460, hueco = 210 }) => {
  const frame = useCurrentFrame();
  const fondo = interpolate(frame, [0, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: CURVA,
  });
  const marca = interpolate(frame, [10, 34], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: CURVA,
  });
  const sube = interpolate(frame, [10, 34], [10, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: CURVA,
  });

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `linear-gradient(145deg, ${brand.green} 0%, ${brand.greenDark} 52%, ${scale.green[7]} 100%)`,
          opacity: fondo,
        }}
      />
      {/* El logo, centrado en el centro exacto del cuadro. */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          opacity: marca,
          transform: `translateY(${sube}px)`,
        }}
      >
        <Logo variante="blanco" ancho={ancho} />
      </AbsoluteFill>

      {/* La web cuelga debajo sin desplazar el logo. */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          paddingTop: hueco,
          opacity: marca,
          transform: `translateY(${sube}px)`,
        }}
      >
        <div
          style={{
            fontFamily: FUENTE,
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: "0.06em",
            color: brand.white,
          }}
        >
          {web}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
