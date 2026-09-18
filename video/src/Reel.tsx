import { AbsoluteFill, Sequence } from "remotion";
import "./fuentes";
import { fps } from "./brand/theme";
import { BloqueOlivo } from "./escenas/BloqueOlivo";
import { BloqueFoto } from "./escenas/BloqueFoto";
import { Cierre } from "./escenas/Cierre";

export type ReelProps = {
  eyebrow: string;
  titular: string;
  lead: string;
  foto: string;
  titularFoto: string;
  destacado: string;
  pregunta: string;
  cta: string;
};

/**
 * <Sequence> es como se cortan las escenas: cada una recibe su propio
 * reloj, que empieza en cero cuando arranca. El componente de dentro no
 * sabe en que momento del video esta, solo cuantos fotogramas lleva vivo.
 *
 * El manual alterna piezas graficas de fondo verde con piezas emocionales
 * de fotografia real. Este reel sigue ese ritmo: olivo, foto, cierre.
 */
export const Reel: React.FC<ReelProps> = ({
  eyebrow,
  titular,
  lead,
  foto,
  titularFoto,
  destacado,
  pregunta,
  cta,
}) => {
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={3 * fps} name="Olivo">
        <BloqueOlivo eyebrow={eyebrow} titular={titular} lead={lead} />
      </Sequence>

      <Sequence from={3 * fps} durationInFrames={4 * fps} name="Foto">
        <BloqueFoto foto={foto} titular={titularFoto} destacado={destacado} />
      </Sequence>

      <Sequence from={7 * fps} durationInFrames={3 * fps} name="Cierre">
        <Cierre pregunta={pregunta} cta={cta} />
      </Sequence>
    </AbsoluteFill>
  );
};
