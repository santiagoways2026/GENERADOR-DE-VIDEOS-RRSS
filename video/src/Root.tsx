import "./index.css";
// Las fuentes se cargan aquí, en la raíz, para que ninguna composición
// pueda renderizarse sin Montserrat.
import "./fuentes";
import { MyComposition } from "./Composition";
import { PruebaGrafico } from "./PruebaGrafico";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <PruebaGrafico />
    </>
  );
};
