import { Composition, Still } from "remotion";
import { format, fps } from "../brand/theme";
import { Short } from "./Short";
import datos from "./shorts.json";
import { PruebaSync } from "./PruebaSync";
import { PortadaShort } from "./PortadaShort";
import portadas from "./portadas.json";

/** Un short por entrada de shorts.json: `npx remotion render Short-01-por-que-sarria`. */
export const ComposicionesShorts: React.FC = () => (
  <>
    <Composition id="PruebaSync" component={PruebaSync} durationInFrames={180} fps={fps} width={960} height={540} />
    {datos.map((d) => (
      <Composition
        key={d.id}
        id={`Short-${d.id}`}
        component={Short}
        defaultProps={{ id: d.id }}
        durationInFrames={Math.round(d.duracion * fps)}
        fps={fps}
        width={format.reels.width}
        height={format.reels.height}
      />
    ))}
    {/* Portada de cada short: `npx remotion still PortadaShort-01-por-que-sarria`. */}
    {portadas.map((p) => (
      <Still
        key={`p${p.id}`}
        id={`PortadaShort-${p.id}`}
        component={PortadaShort}
        defaultProps={{ id: p.id }}
        width={format.reels.width}
        height={format.reels.height}
      />
    ))}
  </>
);
