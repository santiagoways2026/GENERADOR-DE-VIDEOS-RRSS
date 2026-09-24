import {
  AbsoluteFill,
  Audio,
  Composition,
  OffthreadVideo,
  Sequence,
  staticFile,
} from "remotion";
import "./fuentes";

import { brand } from "./brand/theme";
import { Cartela, CierreMarca, PlacaMarca } from "./componentes/CartelaMarca";

/**
 * Santiago Ways · el testimonio aleman, vertical para stories y TikTok.
 * 1080x1920 a 30 fps.
 *
 * El bruto venia de un editor online: 720x1280, subtitulos alemanes pegados
 * en el 60 % de alto y una marca de agua de clideo.com abajo a la derecha.
 * Ninguna de las dos se puede quitar del todo, asi que la pieza esta montada
 * para no necesitarlo:
 *
 * - **De los tres se ven tres planos y nada mas**, sacados de los momentos en
 *   que el rotulo no esta en pantalla. Se localizaron midiendo la firma del
 *   rotulo, pixel muy claro con uno muy oscuro a menos de cuatro pixeles, que
 *   es lo que deja el borde negro de las letras. Salen 0 de rastro en los
 *   tres. La marca de agua vive en las filas 1237 a 1253, asi que los planos
 *   van recortados a 692x1230 y se la dejan fuera.
 * - **El resto es biblioteca**, que ademas viene limpia y en mejor calidad.
 *
 * Ojo con la sincronia: **la imagen no va con el audio aleman.** Medido, el
 * movimiento de la zona de las bocas es el mismo cuando hablan que cuando la
 * pista esta en silencio, 0,81 contra 0,73 y 0,98. El aleman es una locucion
 * puesta encima, asi que los planos de cara van cortos, que es donde no se
 * nota, y nunca sobre una frase entera.
 *
 * La pista la monta `herramientas/scripts/audio-reel-de.py`: deja el
 * testimonio en 50,6 s de los 83 del bruto y le pone cama de ambiente al
 * final. **No lleva musica**, porque el bruto no la tiene.
 */

const FPS = 30;
const f = (s: number) => Math.round(s * FPS);

/** Donde entra la placa de marca y se acaba la imagen. */
const TESTIMONIO = 51.3;
const DURACION = 54.6;

const PISTA = "montajes/reel-de.wav";
const B = "brutos/";
const T = "brutos/testimonios/";
const V = "brutos/piezas-viejas/";
const D = "brutos/testimonio-de/";

const MARGEN = 72;
/**
 * En stories y TikTok los ultimos 300 px los tapa la interfaz, pero TikTok
 * mete ademas el pie de foto y el usuario por encima de eso, asi que el texto
 * sube hasta los 480 px del borde.
 */
const MARGEN_ABAJO = 480;
const TAM = 76;
const TAM_PIE = 34;

/* ------------------------------------------------------------------ */

type Insercion = {
  desde: number;
  hasta: number;
  origen: number;
  fuente: string;
  /** `playbackRate`. Por debajo de 1 el plano dura mas de lo que dura el archivo. */
  ritmo?: number;
  nombre: string;
};

/**
 * Los tres momentos en los que se ve al grupo. Son el mismo encuadre, que es
 * el unico que hay, y van repartidos: abren la pieza, caen sobre "wir sind
 * drei" y vuelven sobre lo que han conseguido. Los dos cortos van a 0,85 para
 * llegar al segundo, que de pie y quietos no se nota.
 */
const CARAS: Insercion[] = [
  { desde: 0.0, hasta: 2.05, origen: 0.0, fuente: D + "grupo-1.mp4", nombre: "Grupo 1 · abre" },
  { desde: 7.86, hasta: 8.9, origen: 0.0, fuente: D + "grupo-2.mp4", ritmo: 0.85, nombre: "Grupo 2 · wir sind drei" },
  { desde: 29.3, hasta: 30.3, origen: 0.0, fuente: D + "grupo-3.mp4", ritmo: 0.85, nombre: "Grupo 3 · lo conseguido" },
];

