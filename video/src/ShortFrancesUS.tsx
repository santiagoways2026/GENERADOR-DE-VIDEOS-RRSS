import { AbsoluteFill, interpolate, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import "./fuentes";
import { brand, fontFamily, margin } from "./brand/theme";
import { Bullets } from "./componentes/Bullets";
import { CajaDato } from "./componentes/CajaDato";
import { Cartela } from "./componentes/Cartela";
import { Llamada } from "./componentes/Llamada";
import { Planos } from "./componentes/Planos";
import { Subtitulos } from "./componentes/Subtitulos";
import { Cierre } from "./escenas/Cierre";
import { MapaRutas } from "./graficos/MapaRutas";
import { SUBTITULOS_FRANCES } from "./subtitulos/frances";

/**
 * Short A del canal de YouTube en ingles: "Why the French Way?".
 *
 * Es un spoke, no una pieza suelta: su trabajo es llevar a la guia completa
 * del Camino Frances y abrir conversacion en comentarios. Por eso el nombre
 * de la ruta se dice en casi todos los bloques y hay dos llamadas separadas,
 * primero a comentar y despues a la guia, nunca en el mismo rotulo.
 *
 * Diferencias con un reel de Instagram, que condicionan el montaje:
 *
 * - **Lleva subtitulos quemados.** En Shorts se ve mucho sin sonido.
 * - **El CTA si va dentro del video.** En Instagram lo pone quien publica,
 *   pero aqui la llamada senala algo que esta en la propia pantalla, los
 *   comentarios y el video de debajo, y eso ningun pie puede hacerlo.
 * - **Los mapas son apoyo, no protagonistas**: dos inserciones y ninguna
 *   pasa de cuatro segundos, aunque su bloque dure mas.
 *
 * Los cortes caen en los arranques de frase de la locucion, medidos con
 * `silencedetect` sobre `locucion-frances.mp3`.
 */

/**
 * Arranques de bloque, en segundos. Salen de los veintinueve tramos de voz
 * del audio:
 *
 *   npx remotion ffmpeg -i public/locucion-frances.mp3 \
 *     -af silencedetect=noise=-30dB:d=0.25 -f null -
 */
const B = [
  0, //     0 · "Seven routes lead to Santiago. Only one is called the French Way."
  3.924, // 1 · "780 kilometres from Saint Jean Pied de Port to Santiago. 33 stages."
  10.175, // 2 · "Why is it THE one? Most walked. Best signposted. A village every few km."
  17.118, // 3 · "You don't have to walk all of it. The last stretch, Sarria to Santiago."
  25.319, // 4 · "Same route. Same Compostela. Bag ahead, room waiting, phone answered."
  32.739, // 5 · "If you've walked it, tell us where you started."
  43.712, // 6 · "Every stage... it's all in our full French Way guide."
  50.588, // 7 · "Buen Camino."
  53.0, //  8 · fin de la pieza: el cierre respira algo mas que la voz
];

/** La misma cama del reel del Xacobeo. El tema se apaga solo entre el
 *  segundo 106 y el 112, asi que arrancando aqui ese fundido cae sobre el
 *  cierre de marca y la pieza termina con la cancion. */
const MUSICA = { desdeSegundo: 112 - 53.0, volumen: 0.14 };

/**
 * Ganancia de la locucion.
 *
 * Esta voz viene grabada 8 dB por debajo de la del reel del Xacobeo: cada
 * voz de ElevenLabs sale a su nivel y hay que igualarlas, o la cama musical
 * queda proporcionalmente demasiado alta y la pieza suena floja al lado de
 * cualquier otra del feed.
 *
 * Su pico esta en -8,4 dB, asi que 2,2 lo deja en -1,4 dB, con margen y sin
 * recortar. Medido con `herramientas/scripts/envolvente.py`.
 */
const VOZ = 2.2;

const f = (s: number) => Math.round(s * 30);
const dur = (i: number) => f(B[i + 1]) - f(B[i]);
/** Fotograma de un instante de la locucion, dentro del bloque `i`. */
const en = (i: number, segundo: number) => f(segundo) - f(B[i]);

/**
 * Zona de los graficos.
 *
 * Mucho mas alta que en un reel: en Shorts la interfaz se come la franja de
 * abajo y por encima de ella van los subtitulos, que ocupan de 1420 a 1520.
 * Todo lo demas tiene que terminar antes de 1400, asi que el suelo de esta
 * zona no baja de 560. Con menos, el subtitulo se come la ultima linea del
 * grafico, que suele ser justo el dato.
 */
const SUELO = 560;

const Centro: React.FC<{ children: React.ReactNode; alto?: number }> = ({
  children,
  alto = SUELO,
}) => (
  <AbsoluteFill
    style={{
      justifyContent: "flex-end",
      alignItems: "center",
      padding: margin,
      paddingBottom: alto,
    }}
  >
    {children}
  </AbsoluteFill>
);

export const ShortFrancesUS: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: brand.forest, fontFamily }}>
      <Audio src={staticFile("locucion-frances.mp3")} volume={VOZ} />
      <Audio
        src={staticFile("musica.mp3")}
        trimBefore={f(MUSICA.desdeSegundo)}
        volume={(frame) =>
          interpolate(frame, [0, 24], [0, MUSICA.volumen], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
      />

      {/* 1 · Siete rutas, una se llama Frances. El mapa tiene que ser el
             peninsular: el rotulo dice cuantas son y se cuentan. */}
      <Sequence durationInFrames={dur(0)} name="1 · Siete rutas">
        <Planos
          total={dur(0)}
          overlay={0.52}
          lista={[
            { src: "contraluz", dura: 1.43, ritmo: 0.65 },
            { src: "camino-abierto", dura: 1.17, ritmo: 0.6 },
          ]}
        />
        <Centro>
          <MapaRutas
            desde={2}
            vista="peninsula"
            titulo="The Camino"
            destino={en(0, 2.6)}
            ancho={800}
          />
        </Centro>
        <Cartela principal="7 routes." secundaria="1 French Way" desde={4} arriba={130} />
      </Sequence>

      {/* 2 · Cuanto mide. El mapa se retira a los cuatro segundos aunque el
             bloque siga: es apoyo, no protagonista. */}
      <Sequence from={f(B[1])} durationInFrames={dur(1)} name="2 · 780 km">
        <Planos
          total={dur(1)}
          overlay={0.5}
          lista={[
            { src: "piernas", dura: 2.23, ritmo: 0.95 },
            { src: "grupo-mimosas", dura: 1.17, ritmo: 0.7 },
            { src: "pareja-muros", dura: 1.53, encuadre: "40% 50%", ritmo: 0.68 },
          ]}
        />
        <Sequence durationInFrames={f(4.0)} name="Mapa del Francés">
          <Centro>
            <MapaRutas
              desde={0}
              vista="peninsula"
              titulo="French Way"
              soloRuta="frances"
              traza={f(3.2)}
              destino={f(3.4)}
              ancho={800}
            />
          </Centro>
        </Sequence>
        {/* El rotulo entra con "33 stages", que es cuando el dato esta
            completo y el mapa ya se ha ido. */}
        <Cartela
          principal="780 km"
          secundaria="33 stages"
          desde={en(1, 8.30)}
          arriba={130}
        />
      </Sequence>

      {/* 3 · Por que esa. Cada bullet cae sobre la palabra que lo nombra. */}
      <Sequence from={f(B[2])} durationInFrames={dur(2)} name="3 · Por qué esa">
        <Planos
          total={dur(2)}
          overlay={0.44}
          lista={[
            { src: "tunel-vegetacion", dura: 0.83, ritmo: 0.55 },
            { src: "flecha", dura: 1.17, encuadre: "58% 50%", ritmo: 0.65 },
            { src: "casa-rural", dura: 1.17, encuadre: "62% 50%", ritmo: 0.65 },
            { src: "mesa-exterior", dura: 1.43, encuadre: "52% 50%", ritmo: 0.7 },
          ]}
        />
        <AbsoluteFill
          style={{ justifyContent: "center", padding: margin, paddingBottom: SUELO }}
        >
          <Bullets
            marca="check"
            cuerpo={34}
            items={["Most walked", "Best signposted", "Village · bed · café every few km"]}
            tiempos={[en(2, 11.386), en(2, 12.76), en(2, 14.436)]}
          />
        </AbsoluteFill>
      </Sequence>

      {/* 4 · El tramo corto. Sin mapa: el de Sarria se reserva para el Short
             B, y aqui el dato va en tarjeta sobre el metraje. */}
      <Sequence from={f(B[3])} durationInFrames={dur(3)} name="4 · Sarria">
        <Planos
          total={dur(3)}
          overlay={0.44}
          lista={[
            { src: "mochila-ligera", dura: 1.97, encuadre: "78% 50%", ritmo: 0.75 },
            { src: "equipaje-grupo", dura: 1.17, encuadre: "45% 50%", ritmo: 0.65 },
            { src: "credencial", dura: 1.03, ritmo: 0.55 },
            { src: "manos-sellando", dura: 1.57, encuadre: "28% 50%", ritmo: 0.7 },
          ]}
        />
        <Centro>
          {/* Entra con "The last stretch, Sarria to Santiago". */}
          <CajaDato
            desde={en(3, 20.526)}
            eyebrow="The short Camino"
            cifra="Sarria → Santiago"
            texto="115 km · 5 stages · one week"
            tono="bosque"
          />
        </Centro>
      </Sequence>

      {/* 5 · Lo que resuelve la agencia, sobre el plano que lo enseña. */}
      <Sequence from={f(B[4])} durationInFrames={dur(4)} name="5 · Mismo Camino">
        <Planos
          total={dur(4)}
          overlay={0.44}
          lista={[
            { src: "compostela", dura: 1.67, encuadre: "50% 50%", ritmo: 0.85 },
            { src: "equipaje-etiquetas", dura: 0.92, ritmo: 0.55 },
            { src: "habitacion", dura: 2.13, encuadre: "62% 50%" },
            { src: "brindis", dura: 1.97, encuadre: "42% 50%", ritmo: 0.95 },
          ]}
        />
        <AbsoluteFill
          style={{ justifyContent: "center", padding: margin, paddingBottom: SUELO }}
        >
          <Bullets
            marca="check"
            cuerpo={34}
            items={["Bag transfer", "Private room", "24/7 support"]}
            tiempos={[en(4, 27.691), en(4, 28.786), en(4, 30.204)]}
          />
        </AbsoluteFill>
        <Cartela
          principal="Same route."
          secundaria="Same Compostela"
          desde={2}
          arriba={150}
        />
      </Sequence>

      {/* 6 · La llamada a comentar. Va sola: no se mezcla con la de la guia. */}
      <Sequence from={f(B[5])} durationInFrames={dur(5)} name="6 · Comentarios">
        <Planos
          total={dur(5)}
          overlay={0.4}
          lista={[
            { src: "plaza", dura: 1.03, ritmo: 0.5 },
            { src: "catedral-torres", dura: 1.67, ritmo: 0.72 },
            { src: "brazos-alto", dura: 0.97, encuadre: "34% 50%", ritmo: 0.42 },
            { src: "catedral-a", dura: 1.67, ritmo: 0.72 },
            { src: "iglesia-exterior", dura: 1.33, ritmo: 0.6 },
          ]}
        />
        <Centro>
          <Llamada
            texto={"Walked it?\nWhere did you start?"}
            desde={en(5, 34.811)}
            tono="lima"
            cuerpo={50}
          />
        </Centro>
      </Sequence>

      {/* 7 · La llamada a la guia, que es el destino de la pieza. Aguanta en
             pantalla los seis segundos enteros. */}
      <Sequence from={f(B[6])} durationInFrames={dur(6)} name="7 · La guía">
        <Planos
          total={dur(6)}
          overlay={0.42}
          lista={[
            { src: "catedral-b", dura: 1.67, ritmo: 0.72 },
            { src: "campo-flores", dura: 1.67, ritmo: 0.75 },
            { src: "contraluz", dura: 1.43, ritmo: 0.6 },
          ]}
        />
        <Centro>
          <Llamada texto="Full French Way guide" desde={6} cuerpo={50} />
        </Centro>
      </Sequence>

      {/* 8 · Cierre de marca. */}
      <Sequence from={f(B[7])} durationInFrames={dur(7)} name="8 · Cierre">
        <Cierre duracion={dur(7)} />
      </Sequence>

      {/* Los subtitulos van por encima de todo y cruzan los bloques. */}
      <Subtitulos cues={SUBTITULOS_FRANCES} />
    </AbsoluteFill>
  );
};

export const DURACION_SHORT_FRANCES = f(B[B.length - 1]);
