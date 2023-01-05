import { ShaderMaterial } from '../../../../lib/materials/ShaderMaterial.js';
import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

export const patternMaterial = new ShaderMaterial(vertexSource, fragmentSource);
