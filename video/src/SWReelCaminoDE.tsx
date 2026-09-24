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
import { Cartela, CierreMarca, PlacaMarca, Subtitulo } from "./componentes/CartelaMarca";

/**
 * Santiago Ways · el testimonio aleman, vertical para stories y TikTok.
 * 1080x1920 a 30 fps.
 *
 * El bruto venia de un editor online: 720x1280, subtitulos alemanes pegados
 * en el 60 % de alto y una marca de agua de clideo.com abajo a la derecha.
 * Ninguna de las dos se puede quitar del todo, asi que la pieza esta montada
 * para no necesitarlo:
 *
 * - **De los tres se ve un solo plano**, el unico hueco en el que el rotulo
 *   no esta en pantalla y dura mas de segundo y medio: del 7,25 al 8,95 del
 *   bruto. La marca de agua vive en las filas 1237 a 1253, asi que va
 *   recortado a 692x1230 y se la deja fuera.
 *
 *   Ojo con como se mide el hueco. La primera version buscaba la firma del
 *   rotulo blanco, pixel muy claro con uno muy oscuro al lado, y se le
 *   escapaban **las palabras resaltadas en verde**, que no llevan ese borde:
 *   en el plano que abria la pieza se colaba un "WIR" en los ultimos ocho
 *   fotogramas. El verde del rotulo es RGB 88,118,49 y tambien lleva borde
 *   oscuro, asi que la firma buena es claro-o-verde con oscuro al lado.
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
const TAM_SUB = 44;
/**
 * Los subtitulos viven por encima de las cartelas, no encima de ellas. La
 * cartela mas alta, la que lleva pie, empieza sobre el pixel 1216, asi que
 * el bloque de subtitulo acaba en el 1150 y quedan 66 px de aire. Mas arriba
 * no puede ir: en el unico plano de cara, ahi estan las caras.
 */
const SUB_ABAJO = 770;

/* ------------------------------------------------------------------ */

type Insercion = {
  desde: number;
  hasta: number;
  origen: number;
  fuente: string;
  /** `playbackRate`. Por debajo de 1 el plano dura mas de lo que dura el archivo. */
  ritmo?: number;
  /** `objectPosition`. Se pone con `mirar()`, no a ojo. */
  encuadre?: string;
  nombre: string;
};

/**
 * De "donde esta esto en la imagen" a `objectPosition`.
 *
 * No son lo mismo: un 16:9 recortado a 9:16 deja ver el 33,75 % del ancho,
 * asi que un `71%` no centra el recorte en el 71 % de la imagen sino en el
 * 64 %. Con `cover`, un 16:9 en un lienzo 9:16 solo recorta a lo ancho, asi
 * que la coordenada vertical no pinta nada.
 */
const VENTANA = (9 / 16) / (16 / 9);
const mirar = (p: number) => `${(((p - VENTANA / 2) / (1 - VENTANA)) * 100).toFixed(1)}% 50%`;

/**
 * El unico plano del grupo. Abre la pieza y no vuelve: es el unico tramo de
 * mas de segundo y medio sin rotulo encima.
 */
const CARAS: Insercion[] = [
  { desde: 0.0, hasta: 1.7, origen: 0.0, fuente: D + "grupo.mp4", nombre: "El grupo · abre" },
];

/** Bloque 1: el grupo, los amigos de la universidad, las familias. */
const GRUPO: Insercion[] = [
  { desde: 1.7, hasta: 4.0, origen: 0.1, fuente: V + "peregrinos-calzada.mp4", encuadre: mirar(0.32), nombre: "Calzada" },
  { desde: 4.0, hasta: 6.1, origen: 0.1, fuente: V + "grupo-calle.mp4", nombre: "Grupo por la calle" },
  { desde: 6.1, hasta: 8.4, origen: 0.05, fuente: T + "peregrinas-muros.mp4", nombre: "Peregrinas entre muros" },
  { desde: 8.4, hasta: 10.8, origen: 0.1, fuente: V + "sendero-peregrinos.mp4", nombre: "Sendero" },
  { desde: 10.8, hasta: 12.7, origen: 0.05, fuente: T + "pareja-muros-piedra.mp4", nombre: "Pareja entre muros" },
  { desde: 12.7, hasta: 15.0, origen: 0.1, fuente: V + "peregrinos-campo.mp4", nombre: "Peregrinos por el campo" },
];

/** Bloque 2: lo que esperan, el enriquecimiento y el vinculo. */
const CAMINO: Insercion[] = [
  { desde: 15.0, hasta: 16.7, origen: 0.0, fuente: T + "sendero-contraluz.mp4", nombre: "Sendero a contraluz" },
  { desde: 16.7, hasta: 18.8, origen: 0.1, fuente: V + "iglesia-espadana.mp4", encuadre: mirar(0.8), nombre: "Iglesia de espadana" },
  { desde: 18.8, hasta: 20.2, origen: 0.0, fuente: T + "interior-capilla.mp4", nombre: "Interior de capilla" },
  { desde: 20.2, hasta: 22.2, origen: 0.1, fuente: V + "soportales-rua.mp4", nombre: "Soportales" },
  { desde: 22.2, hasta: 23.95, origen: 0.05, fuente: V + "cruceiro-prado.mp4", encuadre: mirar(0.61), nombre: "Cruceiro" },
  { desde: 23.95, hasta: 25.55, origen: 0.0, fuente: T + "timpano-romanico.mp4", nombre: "Timpano romanico" },
  { desde: 25.55, hasta: 27.3, origen: 0.1, fuente: V + "horreo-peregrinos.mp4", nombre: "Horreo" },
];

