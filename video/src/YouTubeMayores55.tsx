import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { brand, fontFamily } from "./brand/theme";
import { Cartela } from "./componentes/Cartela";
import { Clip } from "./componentes/Clip";
import { MarcaDeAgua } from "./componentes/Logo";
import { Subtitulos, type Pie } from "./componentes/Subtitulos";
import locucion from "./datos/locucion-55.json";
import { Capitulo } from "./escenas/Capitulo";
import { Cierre } from "./escenas/Cierre";
import { Dividido } from "./escenas/Dividido";
import { Triptico } from "./escenas/Triptico";
import { CasiLaMitad } from "./graficos/CasiLaMitad";
import { PerfilSarria } from "./graficos/PerfilSarria";

/**
 * "Camino de Santiago a partir de los 55", para YouTube, horizontal, sin
 * presentador.
 *
 * Estructura: gancho emocional (el momento vital en que se decide ir), el dato
 * que tranquiliza, tres claves prácticas con su capítulo cada una, el cierre
 * emocional y la pantalla final blanca con un único CTA.
 *
 * El metraje propio es casi todo vertical. Se enseña como tal, en trípticos y
 * pantallas divididas sobre blanco, y el horizontal se reserva para los planos
 * a pantalla completa. Los gráficos solo donde explican algo.
 *
 * Los tiempos de `T` son estimados hasta que llegue la locución grabada;
 * entonces se miden sus silencios y se sustituyen, igual que en los reels.
 */

/** Arranque de cada tramo, en segundos. */
const T = {
  gancho: 0,
  momentos: 9,
  dato: 16,
  mitad: 23,
  excepcion: 31,
  cabecera: 37,
  cap1: 39.5,
  caminado: 42,
  paseos: 50,
  cap2: 57,
  sarria: 59.5,
  perfil: 65,
  bajada: 81,
  cap3: 85,
  calzado: 87.5,
  pies: 95,
  recuerdo: 102.5,
  llegada: 108,
  cta: 118,
  final: 130,
  fin: 138,
};
const f = (s: number) => Math.round(s * 30);
const tramo = (a: number, b: number) => ({ from: f(a), durationInFrames: f(b) - f(a) });

/**
 * Plano horizontal a pantalla completa. Con texto encima, el velo grafito sube
 * para que el blanco se lea sobre follaje claro. La marca de agua se puede
 * quitar donde caería sobre una cara.
 */
const Completo: React.FC<{
  src: string;
  dura: number;
  desde?: number;
  conTexto?: boolean;
  marca?: boolean;
}> = ({ src, dura, desde = 0, conTexto = false, marca = true }) => (
  <>
    <Clip src={src} desdeSegundo={desde} duracion={f(dura)} overlay={conTexto ? 0.34 : 0.15} zoom={1.05} />
    {marca ? <MarcaDeAgua ancho={36} margen={32} /> : null}
  </>
);

/** Varios planos horizontales seguidos, con la duración repartida. */
const Serie: React.FC<{ planos: { src: string; dura: number; encuadre?: string }[]; total: number }> = ({ planos, total }) => {
  const suma = planos.reduce((a, p) => a + p.dura, 0);
  let acum = 0;
  return (
    <>
      {planos.map((p, i) => {
        const ini = acum;
        const fin = i === planos.length - 1 ? total : acum + Math.round((p.dura / suma) * total);
        acum = fin;
        return (
          <Sequence key={p.src} from={ini} durationInFrames={fin - ini} name={p.src}>
            <Clip src={p.src} duracion={fin - ini} overlay={0.15} zoom={1.05} encuadre={p.encuadre} />
          </Sequence>
        );
      })}
      <MarcaDeAgua ancho={36} margen={32} />
    </>
  );
};

const YT = (n: string) => `brutos-yt/${n}.mp4`;
const BR = (n: string) => `brutos/${n}.mp4`;

