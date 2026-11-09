import { Interactive } from "remotion";
import { brand, color, weight } from "../brand/theme";

/**
 * Etiqueta para suscribirse al canal de YouTube.
 *
 * La pieza original traía dos banners quemados seguidos, uno con cuatro
 * redes y otro con el logo y la web. Esta cápsula los tapa a los dos en la
 * misma posición (60-1020 px de ancho, 250-380 de alto) con una sola
 * petición. La web no va aquí: sale en el cierre.
 */
const IconoYouTube: React.FC = () => (
  <svg width="84" height="60" viewBox="0 0 84 60">
    <rect width="84" height="60" rx="16" fill="#fff" />
    <path d="M34 17 L56 30 L34 43 Z" fill={brand.green} />
  </svg>
);

export const Suscribete: React.FC = () => (
  <Interactive.Div
    name="Suscríbete"
    style={{
      position: "absolute",
      top: 244,
      left: 54,
      width: 972,
      height: 142,
      borderRadius: 71,
      backgroundColor: color.bg1,
      display: "flex",
      alignItems: "center",
      gap: 28,
      padding: "0 48px 0 30px",
    }}
  >
    <div
      style={{
        flex: "none",
        width: 118,
        height: 118,
        borderRadius: 999,
        backgroundColor: brand.green,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <IconoYouTube />
    </div>
    <span
      style={{
        fontSize: 46,
        lineHeight: 1.05,
        fontWeight: weight.extrabold,
        letterSpacing: "-0.01em",
        color: brand.forest,
      }}
    >
      Subscribe to our
      <br />
      YouTube channel
    </span>
  </Interactive.Div>
);
