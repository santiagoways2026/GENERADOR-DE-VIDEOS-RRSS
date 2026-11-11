import { AbsoluteFill, Img, Interactive, staticFile } from "remotion";
import "../fuentes";
import { brand, fontFamily, paleta } from "../brand/theme";
import portadas from "./portadas.json";

/**
 * Portada de los shorts de Hildary, con el estilo de pegatina que se usa en
 * el resto de vídeos de la marca: foto real a sangre y el titular en tres
 * líneas ligeramente giradas.
 *
 *   1. Grafito con contorno blanco grueso.
 *   2. Placa verde Ways con el texto en blanco y borde blanco.
 *   3. Verde Ways con contorno blanco, la vieira y tres trazos de énfasis.
 *
 * La foto se elige a mano para cada short (portadas.json) y se copia antes a
 * public/portadas/<id>.jpg. Orden de preferencia: fotos propias, fotos de
 * clientes y, solo si hace falta, stock.
 *
 * Todo lo que importa cae dentro del recorte 4:5 de la cuadrícula de
 * Instagram (y 285 a 1635).
 */
type Datos = { id: string; lineas: string[]; encuadre?: string; alto?: number; acento?: number; zoom?: number; origenZoom?: string };


export const PortadaShort: React.FC<{ id: string }> = ({ id }) => {
  const d = (portadas as Datos[]).find((x) => x.id === id) as Datos;
  // Tarjeta blanca recta; el subrayado SW es un bloque verde girado -1,5° que
  // marca una o dos palabras (entre corchetes en portadas.json). Si ninguna
  // línea lleva corchetes, se subraya la línea `acento` entera.
  const lineas = d.lineas.some((l) => l.includes("["))
    ? d.lineas
    : d.lineas.map((l, k) => (k === (d.acento ?? 1) ? `[${l}]` : l));
  const limpio = (l: string) => l.replace(/[[\]]/g, "");
  // Mismo tamaño para todo el titular: el de la línea más larga.
  const tam = Math.min(150, ...lineas.map((l) => Math.floor(820 / (limpio(l).length * 0.6))));
  return (
    <AbsoluteFill style={{ backgroundColor: brand.green, fontFamily }}>
      <Img
        src={staticFile(`portadas/${d.id}.jpg`)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: d.encuadre ?? "50% 50%",
          scale: d.zoom ?? 1,
          transformOrigin: d.origenZoom ?? "50% 50%",
        }}
      />
      <Interactive.Div
        name="Titular de la portada"
        style={{ position: "absolute", top: d.alto ?? 330, left: 0, right: 0, display: "flex", justifyContent: "center" }}
      >
        <div
          style={{
            backgroundColor: brand.white,
            borderRadius: 44,
            padding: "36px 52px 44px",
            boxShadow: "0 18px 40px rgba(46, 46, 45, 0.28)",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 10,
          }}
        >
          {lineas.map((l, k) => (
            <div key={k} style={{ ...estiloTexto(tam), color: paleta.grafito, display: "flex", alignItems: "baseline" }}>
              {l.split(/(\[[^\]]+\])/).filter(Boolean).map((trozo, n) =>
                trozo.startsWith("[") ? (
                  <span
                    key={n}
                    style={{
                      display: "inline-block",
                      color: brand.white,
                      backgroundColor: paleta.verdeWays,
                      borderRadius: 16,
                      padding: "0px 22px 10px",
                      margin: "0 2px",
                      rotate: "-1.5deg",
                    }}
                  >
                    {trozo.slice(1, -1)}
                  </span>
                ) : (
                  <span key={n} style={{ whiteSpace: "pre" }}>{trozo}</span>
                ),
              )}
            </div>
          ))}
        </div>
      </Interactive.Div>
    </AbsoluteFill>
  );
};

const estiloTexto = (tam: number): React.CSSProperties => ({
  fontSize: tam,
  lineHeight: 1.08,
  fontWeight: 800,
  letterSpacing: "-0.03em",
  whiteSpace: "nowrap",
});