/** Bloque 1: el grupo, los amigos de la universidad, las familias. */
const GRUPO: Insercion[] = [
  { desde: 2.05, hasta: 4.0, origen: 0.1, fuente: V + "peregrinos-calzada.mp4", nombre: "Calzada" },
  { desde: 4.0, hasta: 6.1, origen: 0.1, fuente: V + "grupo-calle.mp4", nombre: "Grupo por la calle" },
  { desde: 6.1, hasta: 7.86, origen: 0.05, fuente: T + "peregrinas-muros.mp4", nombre: "Peregrinas entre muros" },
  { desde: 8.9, hasta: 10.8, origen: 0.1, fuente: V + "sendero-peregrinos.mp4", nombre: "Sendero" },
  { desde: 10.8, hasta: 12.7, origen: 0.05, fuente: T + "pareja-muros-piedra.mp4", nombre: "Pareja entre muros" },
  { desde: 12.7, hasta: 15.0, origen: 0.1, fuente: V + "peregrinos-campo.mp4", nombre: "Peregrinos por el campo" },
];

/** Bloque 2: lo que esperan, el enriquecimiento y el vinculo. */
const CAMINO: Insercion[] = [
  { desde: 15.0, hasta: 16.7, origen: 0.0, fuente: T + "sendero-contraluz.mp4", nombre: "Sendero a contraluz" },
  { desde: 16.7, hasta: 18.8, origen: 0.1, fuente: V + "iglesia-espadana.mp4", nombre: "Iglesia de espadana" },
  { desde: 18.8, hasta: 20.2, origen: 0.0, fuente: T + "interior-capilla.mp4", nombre: "Interior de capilla" },
  { desde: 20.2, hasta: 22.2, origen: 0.1, fuente: V + "soportales-rua.mp4", nombre: "Soportales" },
  { desde: 22.2, hasta: 23.95, origen: 0.05, fuente: V + "cruceiro-prado.mp4", nombre: "Cruceiro" },
  { desde: 23.95, hasta: 25.55, origen: 0.0, fuente: T + "timpano-romanico.mp4", nombre: "Timpano romanico" },
  { desde: 25.55, hasta: 27.3, origen: 0.1, fuente: V + "horreo-peregrinos.mp4", nombre: "Horreo" },
];

/** Bloque 3: el deporte, los amigos y descubrir sitios. */
const DEPORTE: Insercion[] = [
  { desde: 27.3, hasta: 29.3, origen: 0.1, fuente: T + "camino-arbolado.mp4", nombre: "Camino arbolado" },
  { desde: 30.3, hasta: 32.5, origen: 0.05, fuente: T + "camino-dedaleras.mp4", nombre: "Camino entre dedaleras" },
  { desde: 32.5, hasta: 34.6, origen: 0.1, fuente: T + "botas-camino.mp4", nombre: "Botas · Sport treibst" },
  { desde: 34.6, hasta: 36.1, origen: 0.05, fuente: T + "ciclista-camino.mp4", nombre: "Ciclista" },
  { desde: 36.1, hasta: 38.2, origen: 0.1, fuente: V + "puente-calzada.mp4", nombre: "Puente de calzada" },
  { desde: 38.2, hasta: 40.3, origen: 0.1, fuente: T + "mojon-peregrinas.mp4", nombre: "Mojon · kennenlernen" },
  { desde: 40.3, hasta: 41.9, origen: 0.0, fuente: T + "gaiteros.mp4", nombre: "Gaiteros" },
  { desde: 41.9, hasta: 43.7, origen: 0.05, fuente: B + "brindis.mp4", nombre: "Brindis 1080p" },
];

