import "./index.css";

/**
 * El índice de Studio, agrupado por línea. Ver el `CLAUDE.md` de la raíz:
 * cada grupo tiene su receta y no se monta como los otros.
 */

// Shorts · divulgación en inglés, presentadora a cámara, 1080x1920
import { SWShortCompostelaENComposition } from "./shorts/SWShortCompostelaEN";
import { SWShortDuracionENComposition } from "./shorts/SWShortDuracionEN";

// Testimonios · un cliente hablando, en su idioma
import { SWReelCaminoESComposition } from "./testimonios/SWReelCaminoES";
import { SWReelAsistenciaESComposition } from "./testimonios/SWReelAsistenciaES";
import { SWReelGrupoESComposition } from "./testimonios/SWReelGrupoES";
import { SWReelCaminoDEComposition } from "./testimonios/SWReelCaminoDE";
import { SWReelHotelesENComposition } from "./testimonios/SWReelHotelesEN";
import { SWSocialCaminoESComposition } from "./testimonios/SWSocialCaminoES";

// Horizontales · la línea editorial, con el modelo aún por cerrar
import { SWCaminoStoriesENComposition } from "./horizontales/SWCaminoStoriesEN";
import { SWMiniaturaENComposition } from "./horizontales/SWMiniaturaEN";
import { SWMiniaturaSinLogoENComposition } from "./horizontales/SWMiniaturaSinLogoEN";

// Utilidades · no son piezas, son bancos de prueba
import { SWMuestraFuentesComposition } from "./utilidades/SWMuestraFuentes";

// Archivo · piezas de antes de que hubiera líneas. Se renderizan, no se tocan
import { ReelXacobeoComposition } from "./archivo/ReelXacobeo";
import { BancoGraficos } from "./archivo/BancoGraficos";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <SWShortCompostelaENComposition />
      <SWShortDuracionENComposition />

      <SWReelCaminoESComposition />
      <SWReelAsistenciaESComposition />
      <SWReelGrupoESComposition />
      <SWReelCaminoDEComposition />
      <SWReelHotelesENComposition />
      <SWSocialCaminoESComposition />

      <SWCaminoStoriesENComposition />
      <SWMiniaturaENComposition />
      <SWMiniaturaSinLogoENComposition />

      <SWMuestraFuentesComposition />

      <ReelXacobeoComposition />
      <BancoGraficos />
    </>
  );
};
