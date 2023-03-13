import { ShaderMaterial } from '../../../materials/ShaderMaterial';
import { TextureEncoding } from '../../utilities/TextureEncoding';
import { Attachment } from '../../webgl/framebuffers/Attachment';
import { Framebuffer } from '../../webgl/framebuffers/Framebuffer';
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

export interface ICopyPassProps {
  sourceTexImage2D: TexImage2D;
  sourceEncoding: TextureEncoding;
  targetFramebufferOrTexImage2D: VirtualFramebuffer | TexImage2D;
  targetEncoding: TextureEncoding;
}

export interface CopyPass extends IEffect {
  exec(props: ICopyPassProps): void;
}

export async function createCopyPass(
  context: RenderingContext
): Promise<CopyPass> {
  const programRef = context.programCache.acquireRef('copyPass', (name) => {
    const material = new ShaderMaterial(name, vertexSource, fragmentSource);
    return shaderMaterialToProgram(context, material);
  });
  const program = await programRef.promise;

  return {
    exec: (
      props = {
        sourceEncoding: TextureEncoding.Linear,
        targetEncoding: TextureEncoding.Linear
      } as ICopyPassProps
    ) => {
      const {
        sourceTexImage2D,
        sourceEncoding,
        targetFramebufferOrTexImage2D,
        targetEncoding
      } = props;
      const { context } = sourceTexImage2D;

      const uniforms = {
        sourceMap: sourceTexImage2D,
        sourceEncoding,
        targetEncoding
      };

      let targetFramebuffer;
      if (targetFramebufferOrTexImage2D instanceof TexImage2D) {
        targetFramebuffer = new Framebuffer(context);
        targetFramebuffer.attach(
          Attachment.Color0,
          targetFramebufferOrTexImage2D
        );
      } else {
        targetFramebuffer = targetFramebufferOrTexImage2D;
      }

      renderPass({
        framebuffer: targetFramebuffer,
        program,
        uniforms
      });

      if (targetFramebuffer !== targetFramebufferOrTexImage2D) {
        targetFramebuffer.dispose();
      }
    },

    dispose: () => {
      programRef.dispose();
    }
  };
}
