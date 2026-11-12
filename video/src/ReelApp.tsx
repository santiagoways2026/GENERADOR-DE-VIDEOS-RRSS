import { AbsoluteFill, Sequence } from "remotion";
import { brand, fontFamily } from "./brand/theme";
import { Cartela } from "./componentes/Cartela";
import { Clip } from "./componentes/Clip";
import { MarcaDeAgua } from "./componentes/Logo";
import { Movil } from "./componentes/Movil";
import { Planos } from "./componentes/Planos";
import { Cierre } from "./escenas/Cierre";

/**
 * Reel de la app de Santiago Ways: "todo tu Camino en el bolsillo".
 *
 * No es un tutorial. Tres cosas que el cliente lleva en el móvil, cada una
 * sobre planos reales del Camino: sus alojamientos (Voucher), la guía de cada
 * etapa (Dossier) y el mapa con la ruta, los pines y su ubicación.
 *
 * Las pantallas de `app-provisional/` salen del vídeo antiguo a 640x360 y solo
 * sirven para ver ritmo y estilo: se sustituyen por grabaciones nuevas. Los
 * tiempos de `T` son estimados hasta que llegue la locución.
 */

const T = { gancho: 0, alojamientos: 3, guia: 9.5, mapa: 16, cierre: 22.5, fin: 26 };
const f = (s: number) => Math.round(s * 30);
const tramo = (a: number, b: number) => ({ from: f(a), durationInFrames: f(b) - f(a) });

const ARRIBA_MOVIL = 640;

export const ReelApp: React.FC<{ provisional?: boolean }> = ({ provisional = true }) => (
  <AbsoluteFill style={{ backgroundColor: brand.grafito, fontFamily }}>
    <Sequence {...tramo(T.gancho, T.alojamientos)} name="Gancho">
      <Clip src="brutos-yt/v-sendero-gente.mp4" duracion={f(T.alojamientos)} overlay={0.34} zoom={1.05} />
      <Cartela principal="Todo tu Camino," secundaria="en el bolsillo" desde={4} />
    </Sequence>

    <Sequence {...tramo(T.alojamientos, T.guia)} name="Alojamientos">
      <Planos
        total={f(T.guia - T.alojamientos)}
        lista={[
          { src: "habitacion", dura: 2.17 },
          { src: "terraza", dura: 2.2 },
          { src: "casa-rural", dura: 1.17 },
          { src: "mesa-exterior", dura: 1.43 },
        ]}
      />
      <Cartela principal="Tus" secundaria="alojamientos" desde={4} />
      <Movil
        pantalla="app-provisional/documentacion.png"
        desde={10}
        zona={{ x: 40, y: 104, ancho: 446, alto: 330, desde: 40 }}
        provisional={provisional}
        style={{ top: ARRIBA_MOVIL }}
      />
    </Sequence>

    <Sequence {...tramo(T.guia, T.mapa)} name="Guía de ruta">
      <Planos
        total={f(T.mapa - T.guia)}
        lista={[
          { src: "flecha", dura: 1.17 },
          { src: "camino-abierto", dura: 1.17 },
          { src: "contraluz", dura: 1.43 },
          { src: "tunel-vegetacion", dura: 0.83 },
          { src: "piernas", dura: 2.23 },
        ]}
      />
      <Cartela principal="Tu guía de" secundaria="cada etapa" desde={4} />
      <Movil
        pantalla="app-provisional/documentacion.png"
        desde={10}
        zona={{ x: 40, y: 452, ancho: 446, alto: 250, desde: 40 }}
        provisional={provisional}
        style={{ top: ARRIBA_MOVIL }}
      />
    </Sequence>

    <Sequence {...tramo(T.mapa, T.cierre)} name="Mapa">
      <Planos
        total={f(T.cierre - T.mapa)}
        lista={[
          { src: "campo-flores", dura: 1.67 },
          { src: "pareja-muros", dura: 1.57, encuadre: "40% 50%" },
          { src: "rio-piedras", dura: 1.0 },
          { src: "grupo-peregrinos", dura: 0.73 },
          { src: "brazos-alto", dura: 0.97, encuadre: "34% 50%" },
        ]}
      />
      <Cartela principal="Y tu ruta," secundaria="en el mapa" desde={4} />
      <Movil
        pantalla="app-provisional/mapa.png"
        desde={10}
        ubicacion={{ x: 250, y: 640, desde: 45 }}
        provisional={provisional}
        style={{ top: ARRIBA_MOVIL }}
      />
    </Sequence>

    <Sequence {...tramo(T.gancho, T.cierre)} name="Marca de agua">
      <MarcaDeAgua />
    </Sequence>

    <Sequence {...tramo(T.cierre, T.fin)} name="Cierre">
      <Cierre duracion={f(T.fin - T.cierre)} />
    </Sequence>
  </AbsoluteFill>
);

export const DURACION_APP = f(T.fin);
