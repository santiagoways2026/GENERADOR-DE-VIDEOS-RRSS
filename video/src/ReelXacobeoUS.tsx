import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import "./fuentes";
import { brand, fontFamily, margin } from "./brand/theme";
import { Bullets } from "./componentes/Bullets";
import { CajaDato } from "./componentes/CajaDato";
import { Cartela } from "./componentes/Cartela";
import { Planos } from "./componentes/Planos";
import { Cierre } from "./escenas/Cierre";
import { Calendario } from "./graficos/Calendario";
import { LineaTiempo } from "./graficos/LineaTiempo";
import { MapaRutas } from "./graficos/MapaRutas";
import { PuertaSanta } from "./graficos/PuertaSanta";

/**
 * Reel del Xacobeo 2027 para el mercado estadounidense.
 *
 * No es la pieza espanola traducida. Aquella da por sabido que es el Camino;
 * esta no da nada por sabido, y por eso dura minuto en vez de medio: hay que
 * explicar la ruta, el Ano Santo y por que 2027 antes de vender nada. Los
 * graficos no son adorno, son la parte didactica: el mapa situa Galicia, el
 * calendario explica la regla del Jubileo y la puerta cierra la metafora con
 * la que abre la locucion.
 *
 * Los cortes caen en los arranques de frase de la locucion, medidos con
 * `silencedetect` sobre `locucion-en.mp3`. Dentro de cada bloque los planos
 * se reparten segun lo que duran de verdad, que es lo unico que evita los
 * saltos a mitad de escena.
 *
 * Aviso sobre los nombres de los brutos: `interior-velas` es un sendero y
 * `iglesia-exterior` es un interior con velas; estan cambiados de la pieza
 * anterior. Aqui se elige por lo que se ve, no por como se llama el archivo.
 */

/**
 * Arranques de frase de la locucion, en segundos:
 *
 *   npx remotion ffmpeg -i public/locucion-en.mp3 \
 *     -af silencedetect=noise=-30dB:d=0.28 -f null -
 *
 * Cada valor es el final de una pausa, o sea el instante en que la voz
 * empieza a decir lo que el bloque ilustra.
 */
const B = [
  0, //  0 · "In 2027, a door in northern Spain will open..."
  6.21, //  1 · "For a thousand years, pilgrims have walked..."
  14.76, //  2 · "Every few years, July twenty-fifth lands on a Sunday."
  18.27, //  3 · "When that happens, the Church declares a Holy Year..."
  23.32, //  4 · "2027 is one of those years. The next one after that? 2032."
  28.64, //  5 · "Walking the Camino in a Holy Year is not the same walk."
  34.78, //  6 · "...the moment you reach that square..."
  40.07, //  7 · "We've spent years walking these routes..."
  43.72, //  8 · "Handpicked hotels and country houses."
  46.18, //  9 · "Your luggage moved ahead every morning."
  48.23, // 10 · "A dedicated advisor, and support in English, all the way."
  51.51, // 11 · "You carry a day pack. That's it."
  53.65, // 12 · "The best places on each route are small..."
  57.47, // 13 · "Reserve now, and we'll hold your dates and today's rate."
  60.45, // 14 · fin del audio
];

const f = (s: number) => Math.round(s * 30);
const dur = (i: number) => f(B[i + 1]) - f(B[i]);
/** Fotograma de un instante de la locucion, dentro del bloque `i`. */
const en = (i: number, segundo: number) => f(segundo) - f(B[i]);

/** Zona inferior de los graficos, despejada de cartelas y de la interfaz
 *  de Reels, que se come la franja de abajo. */
