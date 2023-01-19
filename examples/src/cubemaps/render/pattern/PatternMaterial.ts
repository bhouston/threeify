import { ShaderMaterial } from '@threeify/core';
import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

export const patternMaterial = new ShaderMaterial(vertexSource, fragmentSource);
