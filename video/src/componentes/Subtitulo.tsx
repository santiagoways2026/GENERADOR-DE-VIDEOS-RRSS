import { brand, weight } from "../brand/theme";
import { useCurrentFrame } from "remotion";

/**
 * Subtítulo palabra a palabra con el mismo aspecto que los que la pieza
 * trae quemados: blanco con sombra y la palabra que suena en una placa
 * olivo. Solo sirve para tapar un hueco, cuando un plano de recurso tapa a
 * quien habla y con ella sus subtítulos.
 */
export const Subtitulo: React.FC<{
  /** Grupos de palabras con el fotograma en que suena cada una. */
  grupos: { palabra: string; en: number }[][];
  top?: number;
}> = ({ grupos, top = 1252 }) => {
  const frame = useCurrentFrame();
  const grupo = [...grupos].reverse().find((g) => frame >= g[0].en) ?? grupos[0];
  const activa = [...grupo].reverse().find((p) => frame >= p.en);
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        gap: 14,
      }}
    >
      {grupo.map((p) => (
        <span
          key={p.palabra + p.en}
          style={{
            fontSize: 62,
            fontWeight: weight.extrabold,
            color: "#fff",
            padding: "2px 12px 6px",
            borderRadius: 8,
            backgroundColor: p === activa ? brand.green : "transparent",
            textShadow: p === activa ? "none" : "0 2px 6px rgba(0,0,0,0.6), 0 0 2px rgba(0,0,0,0.8)",
          }}
        >
          {p.palabra}
        </span>
      ))}
    </div>
  );
};
