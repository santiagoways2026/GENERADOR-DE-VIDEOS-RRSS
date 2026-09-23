import { Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { brand, easeOut, fps, logo } from "../brand/theme";

/**
 * Subtítulos palabra a palabra, al estilo de redes.
 *
 * Se agrupan en páginas cortas (hasta tres palabras) que cambian al ritmo de
 * la voz. La palabra que suena va en una placa lima con texto bosque, que es
 * la única combinación que la marca permite sobre lima; el resto, en blanco
 * con contorno bosque para leerse sobre cualquier plano.
 *
 * "Santiago Ways" nunca se escribe: cuando la voz lo dice, sale el logo.
 */

type Palabra = { t: string; en: number; fin: number };
type Token = { texto: string; en: number; fin: number; logo?: boolean };

const MAX_PALABRAS = 3;
const MAX_CARACTERES = 15;

const limpiar = (t: string) => t.replace(/[.,!?;:"“”]/g, "").trim();

function tokens(palabras: Palabra[]): Token[] {
  const out: Token[] = [];
  for (let i = 0; i < palabras.length; i++) {
    const w = palabras[i];
    const sig = palabras[i + 1];
    if (/^santiago$/i.test(limpiar(w.t)) && sig && /^ways/i.test(limpiar(sig.t))) {
      out.push({ texto: "", en: w.en, fin: sig.fin, logo: true });
      i++;
      continue;
    }
    out.push({ texto: w.t, en: w.en, fin: w.fin });
  }
  return out;
}

function paginar(ts: Token[]): Token[][] {
  const paginas: Token[][] = [];
  let actual: Token[] = [];
  const cerrar = () => {
    if (actual.length) paginas.push(actual);
    actual = [];
  };
  ts.forEach((t, i) => {
    const previa = ts[i - 1];
    const largo = actual.reduce((n, x) => n + limpiar(x.texto).length + 1, 0);
    if (
      actual.length >= MAX_PALABRAS ||
      largo + limpiar(t.texto).length > MAX_CARACTERES ||
      (previa && t.en - previa.fin > 0.35) ||
      t.logo ||
      actual.some((x) => x.logo)
    ) {
      cerrar();
    }
    actual.push(t);
    // La puntuación fuerte cierra la página.
    if (/[.?!,]$/.test(t.texto)) cerrar();
  });
  cerrar();
  return paginas;
}

export const Subtitulos: React.FC<{ palabras: Palabra[] }> = ({ palabras }) => {
  const frame = useCurrentFrame();
  const t = frame / fps;
  const paginas = paginar(tokens(palabras));

  const idx = paginas.findIndex((p, i) => {
    const sig = paginas[i + 1];
    const fin = sig ? Math.min(sig[0].en, p[p.length - 1].fin + 0.6) : p[p.length - 1].fin + 0.4;
    return t >= p[0].en - 0.05 && t < fin;
  });
  if (idx < 0) return null;
  const pagina = paginas[idx];
  const desde = (pagina[0].en - 0.05) * fps;
  const entra = interpolate(frame, [desde, desde + 5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(...easeOut),
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 1300,
        left: 70,
        right: 70,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        gap: "6px 14px",
        opacity: entra,
        translate: `0px ${(1 - entra) * 18}px`,
      }}
    >
      {pagina.map((w, i) => {
        const activa = t >= w.en - 0.03 && t < (pagina[i + 1]?.en ?? w.fin + 0.6);
        if (w.logo) {
          return (
            <div
              key={i}
              style={{
                backgroundColor: brand.green,
                borderRadius: 12,
                padding: "14px 26px",
              }}
            >
              <Img src={staticFile(logo.blanco)} style={{ height: 70, width: "auto", display: "block" }} />
            </div>
          );
        }
        return (
          <span
            key={i}
            style={{
              fontSize: 76,
              lineHeight: 1.08,
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "-0.01em",
              padding: "2px 14px 6px",
              borderRadius: 12,
              color: activa ? brand.forest : brand.white,
              backgroundColor: activa ? brand.lime : "transparent",
              WebkitTextStroke: activa ? "0px" : `12px ${brand.forest}`,
              paintOrder: "stroke fill",
              textShadow: activa ? "none" : "0 6px 18px rgba(14, 44, 31, 0.55)",
              scale: activa ? 1.06 : 1,
            }}
          >
            {limpiar(w.texto)}
          </span>
        );
      })}
    </div>
  );
};
