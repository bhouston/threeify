import { ShaderMaterial } from '../../materials/ShaderMaterial';
import { Attachment } from '../webgl/framebuffers/Attachment';
import { Framebuffer } from '../webgl/framebuffers/Framebuffer';
import {
  renderPass,
  VirtualFramebuffer
} from '../webgl/framebuffers/VirtualFramebuffer';
import { shaderMaterialToProgram } from '../webgl/programs/Program';
import { RenderingContext } from '../webgl/RenderingContext';
import { TexImage2D } from '../webgl/textures/TexImage2D';
import fragmentSource from './copy/fragment.glsl';
import vertexSource from './copy/vertex.glsl';
import { IEffect } from './IEffect';
import { TextureEncoding } from './TextureEncoding';

export interface ICopyPassProps {
  sourceTexImage2D: TexImage2D;
  sourceEncoding?: TextureEncoding;
  targetFramebuffer?: VirtualFramebuffer;
  targetTexImage2D?: TexImage2D;
  targetEncoding?: TextureEncoding;
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
    exec: (props: ICopyPassProps) => {
      const {
        sourceTexImage2D,
        sourceEncoding,
        targetFramebuffer,
        targetTexImage2D,
        targetEncoding
      } = props;
      const { context } = sourceTexImage2D;

      if (targetFramebuffer !== undefined && targetTexImage2D !== undefined) {
        throw new Error(
          'Cannot specify both a target framebuffer and texture.'
        );
      }

      const uniforms = {
        sourceMap: sourceTexImage2D,
        sourceEncoding:
          sourceEncoding !== undefined
            ? sourceEncoding
            : TextureEncoding.Linear,
        targetEncoding:
          targetEncoding !== undefined ? targetEncoding : TextureEncoding.Linear
      };

      let localFramebuffer = targetFramebuffer;
      let tempFramebuffer: Framebuffer | undefined = undefined;

      if (targetFramebuffer === undefined && targetTexImage2D !== undefined) {
        tempFramebuffer = new Framebuffer(context);
        tempFramebuffer.attach(Attachment.Color0, targetTexImage2D);
        localFramebuffer = tempFramebuffer;
      }

      if (localFramebuffer === undefined)
        throw new Error('No target framebuffer or texture specified.');

      renderPass({
        framebuffer: localFramebuffer,
        program,
        uniforms
      });

      if (tempFramebuffer !== undefined) {
        tempFramebuffer.dispose();
      }
    },

    dispose: () => {
      programRef.dispose();
    }
  };
}
