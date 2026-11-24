/**
 * Trocea la locución en subtítulos cortos sincronizados por palabra.
 *
 * Es lógica pura, sin React ni Remotion, para que la use tanto el montaje
 * como el script que escribe los SRT (node la importa tal cual).
 */

export type Palabra = { t: string; ini: number; fin: number };
export type Segmento = {
  /** Lo que dice la voz. */
  voz: string;
  /** Lo que se lee en pantalla, si difiere de la voz (cifras, abreviaturas). */
  texto?: string;
  /** Palabras que van en caja verde. Una o dos por frase como máximo. */
  clave: string[];
  ini: number;
  fin: number;
  palabras: Palabra[];
};
export type Voz = { duracion: number; segmentos: Segmento[] };

export type Parte = { texto: string; clave: boolean };
export type Trozo = { ini: number; fin: number; seg: number; partes: Parte[] };

const MAX_PALABRAS = 5;
const MAX_LETRAS = 24;

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[¿?¡!.,:;«»"]/g, "")
    .trim();

/** Momento en que se dice cada palabra del texto en pantalla. */
function tiempos(seg: Segmento, fichas: string[]): number[] {
  // edge-tts a veces junta dos palabras en una marca («11 años»): se reparten.
  const sueltas: number[] = [];
  for (const p of seg.palabras) {
    const n = p.t.split(/\s+/).filter(Boolean).length || 1;
    for (let k = 0; k < n; k++) sueltas.push(p.ini + ((p.fin - p.ini) * k) / n);
  }
  if (!seg.texto && sueltas.length === fichas.length) return sueltas;
  // El texto en pantalla no coincide palabra a palabra con la voz: reparto
  // proporcional, que basta para frases cortas.
  return fichas.map((_, i) => sueltas[Math.min(sueltas.length - 1, Math.floor((i * sueltas.length) / fichas.length))]);
}

/** Índices de las fichas que forman parte de una palabra clave. */
function marcasClave(fichas: string[], clave: string[]): Set<number> {
  const n = fichas.map(norm);
  const marcadas = new Set<number>();
  for (const frase of clave) {
    const f = frase.split(/\s+/).map(norm);
    for (let i = 0; i + f.length <= n.length; i++) {
      if (f.every((w, k) => n[i + k] === w)) {
        for (let k = 0; k < f.length; k++) marcadas.add(i + k);
        break; // solo la primera vez
      }
    }
  }
  return marcadas;
}

const DEBILES = new Set(
  "el la los las un una unos de del a al en y o por para con sin que se te le lo me nos tu tus su sus mi este esta es".split(" "),
);
const esNumero = (f: string) => /^\d/.test(f);
const mayus = (f: string) => /^[A-ZÁÉÍÓÚÑ]/.test(f.replace(/^[¿¡]/, ""));

/**
 * Parte una frase en bloques de 2 a 5 palabras buscando el corte más natural:
 * nunca dentro de una palabra clave, a ser posible no tras un artículo o una
 * preposición, ni entre dos palabras de un nombre propio («Ponte Ulla»), ni
 * tras una cifra («25 de julio»), y sin dejar una palabra sola.
 */
function partirFrase(fichas: string[], idx: number[], clave: Set<number>): number[][] {
  const n = idx.length;
  const corte = (k: number) => {
    // coste de cortar entre idx[k] y idx[k+1]
    const a = idx[k], b = idx[k + 1];
    if (clave.has(a) && clave.has(b)) return 1000;
    let c = 0;
    if (DEBILES.has(norm(fichas[a]))) c += 9;
    if (mayus(fichas[a]) && mayus(fichas[b])) c += 15;
    if (esNumero(fichas[a])) c += 12;
    return c;
  };
  const grupo = (i: number, j: number) => {
    // coste del bloque idx[i..j-1]
    // Una palabra clave de varias fichas («6, 5, 6 y 11») cuenta como una.
    const len = idx.slice(i, j).filter((k, q) => q === 0 || !(clave.has(k) && clave.has(idx[i + q - 1]))).length;
    const letras = idx.slice(i, j).map((k) => fichas[k]).join(" ").length;
    if (len > MAX_PALABRAS || (len > 1 && letras > MAX_LETRAS + 4)) return Infinity;
    let c = 10;
    if (len === 1) c += 30;
    if (len === 2) c += 3;
    if (letras > MAX_LETRAS - 2) c += (letras - MAX_LETRAS + 2) * 2;
    return c;
  };
  const mejor: number[] = Array(n + 1).fill(Infinity);
  const desde: number[] = Array(n + 1).fill(-1);
  mejor[0] = 0;
  for (let j = 1; j <= n; j++) {
    for (let i = 0; i < j; i++) {
      const c = mejor[i] + grupo(i, j) + (j < n ? corte(j - 1) : 0);
      if (c < mejor[j]) {
        mejor[j] = c;
        desde[j] = i;
      }
    }
  }
  const grupos: number[][] = [];
  for (let j = n; j > 0; j = desde[j]) grupos.unshift(idx.slice(desde[j], j));
  return grupos;
}

/** Corta por signos de puntuación y reparte cada frase en bloques. */
function partir(fichas: string[], clave: Set<number>): number[][] {
  const frases: number[][] = [[]];
  fichas.forEach((f, i) => {
    frases[frases.length - 1].push(i);
    const fuerte = /[.?!]$/.test(f);
    const debil = /[,:;]$/.test(f) && !clave.has(i + 1);
    if ((fuerte || debil) && i < fichas.length - 1) frases.push([]);
  });
  // Una frase de una sola palabra («Uno:», «Rías,») se une a la siguiente,
  // salvo que cierre una oración.
  const unidas: number[][] = [];
  for (let k = 0; k < frases.length; k++) {
    const fr = frases[k];
    const sola = fr.length === 1 && !/[.?!]$/.test(fichas[fr[0]]);
    if (sola && k < frases.length - 1) frases[k + 1] = [...fr, ...frases[k + 1]];
    else if (fr.length === 1 && unidas.length && !/[.?!]$/.test(fichas[unidas[unidas.length - 1].slice(-1)[0]]))
      unidas[unidas.length - 1].push(...fr);
    else unidas.push(fr);
  }
  return unidas.flatMap((fr) => partirFrase(fichas, fr, clave));
}

export function trocear(voz: Voz): Trozo[] {
  const trozos: Trozo[] = [];
  voz.segmentos.forEach((seg, si) => {
    const fichas = (seg.texto ?? seg.voz).split(/\s+/).filter(Boolean);
    const t = tiempos(seg, fichas);
    const clave = marcasClave(fichas, seg.clave);

    const grupos = partir(fichas, clave);

    const siguiente = voz.segmentos[si + 1];
    const finSeg = Math.min(siguiente ? siguiente.ini : voz.duracion, seg.fin + 0.25);
    grupos.forEach((g, gi) => {
      const ini = gi === 0 ? Math.max(0, t[g[0]] - 0.08) : t[g[0]] - 0.05;
      const fin = gi < grupos.length - 1 ? t[grupos[gi + 1][0]] - 0.05 : finSeg;
      if (trozos.length && trozos[trozos.length - 1].fin > ini) trozos[trozos.length - 1].fin = ini;
      trozos.push({
        ini,
        fin,
        seg: si,
        partes: g.map((i) => ({ texto: fichas[i], clave: clave.has(i) })),
      });
    });
  });
  return trozos;
}

/** Une las fichas seguidas en caja verde en una sola caja. */
export function agrupar(partes: Parte[]): Parte[] {
  const out: Parte[] = [];
  for (const p of partes) {
    const ult = out[out.length - 1];
    if (ult && ult.clave === p.clave) ult.texto += " " + p.texto;
    else out.push({ ...p });
  }
  return out;
}

const hms = (s: number) => {
  const ms = Math.max(0, Math.round(s * 1000));
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const sec = Math.floor((ms % 60000) / 1000);
  const r = ms % 1000;
  const p = (n: number, l = 2) => String(n).padStart(l, "0");
  return `${p(h)}:${p(m)}:${p(sec)},${p(r, 3)}`;
};

export function srt(trozos: Trozo[]): string {
  return trozos
    .map((tr, i) => `${i + 1}\n${hms(tr.ini)} --> ${hms(tr.fin)}\n${tr.partes.map((p) => p.texto).join(" ")}\n`)
    .join("\n");
}
