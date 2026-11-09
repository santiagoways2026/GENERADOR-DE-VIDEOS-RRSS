import "./index.css";
import { ComposicionHilaryCompostela, MyComposition } from "./Composition";
import { PruebaGrafico } from "./PruebaGrafico";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <ComposicionHilaryCompostela />
      <PruebaGrafico />
    </>
  );
};
