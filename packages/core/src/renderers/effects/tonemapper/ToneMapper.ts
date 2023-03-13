import { assert } from '../../../core/assert';
import { ShaderMaterial } from '../../../materials/ShaderMaterial';
import {
  renderPass,
  VirtualFramebuffer
} from '../../webgl/framebuffers/VirtualFramebuffer';
import { shaderMaterialToProgram } from '../../webgl/programs/Program';
import { RenderingContext } from '../../webgl/RenderingContext';
import { TexImage2D } from '../../webgl/textures/TexImage2D';
import { IEffect } from '../IEffect';
import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

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
