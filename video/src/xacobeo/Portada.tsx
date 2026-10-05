import { AbsoluteFill, Img, Interactive, staticFile } from "remotion";
import "../fuentes";
import { brand, fontFamily, paleta } from "../brand/theme";
import datos from "./xacobeo.json";

/**
 * Portada del short para Instagram.
 *
 * Se exporta a 1080x1920 (la portada del reel), pero en la cuadrícula del
 * perfil Instagram solo enseña el recorte central 4:5, de y 285 a 1635. Todo
 * lo que importa vive dentro de ese recorte: logo arriba, la cara de Hildary
 * en el centro y el titular abajo. Lo que queda fuera es solo fondo.
 *
 * Dos variantes, sin logo: "foto" (Hildary) y "verde" (fondo verde Ways y
 * el titular).
 */
const RECORTE = { arriba: 285, abajo: 1635 };

export const Portada: React.FC<{ id: string; variante?: "foto" | "verde" }> = ({ id, variante = "foto" }) => {
  const d = datos.find((x) => x.id === id) as (typeof datos)[number];
  const lineas = d.portada.titulo;

  if (variante === "verde") {
    // Solo el verde de la marca y el titular, centrado en el recorte 4:5.
    return (
      <AbsoluteFill style={{ backgroundColor: paleta.verdeWays, fontFamily, justifyContent: "center", alignItems: "center" }}>
        <Titular lineas={lineas} acento={d.portada.acento} grande />
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ backgroundColor: brand.green, fontFamily }}>
      {/* El fotograma se extrae antes con ffmpeg (render_xacobeo.sh): en una
          imagen fija, OffthreadVideo no aplica trimBefore y sale el primero. */}
      <Img
        src={staticFile(`xacobeo/portadas/${d.id}.jpg`)}
        style={{ width: "100%", height: "100%", objectFit: "cover", scale: 1.06, transformOrigin: "50% 38%" }}
      />

      {/* Velo grafito abajo para que el titular se lea sobre cualquier ropa. */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(46,46,45,0) 50%, rgba(46,46,45,0.38) 64%, rgba(46,46,45,0.66) 82%, rgba(46,46,45,0.72) 100%)",
        }}
      />


      <div style={{ position: "absolute", left: 60, right: 60, bottom: 1920 - RECORTE.abajo + 70 }}>
        <Titular lineas={lineas} acento={d.portada.acento} />
      </div>
    </AbsoluteFill>
  );
};

/** Etiqueta del Xacobeo y titular, con la última línea en placa verde sendero. */
const Titular: React.FC<{ lineas: string[]; acento: number; grande?: boolean }> = ({ lineas, acento, grande }) => (
  <Interactive.Div
    name="Titular de la portada"
    style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: grande ? 14 : 8 }}
  >
    <div
      style={{
        backgroundColor: paleta.sendero,
        color: brand.white,
        fontSize: grande ? 44 : 34,
        fontWeight: 900,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        padding: grande ? "10px 26px" : "8px 20px",
        borderRadius: 8,
        marginBottom: grande ? 24 : 14,
      }}
    >
      Xacobeo 2027
    </div>
    {lineas.map((linea, i) => (
      <div
        key={i}
        style={{
          fontSize: Math.min(grande ? 132 : 110, Math.floor((grande ? 960 : 940) / (linea.length * 0.78))),
          lineHeight: 1.04,
          fontWeight: 900,
          letterSpacing: "-0.02em",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          color: brand.white,
          backgroundColor: i === acento ? paleta.sendero : "transparent",
          padding: i === acento ? "4px 22px 10px" : 0,
          borderRadius: 10,
          textShadow: i === acento || grande ? "none" : "0 6px 24px rgba(46, 46, 45, 0.5)",
        }}
      >
        {linea}
      </div>
    ))}
  </Interactive.Div>
);
