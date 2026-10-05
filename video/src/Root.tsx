import "./index.css";
import { MyComposition } from "./Composition";
import { PruebaGrafico } from "./PruebaGrafico";
import { ComposicionesShorts } from "./shorts/Composiciones";
import { ComposicionesXacobeo } from "./xacobeo/Composiciones";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <PruebaGrafico />
      <ComposicionesShorts />
      <ComposicionesXacobeo />
    </>
  );
};
