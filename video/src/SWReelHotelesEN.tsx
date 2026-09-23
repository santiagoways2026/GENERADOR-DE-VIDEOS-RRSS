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
import { Cartela, PlacaMarca } from "./componentes/CartelaMarca";

/**
 * Santiago Ways · el testimonio americano, vertical para stories y TikTok.
 * 1080x1920 a 30 fps.
 *
 * Hablan dos, padre e hijo, y no es lo mismo:
 *
 * - **El padre**, el de la camiseta turquesa, cuenta por que vino y lo del
 *   transporte de equipaje. Tono de 150 Hz, centroide entre 550 y 770 Hz.
 * - **El hijo**, el de la camiseta "Blaze", es el que habla de los hoteles y
 *   de dormir en una cama limpia. Tono de 110 Hz, centroide de 890.
 *
 * La diferencia se mide, no se supone, y decide a quien se enfoca: el grupo
 * son cuatro de lado a lado del cuadro y un recorte a 9:16 solo deja ver el
 * 33,75 % del ancho, asi que hay que elegir. Cuando habla el padre se mira al
 * 79 % de la imagen y cuando habla el hijo, al 62 %.
 *
 * La pista la monta `herramientas/scripts/audio-reel-hoteles.py`, que hace
 * dos cosas que aqui no se pueden hacer: quita 11,95 s por dentro y le pone
 * cola de musica a la placa final. Las dos junturas van con fundido cruzado
 * porque la pista lleva voz y musica en el mismo canal.
 *
 * Todos los planos de recurso salen de la biblioteca, no del master, y van
 * centrados: los del master son planos generales pensados para 16:9 y al
 * recortarlos la accion se queda fuera de cuadro.
 */

const FPS = 30;
const f = (s: number) => Math.round(s * FPS);

/** Lo que dura el testimonio ya montado. */
const TESTIMONIO = 43.55;
const DURACION = 47.55;

/** Los dos tramos del master que se conservan. */
const A_DESDE = 15.3;
const A_DURA = 15.15;
const B_DESDE = 42.4;

const PISTA = "montajes/reel-hoteles.wav";
const MASTER = "montajes/testimonios-EN.mp4";
const B = "brutos/";
const T = "brutos/testimonios/";
const V = "brutos/piezas-viejas/";

const MARGEN = 72;
/** En stories y TikTok los ultimos 300 px los tapa la interfaz. */
const MARGEN_ABAJO = 330;
const TAM = 58;
const TAM_PIE = 30;

/**
 * De "donde esta esto en la imagen" a `objectPosition`.
 *
 * No son lo mismo y es facil equivocarse: un 16:9 recortado a 9:16 deja ver
 * el 33,75 % del ancho, asi que `objectPosition: 71%` no centra el recorte en
 * el 71 % de la imagen, sino en el 64 %.
 */
const VENTANA = (9 / 16) / (16 / 9);
const mirar = (p: number) => `${(((p - VENTANA / 2) / (1 - VENTANA)) * 100).toFixed(1)}% 50%`;

/** Donde cae la cara de cada uno en el plano de grupo. */
const PADRE = mirar(0.79);
const HIJO = mirar(0.62);

/* ------------------------------------------------------------------ */

type Insercion = {
  desde: number;
  hasta: number;
  origen: number;
  fuente?: string;
  encuadre?: string;
  nombre: string;
};

/**
 * Los cuatro momentos en los que se ve hablar a alguien. Salen del propio
 * master, al mismo segundo: lo unico que cambia es por donde se recorta.
 */
const CARAS: Insercion[] = [
  { desde: 0.0, hasta: 4.63, origen: 15.3, encuadre: PADRE, nombre: "Padre 1" },
  { desde: 18.38, hasta: 19.68, origen: 45.63, encuadre: PADRE, nombre: "Padre 2 · equipaje" },
  { desde: 27.65, hasta: 29.85, origen: 54.9, encuadre: HIJO, nombre: "Hijo 1 · hoteles" },
  { desde: 36.52, hasta: 37.38, origen: 63.77, encuadre: HIJO, nombre: "Hijo 2 · hoteles" },
];

