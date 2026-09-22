import { AbsoluteFill, Composition } from "remotion";
import { SWMiniaturaEN } from "./SWMiniaturaEN";

/**
 * La misma miniatura, sin el logo. El equipo coloca la marca despues, asi que
 * se entregan las dos y se elige.
 *
 * La esquina superior derecha queda libre: es donde estaba el logo y donde
 * cabe sin tapar ninguna cara.
 */
export const SWMiniaturaSinLogoEN: React.FC = () => (
  <AbsoluteFill>
    <SWMiniaturaEN sinLogo />
  </AbsoluteFill>
);

export const SWMiniaturaSinLogoENComposition: React.FC = () => (
  <Composition
    id="SWMiniaturaSinLogoEN"
    component={SWMiniaturaSinLogoEN}
    durationInFrames={1}
    fps={30}
    width={1280}
    height={720}
  />
);
