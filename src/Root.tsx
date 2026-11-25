import React from 'react';
import { Composition } from 'remotion';
import { PolarisEditFilm, FPS, DURATION_IN_FRAMES } from './Film';

export const Root: React.FC = () => (
  <Composition
    id="PolarisAIEditMotion"
    component={PolarisEditFilm}
    width={1920}
    height={1080}
    fps={FPS}
    durationInFrames={DURATION_IN_FRAMES}
  />
);
