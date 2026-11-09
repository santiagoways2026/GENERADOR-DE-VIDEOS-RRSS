import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import {
  brand,
  easeOut,
  margin,
  radius,
  tracking,
  videoSize,
  weight,
} from "../brand/theme";
import { Subrayado } from "./Subrayado";

/**
 * Cartela de texto sobre vídeo, la pieza "Texto sobre vídeo" del Brandbook
 * 2027: titular en blanco, Montserrat ExtraBold, en minúscula de frase, con
 * la segunda línea sobre el subrayado Ways.
 *
 * Sustituye a las dos placas encajadas de la guía de 2026 (placa blanca con
 * el dato en bosque y placa lima u olivo debajo). El brandbook nuevo cierra
 * la paleta, quita lima y bosque, y reserva las mayúsculas para antetítulos.
 *
 * Se conserva el ritmo del kit: cada línea entra con un barrido lateral de 27
 * fotogramas y 14 de relevo, no con un fundido.
 */

/** 896 ms del kit, a 30 fps. */
const BARRIDO = 27;
/** 480 ms de retardo entre líneas. */
const RELEVO = 14;

const barrido = (frame: number, desde: number) =>
  `inset(0 ${interpolate(frame, [desde, desde + BARRIDO], [100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...easeOut),
  })}% 0 0)`;

export const Cartela: React.FC<{
  /** Antetítulo pequeño en mayúsculas, sobre caja verde Ways. Opcional. */
  antetitulo?: string;
  /** Primera línea, en blanco. */
  principal: string;
  /** Segunda línea, sobre el subrayado Ways. Es la que lleva la promesa. */
  secundaria?: string;
  desde?: number;
  /** Tamaño del titular. Por defecto, el del brandbook para pantalla. */
  tamano?: number;
}> = ({ antetitulo, principal, secundaria, desde = 0, tamano = videoSize.titular }) => {
  const frame = useCurrentFrame();

  const tAnte = desde;
  const tPrincipal = desde + (antetitulo ? RELEVO : 0);
  const tSecundaria = tPrincipal + RELEVO;

  return (
    <Interactive.Div
      name="Cartela"
      style={{
        position: "absolute",
        top: 200,
        left: margin,
        right: margin,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 10,
      }}
    >
      {antetitulo ? (
        <div
          style={{
            backgroundColor: brand.green,
            color: brand.white,
            fontSize: videoSize.etiqueta,
            fontWeight: weight.bold,
            letterSpacing: tracking.antetitulo,
            textTransform: "uppercase",
            padding: "6px 14px",
            borderRadius: radius.md,
            clipPath: barrido(frame, tAnte),
          }}
        >
          {antetitulo}
        </div>
      ) : null}

      <div
        style={{
          fontSize: tamano,
          lineHeight: 1.1,
          fontWeight: weight.extrabold,
          color: brand.white,
          whiteSpace: "nowrap",
          clipPath: barrido(frame, tPrincipal),
        }}
      >
        {principal}
      </div>

      {secundaria ? (
        <Subrayado
          frame={frame}
          desde={tSecundaria}
          dura={BARRIDO}
          style={{
            fontSize: tamano,
            lineHeight: 1.1,
            fontWeight: weight.extrabold,
            whiteSpace: "nowrap",
          }}
        >
          {secundaria}
        </Subrayado>
      ) : null}
    </Interactive.Div>
  );
};
