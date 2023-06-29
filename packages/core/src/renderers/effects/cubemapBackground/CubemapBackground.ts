import { Mat4 } from '@threeify/math';

import { assert } from '../../../core/assert.js';
import { ShaderMaterial } from '../../../materials/ShaderMaterial.js';
import { DepthTestState } from '../../webgl/DepthTestState.js';
import {
  renderPass,
  VirtualFramebuffer
} from '../../webgl/framebuffers/VirtualFramebuffer.js';
import { shaderMaterialToProgram } from '../../webgl/programs/Program.js';
import { RenderingContext } from '../../webgl/RenderingContext.js';
import { TexImage2D } from '../../webgl/textures/TexImage2D.js';
import { IEffect } from '../IEffect.js';
import fragmentSource from './fragment.glsl.js';
import vertexSource from './vertex.glsl.js';

export interface ICubemapBackgroundProps {
  cubeMapTexImage2D: TexImage2D;
  cubeMapIntensity: number;
  viewToWorld: Mat4;
  clipToView: Mat4;
  targetFramebuffer: VirtualFramebuffer;
}

export interface CubemapBackground extends IEffect {
  exec(props: ICubemapBackgroundProps): void;
}

export async function createCubemapBackground(
  context: RenderingContext
): Promise<CubemapBackground> {
  const programRef = context.programCache.acquireRef(
    'cubemapBackground',
    (name) => {
      const material = new ShaderMaterial(name, vertexSource, fragmentSource);
      return shaderMaterialToProgram(context, material);
    }
  );
  const program = await programRef.promise;

  return {
    exec: (props: ICubemapBackgroundProps) => {
      const {
        cubeMapTexImage2D,
        cubeMapIntensity,
        targetFramebuffer,
        viewToWorld,
        clipToView
      } = props;

      assert(cubeMapIntensity > 0);

      const uniforms = {
        cubeMap: cubeMapTexImage2D,
        cubeMapIntensity,
        viewToWorld,
        clipToView
      };

      renderPass({
        framebuffer: targetFramebuffer,
        program,
        uniforms,
        depthTestState: DepthTestState.Less
      });
    },
    dispose: () => {
      programRef.dispose();
    }
  };
}
