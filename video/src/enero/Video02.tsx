import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  useCurrentFrame,
} from "remotion";
import voz from "../../public/enero/voz/02.json";
import { c, cajaGrafico, curva, fuente, s2f, seguro } from "./marca";
import { VozEnOff } from "./VozEnOff";
import { Montaje } from "./Montaje";
import { Subtitulos, Titular, useEntrada } from "./Texto";
import type { Voz } from "./subtitulos";

/**
 * Vídeo 2 · 4 curiosidades del Año Santo.
 * Solo motion graphics: ni Catedral ni Puerta Santa, para no repetir el
 * vídeo del día 1.
 */
const V = voz as Voz;
const S = V.segmentos.map((s) => s2f(s.ini));
export const DURACION_02 = s2f(V.duracion + 1.2);

/** Cada bloque entra 3 fotogramas antes de que empiece su frase. */
const inicioBloque = (i: number) => (i === 0 ? 0 : S[i] - 3);

/** Fotograma, dentro de su bloque, en que la voz dice la palabra `t` del segmento `seg`. */
const dice = (seg: number, t: string, n = 0) => {
  const ps = V.segmentos[seg].palabras.filter(
    (p) => p.t.replace(/[.,]/g, "") === t,
  );
  return s2f((ps[n] ?? V.segmentos[seg].palabras[0]).ini) - inicioBloque(seg);
};

const ease = Easing.bezier(...curva);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Número de orden y rótulo de cada curiosidad. */
const Cabecera: React.FC<{ n: number; texto: string }> = ({ n, texto }) => {
  const a = useEntrada(0, 8, 18);
  const b = useEntrada(5, 8, 18);
  return (
    <div
      style={{
        position: "absolute",
        top: 300,
        left: seguro.izquierda,
        right: seguro.derecha,
        display: "flex",
        alignItems: "center",
        gap: 36,
        fontFamily: fuente,
      }}
    >
      <div
        style={{
          ...cajaGrafico,
          width: 150,
          height: 150,
          flex: "0 0 150px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 104,
          fontWeight: 800,
          ...a,
        }}
      >
        {n}
      </div>
      <div
        style={{
          color: c.blanco,
          fontSize: 56,
          fontWeight: 800,
          lineHeight: 1.15,
          ...b,
        }}
      >
        {texto}
      </div>
    </div>
  );
};

/** Bloque central donde viven los gráficos. */
const Centro: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      position: "absolute",
      top: 520,
      height: 660,
      left: seguro.izquierda,
      right: seguro.derecha,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: fuente,
      color: c.blanco,
    }}
  >
    {children}
  </div>
);

const aparece = (frame: number, desde: number, dura = 8) => {
  const t = interpolate(frame, [desde, desde + dura], [0, 1], {
    ...clamp,
    easing: ease,
  });
  return { opacity: t, transform: `translateY(${(1 - t) * 24}px)` };
};

/* ---------------- 0 · Gancho ---------------- */
const Gancho: React.FC = () => {
  const f = useCurrentFrame();
  const t5 = dice(0, "5");
  const t10 = dice(0, "10");
  const t27 = dice(0, "2027");
  const tachar = (d: number) =>
    interpolate(f, [d + 10, d + 20], [0, 100], { ...clamp, easing: ease });
  const Fila: React.FC<{ txt: string; d: number }> = ({ txt, d }) => (
    <div
      style={{
        position: "relative",
        fontSize: 110,
        fontWeight: 800,
        color: c.blanco,
        ...aparece(f, d),
      }}
    >
      {txt}
      <div
        style={{
          position: "absolute",
          left: -10,
          top: "52%",
          height: 14,
          width: `calc(${tachar(d)}% + 20px)`,
          backgroundColor: c.verde,
          transform: "rotate(-1.5deg)",
        }}
      />
    </div>
  );
  return (
    <>
      <Titular
        texto="4 curiosidades del [Año Santo]"
        tema="foto"
        tam={80}
        arriba={290}
      />
      <Centro>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 18,
          }}
        >
          <Fila txt="cada 5 años" d={Math.max(0, t5 - 4)} />
          <Fila txt="cada 10 años" d={t10 - 4} />
          <div
            style={{
              ...cajaGrafico,
              marginTop: 30,
              fontSize: 190,
              fontWeight: 800,
              padding: "0 48px",
              lineHeight: 1.15,
              ...aparece(f, t27 - 3, 10),
            }}
          >
            2027
          </div>
        </div>
      </Centro>
    </>
  );
};

