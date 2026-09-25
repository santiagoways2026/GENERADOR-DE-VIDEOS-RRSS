import {
  AbsoluteFill,
  Audio,
  Composition,
  Easing,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import "./fuentes";

import { brand } from "./brand/theme";
import { PlacaMarca } from "./componentes/CartelaMarca";

/**
 * Santiago Ways · pieza de divulgación en inglés, reel 1080x1920 a 30 fps.
 *
 * Esta **no es un testimonio** y no se monta como uno: el clip ya viene
 * montado, con sus subtítulos palabra a palabra y su chapa de marca en el
 * segundo 26. De la receta del testimonio se aplican el recorte de la marca
 * de agua, la placa de cierre y el paso de entrega.
 *
 * El clip abría con un rótulo pegado, una caja verde con texto blanco arriba
 * del cuadro, del segundo 0,20 al 2,77. En su sitio va un titular grande, y
 * para que se lea hay que **quitarle el fondo a la presentadora**: el bambú
 * de detrás es demasiado ruidoso para poner texto encima. Eso no se puede
 * hacer desde Remotion, así que el fondo ya viene cambiado en el archivo, que
 * lo prepara `herramientas/scripts/recortar-figura.py`.
 *
 * El registro es **Montserrat 900 en caja alta y centrado**. 900 es el máximo
 * de la familia, así que cuando se pide más gruesa lo que sube es el cuerpo.
 *
 * **El final del clip no se usa.** De los 52,60 s que dice el contenedor, los
 * últimos 4,65 son negro y silencio digital, y antes hay un fundido a negro
 * del 47,30 al 47,87. La guía no funde a negro: la imagen se corta en 47,35 y
 * la placa de marca entra en 46,90, por encima del fundido.
 */

const FPS = 30;
const f = (s: number) => Math.round(s * FPS);

const MONTAJE = 47.35;
/**
 * La pista acaba en "decide", que se apaga en 47,38. Detrás hay una sílaba
 * suelta en 47,80-47,94, a -21 dB, que el clip arrastra ya sobre su propio
 * negro; ahí no dice nada y se va.
 */
const PISTA = 47.45;
const DURACION = 50.0;

const BASE = "montajes/compostela-abre.mp4";
const T = "brutos/testimonios/";
const FUENTE = "Montserrat, Manrope, sans-serif";

/** El movimiento de la guía: fundido más desplazamiento corto. Nunca rebote. */
const SUAVE = Easing.bezier(0.22, 0.61, 0.36, 1);

/** Ver `SWReelCaminoES` para por qué esto no es un porcentaje a pelo. */
const VENTANA = (9 / 16) / (16 / 9);
const mirar = (p: number) => `${(((p - VENTANA / 2) / (1 - VENTANA)) * 100).toFixed(1)}% 50%`;

type Linea = { texto: string; tam: number; color: string };

/** Fundido más subida corta, con relevo entre líneas. */
const entra = (frame: number, desde: number, largo: number) => ({
  opacity: interpolate(frame, [desde, desde + largo], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: SUAVE,
  }),
  transform: `translateY(${interpolate(frame, [desde, desde + largo], [26, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: SUAVE,
  })}px)`,
});

const Lineas: React.FC<{ lineas: Linea[]; largo: number; relevo: number }> = ({
  lineas,
  largo,
  relevo,
}) => {
  const frame = useCurrentFrame();
  return (
    <>
      {lineas.map((l, i) => (
        <div
          key={l.texto}
          style={{
            fontFamily: FUENTE,
            fontSize: l.tam,
            fontWeight: 900,
            lineHeight: 0.94,
            letterSpacing: "-0.03em",
            color: l.color,
            ...entra(frame, relevo * i, largo),
          }}
        >
          {l.texto}
        </div>
      ))}
    </>
  );
};

/**
 * La tarjeta de apertura: velo suave y texto encima.
 *
 * Va sobre el degradado de marca, que es plano, así que basta con el velo,
 * el mismo recurso que llevan las cartelas de la línea. Medido: la lima
 * sobre el olivo a pelo da 2,23:1 de contraste y el blanco 2,88, por debajo
 * del 3:1 que es el mínimo para texto grande; con el velo al 45 % suben a
 * 3,87 y 4,99.
 */
const APERTURA: Linea[] = [
  { texto: "WHAT IS THE CAMINO DE", tam: 66, color: brand.white },
  { texto: "SANTIAGO?", tam: 150, color: brand.lime },
];

const TarjetaApertura: React.FC<{ total: number }> = ({ total }) => {
  const frame = useCurrentFrame();
  const salida = interpolate(frame, [total - 12, total], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: 130,
        opacity: salida,
      }}
    >
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(24,72,52,0.55) 0%, rgba(24,72,52,0.45) 20%, rgba(24,72,52,0) 34%)",
        }}
      />
      <div style={{ textAlign: "center", position: "relative" }}>
        <Lineas lineas={APERTURA} largo={14} relevo={6} />
      </div>
    </AbsoluteFill>
  );
};

/**
 * Los rótulos de ruta: **placa de bosque y letras en el verde de marca**.
 *
 * Aquí el velo no vale, y no es cuestión de gusto. Medido contra el 10 % más
 * claro del fondo real de cada tramo, con el velo al 45 % que lleva la
 * tarjeta de apertura, el verde olivo `#7AA606` se queda entre **1,15 y 1,44**
 * de contraste. A eso no se le llama poco legible, se le llama ilegible: el
 * mínimo para texto grande es 3:1. Y no se arregla apretando el velo, porque
 * a 0,85 todavía anda por 2,62. Sólo con la placa opaca llega a **3,61**.
 *
 * Que además es lo que hace el kit de la marca, que no pone texto suelto
 * sobre el plano sino sobre placa. El bosque es la tinta de la guía, así que
 * la placa va de bosque y las letras del verde que se pidió.
 *
 * **Cuerpo 88 para los cinco**, y lo fija el más largo: "CAMINO PRIMITIVO"
 * mide 889 px y la placa deja 892 de hueco entre márgenes. A 95 se sale, y
 * cambiar el cuerpo de uno a otro en una lista de cuatro rutas se ve.
 */
