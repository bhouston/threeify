import {
  boxGeometry,
  createRenderingContext,
  DeviceOrientation,
  fetchTexture,
  geometryToBufferGeometry,
  renderBufferGeometry,
  shaderSourceToProgram,
  textureToTexImage2D
} from '@threeify/core';
import {
  Mat4,
  mat4Inverse,
  mat4Perspective,
  quatToMat4,
  translation3ToMat4,
  Vec3
} from '@threeify/math';

import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

async function init(): Promise<void> {
  const geometry = boxGeometry(0.75, 0.75, 0.75);
  const texture = await fetchTexture('/assets/textures/uv_grid_opengl.jpg');

  const context = createRenderingContext(document, 'framebuffer');
  const { canvasFramebuffer } = context;
  window.addEventListener('resize', () => canvasFramebuffer.resize());

  const program = await shaderSourceToProgram(
    context,
    'index',
    vertexSource,
    fragmentSource
  );
  const uniforms = {
    localToWorld: new Mat4(),
    worldToView: translation3ToMat4(new Vec3(0, 0, -1)),
    viewToClip: mat4Perspective(-0.25, 0.25, 0.25, -0.25, 0.1, 4),
    viewLightPosition: Vec3.Zero,
    map: textureToTexImage2D(context, texture)
  };
  const bufferGeometry = geometryToBufferGeometry(context, geometry);

  let deviceOrientation: DeviceOrientation | undefined;

  const body = document.getElementsByTagName('body')[0];
  body.addEventListener(
    'click',
    () => {
      if (deviceOrientation === undefined) {
        deviceOrientation = new DeviceOrientation();
      }
    },
    false
  );

  function animate(): void {
    requestAnimationFrame(animate);

    if (deviceOrientation !== undefined) {
      uniforms.localToWorld = mat4Inverse(
        quatToMat4(deviceOrientation.orientation)
      );
    }
    renderBufferGeometry({
      framebuffer: canvasFramebuffer,
      program,
      uniforms,
      bufferGeometry
    });
  }

  animate();
}

init();
