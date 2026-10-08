import "./index.css";
import { MyComposition } from "./Composition";
import { PruebaGrafico } from "./PruebaGrafico";
import { ComposicionesShorts } from "./shorts/Composiciones";
import { ComposicionPaula } from "./paula/ShortPaula";
import { ComposicionesXacobeo } from "./xacobeo/Composiciones";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <PruebaGrafico />
      <ComposicionesShorts />
      <ComposicionPaula />
      <ComposicionesXacobeo />
    </>
  );
};
