import { brand, radius, tracking, weight } from "../../brand/theme";
import { Subrayado } from "../../componentes/Subrayado";
import type { Titular } from "./tipos";

/** Antetítulo en etiqueta verde Ways y titular ExtraBold sendero con subrayado. */
export const Cabecera: React.FC<Titular & { tamano?: number }> = ({
  antetitulo,
  titular,
  destacado,
  tamano = 64,
}) => (
  <div>
    {antetitulo ? (
    <div
      style={{
        display: "inline-block",
        backgroundColor: brand.green,
        color: brand.white,
        fontSize: 16,
        fontWeight: weight.bold,
        letterSpacing: tracking.antetitulo,
        textTransform: "uppercase",
        borderRadius: radius.md,
        padding: "6px 12px",
      }}
    >
      {antetitulo}
    </div>
    ) : null}
    <div
      style={{
        marginTop: antetitulo ? 20 : 0,
        fontSize: tamano,
        lineHeight: 1.1,
        fontWeight: weight.extrabold,
        color: brand.sendero,
      }}
    >
      {titular} <Subrayado frame={999}>{destacado}</Subrayado>
    </div>
  </div>
);
