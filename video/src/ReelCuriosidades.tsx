import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import "./fuentes";
import { brand, fontFamily, margin } from "./brand/theme";
import { Cartela } from "./componentes/Cartela";
import { Logo } from "./componentes/Logo";
import { Planos } from "./componentes/Planos";
import { Subtitulos, type Pie } from "./componentes/Subtitulos";
import { Cierre } from "./escenas/Cierre";
import { Velocimetro } from "./graficos/Velocimetro";

/**
 * Reel de curiosidades del Camino de Santiago.
 *
 * Cuatro datos, uno por bloque, con el gancho delante y el cierre de marca
 * detras. Los cortes caen en los arranques de frase de la locucion, medidos
 * con `silencedetect` sobre el MP3, de modo que la imagen cambia justo cuando
 * la voz empieza a contar cada curiosidad.
 *
 * Solo tres bloques llevan cartela. El del Botafumeiro no: ahi habla el
 * velocimetro, que ya trae su titular y su fuente.
 *
 * Los subtitulos se cortan antes del cierre. El cierre es degradado, logo y
 * web, y nada mas.
 */

/** Arranques de frase de la locucion, en segundos. */
const B = [0, 3.635, 15.409, 26.507, 33.882, 44.752, 48.8];
const f = (s: number) => Math.round(s * 30);
const dur = (i: number) => f(B[i + 1]) - f(B[i]);

/**
 * Un pie por frase, con los limites reales de la locucion.
 *
 * Las pausas cortas entre frases las cubre el propio componente alargando el
 * pie anterior, asi que aqui van los tiempos tal cual se midieron.
 */
const PIES: Pie[] = [
  { desde: 0.0, hasta: 1.8, texto: "Cuatro cosas del Camino de Santiago" },
  { desde: 2.087, hasta: 2.989, texto: "que casi nadie sabe." },

  { desde: 3.635, hasta: 5.347, texto: "La primera guía de viajes de la historia" },
  { desde: 5.75, hasta: 8.113, texto: "se escribió para este camino, en el siglo XII." },
  { desde: 8.661, hasta: 10.637, texto: "Y ya avisaba de qué ríos no beber." },
  { desde: 11.367, hasta: 12.647, texto: "Del Salado dejó escrito:" },
  { desde: 13.298, hasta: 14.733, texto: "«guárdate, que es mortífero»." },

  { desde: 15.409, hasta: 17.498, texto: "En la catedral de Santo Domingo de la Calzada" },
  { desde: 17.97, hasta: 19.501, texto: "viven un gallo y una gallina." },
  { desde: 20.117, hasta: 23.26, texto: "Vivos, dentro del templo, desde el siglo XV." },
  { desde: 23.885, hasta: 25.923, texto: "Es la única iglesia del mundo que lo permite." },

  { desde: 26.507, hasta: 29.007, texto: "El Botafumeiro necesita ocho hombres para volar." },
  { desde: 29.729, hasta: 33.22, texto: "Alcanza los 68 km/h y sube 21 metros." },

  {
    desde: 33.882,
    hasta: 38.925,
    texto: "Y al llegar, el hostal que los Reyes Católicos levantaron en 1499",
  },
  { desde: 39.463, hasta: 41.015, texto: "todavía da de comer, gratis," },
  {
    desde: 41.384,
    hasta: 44.06,
    texto: "a los diez primeros peregrinos que enseñen la Compostela.",
  },
];

/** Zona del grafico: por debajo de las cartelas y por encima de los pies. */
const Inferior: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{
      justifyContent: "flex-end",
      alignItems: "center",
      padding: margin,
      paddingBottom: 470,
    }}
  >
    {children}
  </AbsoluteFill>
);

