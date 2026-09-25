import {
  AbsoluteFill,
  Composition,
  OffthreadVideo,
  Sequence,
  staticFile,
} from "remotion";
import "./fuentes";

import { brand } from "./brand/theme";
import { Cartela, CierreMarca, PlacaMarca } from "./componentes/CartelaMarca";

/**
 * Santiago Ways · testimonio de la pareja, espanol, reel 1080x1920 a 30 fps.
 *
 * Sale de un clip vertical de 720x1280 que venia de un editor online, con su
 * marca de agua pegada abajo a la derecha. La marca se quita **recortando**,
 * que es lo que dice `marca-agua.py`: ocupaba del pixel 1227 al 1254 de alto,
 * asi que cortando por 1218 sale de cuadro con margen. El recorte devuelve el
 * 9:16 con un zoom de 1,053x y se lleva el 4,8 % por abajo y otro tanto por
 * los lados. Borrar la marca en su sitio no sirve aqui: cae sobre los pies y
 * la piedra, con mucha textura, y ahi el relleno se ve.
 *
 * La base ya es vertical, asi que a diferencia de `SWReelCaminoES` no hay que
 * reencuadrar plano a plano: va entera en un `OffthreadVideo` con su audio.
 * Los que si hay que encuadrar son los planos de la biblioteca, que son 16:9.
 *
 * Lo que esta escena pone encima:
 *
 * 1. **Tres planos de catedral** en los primeros 5,63 s. Debajo habia un
 *    puente medieval con cielo gris y cables de luz cruzando el cuadro, que
 *    no abre nada. Van de lo general al detalle y con gente en medio, que es
 *    como se encadenan planos del mismo monumento sin que parezcan saltos.
 * 2. **Cuatro planos de alojamiento** del 40,53 al 46,80, debajo de la
 *    cartela de hoteles.
 * 3. **Tres cartelas** y el cierre de marca.
 *
 * Los tiempos salen de transcribir el audio y de medir los cortes del propio
 * clip, no de mirar la linea de tiempo a ojo.
 */

const FPS = 30;
const f = (s: number) => Math.round(s * FPS);

/** El clip dura 64,98 s. Detras va la placa de marca. */
const MONTAJE = 64.98;
const DURACION = 67.8;

const MARGEN = 72;
const MARGEN_ABAJO = 480;
/**
 * 70, no los 76 de los otros reels: "organizado en hoteles" con su recuadro
 * mide 919 px a 76 sobre un util de 936, y "Teléfono de asistencia" 887. Con
 * 17 px de holgura una cartela no se da por buena, porque las lineas no se
 * parten solas: se salen del lienzo. A 70 la peor baja a 846.
 *
 * Aqui no hace falta bajar mas. La pareja esta sentada y a media altura: la
 * barbilla mas baja de la pieza cae en el pixel 950 de los 1920, asi que el
 * bloque de texto, que arranca en 1290, no se le acerca.
 */
const TAM = 70;
const TAM_PIE = 34;

const BASE = "montajes/testimonio-ES2.mp4";
const B = "brutos/";
const T = "brutos/testimonios/";

/**
 * De "donde esta esto en la imagen" a `objectPosition`. Un 16:9 recortado a
 * 9:16 deja ver el 33,75 % del ancho, asi que un `71 %` no centra el recorte
 * en el 71 % de la imagen sino en el 64 %. Los numeros salen de
 * `herramientas/scripts/encuadrar.py` y estan mirados en un fotograma.
 */
const VENTANA = (9 / 16) / (16 / 9);
const mirar = (p: number) => `${(((p - VENTANA / 2) / (1 - VENTANA)) * 100).toFixed(1)}% 50%`;

type Insercion = {
  desde: number;
  hasta: number;
  origen: number;
  fuente: string;
  /** Por debajo de 1 alarga el plano sin repetirlo. */
  ritmo?: number;
  encuadre?: string;
  nombre: string;
};

