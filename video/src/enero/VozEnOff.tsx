import React from "react";
import { getInputProps, staticFile } from "remotion";
import { Audio } from "@remotion/media";

/**
 * La voz en off de cada vídeo. Con `--props='{"sinVoz":true}'` se renderiza
 * la versión sin voz: mismos planos, subtítulos y ambiente, para grabar
 * encima una locución propia siguiendo el texto en pantalla.
 */
export const VozEnOff: React.FC<{ id: string }> = ({ id }) =>
  getInputProps().sinVoz ? null : (
    <Audio src={staticFile(`enero/voz/${id}.mp3`)} />
  );
