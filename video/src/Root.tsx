import "./index.css";
import { MyComposition } from "./Composition";
import { PruebaFuente } from "./PruebaFuente";
import { PruebaGrafico } from "./PruebaGrafico";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <PruebaGrafico />
      <PruebaFuente />
    </>
  );
};
