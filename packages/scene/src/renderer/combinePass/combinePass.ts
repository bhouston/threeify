import {
  assert,
  IEffect,
  RenderingContext,
  renderPass,
  ShaderMaterial,
  shaderMaterialToProgram,
  TexImage2D,
  VirtualFramebuffer
} from '@threeify/core';

import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

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
