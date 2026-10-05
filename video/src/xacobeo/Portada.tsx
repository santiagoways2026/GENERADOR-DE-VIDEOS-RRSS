import { AbsoluteFill, Img, Interactive, staticFile } from "remotion";
import "../fuentes";
import { brand, fontFamily } from "../brand/theme";
import { Logo } from "../componentes/Logo";
import datos from "./xacobeo.json";

/**
 * Portada del short para Instagram.
 *
 * Se exporta a 1080x1920 (la portada del reel), pero en la cuadrícula del
 * perfil Instagram solo enseña el recorte central 4:5, de y 285 a 1635. Todo
 * lo que importa vive dentro de ese recorte: logo arriba, la cara de Hildary
 * en el centro y el titular abajo. Lo que queda fuera es solo fondo.
 */
const RECORTE = { arriba: 285, abajo: 1635 };

export const Portada: React.FC<{ id: string }> = ({ id }) => {
  const d = datos.find((x) => x.id === id) as (typeof datos)[number];
  const lineas = d.portada.titulo;

  return (
    <AbsoluteFill style={{ backgroundColor: brand.forest, fontFamily }}>
      {/* El fotograma se extrae antes con ffmpeg (render_xacobeo.sh): en una
          imagen fija, OffthreadVideo no aplica trimBefore y sale el primero. */}
      <Img
        src={staticFile(`xacobeo/portadas/${d.id}.jpg`)}
        style={{ width: "100%", height: "100%", objectFit: "cover", scale: 1.06, transformOrigin: "50% 38%" }}
      />

      {/* Velo bosque abajo para que el titular se lea sobre cualquier ropa. */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(14,44,31,0) 48%, rgba(14,44,31,0.55) 62%, rgba(14,44,31,0.92) 82%, rgba(14,44,31,0.96) 100%)",
        }}
      />

      <Logo
        variante="blanco"
        ancho={260}
        style={{ position: "absolute", top: RECORTE.arriba + 50, left: (1080 - 260) / 2 }}
      />

      <Interactive.Div
        name="Titular de la portada"
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          bottom: 1920 - RECORTE.abajo + 70,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div
          style={{
            backgroundColor: brand.lime,
            color: brand.forest,
            fontSize: 34,
            fontWeight: 900,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            padding: "8px 20px",
            borderRadius: 8,
            marginBottom: 14,
          }}
        >
          Xacobeo 2027
        </div>
        {lineas.map((linea, i) => (
          <div
            key={i}
            style={{
              fontSize: Math.min(110, Math.floor(940 / (linea.length * 0.78))),
              lineHeight: 1.02,
              fontWeight: 900,
              letterSpacing: "-0.02em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              color: i === d.portada.acento ? brand.lime : brand.white,
              textShadow: "0 6px 24px rgba(14, 44, 31, 0.6)",
            }}
          >
            {linea}
          </div>
        ))}
      </Interactive.Div>
    </AbsoluteFill>
  );
};
