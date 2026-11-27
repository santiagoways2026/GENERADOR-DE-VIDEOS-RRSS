import "./index.css";
import { MyComposition } from "./Composition";
import { PruebaGrafico } from "./PruebaGrafico";
import { ComposicionesShorts } from "./shorts/Composiciones";
import { ComposicionPaula } from "./paula/ShortPaula";
import { ComposicionesXacobeo } from "./xacobeo/Composiciones";
import { ComposicionesWebinar } from "./webinar/Webinar";
import { ComposicionesYtWebinar } from "./ytweb/Ventanas";
import { ComposicionesPortadaYT, ComposicionPortadaCanal, ComposicionPortadaPaula } from "./ytweb/PortadaYT";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <PruebaGrafico />
      <ComposicionesShorts />
      <ComposicionPaula />
      <ComposicionesXacobeo />
      <ComposicionesWebinar />
      <ComposicionesYtWebinar />
      <ComposicionesPortadaYT />
      <ComposicionPortadaCanal />
      <ComposicionPortadaPaula />
    </>
  );
};
