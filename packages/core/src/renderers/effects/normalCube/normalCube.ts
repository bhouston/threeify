import {
  Attachment,
  BufferGeometry,
  cubeFaceTargets,
  Framebuffer,
  IEffect,
  makeMat4CubeMapTransform,
  renderBufferGeometry,
  RenderingContext,
  ShaderMaterial,
  shaderMaterialToProgram,
  TexImage2D
} from '@threeify/core';
import { Mat4, mat4PerspectiveFov } from '@threeify/math';

import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

export interface INormalCubeProps {
  bufferGeometry: BufferGeometry;
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
  const framebuffer = new Framebuffer(context);

  return {
    exec: (props: INormalCubeProps) => {
      const { bufferGeometry, cubeMap } = props;

      const uniforms = {
        localToWorld: new Mat4(),
        worldToView: new Mat4(),
        worldToLocal: new Mat4(),
        viewToClip: mat4PerspectiveFov(45, 0.01, 2, 1, 1) // 90 degree FOV with a square aspect ratio.
      };

      for (let index = 0; index < cubeFaceTargets.length; index++) {
        const target = cubeFaceTargets[index];

        uniforms.worldToView = makeMat4CubeMapTransform(index);

        framebuffer.attach(Attachment.Color0, cubeMap, target, 0);
        renderBufferGeometry({
          framebuffer,
          bufferGeometry,
          program,
          uniforms
          /*    depthTestState: DepthTestState.Less,
          blendState: BlendState.PremultipliedOver,
          cullingState: CullingState.Front*/
        });
      }
    },

    dispose: () => {
      framebuffer.dispose();
      programRef.dispose();
    }
  };
}
