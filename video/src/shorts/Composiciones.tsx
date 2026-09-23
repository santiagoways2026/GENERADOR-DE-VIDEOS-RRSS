import { Composition } from "remotion";
import { format, fps } from "../brand/theme";
import { Short } from "./Short";
import datos from "./shorts.json";
import { PruebaSync } from "./PruebaSync";

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
  </>
);
