import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import {
  brand,
  color,
  easeOut,
  fontSize,
  radius,
  shadow,
  space,
  tracking,
  weight,
} from "../brand/theme";
import { entrada } from "../componentes/entrada";

/**
 * Etiqueta de precio que se cierra con un candado.
 *
 * Sin cifras ni porcentajes: el gesto de cerrar cuenta la idea entera, y
 * una cifra en una pieza anclada un ano seria una promesa que envejece.
 */
export const Candado: React.FC<{ texto?: string; desde?: number }> = ({
  texto = "Precio bloqueado hoy",
  desde = 0,
}) => {
  const frame = useCurrentFrame();
  const t = frame - desde;

  // El arco del candado baja hasta encajar en el cuerpo.
  const arco = interpolate(t, [18, 34], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...easeOut),
  });

  return (
    <Interactive.Div
      name="Candado"
      style={{
        display: "flex",
        alignItems: "center",
        gap: space[5],
        backgroundColor: color.bg1,
        borderRadius: radius.lg,
        boxShadow: shadow.raised,
        padding: `${space[5]}px ${space[6]}px`,
        opacity: entrada(frame, desde).opacity,
        translate: entrada(frame, desde).translate,
      }}
    >
      <svg width="120" height="150" viewBox="0 0 96 120">
        {/* Arco: sube fuera del cuerpo y baja al cerrarse. */}
        <path
          d={`M 26 ${58 - arco * 0} V 40 a 22 22 0 0 1 44 0 V 58`}
          fill="none"
          stroke={brand.green}
          strokeWidth="11"
          strokeLinecap="round"
          style={{
            translate: `0px ${(1 - arco) * -22}px`,
          }}
        />
        {/* Cuerpo */}
        <rect
          x="14"
          y="54"
          width="68"
          height="56"
          rx="12"
          fill={brand.green}
        />
        {/* Ojo de la cerradura */}
        <circle cx="48" cy="78" r="8" fill={color.bg1} />
        <rect x="44" y="82" width="8" height="16" rx="4" fill={color.bg1} />
      </svg>

      <div style={{ maxWidth: 380 }}>
        <div
          style={{
            fontSize: fontSize.md,
            fontWeight: weight.bold,
            letterSpacing: tracking.loose,
            textTransform: "uppercase",
            color: color.fg3,
          }}
        >
          Reservando ahora
        </div>
        <div
          style={{
            marginTop: space[2],
            fontSize: fontSize["3xl"],
            fontWeight: weight.black,
            lineHeight: 1.15,
            color: brand.forest,
          }}
        >
          {texto}
        </div>
      </div>
    </Interactive.Div>
  );
};
