import { AbsoluteFill, Composition, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import "../fuentes";
import { easeOut, fontFamily, paleta } from "../brand/theme";

/**
 * Ventanas flotantes para el vídeo de YouTube del webinar Holy Year 2027
 * (tareas de Pau en "plan youtube"). Se renderizan con fondo transparente y
 * se superponen al vídeo original con ffmpeg, sin tocar su montaje.
 *
 * Todas van a la izquierda, sobre la pared libre junto a Nahema: no tapan su
 * cara ni la esquina inferior derecha, donde YouTube pone la marca de agua
 * del canal.
 */

const FPS = 25;
const curva = Easing.bezier(...easeOut);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const SOMBRA = "0 8px 32px rgba(46, 46, 45, 0.12)";
const URL_CORTA = "linktr.ee/santiago_ways1";

/** Entrada y salida: fundido con desplazamiento corto, curva de la marca. */
const useEntrada = () => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const ent = interpolate(f, [0, 18], [0, 1], { ...clamp, easing: curva });
  const sal = interpolate(f, [durationInFrames - 15, durationInFrames - 1], [1, 0], { ...clamp, easing: curva });
  const v = Math.min(ent, sal);
  return { opacity: v, transform: `translateX(${(1 - v) * -40}px)` };
};

const Tarjeta: React.FC<{ children: React.ReactNode; top: number; ancho?: number }> = ({ children, top, ancho = 440 }) => {
  const anim = useEntrada();
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 64,
          top,
          width: ancho,
          background: paleta.blanco,
          borderRadius: 22,
          boxShadow: SOMBRA,
          padding: "28px 30px",
          fontFamily,
          color: paleta.grafito,
          ...anim,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};

const Antetitulo: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: 2, color: paleta.sendero, marginBottom: 10 }}>{children}</div>
);

const Boton: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 12,
      marginTop: 20,
      background: paleta.verdeWays,
      color: paleta.blanco,
      fontWeight: 800,
      fontSize: 28,
      padding: "12px 26px",
      borderRadius: 999,
    }}
  >
    {children}
  </div>
);

const Campana: React.FC = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

/** 1. Suscripción, justo después del primer gancho. */
export const Suscribir: React.FC = () => (
  <Tarjeta top={600}>
    <Antetitulo>HOLY YEAR 2027</Antetitulo>
    <div style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.1 }}>Planning your Camino?</div>
    <div style={{ fontSize: 26, lineHeight: 1.4, marginTop: 10, color: paleta.gris }}>
      Subscribe for more tips from our Camino experts.
    </div>
    <Boton>
      <Campana /> Subscribe
    </Boton>
  </Tarjeta>
);

/** 2 y 3. Redes con el QR del final, que así sale antes. */
export const Redes: React.FC = () => (
  <Tarjeta top={560} ancho={440}>
    <Antetitulo>KEEP IN TOUCH</Antetitulo>
    <div style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.1 }}>Follow us on social media</div>
    <div style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 20 }}>
      <Img src={staticFile("ytweb/qr.png")} style={{ width: 170, height: 170, borderRadius: 10 }} />
      <div style={{ fontSize: 26, lineHeight: 1.4, color: paleta.gris }}>Scan the code</div>
    </div>
  </Tarjeta>
);

/** 4. Datos de contacto en un momento clave (texto pendiente de validar por Vir). */
export const Contacto: React.FC = () => (
  <Tarjeta top={560} ancho={460}>
    <Antetitulo>TALK TO US</Antetitulo>
    <div style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.1 }}>Questions about your Camino?</div>
    <div style={{ fontSize: 26, lineHeight: 1.5, marginTop: 14 }}>
      <div style={{ fontWeight: 800, color: paleta.sendero }}>info@santiagoways.com</div>
    </div>
  </Tarjeta>
);

/** 5. URL corta al lado del QR de la diapositiva final. */
export const UrlFinal: React.FC = () => {
  const f = useCurrentFrame();
  // Sin salida propia: se corta con la diapositiva.
  const o = interpolate(f, [0, 12], [0, 1], { ...clamp, easing: curva });
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          right: 330,
          top: 900,
          background: paleta.blanco,
          color: paleta.sendero,
          fontFamily,
          fontWeight: 800,
          fontSize: 30,
          padding: "10px 24px",
          borderRadius: 999,
          opacity: o,
        }}
      >
        {URL_CORTA}
      </div>
    </AbsoluteFill>
  );
};

const VENTANAS: [string, React.FC, number][] = [
  ["Suscribir", Suscribir, 9],
  ["Redes", Redes, 12],
  ["Contacto", Contacto, 12],
  ["UrlFinal", UrlFinal, 14],
];

export const ComposicionesYtWebinar: React.FC = () => (
  <>
    {VENTANAS.map(([id, C, s]) => (
      <Composition key={id} id={`YtWeb-${id}`} component={C} durationInFrames={Math.round(s * FPS)} fps={FPS} width={1920} height={1080} />
    ))}
  </>
);
