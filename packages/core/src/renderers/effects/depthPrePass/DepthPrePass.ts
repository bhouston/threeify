import { Color3, Vec2, vec2Equals, vec2ToString } from '@threeify/math';

import { assert } from '../../../core/assert';
import { using } from '../../../core/using';
import { ShaderMaterial } from '../../../materials/ShaderMaterial';
import { BlendState } from '../../webgl/BlendState';
import { ClearState } from '../../webgl/ClearState';
import { BufferBit } from '../../webgl/framebuffers/BufferBit';
import {
  colorAttachmentToFramebuffer,
  Framebuffer
} from '../../webgl/framebuffers/Framebuffer';
import { renderPass } from '../../webgl/framebuffers/VirtualFramebuffer';
import { shaderMaterialToProgram } from '../../webgl/programs/Program';
import { RenderingContext } from '../../webgl/RenderingContext';
import { TexImage2D } from '../../webgl/textures/TexImage2D';
import { IEffect } from '../IEffect';
import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

// enumerator interface that returns both a mesh and a material
export interface IDepthPreePassMesh {
  bufferGeometry: BufferGeometry;
  
  normalMap?: TexImage2D;
  normalScale: Vec2;
  normalUVChannel: number;
  
  alphaMap?: TexImage2D;
  alphaFactor: number;
  alphaMode: AlphaMode;
  alphaUVChannel: number;
};



export interface IDepthPrePassProps {
  sourceTexImage2D: TexImage2D;
  sourceLod: number;
  standardDeviationInTexels: number;
  tempTexImage2D: TexImage2D;
  targetFramebuffer: Framebuffer;
  targetAlpha: number;
}

export interface DepthPrePass extends IEffect {
  exec(props: IDepthPrePassProps): void;
}

export async function createGaussianBlur(
  context: RenderingContext
): Promise<GaussianBlur> {
  const programRef = context.programCache.acquireRef('gaussianBlur', (name) => {
    const material = new ShaderMaterial(name, vertexSource, fragmentSource);
    return shaderMaterialToProgram(context, material);
  });
  const program = await programRef.promise;

  return {
    exec: (
      props = {
        sourceLod: 0,
        standardDeviationInTexels: 3,
        targetAlpha: 1
      } as IGaussianBlurProps