export const YouTubeMayores55: React.FC<{
  /** Subtítulos quemados: solo en la versión guía. El máster va limpio y los
   *  subtítulos se suben a YouTube como pistas .srt en español e inglés. */
  subtitulos?: boolean;
  /** Archivo de locución en public/, cuando esté grabada. */
  locucionArchivo?: string;
}> = ({ subtitulos = false, locucionArchivo }) => {
  const pies: Pie[] = locucion.pies.map((p) => ({ desde: p.desde, hasta: p.hasta, texto: p.es }));

  return (
    <AbsoluteFill style={{ backgroundColor: brand.white, fontFamily }}>
      {locucionArchivo ? <Audio src={staticFile(locucionArchivo)} /> : null}

      {/* Gancho: el viaje que se guarda durante años. */}
      <Sequence {...tramo(T.gancho, T.momentos)} name="Gancho">
        {/* Sin marca de agua: quien viene hacia cámara tiene la cara arriba a la derecha. */}
        <Completo src={YT("h-grupo-sendero")} dura={T.momentos - T.gancho} marca={false} />
      </Sequence>

      {/* Una jubilación, un cumpleaños, los hijos que se van. */}
      <Sequence {...tramo(T.momentos, T.dato)} name="Momentos">
        <Triptico
          duracion={f(T.dato - T.momentos)}
          planos={[
            { src: YT("v-mayores-bastones"), desde: 0 },
            { src: YT("v-fuente"), desde: f(2) },
            { src: YT("v-sello"), desde: f(4) },
          ]}
        />
      </Sequence>

      <Sequence {...tramo(T.dato, T.mitad)} name="Dato">
        <Serie
          total={f(T.mitad - T.dato)}
          planos={[
            { src: YT("h-sendero-sol"), dura: 3.8 },
            { src: YT("h-mochilas-iglesia"), dura: 5.3 },
          ]}
        />
      </Sequence>

      <Sequence {...tramo(T.mitad, T.excepcion)} name="Casi la mitad">
        <CasiLaMitad cuenta={10} />
      </Sequence>

      <Sequence {...tramo(T.excepcion, T.cabecera)} name="No vas a ser la excepción">
        <Completo src={YT("h-grupo-sendero")} desde={9} dura={T.cabecera - T.excepcion} conTexto />
        <Cartela
          principal="No vas a ser"
          secundaria="la excepción"
          desde={8}
          escala={2 / 3}
          posicion={{ top: 88, left: 72 }}
        />
      </Sequence>

      {/* Cabecera de marca, como en el brandbook: logo y web. */}
      <Sequence {...tramo(T.cabecera, T.cap1)} name="Cabecera">
        <Cierre duracion={f(T.cap1 - T.cabecera)} variante="verde" />
      </Sequence>

      {/* 1 · No hace falta estar en forma */}
      <Sequence {...tramo(T.cap1, T.caminado)} name="Capítulo 1">
        <Capitulo antetitulo="1 de 3" titular="No hace falta estar en forma" />
      </Sequence>
      <Sequence {...tramo(T.caminado, T.paseos)} name="Haber caminado">
        <Dividido
          src={YT("v-sendero-gente")}
          duracion={f(T.paseos - T.caminado)}
          titular="Hace falta haber"
          destacado="caminado"
          apoyo="Varias veces por semana, subiendo poco a poco y con algún día largo."
        />
      </Sequence>
      <Sequence {...tramo(T.paseos, T.cap2)} name="Paseos">
        <Serie
          total={f(T.cap2 - T.paseos)}
          planos={[
            { src: BR("campo-flores"), dura: 1.67 },
            { src: BR("contraluz"), dura: 1.43 },
            { src: BR("camino-abierto"), dura: 1.17 },
            { src: BR("tunel-vegetacion"), dura: 0.83 },
            { src: BR("rio-piedras"), dura: 1.0 },
            { src: BR("pareja-muros"), dura: 1.57, encuadre: "40% 50%" },
          ]}
        />
      </Sequence>

      {/* 2 · El día más largo */}
      <Sequence {...tramo(T.cap2, T.sarria)} name="Capítulo 2">
        <Capitulo antetitulo="2 de 3" titular="El día más largo" />
      </Sequence>
      <Sequence {...tramo(T.sarria, T.perfil)} name="Desde Sarria">
        <Dividido
          src={YT("v-sarria-letras")}
          duracion={f(T.perfil - T.sarria)}
          antetitulo="Desde Sarria"
          titular="5 etapas y"
          destacado="ningún puerto"
        />
      </Sequence>
      <Sequence {...tramo(T.perfil, T.bajada)} name="Perfil">
        <PerfilSarria dibujo={0} focoDura={60} focoMelide={f(9)} focoBajada={f(13.5)} />
      </Sequence>
      <Sequence {...tramo(T.bajada, T.cap3)} name="Bajada a Portomarín">
        <Dividido
          src={YT("v-portomarin")}
          duracion={f(T.cap3 - T.bajada)}
          antetitulo="Portomarín"
          titular="Ojo a la"
          destacado="bajada"
        />
      </Sequence>

      {/* 3 · Los zapatos */}
      <Sequence {...tramo(T.cap3, T.calzado)} name="Capítulo 3">
        <Capitulo antetitulo="3 de 3" titular="Los zapatos" />
      </Sequence>
      <Sequence {...tramo(T.calzado, T.pies)} name="Calzado de siempre">
        <Dividido
          src={YT("v-grupo-pies")}
          duracion={f(T.pies - T.calzado)}
          titular="Tu calzado"
          destacado="de siempre"
          apoyo="Y si compras, media talla más: con los kilómetros, los pies se hinchan."
        />
      </Sequence>
      <Sequence {...tramo(T.pies, T.recuerdo)} name="Caminando">
        <Serie
          total={f(T.recuerdo - T.pies)}
          planos={[
            { src: BR("piernas"), dura: 2.23 },
            { src: BR("escaleras"), dura: 1.2 },
            { src: BR("flecha"), dura: 1.17, encuadre: "58% 50%" },
            { src: BR("grupo-peregrinos"), dura: 0.73 },
            { src: BR("brazos-alto"), dura: 0.97, encuadre: "34% 50%" },
            { src: BR("grupo-mimosas"), dura: 1.17 },
          ]}
        />
      </Sequence>

      {/* Lo que de verdad se recuerda. */}
      <Sequence {...tramo(T.recuerdo, T.llegada)} name="Recuerdo">
        <Serie
          total={f(T.llegada - T.recuerdo)}
          planos={[
            { src: BR("brindis"), dura: 2.0, encuadre: "42% 50%" },
            { src: BR("compostela"), dura: 1.7, encuadre: "38% 50%" },
            { src: BR("manos-sellando"), dura: 1.6, encuadre: "28% 50%" },
            { src: BR("credencial"), dura: 1.07 },
          ]}
        />
      </Sequence>
      <Sequence {...tramo(T.llegada, T.cta)} name="La llegada">
        <Triptico
          duracion={f(T.cta - T.llegada)}
          planos={[
            { src: YT("v-mojon"), desde: 0 },
            { src: YT("v-vacas"), desde: f(2.5) },
            { src: YT("v-obradoiro"), desde: f(5) },
          ]}
        />
      </Sequence>

      {/* CTA de comentario, con la pregunta de experiencia. */}
      <Sequence {...tramo(T.cta, T.final)} name="Comentarios">
        <Completo src={YT("h-grupo-sendero")} desde={18} dura={T.final - T.cta} conTexto />
        <Cartela
          principal="¿Desde dónde"
          secundaria="empezaste?"
          desde={10}
          escala={2 / 3}
          posicion={{ top: 88, left: 72 }}
        />
      </Sequence>

      {/* Pantalla final blanca con un único CTA. */}
      <Sequence {...tramo(T.final, T.fin)} name="Pantalla final">
        <Cierre duracion={f(T.fin - T.final)} variante="blanco" cta="Suscríbete" />
      </Sequence>

      {subtitulos ? (
        <Sequence durationInFrames={f(T.final)} name="Subtítulos guía">
          <Subtitulos lista={pies} abajo={36} tamano={28} />
        </Sequence>
      ) : null}
    </AbsoluteFill>
  );
};

export const DURACION_YT55 = f(T.fin);
