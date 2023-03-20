import {
  Attachment,
  BlendState,
  BufferGeometry,
  cubeFaceDebugColor,
  cubeFaceTargets,
  CullingState,
  DepthTestState,
  Framebuffer,
  makeMat4CubeMapTransform,
  renderBufferGeometry,
  RenderingContext,
  shaderSourceToProgram,
  TexImage2D,
  using
} from '@threeify/core';
import { Color3, Mat4, mat4PerspectiveFov } from '@threeify/math';

import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

export async function renderGeometryNormalsIntoCubeMap(
  context: RenderingContext,
  bufferGeometry: BufferGeometry,
  cubeMap: TexImage2D
) {
  using(
    await shaderSourceToProgram(
      context,
      'normalBake',
      vertexSource,
      fragmentSource
    ),
    (program) => {
      using(new Framebuffer(context), (framebuffer) => {
        const uniforms = {
          localToWorld: new Mat4(),
          worldToView: new Mat4(),
          viewToClip: mat4PerspectiveFov(45, 0.01, 2, 1, 1), // 90 degree FOV with a square aspect ratio.
          debugColor: new Color3()
        };

        cubeFaceTargets.forEach((target, index) => {
          framebuffer.attach(Attachment.Color0, cubeMap, target, 0);

          framebuffer.clear();

          uniforms.worldToView = makeMat4CubeMapTransform(
            index,
            uniforms.worldToView
          );

          console.log(uniforms.worldToView);
          uniforms.debugColor = cubeFaceDebugColor[index];
          uniforms.debugColor = new Color3();

          renderBufferGeometry({
            framebuffer,
            bufferGeometry,
            program,
            uniforms,
            depthTestState: DepthTestState.None,
            blendState: BlendState.PremultipliedOver,
            cullingState: CullingState.None
          });
        });
      });
    }
  );
}
