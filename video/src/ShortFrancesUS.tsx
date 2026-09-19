import { AbsoluteFill, interpolate, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { useFuentesDeMarca } from "./fuentes";
import { brand, fontFamily, margin } from "./brand/theme";
import { Bullets } from "./componentes/Bullets";
import { Cartela } from "./componentes/Cartela";
import { Cifra } from "./componentes/Cifra";
import { Planos } from "./componentes/Planos";
import { Subtitulos } from "./componentes/Subtitulos";
import { Titular } from "./componentes/Titular";
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
 * **Cada bloque resuelve el texto de una forma distinta**: placas, cifra
 * grande, titular sobre la imagen, lista con checks. Una pieza entera a base
 * de listas parece una plantilla, y hace que todas las piezas de la marca
 * parezcan la misma.
 */

/**
 * Arranques de bloque, en segundos.
 *
 * Salen de alinear el guion con los veintinueve tramos de voz del audio:
 *
 *   python3 herramientas/scripts/alinear-locucion.py \
 *     video/public/locucion-frances.mp3 video/public/guiones/frances.txt frances
 *
 * La primera version de este montaje reparti el guion a ojo entre los tramos
 * y salio corrida casi dos segundos de la mitad en adelante. El ancla que lo
 * destapa son las tres preguntas sueltas ("Saint Jean? Sarria? Somewhere in
 * between?"): son los tres unicos tramos de medio segundo del audio y van
 * seguidos, asi que solo encajan en un sitio.
 */
const B = [
  0, //     0 · "Seven routes lead to Santiago. Only one is called the French Way."
  3.924, // 1 · "780 km from Saint Jean Pied de Port to Santiago. 33 stages."
  10.175, // 2 · "Why is it THE one? Most walked. Best signposted. A village every few km."
  18.651, // 3 · "You don't have to walk all of it. The last stretch, Sarria to Santiago."
  27.691, // 4 · "Same route. Same Compostela. Bag ahead, room waiting, phone answered."
  34.811, // 5 · "If you've walked the French Way, tell us where you started."
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
 * voz de ElevenLabs sale a su nivel y hay que igualarlas. Su pico esta en
 * -8,4 dB, asi que 2,2 lo deja en -1,4 dB, con margen y sin recortar.
 */
const VOZ = 2.2;

const f = (s: number) => Math.round(s * 30);
const dur = (i: number) => f(B[i + 1]) - f(B[i]);
/** Fotograma de un instante de la locucion, dentro del bloque `i`. */
const en = (i: number, segundo: number) => f(segundo) - f(B[i]);

/**
 * Suelo de todo lo que se pinta encima del metraje.
 *
 * En Shorts la interfaz se come la franja de abajo y por encima de ella van
 * los subtitulos, que ocupan de 1420 a 1520. Todo lo demas termina antes de
 * 1400. Con menos, el subtitulo se come la ultima linea, que suele ser justo
 * el dato.
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

/** Zona de los titulares sobre la imagen: mas arriba, donde hay aire. */
const Alto: React.FC<{ children: React.ReactNode; desde?: number }> = ({
  children,
  desde = 300,
}) => (
  <AbsoluteFill style={{ justifyContent: "flex-start", paddingTop: desde }}>
    {children}
  </AbsoluteFill>
);

export const ShortFrancesUS: React.FC = () => {
  useFuentesDeMarca();

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
          overlay={0.5}
          lista={[
            { src: "pareja-muros", dura: 1.53, encuadre: "40% 50%", ritmo: 0.62 },
            { src: "mochila-ligera", dura: 1.97, encuadre: "78% 50%", ritmo: 0.82 },
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
             bloque siga, y la cifra toma el relevo: dos formas distintas de
             contar el mismo dato, no dos placas iguales. */}
      <Sequence from={f(B[1])} durationInFrames={dur(1)} name="2 · 780 km">
        <Planos
          total={dur(1)}
          overlay={0.5}
          lista={[
            { src: "piernas", dura: 2.23, ritmo: 0.95 },
            { src: "grupo-mimosas", dura: 1.17, ritmo: 0.7 },
            { src: "brindis", dura: 1.97, encuadre: "42% 50%", ritmo: 0.85 },
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
        {/* La cifra entra cuando el mapa ya se ha ido, con "33 stages". */}
        <Sequence from={f(4.2)} name="Cifra">
          <Centro alto={700}>
            <Cifra
              encima="Saint Jean → Santiago"
              cifra="780"
              unidad="km"
              debajo="33 stages"
              cuenta={26}
            />
          </Centro>
        </Sequence>
      </Sequence>

      {/* 3 · Por que esa. Tres titulares sobre la imagen, uno cada vez: aqui
             la lista sobra, porque la voz ya las enumera. */}
      <Sequence from={f(B[2])} durationInFrames={dur(2)} name="3 · Por qué esa">
        <Planos
          total={dur(2)}
          overlay={0.52}
          lista={[
            { src: "grupo-peregrinos", dura: 0.73, ritmo: 0.5 },
            { src: "flecha", dura: 1.17, encuadre: "58% 50%", ritmo: 0.6 },
            { src: "casa-rural", dura: 1.17, encuadre: "62% 50%", ritmo: 0.6 },
            { src: "mesa-exterior", dura: 1.43, encuadre: "52% 50%", ritmo: 0.65 },
            { src: "tunel-vegetacion", dura: 0.83, ritmo: 0.6 },
          ]}
        />
        {/* Cada titular va dentro de su propia Sequence, y el margen se
            aplica dentro: una Sequence anidada crea su propio lienzo a
            pantalla completa y se salta el padding del contenedor, que es
            lo que sacaba el texto fuera de cuadro. */}
        <Sequence
          from={en(2, 11.386)}
          durationInFrames={en(2, 12.76) - en(2, 11.386)}
          name="Most walked"
        >
          <Alto>
            <Titular texto="The most walked" resalta={[1, 2]} />
          </Alto>
        </Sequence>
        <Sequence
          from={en(2, 12.76)}
          durationInFrames={en(2, 14.436) - en(2, 12.76)}
          name="Best signposted"
        >
          <Alto>
            <Titular texto="The best signposted" resalta={[1, 2]} />
          </Alto>
        </Sequence>
        <Sequence from={en(2, 14.436)} name="Village, bed, café">
          <Alto>
            <Titular
              texto="A village, a bed, a café"
              resalta={[1]}
              cuerpo={78}
              pie="every few kilometres"
            />
          </Alto>
        </Sequence>
      </Sequence>

      {/* 4 · El tramo corto. Sin mapa: el de Sarria se reserva para el Short
             B. La cifra manda y el detalle va debajo. */}
      <Sequence from={f(B[3])} durationInFrames={dur(3)} name="4 · Sarria">
        <Planos
          total={dur(3)}
          overlay={0.46}
          lista={[
            { src: "mochila-ligera", dura: 1.97, encuadre: "78% 50%", ritmo: 0.72 },
            { src: "pareja-muros", dura: 1.53, encuadre: "40% 50%", ritmo: 0.6 },
            { src: "credencial", dura: 1.03, ritmo: 0.52 },
            { src: "manos-sellando", dura: 1.57, encuadre: "28% 50%", ritmo: 0.66 },
          ]}
        />
        {/* Entra con "The last stretch, Sarria to Santiago". */}
        <Sequence from={en(3, 22.661)} name="Cifra de Sarria">
          <Centro alto={700}>
            <Cifra
              encima="Sarria → Santiago"
              cifra="115"
              unidad="km"
              debajo="5 stages · one week"
              cuenta={22}
            />
          </Centro>
        </Sequence>
      </Sequence>

      {/* 5 · Lo que resuelve la agencia. Aqui si es una lista: son tres
             servicios y la voz los enumera uno detras de otro. */}
      <Sequence from={f(B[4])} durationInFrames={dur(4)} name="5 · Mismo Camino">
        <Planos
          total={dur(4)}
          overlay={0.44}
          lista={[
            { src: "compostela", dura: 1.67, encuadre: "50% 50%", ritmo: 0.85 },
            { src: "equipaje-etiquetas", dura: 0.92, ritmo: 0.5 },
            { src: "habitacion", dura: 2.13, encuadre: "62% 50%" },
            { src: "equipaje-portal", dura: 1.17, encuadre: "55% 50%", ritmo: 0.62 },
          ]}
        />
        <AbsoluteFill
          style={{ justifyContent: "center", padding: margin, paddingBottom: SUELO }}
        >
          <Bullets
            marca="check"
            cuerpo={34}
            items={["Bag transfer", "Private room", "24/7 support"]}
            tiempos={[en(4, 30.204), en(4, 31.564), en(4, 32.739)]}
          />
        </AbsoluteFill>
        <Cartela
          principal="Same route."
          secundaria="Same Compostela"
          desde={2}
          arriba={130}
        />
      </Sequence>

      {/* 6 · La llamada a comentar. Va sola y va sobre la imagen: una placa
             de color aqui parecia un banner pegado encima del video. */}
      <Sequence from={f(B[5])} durationInFrames={dur(5)} name="6 · Comentarios">
        <Planos
          total={dur(5)}
          overlay={0.44}
          lista={[
            { src: "brazos-alto", dura: 0.97, encuadre: "34% 50%", ritmo: 0.42 },
            { src: "plaza", dura: 1.03, ritmo: 0.48 },
            { src: "catedral-torres", dura: 1.67, ritmo: 0.72 },
            { src: "iglesia-exterior", dura: 1.33, ritmo: 0.6 },
          ]}
        />
        <Alto desde={260}>
          <Titular
            texto="Where did you start?"
            resalta={[2, 3]}
            desde={en(5, 36.0)}
            cuerpo={100}
            pie="Saint Jean · Sarria · somewhere in between?"
          />
        </Alto>
      </Sequence>

      {/* 7 · La llamada a la guia, que es el destino de la pieza. Aguanta en
             pantalla los seis segundos enteros. */}
      <Sequence from={f(B[6])} durationInFrames={dur(6)} name="7 · La guía">
        <Planos
          total={dur(6)}
          overlay={0.46}
          lista={[
            { src: "catedral-a", dura: 1.67, ritmo: 0.72 },
            { src: "compostela", dura: 1.67, encuadre: "50% 50%", ritmo: 0.78 },
            { src: "contraluz", dura: 1.43, ritmo: 0.56 },
          ]}
        />
        <Alto desde={260}>
          <Titular
            texto="Every stage, start to finish"
            resalta={[0, 1]}
            desde={4}
            cuerpo={86}
            pie="Full French Way guide · the video right below"
          />
        </Alto>
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