export const ReelCuriosidades: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: brand.forest, fontFamily }}>
      <Audio src={staticFile("locucion-curiosidades.mp3")} />

      {/* La marca acompana la pieza hasta el cierre, que ya es todo marca. */}
      <Sequence durationInFrames={f(B[5])} name="Marca">
        <Logo
          variante="blanco"
          ancho={240}
          style={{ position: "absolute", left: margin, bottom: margin, opacity: 0.92 }}
        />
      </Sequence>

      {/* 1 · Gancho */}
      <Sequence durationInFrames={dur(0)} name="1 · Gancho">
        <Planos
          total={dur(0)}
          overlay={0.38}
          lista={[
            { src: "camino-abierto", dura: 1.17 },
            { src: "contraluz", dura: 1.43 },
            { src: "piernas", dura: 2.23 },
          ]}
        />
        <Cartela principal="4 curiosidades" secundaria="Del Camino de Santiago" desde={4} />
      </Sequence>

      {/* 2 · La primera guía de viajes de la historia */}
      <Sequence from={f(B[1])} durationInFrames={dur(1)} name="2 · Códice Calixtino">
        <Planos
          total={dur(1)}
          overlay={0.42}
          lista={[
            { src: "credencial", dura: 1.07 },
            { src: "manos-sellando", dura: 1.6, encuadre: "28% 50%" },
            { src: "portico-sellado", dura: 1.97, encuadre: "30% 50%" },
            { src: "interior-velas", dura: 2.1 },
            { src: "iglesia-exterior", dura: 1.37, encuadre: "56% 50%" },
            { src: "catedral-a", dura: 1.7 },
            { src: "escaleras", dura: 1.2 },
            { src: "flecha", dura: 1.17, encuadre: "58% 50%" },
          ]}
        />
        <Cartela principal="Siglo XII" secundaria="La primera guía de viajes" desde={8} />
      </Sequence>

      {/* 3 · Un gallo y una gallina dentro de la catedral */}
      <Sequence from={f(B[2])} durationInFrames={dur(2)} name="3 · El gallinero">
        <Planos
          total={dur(2)}
          overlay={0.42}
          lista={[
            { src: "campo-flores", dura: 1.67 },
            { src: "rio-piedras", dura: 1.0 },
            { src: "tunel-vegetacion", dura: 0.83 },
            { src: "grupo-mimosas", dura: 1.17 },
            { src: "pareja-muros", dura: 1.57, encuadre: "40% 50%" },
            { src: "plaza", dura: 1.03 },
            { src: "contraluz", dura: 1.43 },
            { src: "brazos-alto", dura: 0.97, encuadre: "34% 50%" },
            { src: "camino-abierto", dura: 1.17 },
            { src: "piernas", dura: 2.23 },
          ]}
        />
        <Cartela principal="Un gallo vivo" secundaria="Dentro de la catedral" desde={8} />
      </Sequence>

      {/* 4 · El Botafumeiro. Sin cartela: habla el gráfico. */}
      <Sequence from={f(B[3])} durationInFrames={dur(3)} name="4 · Botafumeiro">
        <Planos
          total={dur(3)}
          overlay={0.46}
          lista={[
            { src: "catedral-torres", dura: 1.7 },
            { src: "catedral-b", dura: 1.7 },
            { src: "interior-velas", dura: 2.1 },
            { src: "fachada-moderna", dura: 1.17, encuadre: "40% 50%" },
            { src: "grupo-peregrinos", dura: 0.73 },
            { src: "catedral-a", dura: 1.7 },
          ]}
        />
        <Inferior>
          <Velocimetro desde={8} remate={20} cuenta={87} recorrido={42} />
        </Inferior>
      </Sequence>

      {/* 5 · Comida gratis para el peregrino desde 1499 */}
      <Sequence from={f(B[4])} durationInFrames={dur(4)} name="5 · Hostal dos Reis">
        <Planos
          total={dur(4)}
          overlay={0.4}
          lista={[
            { src: "habitacion", dura: 2.17, encuadre: "62% 50%" },
            { src: "casa-rural", dura: 1.17, encuadre: "38% 50%" },
            { src: "terraza", dura: 2.2, encuadre: "30% 50%" },
            { src: "mesa-exterior", dura: 1.43, encuadre: "40% 50%" },
            { src: "vieiras", dura: 1.27 },
            { src: "brindis", dura: 2.0, encuadre: "42% 50%" },
            { src: "escaleras", dura: 1.2 },
            { src: "compostela", dura: 1.7, encuadre: "38% 50%" },
            { src: "plaza", dura: 1.03 },
          ]}
        />
        <Cartela principal="Desde 1499" secundaria="Comida gratis al peregrino" desde={8} />
      </Sequence>

      {/* Los pies acompañan toda la locución menos el cierre. */}
      <Sequence durationInFrames={f(B[5])} name="Subtítulos">
        <Subtitulos lista={PIES} />
      </Sequence>

      {/* 6 · Cierre de marca */}
      <Sequence from={f(B[5])} durationInFrames={dur(5)} name="6 · Cierre">
        <Cierre duracion={dur(5)} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const DURACION_CURIOSIDADES = f(B[B.length - 1]);
