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
 * La Puerta Santa, en sus dos estados: cerrada y abierta.
 *
 * Es la metafora con la que abre la pieza ("a door that has stayed sealed"),
 * asi que conviene cerrarla en imagen cuando la locucion explica que en Ano
 * Santo se abre. No hay metraje de la puerta real en el repositorio y una
 * foto de archivo estaria prohibida por el manual, de modo que se dibuja:
 * ademas asi se puede animar el gesto, que es lo que cuenta la idea.
 *
 * Son dos hojas que se abren hacia dentro. Se probo antes con el muro de
 * sillares que de verdad tapia la puerta y se derriba cada Ano Santo, pero
 * en pantalla no se leia: unos bloques que se desvanecen no dicen "puerta".
 * Dos hojas abriendose las entiende cualquiera sin pensar, que es lo que
 * hace falta en cinco segundos.
 */

/** Lo que tarda en abrirse del todo. */
const GIRO = 34;
/** Cuanto se repliega cada hoja. No llega a 1: el canto se queda a la vista,
 *  que es lo que da el grosor de la madera. */
const REPLIEGUE = 0.88;

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

  /** 0 cerrada, 1 abierta del todo. */
  const apertura = interpolate(frame, [abre, abre + GIRO], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...easeOut),
  });

  /** Una hoja vista de frente se acorta al abrirse. */
  const hoja = 1 - apertura * REPLIEGUE;

  /** Casetones de cada hoja, en proporcion del alto. */
  const paneles = [0.06, 0.29, 0.52, 0.75];

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
          {/* La luz de dentro: calida, no el lima de marca, que a pantalla
              completa se come el resto del grafico. */}
          <radialGradient id="luz" cx="50%" cy="58%" r="70%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="42%" stopColor={brand.cream} />
            <stop offset="100%" stopColor={scale.green[1]} />
          </radialGradient>
          {/* Cada hoja se oscurece hacia el canto interior: es lo que da la
              sensacion de que gira y no de que se encoge. */}
          <linearGradient id="hojaIzq" x1="0" x2="1">
            <stop offset="0%" stopColor={scale.green[6]} />
            <stop offset="100%" stopColor={scale.green[8]} />
          </linearGradient>
          <linearGradient id="hojaDer" x1="0" x2="1">
            <stop offset="0%" stopColor={scale.green[8]} />
            <stop offset="100%" stopColor={scale.green[6]} />
          </linearGradient>
        </defs>

        <g clipPath="url(#vano)">
          {/* El interior, que solo se ve cuando las hojas se apartan. */}
          <rect x="90" y="100" width="340" height="510" fill="url(#luz)" />
          {/* Una nave insinuada al fondo, para que se lea profundidad. */}
          <path
            d="M215 610 V330 A45 45 0 0 1 305 330 V610 Z"
            fill={scale.green[2]}
            opacity={apertura * 0.5}
          />

          {[
            { lado: "izq", x: 90, ancho: 170, eje: 90 },
            { lado: "der", x: 260, ancho: 170, eje: 430 },
          ].map(({ lado, x, ancho, eje }) => (
            <g
              key={lado}
              // El eje de giro es el canto exterior, contra la jamba.
              transform={`translate(${eje} 0) scale(${hoja} 1) translate(${-eje} 0)`}
            >
              <rect
                x={x}
                y="100"
                width={ancho}
                height="510"
                fill={lado === "izq" ? "url(#hojaIzq)" : "url(#hojaDer)"}
              />
              {paneles.map((p) => (
                <rect
                  key={p}
                  x={x + 26}
                  y={130 + p * 470}
                  width={ancho - 52}
                  height={92}
                  rx="4"
                  fill="none"
                  stroke={scale.green[5]}
                  strokeWidth="5"
                  opacity={0.7}
                />
              ))}
              {/* Aldaba, junto al canto que se abre. */}
              <circle
                cx={lado === "izq" ? x + ancho - 34 : x + 34}
                cy="390"
                r="13"
                fill="none"
                stroke={brand.lime}
                strokeWidth="7"
              />
            </g>
          ))}

          {/* Sombra que arroja cada hoja sobre el umbral al abrirse. */}
          <rect
            x="90"
            y="100"
            width="340"
            height="510"
            fill={brand.forest}
            opacity={(1 - apertura) * 0.12}
          />
        </g>

        {/* Jamba: el grosor del muro, por delante de las hojas. */}
        <path
          d="M40 620 V280 A220 220 0 0 1 480 280 V620 H430 V280 A170 170 0 0 0 90 280 V620 Z"
          fill={brand.forest}
        />
        {/* Arco de dovelas. */}
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