/* ---------------- 1 · Calendario de julio ---------------- */
const DIAS = ["L", "M", "X", "J", "V", "S", "D"];
const Calendario: React.FC = () => {
  const f = useCurrentFrame();
  // Pasa de año en año hasta 2027, el primero en que el 25 de julio es domingo.
  const anios = [2022, 2023, 2024, 2025, 2026, 2027];
  const paso = 9;
  const k = Math.min(anios.length - 1, Math.max(0, Math.floor((f - 6) / paso)));
  const anio = anios[k];
  const final = k === anios.length - 1;
  const primero = (new Date(Date.UTC(anio, 6, 1)).getUTCDay() + 6) % 7; // 0 = lunes
  const celdas = Array.from({ length: 42 }, (_, i) => i - primero + 1);
  const llegada = 6 + paso * (anios.length - 1);
  const marca = interpolate(f, [llegada, llegada + 8], [0, 1], {
    ...clamp,
    easing: ease,
  });
  const tam = 104;
  return (
    <Centro>
      <div
        style={{
          backgroundColor: c.blanco,
          boxShadow: "0 8px 32px rgba(46, 46, 45, 0.12)",
          padding: "34px 40px 40px",
          ...aparece(f, 0, 10),
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 18,
          }}
        >
          <span style={{ fontSize: 50, fontWeight: 800 }}>Julio</span>
          <span
            style={{
              fontSize: 50,
              fontWeight: 800,
              color: final ? c.sendero : c.grafito,
            }}
          >
            {anio}
          </span>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(7, ${tam}px)`,
            rowGap: 6,
          }}
        >
          {DIAS.map((d) => (
            <div
              key={d}
              style={{
                textAlign: "center",
                fontSize: 30,
                fontWeight: 800,
                color: d === "D" ? c.sendero : "#8a8a86",
                paddingBottom: 8,
              }}
            >
              {d}
            </div>
          ))}
          {celdas.slice(0, primero + 31 > 35 ? 42 : 35).map((n, i) => {
            const valido = n >= 1 && n <= 31;
            const es25 = n === 25;
            return (
              <div
                key={i}
                style={{
                  height: 76,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 34,
                  fontWeight: es25 ? 800 : 600,
                  color: !valido
                    ? "transparent"
                    : es25 && final
                      ? c.blanco
                      : es25
                        ? c.grafito
                        : "#6b6b68",
                  position: "relative",
                }}
              >
                {es25 ? (
                  <div
                    style={{
                      position: "absolute",
                      inset: 4,
                      ...(final ? cajaGrafico : { backgroundColor: c.niebla }),
                      transform: final
                        ? `scale(${0.85 + 0.15 * marca}) rotate(-1.5deg)`
                        : undefined,
                    }}
                  />
                ) : null}
                <span style={{ position: "relative" }}>{valido ? n : ""}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div
        style={{
          marginTop: 30,
          fontSize: 46,
          fontWeight: 800,
          color: c.blanco,
          opacity: marca,
        }}
      >
        25 de julio de 2027: domingo
      </div>
    </Centro>
  );
};

/* ---------------- 2 · Cadencia 6, 5, 6 y 11 ---------------- */
const Cadencia: React.FC = () => {
  const f = useCurrentFrame();
  const anios = [1993, 1999, 2004, 2010, 2021];
  const saltos = ["6", "5", "6", "11"];
  // Cada salto aparece cuando la voz dice su cifra.
  const tSaltos = [
    dice(2, "6", 0),
    dice(2, "5"),
    dice(2, "6", 1),
    dice(2, "11 años"),
  ];
  const alto = 128;
  return (
    <Centro>
      <div style={{ position: "relative", width: 760, height: alto * 4 + 90 }}>
        <div
          style={{
            position: "absolute",
            left: 380,
            top: 40,
            width: 6,
            height: interpolate(f, [0, 40], [0, alto * 4], {
              ...clamp,
              easing: ease,
            }),
            backgroundColor: c.niebla,
          }}
        />
        {anios.map((a, i) => (
          <div
            key={a}
            style={{
              position: "absolute",
              left: 430,
              top: i * alto + 8,
              fontSize: 64,
              fontWeight: 800,
              color: c.blanco,
              ...aparece(f, i * 6, 8),
            }}
          >
            {a}
            <div
              style={{
                position: "absolute",
                left: -61,
                top: 26,
                width: 22,
                height: 22,
                backgroundColor: c.verde,
                transform: "rotate(45deg)",
              }}
            />
          </div>
        ))}
        {saltos.map((s, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              right: 430,
              top: i * alto + alto / 2 + 6,
              display: "flex",
              alignItems: "center",
              gap: 14,
              ...aparece(f, tSaltos[i] - 2, 7),
            }}
          >
            <span
              style={{
                ...cajaGrafico,
                fontSize: 64,
                fontWeight: 800,
                padding: "0 22px",
                lineHeight: 1.2,
              }}
            >
              {s}
            </span>
            <span
              style={{
                fontSize: 34,
                fontWeight: 700,
                color: "rgba(255,255,255,0.85)",
              }}
            >
              años
            </span>
          </div>
        ))}
      </div>
    </Centro>
  );
};

/* ---------------- 3 · 2021 y 2022 ---------------- */
const DosAnios: React.FC = () => {
  const f = useCurrentFrame();
  const t21 = dice(3, "2021");
  const t22 = dice(3, "2022");
  const pand = dice(3, "pandemia");
  const Tarjeta: React.FC<{ a: string; d: number }> = ({ a, d }) => (
    <div
      style={{
        ...cajaGrafico,
        fontSize: 150,
        fontWeight: 800,
        padding: "6px 44px",
        ...aparece(f, d - 3, 9),
      }}
    >
      {a}
    </div>
  );
  return (
    <Centro>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 28,
        }}
      >
        <Tarjeta a="2021" d={t21} />
        <div
          style={{ fontSize: 60, fontWeight: 800, ...aparece(f, t22 - 6, 6) }}
        >
          y
        </div>
        <Tarjeta a="2022" d={t22} />
        <div
          style={{
            marginTop: 18,
            fontSize: 46,
            fontWeight: 700,
            color: "rgba(255,255,255,0.85)",
            ...aparece(f, pand - 2, 8),
          }}
        >
          un Año Santo prorrogado
        </div>
      </div>
    </Centro>
  );
};

/* ---------------- 4 · Después de 2027, 2032 ---------------- */
const Siguiente: React.FC = () => {
  const f = useCurrentFrame();
  const t32 = dice(4, "2032");
  const flecha = interpolate(f, [t32 - 18, t32 - 2], [0, 1], {
    ...clamp,
    easing: ease,
  });
  return (
    <Centro>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontSize: 150,
            fontWeight: 800,
            color: c.blanco,
            ...aparece(f, 4, 9),
          }}
        >
          2027
        </div>
        <div
          style={{
            height: 150,
            width: 6,
            position: "relative",
            margin: "10px 0 24px",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              width: 6,
              height: 150 * flecha,
              backgroundColor: c.verde,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: -15,
              top: 150 * flecha - 22,
              width: 36,
              height: 36,
              borderRight: `6px solid ${c.verde}`,
              borderBottom: `6px solid ${c.verde}`,
              transform: "rotate(45deg)",
              opacity: flecha,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 40,
              top: 50,
              whiteSpace: "nowrap",
              fontSize: 38,
              fontWeight: 700,
              color: "rgba(255,255,255,0.85)",
              opacity: flecha,
            }}
          >
            5 años
          </div>
        </div>
        <div
          style={{
            ...cajaGrafico,
            fontSize: 170,
            fontWeight: 800,
            padding: "0 44px",
            ...aparece(f, t32 - 3, 9),
          }}
        >
          2032
        </div>
      </div>
    </Centro>
  );
};

/* ---------------- 5 · Cierre ---------------- */
const Resumen: React.FC = () => {
  const f = useCurrentFrame();
  const items = [
    "Solo si el 25 de julio es domingo",
    "Cada 6, 5, 6 y 11 años",
    "El de 2021 duró dos años",
    "Después de 2027, 2032",
  ];
  return (
    <>
      <Titular texto="¿Cuál no conocías?" tema="foto" tam={84} arriba={300} />
      <Centro>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 22,
            width: "100%",
          }}
        >
          {items.map((t, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 26,
                backgroundColor: c.blanco,
                boxShadow: "0 8px 32px rgba(46, 46, 45, 0.12)",
                padding: "18px 26px",
                ...aparece(f, 4 + i * 5, 8),
              }}
            >
              <span
                style={{
                  ...cajaGrafico,
                  width: 82,
                  height: 82,
                  flex: "0 0 82px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 52,
                  fontWeight: 800,
                }}
              >
                {i + 1}
              </span>
              <span style={{ fontSize: 42, fontWeight: 800, color: c.grafito }}>
                {t}
              </span>
            </div>
          ))}
        </div>
      </Centro>
    </>
  );
};

/**
 * Fondo: planos del Camino (ninguno de la Catedral), desenfocados y
 * oscurecidos para que las cifras en blanco destaquen.
 */
const PLANOS_FONDO = [
  "v177",
  "v192",
  "v49",
  "v100",
  "v183",
  "v99",
  "v43",
  "v46",
];
const Fondo: React.FC = () => {
  const tramo = DURACION_02 / 30 / PLANOS_FONDO.length;
  return (
    <AbsoluteFill
      style={{ filter: "blur(7px) saturate(0.9)", transform: "scale(1.06)" }}
    >
      <Montaje
        fundido={12}
        tomas={PLANOS_FONDO.map((v, i) => ({
          src: `enero/clips/vertical-${v}.mp4`,
          ini: i * tramo,
          fin: (i + 1) * tramo,
          volumen: 0.1,
          velocidad: 0.7,
        }))}
      />
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(20,22,20,0.72) 0%, rgba(20,22,20,0.55) 45%, rgba(20,22,20,0.75) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

export const Video02: React.FC = () => {
  const bloques: [React.FC, string | null][] = [
    [Gancho, null],
    [Calendario, "Solo si el 25 de julio cae en domingo"],
    [Cadencia, "Llega con una cadencia rara"],
    [DosAnios, "El anterior duró dos años"],
    [Siguiente, "El siguiente no llega hasta 2032"],
    [Resumen, null],
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: c.grafito, fontFamily: fuente }}>
      <VozEnOff id="02" />
      <Fondo />
      {bloques.map(([Bloque, titulo], i) => {
        const desde = inicioBloque(i);
        const hasta =
          i < bloques.length - 1 ? inicioBloque(i + 1) : DURACION_02;
        return (
          <Sequence
            key={i}
            from={desde}
            durationInFrames={hasta - desde}
            name={`Bloque ${i}`}
          >
            {titulo ? <Cabecera n={i} texto={titulo} /> : null}
            <Bloque />
          </Sequence>
        );
      })}
      <Subtitulos voz={V} tema="foto" arriba={1235} tam={58} />
    </AbsoluteFill>
  );
};
