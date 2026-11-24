import React from "react";
import { Composition, Still } from "remotion";
import { ALTO, ANCHO, FPS } from "./marca";
import { DURACION_01, Video01 } from "./Video01";
import { DURACION_02, Video02 } from "./Video02";
import { DURACION_03, Video03 } from "./Video03";
import { DURACION_04, Video04 } from "./Video04";
import { DURACION_05, Video05 } from "./Video05";
import { Mini01, Mini02, Mini03, Mini04, Mini05 } from "./Miniaturas";

const comun = { fps: FPS, width: ANCHO, height: ALTO } as const;

/** Los verticales de enero de 2027, en español. */
export const ComposicionesEnero: React.FC = () => (
  <>
    <Composition
      id="Enero01PuertaSanta"
      component={Video01}
      durationInFrames={DURACION_01}
      {...comun}
    />
    <Composition
      id="Enero02Curiosidades"
      component={Video02}
      durationInFrames={DURACION_02}
      {...comun}
    />
    <Composition
      id="Enero03Caminos"
      component={Video03}
      durationInFrames={DURACION_03}
      {...comun}
    />
    <Composition
      id="Enero04Ourense"
      component={Video04}
      durationInFrames={DURACION_04}
      {...comun}
    />
    <Composition
      id="Enero05SemanaSanta"
      component={Video05}
      durationInFrames={DURACION_05}
      {...comun}
    />
    <Still id="Mini01" component={Mini01} width={ANCHO} height={ALTO} />
    <Still id="Mini02" component={Mini02} width={ANCHO} height={ALTO} />
    <Still id="Mini03" component={Mini03} width={ANCHO} height={ALTO} />
    <Still id="Mini04" component={Mini04} width={ANCHO} height={ALTO} />
    <Still id="Mini05" component={Mini05} width={ANCHO} height={ALTO} />
  </>
);