/** Camino, sobre lo que cuenta el padre de por que vino. */
const CAMINO: Insercion[] = [
  { desde: 4.63, hasta: 6.0, origen: 0.03, fuente: B + "contraluz.mp4", nombre: "Contraluz" },
  { desde: 6.0, hasta: 7.5, origen: 0.03, fuente: B + "pareja-muros.mp4", nombre: "Pareja entre muros" },
  { desde: 7.5, hasta: 9.4, origen: 0.1, fuente: V + "peregrinos-calzada.mp4", nombre: "Calzada" },
  { desde: 9.4, hasta: 11.2, origen: 0.1, fuente: V + "peregrinos-campo.mp4", nombre: "Campo" },
  { desde: 11.2, hasta: 13.6, origen: 0.1, fuente: V + "sendero-peregrinos.mp4", nombre: "Sendero" },
  // Tapa la juntura del corte, que cae en 15,15.
  { desde: 13.6, hasta: 15.6, origen: 0.03, fuente: V + "sendero-pareja.mp4", nombre: "Juntura · sendero en pareja" },
  { desde: 15.6, hasta: 17.4, origen: 0.1, fuente: V + "grupo-calle.mp4", nombre: "Grupo por la calle" },
];

/** Equipaje, sobre "having somebody Sherpa your belongings from town to town". */
const EQUIPAJE: Insercion[] = [
  { desde: 17.4, hasta: 18.38, origen: 0.05, fuente: T + "maletas-portal.mp4", nombre: "Maletas · portal" },
  { desde: 19.68, hasta: 21.5, origen: 0.1, fuente: V + "maletas-etiqueta.mp4", nombre: "Maletas · etiqueta" },
  { desde: 21.5, hasta: 22.6, origen: 0.03, fuente: T + "etiquetas-maletas.mp4", nombre: "Etiquetas" },
  { desde: 22.6, hasta: 24.2, origen: 0.03, fuente: V + "maleta-concha.mp4", nombre: "Maleta · concha" },
  { desde: 24.2, hasta: 25.0, origen: 0.02, fuente: T + "maletas-fila.mp4", nombre: "Maletas en fila" },
];

/** Alojamiento, sobre lo que cuenta el hijo. Fachadas, camas y banos. */
const HOTELES: Insercion[] = [
  { desde: 25.0, hasta: 26.7, origen: 0.05, fuente: V + "pazo-blanco.mp4", nombre: "Fachada · pazo" },
  { desde: 26.7, hasta: 27.65, origen: 0.05, fuente: V + "hotel-arzua.mp4", nombre: "Fachada · hotel Arzua" },
  { desde: 29.85, hasta: 32.0, origen: 0.03, fuente: B + "terraza.mp4", nombre: "Terraza sobre el agua" },
  { desde: 32.0, hasta: 34.0, origen: 0.08, fuente: B + "habitacion.mp4", encuadre: mirar(0.66), nombre: "Cama · ventanal 1080p" },
  { desde: 34.0, hasta: 35.1, origen: 0.03, fuente: T + "bano-ducha.mp4", nombre: "Ducha" },
  { desde: 35.1, hasta: 36.52, origen: 0.05, fuente: V + "habitacion-ventanal.mp4", nombre: "Cama · ventanal" },
  { desde: 37.38, hasta: 39.05, origen: 0.05, fuente: V + "habitacion-granate.mp4", nombre: "Cama · granate" },
  { desde: 39.05, hasta: 40.45, origen: 0.05, fuente: V + "bano-lavabo.mp4", nombre: "Bano · lavabo" },
  { desde: 40.45, hasta: 42.4, origen: 0.05, fuente: V + "casa-calixtino.mp4", nombre: "Fachada · casona" },
  { desde: 42.4, hasta: 43.55, origen: 0.1, fuente: V + "galeria-hotel.mp4", nombre: "Galeria del hotel" },
];

const INSERCIONES = [...CARAS, ...CAMINO, ...EQUIPAJE, ...HOTELES];

/* ------------------------------------------------------------------ */

