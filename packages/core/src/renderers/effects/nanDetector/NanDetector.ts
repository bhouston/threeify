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

export interface INanDetectorProps {
  sourceTexImage2D: TexImage2D;
  targetFramebuffer: VirtualFramebuffer;
}

export interface NanDetector extends IEffect {
  exec(props: INanDetectorProps): void;
}

export async function createNanDetector(
  context: RenderingContext
): Promise<NanDetector> {
  const programRef = context.programCache.acquireRef('nanDetector', (name) => {
    const material = new ShaderMaterial(name, vertexSource, fragmentSource);
    return shaderMaterialToProgram(context, material);
  });
  const program = await programRef.promise;

  return {
    exec: (props: INanDetectorProps) => {
      const { sourceTexImage2D, targetFramebuffer } = props;

      const uniforms = {
        sourceMap: sourceTexImage2D
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