const RUTA_TAM = 88;
const PIE_TAM = 52;

const RotuloRuta: React.FC<{ lineas: Linea[]; total: number; rapido?: boolean }> = ({
  lineas,
  total,
  rapido = false,
}) => {
  const frame = useCurrentFrame();
  const largo = rapido ? 8 : 14;
  const salida = interpolate(frame, [total - largo, total], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: 150,
        opacity: salida,
      }}
    >
      <div
        style={{
          textAlign: "center",
          backgroundColor: brand.forest,
          padding: "26px 34px 30px",
          borderRadius: 6,
          ...entra(frame, 0, largo),
        }}
      >
        <Lineas lineas={lineas} largo={largo} relevo={rapido ? 0 : 5} />
      </div>
    </AbsoluteFill>
  );
};

/**
 * Las rutas, cada una sobre el momento en que ella la nombra. Los límites
 * salen de medir los huecos sin voz, no de repartir a ojo.
 *
 * "MOST POPULAR" y "MOST POPULAR START" no son adornos: ella dice "some
 * routes are more popular" justo antes de la francesa, y "a lot of people
 * start in Sarria" justo antes de Sarria.
 */
const RUTAS: { desde: number; hasta: number; lineas: Linea[]; nombre: string }[] = [
  {
    desde: 20.1,
    hasta: 24.3,
    nombre: "French Way",
    lineas: [
      { texto: "FRENCH WAY", tam: RUTA_TAM, color: brand.green },
      { texto: "MOST POPULAR", tam: PIE_TAM, color: brand.white },
    ],
  },
  {
    desde: 24.45,
    hasta: 26.3,
    nombre: "Portuguese Way",
    lineas: [{ texto: "PORTUGUESE WAY", tam: RUTA_TAM, color: brand.green }],
  },
  {
    desde: 26.55,
    hasta: 27.75,
    nombre: "Northern Way",
    lineas: [{ texto: "NORTHERN WAY", tam: RUTA_TAM, color: brand.green }],
  },
  {
    desde: 27.85,
    hasta: 29.3,
    nombre: "Camino Primitivo",
    lineas: [{ texto: "CAMINO PRIMITIVO", tam: RUTA_TAM, color: brand.green }],
  },
  {
    desde: 34.3,
    hasta: 36.95,
    nombre: "Sarria",
    lineas: [
      { texto: "SARRIA", tam: RUTA_TAM, color: brand.green },
      { texto: "MOST POPULAR START", tam: PIE_TAM, color: brand.white },
    ],
  },
];

/**
 * Dos planos de recurso y no más, que es lo que se pidió. Uno de camino
 * andando sobre "it was all organized", y uno de llegada celebrando sobre la
 * frase que cierra, "the Camino starts wherever you decide": esa frase gana
 * mucho más sobre gente celebrando que sobre un plano de ella hablando.
 */
type Insercion = {
  desde: number;
  hasta: number;
  origen: number;
  fuente: string;
  encuadre: string;
  nombre: string;
};

const INSERCIONES: Insercion[] = [
  { desde: 41.3, hasta: 43.2, origen: 0.0, fuente: T + "camino-dedaleras.mp4", encuadre: mirar(0.39), nombre: "Recurso · camino entre dedaleras" },
  { desde: 45.4, hasta: 46.5, origen: 0.0, fuente: T + "brazos-celebracion.mp4", encuadre: mirar(0.41), nombre: "Recurso · celebracion" },
];

export const SWDivulgaCompostelaEN: React.FC = () => {
  const total = f(DURACION);
  const entraPlaca = f(46.9);

  return (
    <AbsoluteFill style={{ backgroundColor: brand.green }}>
      <Sequence durationInFrames={f(MONTAJE)} name="Montaje">
        <OffthreadVideo
          src={staticFile(BASE)}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Sequence>

      <Sequence durationInFrames={f(PISTA)} name="Pista">
        <Audio src={staticFile(BASE)} />
      </Sequence>

      {INSERCIONES.map((s) => (
        <Sequence
          key={s.desde}
          from={f(s.desde)}
          durationInFrames={f(s.hasta) - f(s.desde)}
          name={s.nombre}
        >
          <OffthreadVideo
            src={staticFile(s.fuente)}
            trimBefore={f(s.origen)}
            muted
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: s.encuadre,
            }}
          />
        </Sequence>
      ))}

      <Sequence durationInFrames={f(2.9)} name="1 · What is the Camino">
        <TarjetaApertura total={f(2.9)} />
      </Sequence>

      {RUTAS.map((r, i) => (
        <Sequence
          key={r.desde}
          from={f(r.desde)}
          durationInFrames={f(r.hasta) - f(r.desde)}
          name={`${i + 2} · ${r.nombre}`}
        >
          <RotuloRuta
            lineas={r.lineas}
            total={f(r.hasta) - f(r.desde)}
            rapido={r.lineas.length === 1}
          />
        </Sequence>
      ))}

      <Sequence from={entraPlaca} durationInFrames={total - entraPlaca} name="7 · Placa de marca">
        <PlacaMarca ancho={560} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const SWDivulgaCompostelaENComposition: React.FC = () => (
  <Composition
    id="SWDivulgaCompostelaEN"
    component={SWDivulgaCompostelaEN}
    durationInFrames={f(DURACION)}
    fps={FPS}
    width={1080}
    height={1920}
  />
);
