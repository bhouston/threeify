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

export interface ICombinePassProps {
  opaqueTexImage2D: TexImage2D;
  transmissionTexImage2D: TexImage2D;
  targetFramebuffer: VirtualFramebuffer;
  exposure: number;
}

export interface CombinePass extends IEffect {
  exec(props: ICombinePassProps): void;
}

export async function createCombinePass(
  context: RenderingContext
): Promise<CombinePass> {
  const programRef = context.programCache.acquireRef('combinePass', (name) => {
    const material = new ShaderMaterial(name, vertexSource, fragmentSource);
    return shaderMaterialToProgram(context, material);
  });
  const program = await programRef.promise;

  return {
    exec: (props: ICombinePassProps) => {
      const {
        opaqueTexImage2D,
        transmissionTexImage2D,
        targetFramebuffer,
        exposure
      } = props;

      assert(exposure > 0);

      const uniforms = {
        opaqueTexture: opaqueTexImage2D,
        transmissionTexture: transmissionTexImage2D,
        exposure: exposure || 1
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
