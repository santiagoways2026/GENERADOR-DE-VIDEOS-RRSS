import { AbsoluteFill, Sequence } from "remotion";
import { brand } from "../brand/theme";
import { Panel } from "../componentes/Panel";

/**
 * Tres planos verticales, uno junto a otro, sobre blanco.
 *
 * Entran de uno en uno, cada uno cuando la voz nombra lo que enseña: es el
 * ritmo de enumeración ("una jubilación, un cumpleaños, los hijos que se van")
 * hecho imagen, sin un solo efecto añadido.
 */

const ALTO = 608;
const ANCHO = Math.round((ALTO * 9) / 16);
const HUECO = 24;

export const Triptico: React.FC<{
  planos: { src: string; desde: number; encuadre?: string }[];
  duracion: number;
}> = ({ planos, duracion }) => (
  <AbsoluteFill
    style={{
      backgroundColor: brand.white,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: HUECO,
    }}
  >
    {planos.map((p) => (
      // Cada panel arranca su vídeo cuando aparece, no al empezar la escena.
      <div key={p.src} style={{ position: "relative", width: ANCHO, height: ALTO }}>
        <Sequence from={p.desde} layout="none">
          <Panel
            src={p.src}
            ancho={ANCHO}
            alto={ALTO}
            duracion={duracion - p.desde}
            encuadre={p.encuadre}
          />
        </Sequence>
      </div>
    ))}
  </AbsoluteFill>
);
