import { ShaderMaterial } from '@threeify/core';

import fragmentSource from './fragment.glsl.js';
import vertexSource from './vertex.glsl.js';

export const samplerMaterial = new ShaderMaterial(
  'sampler',
  vertexSource,
  fragmentSource
);
