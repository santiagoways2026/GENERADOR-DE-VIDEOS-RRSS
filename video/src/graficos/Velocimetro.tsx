import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import {
  brand,
  color,
  easeOut,
  fontSize,
  radius,
  scale,
  shadow,
  space,
  tracking,
  weight,
} from "../brand/theme";

/**
 * Velocimetro del Botafumeiro.
 *
 * La cifra es lo unico numerico de la pieza, asi que se cuenta en pantalla
 * en lugar de aparecer hecha: la aguja y el numero suben juntos mientras la
 * voz dice el dato, y se detienen en 68 justo cuando lo termina de decir.
 *
 * Lleva su fuente impresa. La guia prohibe cifras sin fuente en pantalla.
 */

/** Tope de la esfera. Deja aire por encima del dato para que 68 no sea el fin. */
const TOPE = 80;
const OBJETIVO = 68;

const CX = 280;
const CY = 292;
const R = 220;
/** Longitud del arco semicircular, para el recorte del trazo. */
const ARCO = Math.PI * R;

const MARCAS = [0, 20, 40, 60, 80];
/** Radio al que se rotulan las marcas, por fuera del trazo. */
const EXTERIOR = R + 36;

export const Velocimetro: React.FC<{
  desde?: number;
  /** Fotograma en que arranca la cuenta, relativo al bloque. */
  cuenta?: number;
  /** Fotogramas que tarda en llegar al dato. */
  recorrido?: number;
  /** Fotograma en que entra la placa lima de remate.
   *  Se separa de la cuenta porque la voz no siempre dice las dos cosas en
   *  el mismo orden que la esfera las muestra. */
  remate?: number;
}> = ({ desde = 0, cuenta = 34, recorrido = 40, remate }) => {
  const frame = useCurrentFrame();
  const t = frame - desde;
  const tRemate = remate ?? cuenta + recorrido;

  const valor = interpolate(t, [cuenta, cuenta + recorrido], [0, OBJETIVO], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...easeOut),
  });
  const p = valor / TOPE;
  const angulo = Math.PI * (1 - p);

  return (
    <Interactive.Div
      name="Velocímetro"
      style={{
        backgroundColor: color.bg1,
        borderRadius: radius.lg,
        boxShadow: shadow.raised,
        overflow: "hidden",
        width: 720,
        opacity: interpolate(t, [0, 10], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        translate: interpolate(t, [0, 16], ["0px 24px", "0px 0px"], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(...easeOut),
        }),
      }}
    >
      {/* Cabecera en placa olivo, como las cartelas del kit. */}
      <div
        style={{
          backgroundColor: brand.green,
          color: color.fgInverse,
          padding: `${space[4]}px ${space[6]}px`,
          fontSize: fontSize.xl,
          fontWeight: weight.black,
          letterSpacing: tracking.loose,
          textTransform: "uppercase",
        }}
      >
        El Botafumeiro
      </div>

      <div style={{ padding: `${space[6]}px ${space[6]}px ${space[4]}px` }}>
        <svg width={560} height={330} viewBox="0 0 560 330" style={{ display: "block" }}>
          {/* Esfera de fondo. */}
          <path
            d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`}
            fill="none"
            stroke={scale.green[1]}
            strokeWidth={34}
            strokeLinecap="round"
          />
          {/* Recorrido hecho, en olivo. */}
          <path
            d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`}
            fill="none"
            stroke={brand.green}
            strokeWidth={34}
            strokeLinecap="round"
            strokeDasharray={ARCO}
            strokeDashoffset={ARCO * (1 - p)}
          />

          {/* Las marcas van por fuera del arco: dentro chocaban con el dato. */}
          {MARCAS.map((m) => {
            const a = Math.PI * (1 - m / TOPE);
            return (
              <text
                key={m}
                x={CX + Math.cos(a) * EXTERIOR}
                y={CY - Math.sin(a) * EXTERIOR + 12}
                textAnchor="middle"
                fill={color.fg3}
                fontSize={26}
                fontWeight={weight.bold}
              >
                {m}
              </text>
            );
          })}

          {/* Cabeza del recorrido.
           *  Va montada sobre el arco y no es una aguja desde el centro:
           *  una aguja cruza el dato cada vez que pasa por la vertical. */}
          <circle
            cx={CX + Math.cos(angulo) * R}
            cy={CY - Math.sin(angulo) * R}
            r={23}
            fill={brand.forest}
          />
          <circle
            cx={CX + Math.cos(angulo) * R}
            cy={CY - Math.sin(angulo) * R}
            r={9}
            fill={color.bg1}
          />

          {/* El dato, dentro de la esfera. */}
          <text
            x={CX}
            y={CY - 98}
            textAnchor="middle"
            fill={brand.forest}
            fontSize={118}
            fontWeight={weight.black}
            letterSpacing="-0.02em"
          >
            {Math.round(valor)}
          </text>
          <text
            x={CX}
            y={CY - 48}
            textAnchor="middle"
            fill={color.fg3}
            fontSize={32}
            fontWeight={weight.black}
            letterSpacing="0.08em"
          >
            KM/H
          </text>
        </svg>

        <div
          style={{
            marginTop: space[2],
            textAlign: "center",
            fontSize: fontSize.base,
            fontWeight: weight.medium,
            color: color.fg3,
          }}
        >
          Fuente: Catedral de Santiago
        </div>
      </div>

      {/* Conclusion, en placa lima con texto bosque. */}
      <div
        style={{
          backgroundColor: brand.lime,
          color: color.fgOnLime,
          padding: `${space[4]}px ${space[6]}px`,
          fontSize: fontSize.xl,
          fontWeight: weight.black,
          letterSpacing: tracking.wide,
          textTransform: "uppercase",
          textAlign: "center",
          clipPath: `inset(0 ${interpolate(t, [tRemate, tRemate + 18], [100, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(...easeOut),
          })}% 0 0)`,
        }}
      >
        Hacen falta 8 hombres
      </div>
    </Interactive.Div>
  );
};