const Inferior: React.FC<{ children: React.ReactNode; alto?: number }> = ({
  children,
  alto = 300,
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

export const ReelXacobeoUS: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: brand.forest, fontFamily }}>
      <Audio src={staticFile("locucion-en.mp3")} />


      {/* 1 · El gancho: una puerta que se abre. Todavia no se nombra el
             Camino, que a este publico no le dice nada. */}
      <Sequence durationInFrames={dur(0)} name="1 · Una puerta">
        <Planos
          total={dur(0)}
          overlay={0.36}
          lista={[
            { src: "contraluz", dura: 1.47, ritmo: 0.8 },
            { src: "campo-flores", dura: 1.6 },
            { src: "camino-abierto", dura: 1.15, ritmo: 0.8 },
            { src: "piernas", dura: 1.9 },
          ]}
        />
        <Cartela
          eyebrow="Xacobeo 2027"
          principal="Camino de Santiago"
          secundaria="Spain's Holy Year"
          desde={10}
        />
      </Sequence>

      {/* 2 · Que es el Camino. El mapa hace el trabajo: situa Galicia y
             ensena que son varias rutas con un mismo final. */}
      <Sequence from={f(B[1])} durationInFrames={dur(1)} name="2 · Mapa de rutas">
        <Planos
          total={dur(1)}
          overlay={0.48}
          lista={[
            { src: "pareja-muros", dura: 1.55, encuadre: "40% 50%", ritmo: 0.8 },
            { src: "grupo-mimosas", dura: 1.2, ritmo: 0.7 },
            { src: "flecha", dura: 1.2, encuadre: "58% 50%", ritmo: 0.7 },
            { src: "manos-sellando", dura: 1.6, encuadre: "28% 50%", ritmo: 0.85 },
            { src: "credencial", dura: 1.05, ritmo: 0.7 },
          ]}
        />
        <Cartela principal="1,000 years" secundaria="of pilgrimage" desde={14} />
        <Inferior>
          {/* Santiago se enciende justo cuando la voz dice el nombre. */}
          <MapaRutas desde={10} destino={en(1, 10.46)} titulo="Northern Spain" />
        </Inferior>
      </Sequence>

      {/* 3 · La regla del Ano Santo, de un vistazo. El calendario ya trae su
             titular, asi que aqui no va cartela. */}
      <Sequence from={f(B[2])} durationInFrames={dur(2)} name="3 · Calendario">
        <Planos
          total={dur(2)}
          overlay={0.5}
          lista={[
            { src: "catedral-torres", dura: 1.7, ritmo: 0.9 },
            { src: "iglesia-exterior", dura: 1.37, ritmo: 0.75 },
          ]}
        />
        <Inferior>
          <Calendario
            desde={4}
            titulo="July 2027"
            pie="July 25 falls on a Sunday"
            abre="domingo"
          />
        </Inferior>
      </Sequence>

      {/* 4 · Que pasa entonces: se abre la Puerta Santa. Cierra en imagen la
             metafora con la que arranca la pieza. */}
      <Sequence from={f(B[3])} durationInFrames={dur(3)} name="4 · Puerta Santa">
        <Planos
          total={dur(3)}
          overlay={0.46}
          lista={[
            { src: "catedral-b", dura: 1.7, ritmo: 0.9 },
            { src: "portico-sellado", dura: 2.0, encuadre: "30% 50%" },
            { src: "brazos-alto", dura: 1.0, encuadre: "34% 50%", ritmo: 0.7 },
          ]}
        />
        <Cartela principal="This is" secundaria="a Holy Year" desde={8} />
        <Inferior alto={320}>
          {/* La puerta se abre sobre la palabra "unsealed". */}
          <PuertaSanta desde={10} abre={en(3, 21.1)} sellada="Sealed" abierta="Open" />
        </Inferior>
      </Sequence>

      {/* 5 · Lo irrepetible, en numeros. El grafico trae su propio titular. */}
      <Sequence from={f(B[4])} durationInFrames={dur(4)} name="5 · Años Santos">
        <Planos
          total={dur(4)}
          overlay={0.46}
          lista={[
            { src: "campo-flores", dura: 1.7, ritmo: 0.9 },
            { src: "rio-piedras", dura: 1.0, ritmo: 0.6 },
            { src: "contraluz", dura: 1.47, ritmo: 0.8 },
          ]}
        />
        <Inferior>
          {/* 2032 se enciende con la cifra, no antes. */}
          <LineaTiempo
            desde={8}
            pie="Once a decade, more or less"
            resaltaSiguiente={en(4, 27.15)}
          />
        </Inferior>
      </Sequence>

      {/* 6 · Que se siente. Aqui manda el metraje: es la parte que vende el
             viaje, y un grafico encima lo estropearia. */}
      <Sequence from={f(B[5])} durationInFrames={dur(5)} name="6 · Un Año Santo se nota">
        <Planos
          total={dur(5)}
          overlay={0.32}
          lista={[
            { src: "catedral-torres", dura: 1.6 },
            { src: "brindis", dura: 1.8, encuadre: "42% 50%" },
            { src: "vieiras", dura: 1.25, ritmo: 0.85 },
            { src: "iglesia-exterior", dura: 1.3, ritmo: 0.9 },
          ]}
        />
        <Cartela principal="The Camino" secundaria="at its most alive" desde={6} />
      </Sequence>

      {/* 7 · La llegada, y la prueba social. El dato entra cuando la voz
             dice por que la gente cruza un oceano por esto. */}
      <Sequence from={f(B[6])} durationInFrames={dur(6)} name="7 · Obradoiro">
        <Planos
          total={dur(6)}
          overlay={0.3}
          lista={[
            { src: "plaza", dura: 1.05, ritmo: 0.7 },
            { src: "compostela", dura: 1.7, encuadre: "38% 50%", ritmo: 0.9 },
            { src: "catedral-a", dura: 1.7, ritmo: 0.85 },
          ]}
        />
        <Inferior alto={280}>
          <CajaDato
            desde={en(6, 37.0)}
            eyebrow="In a Holy Year"
            cifra="A plenary indulgence"
            texto="Making a pilgrimage during a Holy Year allows Christians to obtain one"
            tono="bosque"
          />
        </Inferior>
      </Sequence>

      {/* 8 · El bloque de servicio. Es el mas largo de la pieza a proposito:
             aqui se construye la sensacion premium. Cada tarjeta cae sobre
             la frase que la nombra, y el plano ensena de que habla. */}
      <Sequence
        from={f(B[7])}
        durationInFrames={f(B[11]) - f(B[7])}
        name="8 · Lo que hacemos nosotros"
      >
        {/* 8a · "...so you don't have to plan a thing." */}
        <Sequence durationInFrames={dur(7)} name="8a · Las rutas">
          <Planos
            total={dur(7)}
            overlay={0.42}
            lista={[
              { src: "flecha", dura: 1.2, encuadre: "58% 50%", ritmo: 0.7 },
              { src: "piernas", dura: 2.0 },
            ]}
          />
        </Sequence>

        {/* 8b · "Handpicked hotels and country houses." */}
        <Sequence from={dur(7)} durationInFrames={dur(8)} name="8b · Alojamiento">
          <Planos
            total={dur(8)}
            overlay={0.42}
            lista={[
              { src: "habitacion", dura: 1.3, encuadre: "62% 50%" },
              { src: "casa-rural", dura: 1.2, encuadre: "38% 50%", ritmo: 0.92 },
            ]}
          />
        </Sequence>

        {/* 8c · "Your luggage moved ahead every morning." */}
        <Sequence
          from={f(B[9]) - f(B[7])}
          durationInFrames={dur(9)}
          name="8c · Equipajes"
        >
          <Planos
            total={dur(9)}
            overlay={0.26}
            lista={[
              { src: "equipaje-etiquetas", dura: 0.95, ritmo: 0.44 },
            ]}
          />
        </Sequence>

        {/* 8d · "A dedicated advisor, and support in English, all the way." */}
        <Sequence
          from={f(B[10]) - f(B[7])}
          durationInFrames={dur(10)}
          name="8d · Asesor"
        >
          <Planos
            total={dur(10)}
            overlay={0.42}
            lista={[
              { src: "portico-sellado", dura: 1.7, encuadre: "30% 50%" },
              { src: "equipaje-grupo", dura: 1.2, encuadre: "45% 50%", ritmo: 0.75 },
            ]}
          />
        </Sequence>

        {/* Las tarjetas se quedan en pantalla y se van sumando, de modo que
            al final del bloque se leen las cuatro juntas. Se nombra lo que
            se quita, no lo que se anade: es lo que suena a viaje cuidado. */}
        <AbsoluteFill
          style={{ justifyContent: "center", padding: margin, paddingBottom: 260 }}
        >
          <Bullets
            marca="check"
            cuerpo={34}
            items={[
              "Handpicked stays",
              "Bags moved daily",
              "A dedicated advisor",
              "24/7 support in English",
            ]}
            tiempos={[
              f(B[8]) - f(B[7]),
              f(B[9]) - f(B[7]),
              f(B[10]) - f(B[7]),
              en(7, 49.9),
            ]}
          />
        </AbsoluteFill>
      </Sequence>

      {/* 9 · El remate del servicio, en una frase. */}
      <Sequence from={f(B[11])} durationInFrames={dur(11)} name="9 · Una mochila">
        <Planos
          total={dur(11)}
          overlay={0.36}
          lista={[
            { src: "pareja-muros", dura: 1.55, encuadre: "40% 50%", ritmo: 0.72 },
          ]}
        />
        <Cartela
          principal="You walk."
          secundaria="We handle the rest"
          desde={0}
          arriba={240}
        />
      </Sequence>

      {/* 10 · El argumento para reservar ya: disponibilidad y eleccion, no
              precio. Sin texto, para que la frase respire antes del CTA. */}
      <Sequence from={f(B[12])} durationInFrames={dur(12)} name="10 · Plazas contadas">
        <Planos
          total={dur(12)}
          overlay={0.34}
          lista={[
            { src: "terraza", dura: 2.0, encuadre: "30% 50%" },
            { src: "mesa-exterior", dura: 1.45, encuadre: "40% 50%", ritmo: 0.8 },
          ]}
        />
      </Sequence>


      {/* 11 · Cierre de marca. El unico CTA de la pieza. */}
      <Sequence from={f(B[13])} durationInFrames={dur(13)} name="11 · Cierre">
        <Cierre
          duracion={dur(13)}
          cta="Reserve your 2027 Camino"
          coletilla="Link in bio"
        />
      </Sequence>
    </AbsoluteFill>
  );
};

export const DURACION_REEL_US = f(B[B.length - 1]);
