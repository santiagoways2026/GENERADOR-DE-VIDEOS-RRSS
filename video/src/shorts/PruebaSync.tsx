import { AbsoluteFill, OffthreadVideo, Sequence, staticFile } from "remotion";

/** Prueba de sincronía: un tramo del vídeo limpio con su voz, sin nada más. */
export const PruebaSync: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={30} durationInFrames={150}>
      <OffthreadVideo src={staticFile("hilary/limpio.mp4")} trimBefore={Math.round(152.58 * 30)} style={{ width: "100%" }} />
    </Sequence>
  </AbsoluteFill>
);
