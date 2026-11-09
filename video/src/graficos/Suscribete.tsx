import { Interactive } from "remotion";
import { brand, color, weight } from "../brand/theme";

/**
 * Cápsula de redes: una sola red y la web.
 *
 * La pieza original traía dos banners quemados seguidos, uno con cuatro
 * redes y otro con el logo y la web. Esta cápsula los tapa a los dos en la
 * misma posición (60-1020 px de ancho, 250-380 de alto) y se queda con lo
 * que importa: dónde seguirnos y dónde reservar.
 */
const IconoFacebook: React.FC = () => (
  <svg width="54" height="54" viewBox="0 0 54 54">
    <circle cx="27" cy="27" r="27" fill="#fff" />
    <path
      d="M30.5 44V29.6h4.8l.7-5.6h-5.5v-3.6c0-1.6.5-2.7 2.8-2.7h3V12.7c-.5-.1-2.3-.2-4.3-.2-4.3 0-7.2 2.6-7.2 7.4V24h-4.8v5.6h4.8V44z"
      fill={brand.green}
    />
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
      overflow: "hidden",
      backgroundColor: color.bg1,
      display: "flex",
      alignItems: "stretch",
    }}
  >
    <div
      style={{
        backgroundColor: brand.green,
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "0 34px 0 44px",
      }}
    >
      <IconoFacebook />
      <span style={{ fontSize: 38, lineHeight: 1.05, fontWeight: weight.extrabold, color: "#fff" }}>
        Subscribe
        <br />
        on Facebook
      </span>
    </div>
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Manrope, sans-serif",
        fontSize: 40,
        fontWeight: weight.bold,
        color: brand.forest,
      }}
    >
      santiagoways.com
    </div>
  </Interactive.Div>
);
