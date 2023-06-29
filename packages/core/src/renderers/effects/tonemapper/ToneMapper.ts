import { assert } from '../../../core/assert.js';
import { ShaderMaterial } from '../../../materials/ShaderMaterial.js';
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

export interface IToneMapperProps {
  sourceTexImage2D: TexImage2D;
  exposure: number;
  targetFramebuffer: VirtualFramebuffer;
}

export interface ToneMapper extends IEffect {
  exec(props: IToneMapperProps): void;
}

export async function createToneMapper(
  context: RenderingContext
): Promise<ToneMapper> {
  const programRef = context.programCache.acquireRef('toneMapping', (name) => {
    const material = new ShaderMaterial(name, vertexSource, fragmentSource);
    return shaderMaterialToProgram(context, material);
  });
  const program = await programRef.promise;

  return {
    exec: (props: IToneMapperProps) => {
      const { sourceTexImage2D, exposure, targetFramebuffer } = props;

      assert(exposure > 0);

      const uniforms = {
        sourceMap: sourceTexImage2D,
        exposure
      };

      renderPass({
        framebuffer: targetFramebuffer,
        program,
        uniforms
      });
    },

    dispose: () => {
      programRef.dispose();
    }
  };
}
