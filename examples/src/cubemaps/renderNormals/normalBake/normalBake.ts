import {
  Attachment,
  BlendState,
  BufferGeometry,
  ClearState,
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
  Vec3,
  vec3ToString
} from '@threeify/math';

import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

export async function renderGeometryNormalsIntoCubeMap(
  context: RenderingContext,
  bufferGeometry: BufferGeometry,
  cubeMap: TexImage2D
) {
  const program = await shaderSourceToProgram(
    context,
    'normalBake',
    vertexSource,
    fragmentSource
  );
  const framebuffer = new Framebuffer(context);
  const uniforms = {
    localToWorld: new Mat4(),
    worldToView: new Mat4(),
    viewToWorld: new Mat4(),
    worldToLocal: new Mat4(),
    viewToClip: mat4PerspectiveFov(45, 0.01, 2, 1, 1), // 90 degree FOV with a square aspect ratio.
    debugColor: new Color3(),
    normalScale: new Vec3(1, 1, 1)
  };

  for ( let index = 0; index < cubeFaceTargets.length; index ++ ) {
    const target = cubeFaceTargets[index];
 
    uniforms.worldToView = makeMat4CubeMapTransform(index);
    uniforms.viewToWorld = mat4Inverse(uniforms.worldToView);
    uniforms.worldToLocal = mat4Inverse(uniforms.localToWorld);
    console.log(`camera for ${index} / ${TextureTarget[target]}: ${mat4ToString(uniforms.worldToView)}`);

    uniforms.debugColor = cubeFaceDebugColor[index];
    uniforms.debugColor = new Color3();

    framebuffer.attach(Attachment.Color0, cubeMap, target, 0);
    renderBufferGeometry({
      framebuffer,
      bufferGeometry,
      program,
      uniforms,
      depthTestState: DepthTestState.Less,
      blendState: BlendState.PremultipliedOver,
      cullingState: CullingState.Front
    });
  }
}
