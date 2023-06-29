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
