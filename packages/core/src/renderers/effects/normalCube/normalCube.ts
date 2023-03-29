import { Color3, Mat4, mat4Inverse, mat4PerspectiveFov } from '@threeify/math';

import { ShaderMaterial } from '../../../materials/ShaderMaterial';
import {
  cubeFaceTargets,
  makeMat4CubeMapTransform
} from '../../../textures/CubeMapTexture';
import { BlendState } from '../../webgl/BlendState';
import { BufferGeometry } from '../../webgl/buffers/BufferGeometry';
import { ClearState } from '../../webgl/ClearState';
import { CullingState } from '../../webgl/CullingState';
import { DepthTestState } from '../../webgl/DepthTestState';
import { Attachment } from '../../webgl/framebuffers/Attachment';
import { Framebuffer } from '../../webgl/framebuffers/Framebuffer';
import { renderBufferGeometry } from '../../webgl/framebuffers/VirtualFramebuffer';
import { shaderMaterialToProgram } from '../../webgl/programs/Program';
import { RenderingContext } from '../../webgl/RenderingContext';
import { TexImage2D } from '../../webgl/textures/TexImage2D';
import { IEffect } from '../IEffect';
import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

export interface INormalCubeProps {
  bufferGeometry: BufferGeometry;
  localToGem?: Mat4;
  cubeMap: TexImage2D;
}

export interface NormalCube extends IEffect {
  exec(props: INormalCubeProps): void;
}

export async function createNormalCube(
  context: RenderingContext
): Promise<NormalCube> {
  const programRef = context.programCache.acquireRef('normalCube', (name) => {
    const material = new ShaderMaterial(name, vertexSource, fragmentSource);
    return shaderMaterialToProgram(context, material);
  });
  const program = await programRef.promise;

  return {
    exec: (props: INormalCubeProps) => {
      const { bufferGeometry, cubeMap, localToGem } = props;

      const uniforms = {
        localToWorld:
          localToGem !== undefined ? mat4Inverse(localToGem) : new Mat4(),
        worldToLocal: localToGem !== undefined ? localToGem : new Mat4(),
        worldToView: new Mat4(),
        viewToClip: mat4PerspectiveFov(45, 0.01, 2, 1, 1) // 90 degree FOV with a square aspect ratio.
      };
      const framebuffer = new Framebuffer(context);

      for (let index = 0; index < cubeFaceTargets.length; index++) {
        const target = cubeFaceTargets[index];

        uniforms.worldToView = makeMat4CubeMapTransform(index);

        framebuffer.attach(Attachment.Color0, cubeMap, target, 0);
        framebuffer.clearState = new ClearState(Color3.Black, 0);
        framebuffer.clear();
        renderBufferGeometry({
          framebuffer,
          bufferGeometry,
          program,
          uniforms,
          depthTestState: DepthTestState.Less,
          blendState: BlendState.None,
          cullingState: CullingState.Front
        });
      }
      framebuffer.dispose();
    },

    dispose: () => {
      programRef.dispose();
    }
  };
}
