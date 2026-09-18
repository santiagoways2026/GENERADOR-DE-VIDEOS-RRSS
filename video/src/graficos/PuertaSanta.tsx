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
 * La Puerta Santa, en sus dos estados: tapiada y abierta.
 *
 * Es la metafora con la que abre la pieza ("a door that has stayed sealed"),
 * asi que conviene cerrarla en imagen cuando la locucion explica que en Ano
 * Santo se abre. No hay metraje de la puerta real en el repositorio y una
 * foto de archivo estaria prohibida por el manual, de modo que se dibuja:
 * ademas asi se puede animar el gesto, que es lo que cuenta la idea.
 *
 * El sillar de arriba es el ultimo en caer, para que la vista siga el
 * desmontaje de abajo arriba y acabe mirando el vano ya abierto.
 */

/** Filas de sillares que tapian el vano. */
const SILLARES = 7;
/** Lo que tarda en retirarse un sillar. */
const CAIDA = 12;
/** Solape entre un sillar y el siguiente: sin el, desmontar siete tardaria
 *  casi tres segundos y el bloque no da para tanto. */
const SOLAPE = 0.45;

export const PuertaSanta: React.FC<{
  desde?: number;
  /** Fotograma del bloque en el que empieza a abrirse. Se hace coincidir con
   *  la palabra "unsealed" de la locucion. Va en fotogramas de la escena, no
   *  relativos a `desde`. */
  abre?: number;
  sellada?: string;
  abierta?: string;
}> = ({ desde = 0, abre = 46, sellada = "Sealed", abierta = "Open" }) => {
  const frame = useCurrentFrame();
  const t = frame - desde;

  const aparece = interpolate(t, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /** 0 tapiada, 1 abierta del todo. */
  const apertura = interpolate(
    frame,
    [abre, abre + CAIDA * SILLARES * SOLAPE],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(...easeOut),
    },
  );

  return (
    <Interactive.Div
      name="PuertaSanta"
      style={{
        display: "flex",
        alignItems: "center",
        gap: space[6],
        backgroundColor: color.bg1,
        borderRadius: radius.lg,
        boxShadow: shadow.raised,
        padding: `${space[5]}px ${space[7]}px ${space[5]}px ${space[5]}px`,
        opacity: aparece,
        translate: interpolate(t, [0, 18], ["0px 24px", "0px 0px"], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(...easeOut),
        }),
      }}
    >
      <svg width="400" height="477" viewBox="0 0 520 620">
        <defs>
          <clipPath id="vano">
            <path d="M90 600 V280 A170 170 0 0 1 430 280 V600 Z" />
          </clipPath>
          <radialGradient id="luz" cx="50%" cy="62%" r="62%">
            <stop offset="0%" stopColor={brand.lime} />
            <stop offset="58%" stopColor={brand.limeSoft} />
            <stop offset="100%" stopColor={scale.green[1]} />
          </radialGradient>
        </defs>

        {/* Jamba: el grosor del muro. */}
        <path
          d="M40 620 V280 A220 220 0 0 1 480 280 V620 H430 V280 A170 170 0 0 0 90 280 V620 Z"
          fill={brand.forest}
        />

        {/* El vano, que es lo que se abre. */}
        <g clipPath="url(#vano)">
          {/* La luz de dentro, que solo se ve cuando cae el sillar. */}
          <rect x="90" y="100" width="340" height="510" fill="url(#luz)" />

          {/* Sillares que tapian, de abajo arriba. El de mas abajo cae
              primero: la vista sube con el desmontaje. */}
          {Array.from({ length: SILLARES }, (_, i) => {
            const alto = 510 / SILLARES;
            const y = 610 - (i + 1) * alto;
            const cae = interpolate(
              frame,
              [abre + i * CAIDA * SOLAPE, abre + i * CAIDA * SOLAPE + CAIDA],
              [0, 1],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(...easeOut),
              },
            );
            return (
              <g key={i} opacity={1 - cae}>
                <rect
                  x="88"
                  y={y}
                  width="344"
                  height={alto - 3}
                  fill={scale.neutral[3]}
                  stroke={scale.neutral[4]}
                  strokeWidth="2"
                  // Se retira hacia dentro, no hacia un lado.
                  style={{ translate: `0px ${cae * -18}px` }}
                />
                {/* Junta vertical alterna, para que lea como sillería. */}
                <rect
                  x={i % 2 ? 258 : 172}
                  y={y}
                  width="3"
                  height={alto - 3}
                  fill={scale.neutral[4]}
                  opacity={1 - cae}
                />
              </g>
            );
          })}
        </g>

        {/* Arco de dovelas por encima del vano. */}
        <path
          d="M90 280 A170 170 0 0 1 430 280"
          fill="none"
          stroke={brand.green}
          strokeWidth="14"
        />

        {/* Umbral. */}
        <rect x="40" y="600" width="440" height="20" fill={brand.forest} />
      </svg>

      <div style={{ display: "flex", flexDirection: "column", gap: space[3] }}>
        {/* Los dos estados, uno encima del otro: el relevo se ve. */}
        {[
          { texto: sellada, activo: 1 - apertura, bg: brand.forest, fg: color.fgInverse },
          { texto: abierta, activo: apertura, bg: brand.lime, fg: color.fgOnLime },
        ].map((estado) => (
          <div
            key={estado.texto}
            style={{
              backgroundColor: estado.bg,
              color: estado.fg,
              borderRadius: radius.md,
              padding: `${space[3]}px ${space[5]}px`,
              fontSize: fontSize["2xl"],
              fontWeight: weight.black,
              letterSpacing: tracking.loose,
              textTransform: "uppercase",
              textAlign: "center",
              opacity: 0.22 + estado.activo * 0.78,
              scale: interpolate(estado.activo, [0, 1], [0.92, 1], {
                output: "perceptual-scale",
              }),
            }}
          >
            {estado.texto}
          </div>
        ))}
      </div>
    </Interactive.Div>
  );
};