const INSERCIONES: Insercion[] = [
  /*
   * Apertura. El clip abria con el puente y cinco segundos y medio de cielo
   * gris; entra la catedral, que es lo que se pidio. Tres planos, de lo
   * general al detalle: las dos torres enteras, una torre de cerca con una
   * persona al pie y el timpano. Tres encuadres seguidos de torres contra
   * nubes se leerian como un salto; con la persona en medio y el detalle al
   * final, se lee como una secuencia.
   */
  { desde: 0.0, hasta: 2.1, origen: 0.0, fuente: T + "catedral-nubes.mp4", encuadre: mirar(0.5), nombre: "Apertura · las dos torres" },
  { desde: 2.1, hasta: 4.0, origen: 0.0, fuente: T + "catedral-escalinata.mp4", encuadre: mirar(0.55), nombre: "Apertura · torre con gente" },
  { desde: 4.0, hasta: 5.63, origen: 0.0, fuente: T + "timpano-romanico.mp4", encuadre: mirar(0.41), nombre: "Apertura · timpano" },
  /*
   * Alojamiento, debajo de la cartela de hoteles, sobre "recomendaríamos a
   * Santiago Ways porque hasta el momento todo está siendo fenomenal".
   * Ocupan el hueco entero del letrero de SANTIAGO de COMPOSTELA, que eran
   * 6,27 s de un rotulo quieto.
   *
   * El primero es el unico 1080p de los cuatro y el mejor: habitacion con
   * cama y ventanal al embalse. Los otros tres son de 720p y duran poco, asi
   * que van con `ritmo` por debajo de 1; son planos quietos, de 0,38 a 1,08
   * de movimiento, y ahi no se ve la camara lenta. Los tres dejan un
   * fotograma de holgura: a cero, `comprobar-inserciones.py` no avisa pero
   * cualquier redondeo congela el ultimo fotograma.
   */
  { desde: 40.53, hasta: 42.6, origen: 0.05, fuente: B + "habitacion.mp4", encuadre: mirar(0.55), nombre: "Hoteles · habitacion con vistas" },
  { desde: 42.6, hasta: 44.05, origen: 0.0, fuente: T + "habitacion-doble.mp4", ritmo: 0.68, encuadre: mirar(0.35), nombre: "Hoteles · habitacion doble" },
  { desde: 44.05, hasta: 45.4, origen: 0.0, fuente: T + "lounge-hotel.mp4", ritmo: 0.86, encuadre: mirar(0.35), nombre: "Hoteles · salon" },
  { desde: 45.4, hasta: 46.8, origen: 0.0, fuente: T + "bano-ducha.mp4", ritmo: 0.85, encuadre: mirar(0.5), nombre: "Hoteles · baño privado" },
];

/* ------------------------------------------------------------------ */

export const SWReelAsistenciaES: React.FC = () => {
  const total = f(DURACION);
  const finMontaje = f(MONTAJE);
  const entraPlaca = f(64.6);
  const entraCierre = f(61.4);

  return (
    <AbsoluteFill style={{ backgroundColor: brand.green }}>
      {/* La base ya es 9:16: `cover` no recorta nada y el audio va con ella. */}
      <Sequence durationInFrames={finMontaje} name="Montaje">
        <OffthreadVideo
          src={staticFile(BASE)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
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
            playbackRate={s.ritmo ?? 1}
            muted
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: s.encuadre ?? "50% 50%",
            }}
          />
        </Sequence>
      ))}

      {/* 1 · sobre "con Santiago Ways la relación ha sido fantástica", 0,70-5,28 */}
      <Sequence from={f(0.6)} durationInFrames={f(5.4) - f(0.6)} name="1 · Camino organizado">
        <Cartela
          lineas={[
            [{ texto: "Camino de Santiago" }],
            [{ texto: "organizado en hoteles", destacado: true }],
          ]}
          total={f(5.4) - f(0.6)}
          tam={TAM}
          margen={MARGEN}
          margenAbajo={MARGEN_ABAJO}
          tamPie={TAM_PIE}
        />
      </Sequence>

      {/*
        2 · "poder tener un número de apoyo 24 horas todos los días del
        viaje", 21,5-25,5. La cartela entra en 22,0, que es donde empieza la
        frase, y se queda hasta 26,6.
      */}
      <Sequence from={f(22.0)} durationInFrames={f(26.6) - f(22.0)} name="2 · Teléfono 24/7">
        <Cartela
          lineas={[
            [{ texto: "Teléfono de asistencia" }],
            [{ texto: "24/7", destacado: true }],
          ]}
          total={f(26.6) - f(22.0)}
          tam={TAM}
          margen={MARGEN}
          margenAbajo={MARGEN_ABAJO}
          tamPie={TAM_PIE}
        />
      </Sequence>

      {/* 3 · sobre los cuatro planos de alojamiento, 40,53-46,80 */}
      <Sequence from={f(40.8)} durationInFrames={f(46.6) - f(40.8)} name="3 · Hoteles seleccionados">
        <Cartela
          lineas={[[{ texto: "Hoteles" }], [{ texto: "seleccionados", destacado: true }]]}
          pie={["Habitación y baño privados"]}
          total={f(46.6) - f(40.8)}
          tam={TAM}
          margen={MARGEN}
          margenAbajo={MARGEN_ABAJO}
          tamPie={TAM_PIE}
        />
      </Sequence>

      <Sequence from={entraCierre} durationInFrames={total - entraCierre} name="4 · Tu Camino empieza aquí">
        <CierreMarca
          lineas={[[{ texto: "Tu Camino" }], [{ texto: "empieza aquí", destacado: true }]]}
          salidaTexto={f(64.5) - entraCierre}
          tam={TAM}
          margen={MARGEN}
          margenAbajo={MARGEN_ABAJO}
          abajo
        />
      </Sequence>

      <Sequence from={entraPlaca} durationInFrames={total - entraPlaca} name="5 · Placa de marca">
        <PlacaMarca />
      </Sequence>
    </AbsoluteFill>
  );
};

export const SWReelAsistenciaESComposition: React.FC = () => (
  <Composition
    id="SWReelAsistenciaES"
    component={SWReelAsistenciaES}
    durationInFrames={f(DURACION)}
    fps={FPS}
    width={1080}
    height={1920}
  />
);