export const SWReelHotelesEN: React.FC = () => {
  const total = f(DURACION);
  const finTestimonio = f(TESTIMONIO);
  const entraPlaca = f(43.55);

  return (
    <AbsoluteFill style={{ backgroundColor: brand.green }}>
      {/* La pista va aparte: lleva el corte por dentro y la cola de musica. */}
      <Audio src={staticFile(PISTA)} />

      {/* Los dos tramos del master, mudos: el audio es siempre el de la pista. */}
      <Sequence durationInFrames={f(A_DURA)} name="Tramo A · el padre">
        <OffthreadVideo
          src={staticFile(MASTER)}
          trimBefore={f(A_DESDE)}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Sequence>
      <Sequence
        from={f(A_DURA)}
        durationInFrames={finTestimonio - f(A_DURA)}
        name="Tramo B · equipaje y hoteles"
      >
        <OffthreadVideo
          src={staticFile(MASTER)}
          trimBefore={f(B_DESDE)}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Sequence>

      {INSERCIONES.map((s) => (
        <Sequence
          key={`${s.nombre}-${s.desde}`}
          from={f(s.desde)}
          durationInFrames={f(s.hasta) - f(s.desde)}
          name={s.nombre}
        >
          <OffthreadVideo
            src={staticFile(s.fuente ?? MASTER)}
            trimBefore={f(s.origen)}
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

      {/* 1 · sobre "I've had the trail on my bucket list for about 10 years" */}
      <Sequence from={f(0.7)} durationInFrames={f(7.4) - f(0.7)} name="1 · Camino organizado">
        <Cartela
          lineas={[[{ texto: "Camino de Santiago" }], [{ texto: "fully organised", destacado: true }]]}
          total={f(7.4) - f(0.7)}
          tam={52}
          margen={MARGEN}
          margenAbajo={MARGEN_ABAJO}
          tamPie={TAM_PIE}
        />
      </Sequence>

      {/* 2 · sobre "having somebody Sherpa your belongings from town to town" */}
      <Sequence from={f(17.6)} durationInFrames={f(24.8) - f(17.6)} name="2 · Tu equipaje">
        <Cartela
          lineas={[[{ texto: "Your luggage" }], [{ texto: "travels for you", destacado: true }]]}
          pie={["Hotel to hotel, every stage"]}
          total={f(24.8) - f(17.6)}
          tam={TAM}
          margen={MARGEN}
          margenAbajo={MARGEN_ABAJO}
          tamPie={TAM_PIE}
        />
      </Sequence>

      {/* 3 · sobre "nothing better than laying down in a nice clean bed and a shower" */}
      <Sequence from={f(30.6)} durationInFrames={f(36.2) - f(30.6)} name="3 · Cama limpia">
        <Cartela
          lineas={[[{ texto: "A clean bed" }], [{ texto: "and a hot shower", destacado: true }]]}
          pie={["Waiting for you every night"]}
          total={f(36.2) - f(30.6)}
          tam={TAM}
          margen={MARGEN}
          margenAbajo={MARGEN_ABAJO}
          tamPie={TAM_PIE}
        />
      </Sequence>

      {/* 4 · sobre "I won't be sleeping in a tent or at some hostel" */}
      <Sequence from={f(37.5)} durationInFrames={f(42.9) - f(37.5)} name="4 · Habitacion privada">
        <Cartela
          lineas={[[{ texto: "Always private" }], [{ texto: "room & bathroom", destacado: true }]]}
          pie={["Hand-picked hotels"]}
          total={f(42.9) - f(37.5)}
          tam={TAM}
          margen={MARGEN}
          margenAbajo={MARGEN_ABAJO}
          tamPie={TAM_PIE}
        />
      </Sequence>

      <Sequence from={entraPlaca} durationInFrames={total - entraPlaca} name="5 · Placa de marca">
        <PlacaMarca ancho={620} hueco={300} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const SWReelHotelesENComposition: React.FC = () => (
  <Composition
    id="SWReelHotelesEN"
    component={SWReelHotelesEN}
    durationInFrames={f(DURACION)}
    fps={FPS}
    width={1080}
    height={1920}
  />
);