/** Bloque 3: el deporte, los amigos y descubrir sitios. */
const DEPORTE: Insercion[] = [
  { desde: 27.3, hasta: 29.5, origen: 0.1, fuente: T + "camino-arbolado.mp4", nombre: "Camino arbolado" },
  { desde: 29.5, hasta: 31.2, origen: 0.05, fuente: T + "camino-muro.mp4", nombre: "Camino entre muros" },
  { desde: 31.2, hasta: 32.5, origen: 0.05, fuente: T + "camino-dedaleras.mp4", nombre: "Camino entre dedaleras" },
  { desde: 32.5, hasta: 34.6, origen: 0.1, fuente: T + "botas-camino.mp4", nombre: "Botas · Sport treibst" },
  { desde: 34.6, hasta: 36.1, origen: 0.05, fuente: T + "ciclista-camino.mp4", nombre: "Ciclista" },
  { desde: 36.1, hasta: 38.2, origen: 0.1, fuente: V + "puente-calzada.mp4", nombre: "Puente de calzada" },
  { desde: 38.2, hasta: 40.3, origen: 0.1, fuente: T + "mojon-peregrinas.mp4", nombre: "Mojon · kennenlernen" },
  { desde: 40.3, hasta: 41.9, origen: 0.0, fuente: T + "gaiteros.mp4", encuadre: mirar(0.68), nombre: "Gaiteros" },
  { desde: 41.9, hasta: 43.7, origen: 0.05, fuente: B + "brindis.mp4", nombre: "Brindis 1080p" },
];

/** Bloque 4: los paisajes y el final en Santiago, que es donde cae el CTA. */
const SANTIAGO: Insercion[] = [
  { desde: 43.7, hasta: 45.8, origen: 0.05, fuente: T + "prado-flores.mp4", nombre: "Prado en flor" },
  // Del general con gente al detalle de la fachada, como pide el manual.
  { desde: 45.8, hasta: 47.9, origen: 0.1, fuente: T + "catedral-escalinata.mp4", nombre: "Catedral · la escalinata" },
  { desde: 47.9, hasta: 51.3, origen: 0.1, fuente: T + "fachada-obradoiro.mp4", nombre: "CTA · fachada del Obradoiro" },
];

/**
 * Los subtitulos, en el registro de la marca y no los del editor online.
 *
 * El texto sale de transcribir la pista y se ha repasado a mano: la
 * locucion alemana es un doblaje y trae giros que no son aleman corriente,
 * asi que las frases van limpias sin cambiar lo que se dice. **Falta que lo
 * mire alguien que hable aleman.**
 *
 * Las lineas se parten a mano, no por ancho: a 44 px caben unos 38
 * caracteres sobre lienzo de 1080, y una frase partida donde toca se lee
 * mejor que una partida donde cabe.
 */
type Cue = { desde: number; hasta: number; lineas: string[] };

const SUBS: Cue[] = [
  { desde: 0.31, hasta: 3.1, lineas: ["Wir reisen als Gruppe,", "was für uns wichtig ist."] },
  { desde: 3.54, hasta: 6.75, lineas: ["Das gibt uns die Möglichkeit,", "uns zu treffen."] },
  { desde: 7.86, hasta: 9.2, lineas: ["Wir sind drei."] },
  { desde: 9.33, hasta: 11.2, lineas: ["Wir waren Universitätsstudenten,"] },
  { desde: 11.2, hasta: 12.7, lineas: ["haben zusammen abgeschlossen"] },
  { desde: 12.7, hasta: 14.8, lineas: ["und sind hier mit unseren Familien."] },
  { desde: 15.37, hasta: 19.05, lineas: ["Wir hoffen, dass uns diese Erfahrung"] },
  { desde: 19.41, hasta: 22.45, lineas: ["eine spirituelle Bereicherung bringt."] },
  { desde: 22.57, hasta: 24.4, lineas: ["und eine größere Verbundenheit,"] },
  { desde: 24.4, hasta: 26.85, lineas: ["nachdem wir so viel Zeit", "zusammen verbracht haben."] },
  { desde: 27.53, hasta: 29.0, lineas: ["Ich würde sagen,"] },
  { desde: 29.26, hasta: 30.9, lineas: ["dass es wunderschön ist,"] },
  { desde: 30.9, hasta: 32.7, lineas: ["was wir bisher erreicht haben."] },
  { desde: 32.84, hasta: 35.6, lineas: ["Diese Reisen, bei denen man", "Sport treibt"] },
  { desde: 35.6, hasta: 38.05, lineas: ["und ihn mit Freunden verbindet"] },
  { desde: 38.44, hasta: 41.2, lineas: ["und damit, interessante Dinge", "kennenzulernen."] },
  { desde: 41.4, hasta: 43.5, lineas: ["Ich finde das wunderbar."] },
  { desde: 43.9, hasta: 46.1, lineas: ["Die Landschaften sind wunderschön."] },
  { desde: 46.1, hasta: 48.1, lineas: ["Wir hoffen, dass es so weitergeht,"] },
  { desde: 48.25, hasta: 50.6, lineas: ["bis wir den Weg", "nach Santiago beenden."] },
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
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: s.encuadre ?? "50% 50%",
            }}
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

      {SUBS.map((c) => (
        <Sequence
          key={`sub-${c.desde}`}
          from={f(c.desde)}
          durationInFrames={f(c.hasta) - f(c.desde)}
          name={`sub · ${c.lineas[0]}`}
        >
          <Subtitulo lineas={c.lineas} tam={TAM_SUB} margen={MARGEN} margenAbajo={SUB_ABAJO} />
        </Sequence>
      ))}

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
