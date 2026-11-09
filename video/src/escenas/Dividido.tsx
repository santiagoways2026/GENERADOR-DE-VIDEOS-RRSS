import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { brand, easeOut, radius, tracking, weight } from "../brand/theme";
import { Panel } from "../componentes/Panel";
import { Subrayado } from "../componentes/Subrayado";

/**
 * Pantalla dividida: texto sobre blanco a la izquierda y un plano vertical a
 * la derecha.
 *
 * Es la forma más honrada de usar metraje vertical en un vídeo horizontal, y
 * cumple de paso la proporción del brandbook, con el blanco como color
 * principal. El titular va en grafito ExtraBold con el subrayado Ways, por
 * defecto, sobre una o dos palabras.
 */

const ALTO = 608;
const ANCHO = Math.round((ALTO * 9) / 16);
const BARRIDO = 27;
const RELEVO = 14;

const barrido = (f: number, desde: number) =>
  `inset(0 ${interpolate(f, [desde, desde + BARRIDO], [100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...easeOut),
  })}% 0 0)`;

export const Dividido: React.FC<{
  src: string;
  duracion: number;
  antetitulo?: string;
  /** Primera línea del titular, en grafito. */
  titular: string;
  /** Segunda línea, sobre el subrayado Ways. */
  destacado?: string;
  /** Una línea de apoyo en texto de lectura. Opcional. */
  apoyo?: string;
  encuadre?: string;
}> = ({ src, duracion, antetitulo, titular, destacado, apoyo, encuadre }) => {
  const f = useCurrentFrame();
  const t0 = 6;
  const tTit = t0 + (antetitulo ? RELEVO : 0);

  return (
    <AbsoluteFill style={{ backgroundColor: brand.white, flexDirection: "row", alignItems: "center" }}>
      <div style={{ flex: 1, paddingLeft: 96, paddingRight: 48, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 14 }}>
        {antetitulo ? (
          <div
            style={{
              backgroundColor: brand.green,
              color: brand.white,
              fontSize: 16,
              fontWeight: weight.bold,
              letterSpacing: tracking.antetitulo,
              textTransform: "uppercase",
              padding: "5px 12px",
              borderRadius: radius.md,
              clipPath: barrido(f, t0),
            }}
          >
            {antetitulo}
          </div>
        ) : null}
        <div
          style={{
            fontSize: 52,
            lineHeight: 1.1,
            fontWeight: weight.extrabold,
            color: brand.grafito,
            clipPath: barrido(f, tTit),
          }}
        >
          {titular}
        </div>
        {destacado ? (
          <Subrayado
            frame={f}
            desde={tTit + RELEVO}
            dura={BARRIDO}
            style={{ fontSize: 52, lineHeight: 1.1, fontWeight: weight.extrabold }}
          >
            {destacado}
          </Subrayado>
        ) : null}
        {apoyo ? (
          <div
            style={{
              marginTop: 10,
              maxWidth: 560,
              fontSize: 24,
              lineHeight: 1.5,
              fontWeight: weight.medium,
              color: brand.gris,
              opacity: interpolate(f, [tTit + 30, tTit + 44], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            {apoyo}
          </div>
        ) : null}
      </div>
      <div style={{ paddingRight: 72 }}>
        <Panel src={src} ancho={ANCHO} alto={ALTO} duracion={duracion} encuadre={encuadre} />
      </div>
    </AbsoluteFill>
  );
};