/** Bloque 4: los paisajes y el final en Santiago, que es donde cae el CTA. */
const SANTIAGO: Insercion[] = [
  { desde: 43.7, hasta: 45.8, origen: 0.05, fuente: T + "prado-flores.mp4", nombre: "Prado en flor" },
  // Del general con gente al detalle de la fachada, como pide el manual.
  { desde: 45.8, hasta: 47.9, origen: 0.1, fuente: T + "catedral-escalinata.mp4", nombre: "Catedral · la escalinata" },
  { desde: 47.9, hasta: 51.3, origen: 0.1, fuente: T + "fachada-obradoiro.mp4", nombre: "CTA · fachada del Obradoiro" },
];

const INSERCIONES = [...CARAS, ...GRUPO, ...CAMINO, ...DEPORTE, ...SANTIAGO];

/* ------------------------------------------------------------------ */

export const SWReelCaminoDE: React.FC = () => {
  const total = f(DURACION);
  const entraCta = f(48.2);
  const entraPlaca = f(TESTIMONIO);

  return (
    <AbsoluteFill style={{ backgroundColor: brand.green }}>
      <Audio src={staticFile(PISTA)} />

      {INSERCIONES.map((s) => (
        <Sequence
          key={`${s.nombre}-${s.desde}`}
          from={f(s.desde)}
          durationInFrames={f(s.hasta) - f(s.desde)}
          name={s.nombre}
        >
          <OffthreadVideo
            src={staticFile(s.fuente)}
            trimBefore={f(s.origen)}
            playbackRate={s.ritmo ?? 1}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Sequence>
      ))}

      {/* 1 · sobre "Wir reisen als Gruppe, was fur uns wichtig ist" */}
      <Sequence from={f(0.6)} durationInFrames={f(7.0) - f(0.6)} name="1 · Manche Reisen">
        <Cartela
          lineas={[[{ texto: "Manche Reisen" }], [{ texto: "hinterlassen Spuren", destacado: true }]]}
          total={f(7.0) - f(0.6)}
          tam={TAM}
          margen={MARGEN}
          margenAbajo={MARGEN_ABAJO}
          tamPie={TAM_PIE}
        />
      </Sequence>

      {/* 2 · sobre la Bereicherung y la Verbundenheit */}
      <Sequence from={f(16.4)} durationInFrames={f(22.4) - f(16.4)} name="2 · Gemeinsam">
        <Cartela
          lineas={[[{ texto: "Gemeinsam gehen," }], [{ texto: "gemeinsam ankommen", destacado: true }]]}
          total={f(22.4) - f(16.4)}
          tam={TAM}
          margen={MARGEN}
          margenAbajo={MARGEN_ABAJO}
          tamPie={TAM_PIE}
        />
      </Sequence>

      {/* 3 · sobre "Reisen, bei denen du Sport treibst" */}
      <Sequence from={f(33.6)} durationInFrames={f(39.6) - f(33.6)} name="3 · Du gehst">
        <Cartela
          lineas={[[{ texto: "Du gehst." }], [{ texto: "Wir kümmern uns.", destacado: true }]]}
          pie={["Unterkunft, Gepäck und Betreuung"]}
          total={f(39.6) - f(33.6)}
          tam={TAM}
          margen={MARGEN}
          margenAbajo={MARGEN_ABAJO}
          tamPie={TAM_PIE}
        />
      </Sequence>

      {/* 4 · el CTA, sobre la fachada de la catedral */}
      <Sequence from={entraCta} durationInFrames={total - entraCta} name="4 · Dein Camino beginnt hier">
        <CierreMarca
          lineas={[[{ texto: "Dein Camino" }], [{ texto: "beginnt hier", destacado: true }]]}
          salidaTexto={f(51.1) - entraCta}
          tam={TAM}
          abajo
          margen={MARGEN}
          margenAbajo={MARGEN_ABAJO}
        />
      </Sequence>

      <Sequence from={entraPlaca} durationInFrames={total - entraPlaca} name="5 · Placa de marca">
        <PlacaMarca ancho={620} hueco={300} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const SWReelCaminoDEComposition: React.FC = () => (
  <Composition
    id="SWReelCaminoDE"
    component={SWReelCaminoDE}
    durationInFrames={f(DURACION)}
    fps={FPS}
    width={1080}
    height={1920}
  />
);
