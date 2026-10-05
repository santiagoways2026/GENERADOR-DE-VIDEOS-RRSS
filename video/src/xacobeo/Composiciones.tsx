import { Composition, Still } from "remotion";
import { format, fps } from "../brand/theme";
import { Portada } from "./Portada";
import { ShortXacobeo } from "./ShortXacobeo";
import datos from "./xacobeo.json";

/**
 * Shorts del Xacobeo 2027 y su portada para Instagram:
 *   npx remotion render Xacobeo-01-por-que-2027
 *   npx remotion still Portada-01-por-que-2027
 */
export const ComposicionesXacobeo: React.FC = () => (
  <>
    {datos.map((d) => (
      <Composition
        key={d.id}
        id={`Xacobeo-${d.id}`}
        component={ShortXacobeo}
        defaultProps={{ id: d.id }}
        durationInFrames={Math.round(d.duracion * fps)}
        fps={fps}
        width={format.reels.width}
        height={format.reels.height}
      />
    ))}
    {datos.map((d) => (
      <Still
        key={`v${d.id}`}
        id={`PortadaVerde-${d.id}`}
        component={Portada}
        defaultProps={{ id: d.id, variante: "verde" as const }}
        width={format.reels.width}
        height={format.reels.height}
      />
    ))}
    {datos.map((d) => (
      <Still
        key={`p${d.id}`}
        id={`Portada-${d.id}`}
        component={Portada}
        defaultProps={{ id: d.id }}
        width={format.reels.width}
        height={format.reels.height}
      />
    ))}
  </>
);
