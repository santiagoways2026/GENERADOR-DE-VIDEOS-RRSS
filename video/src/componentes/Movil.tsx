import { Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { brand, easeOut, fontFamily, radius, shadow, weight } from "../brand/theme";

/**
 * Un móvil dibujado con una pantalla de la app dentro: captura o grabación.
 *
 * Entra con el movimiento de marca (fundido y desplazamiento corto, sin
 * rebote) y puede marcar una zona de la pantalla con un recuadro verde Ways
 * y un punto de ubicación que late, todo calculado por fotograma.
 */

export const ANCHO_MOVIL = 560;
export const ALTO_MOVIL = 1160;
const BISEL = 18;
export const ANCHO_PANTALLA = ANCHO_MOVIL - BISEL * 2;

type Zona = { x: number; y: number; ancho: number; alto: number; desde: number };

export const Movil: React.FC<{
  /** Imagen de la pantalla en public/, a lo ancho de la pantalla. */
  pantalla: string;
  /** Fotograma en que entra. */
  desde?: number;
  /** Desplazamiento vertical de la pantalla, en px de pantalla, al final del plano. */
  desplazamiento?: { hasta: number; desde: number; dura: number };
  /** Recuadro sobre lo que se está enseñando, en px de pantalla. */
  zona?: Zona;
  /** Punto de ubicación en tiempo real, en px de pantalla. */
  ubicacion?: { x: number; y: number; desde: number };
  /** Aviso de que la pantalla aún es la captura antigua. */
  provisional?: boolean;
  style?: React.CSSProperties;
}> = ({ pantalla, desde = 0, desplazamiento, zona, ubicacion, provisional = false, style }) => {
  const f = useCurrentFrame();
  const curva = Easing.bezier(...easeOut);
  const entrada = interpolate(f, [desde, desde + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: curva,
  });
  const scroll = desplazamiento
    ? interpolate(f, [desplazamiento.desde, desplazamiento.desde + desplazamiento.dura], [0, desplazamiento.hasta], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.cubic),
      })
    : 0;

  return (
    <div
      style={{
        position: "absolute",
        width: ANCHO_MOVIL,
        height: ALTO_MOVIL,
        left: "50%",
        translate: `-50% ${interpolate(entrada, [0, 1], [60, 0])}px`,
        opacity: entrada,
        ...style,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: brand.grafito,
          borderRadius: 84,
          padding: BISEL,
          boxShadow: shadow.caja,
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            borderRadius: 66,
            overflow: "hidden",
            backgroundColor: brand.white,
          }}
        >
          <Img
            src={staticFile(pantalla)}
            style={{ position: "absolute", top: 70 - scroll, left: 0, width: "100%" }}
          />
          {/* Barra de estado y isla, para que se lea como un móvil. */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 64, backgroundColor: brand.white }} />
          <div
            style={{
              position: "absolute",
              top: 18,
              left: "50%",
              translate: "-50% 0",
              width: 150,
              height: 38,
              borderRadius: radius.pill,
              backgroundColor: brand.grafito,
            }}
          />

          {zona ? (
            <div
              style={{
                position: "absolute",
                left: zona.x,
                top: zona.y + 70 - scroll,
                width: zona.ancho,
                height: zona.alto,
                border: `6px solid ${brand.green}`,
                borderRadius: 24,
                opacity: interpolate(f, [zona.desde, zona.desde + 10], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
                scale: interpolate(f, [zona.desde, zona.desde + 14], [1.06, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: curva,
                }),
              }}
            />
          ) : null}

          {ubicacion ? (
            <div style={{ position: "absolute", left: ubicacion.x, top: ubicacion.y + 70 - scroll }}>
              {/* Onda que se abre y se apaga cada segundo, sin rebote. */}
              <div
                style={{
                  position: "absolute",
                  width: 40,
                  height: 40,
                  left: -20,
                  top: -20,
                  borderRadius: "50%",
                  backgroundColor: brand.green,
                  opacity: f < ubicacion.desde ? 0 : interpolate((f - ubicacion.desde) % 30, [0, 30], [0.5, 0]),
                  scale: f < ubicacion.desde ? 1 : interpolate((f - ubicacion.desde) % 30, [0, 30], [1, 3]),
                }}
              />
              <div
                style={{
                  position: "absolute",
                  width: 30,
                  height: 30,
                  left: -15,
                  top: -15,
                  borderRadius: "50%",
                  backgroundColor: brand.sendero,
                  border: `6px solid ${brand.white}`,
                  opacity: interpolate(f, [ubicacion.desde, ubicacion.desde + 8], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                }}
              />
            </div>
          ) : null}
        </div>
      </div>

      {provisional ? (
        <div
          style={{
            position: "absolute",
            bottom: -44,
            width: "100%",
            textAlign: "center",
            fontFamily,
            fontSize: 20,
            fontWeight: weight.semibold,
            color: brand.white,
          }}
        >
          Pantalla provisional
        </div>
      ) : null}
    </div>
  );
};
