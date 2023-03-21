import {
  Attachment,
  BlendState,
  BufferGeometry,
  cubeFaceDebugColor,
  cubeFaceForwards,
  cubeFaceRights,
  cubeFaceTargets,
  cubeFaceUps,
  CullingState,
  DepthTestState,
  Framebuffer,
  makeMat4CubeMapTransform,
  renderBufferGeometry,
  RenderingContext,
  shaderSourceToProgram,
  TexImage2D,
  TextureTarget,
  using
} from '@threeify/core';
import {
  Color3,
  Mat4,
  mat4Inverse,
  mat4PerspectiveFov,
  mat4ToString,
  vec3ToString
} from '@threeify/math';

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
          viewToWorld: new Mat4(),
          worldToLocal: new Mat4(),
          viewToClip: mat4PerspectiveFov(45, 0.01, 2, 1, 1), // 90 degree FOV with a square aspect ratio.
          debugColor: new Color3()
        };

        cubeFaceTargets.forEach((target, index) => {
          framebuffer.attach(Attachment.Color0, cubeMap, target, 0);
          //if( target === TextureTarget.CubeMapNegativeZ ) {
          //return;
          //}

          // framebuffer.clear();

          console.log(`target: ${TextureTarget[target]} index: ${index}`);

          console.log(TextureTarget[target], index);
          console.log(
            `forward: ${vec3ToString(
              cubeFaceForwards[index]
            )} up ${vec3ToString(cubeFaceUps[index])} right ${vec3ToString(
              cubeFaceRights[index]
            )}`
          );

          uniforms.worldToView = makeMat4CubeMapTransform(index);
          uniforms.viewToWorld = mat4Inverse(uniforms.worldToView);
          uniforms.worldToLocal = mat4Inverse(uniforms.localToWorld);
          console.log(`camera: ${mat4ToString(uniforms.worldToView)}`);

          console.log(uniforms.worldToView);
          uniforms.debugColor = cubeFaceDebugColor[index];
          uniforms.debugColor = new Color3();

          renderBufferGeometry({
            framebuffer,
            bufferGeometry,
            program,
            uniforms,
            depthTestState: DepthTestState.Less,
            blendState: BlendState.PremultipliedOver,
            cullingState: CullingState.Front
          });
        });
      });
    }
  );
}
