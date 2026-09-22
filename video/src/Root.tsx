import "./index.css";
import { MyComposition } from "./Composition";
import { PruebaGrafico } from "./PruebaGrafico";
import { SWCaminoStoriesENComposition } from "./SWCaminoStoriesEN";
import { SWMiniaturaENComposition } from "./SWMiniaturaEN";
import { SWMiniaturaSinLogoENComposition } from "./SWMiniaturaSinLogoEN";
import { SWMuestraFuentesComposition } from "./SWMuestraFuentes";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <PruebaGrafico />
      <SWCaminoStoriesENComposition />
      <SWMiniaturaENComposition />
      <SWMiniaturaSinLogoENComposition />
      <SWMuestraFuentesComposition />
    </>
  );
};
