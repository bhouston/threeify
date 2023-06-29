import { ShaderMaterial } from '@threeify/core';

import fragmentSource from './fragment.glsl.js';
import vertexSource from './vertex.glsl.js';

export const patternMaterial = new ShaderMaterial(
  'pattern',
  vertexSource,
  fragmentSource
);
