import {
  createRenderingContext,
  fetchCubeMapTexture,
  geometryToBufferGeometry,
  icosahedronGeometry,
  renderBufferGeometry,
  shaderSourceToProgram,
  textureToTexImage2D
} from '@threeify/core';
import {
  Euler3,
  euler3ToMat4,
  Mat4,
  mat4PerspectiveFov,
  translation3ToMat4,
  Vec3
} from '@threeify/math';

import fragmentSource from './fragment.glsl.js';
import vertexSource from './vertex.glsl.js';

async function init(): Promise<void> {
  const geometry = icosahedronGeometry(0.75, 2, true);
  const cubeTexture = await fetchCubeMapTexture(
    '/assets/textures/cube/pisa/*.png'
  );

  const context = createRenderingContext(document, 'framebuffer');
  const { canvasFramebuffer } = context;
  window.addEventListener('resize', () => canvasFramebuffer.resize());

  const program = await shaderSourceToProgram(
    context,
    'index',
    vertexSource,
    fragmentSource
  );
  const cubeMap = textureToTexImage2D(context, cubeTexture);
  const uniforms = {
    localToWorld: new Mat4(),
    worldToView: translation3ToMat4(new Vec3(0, 0, -3)),
    viewToClip: mat4PerspectiveFov(
      25,
      0.1,
      4,
      1,
      canvasFramebuffer.aspectRatio
    ),
    cubeMap: cubeMap
  };
  const bufferGeometry = geometryToBufferGeometry(context, geometry);

  function animate(): void {
    requestAnimationFrame(animate);

    const now = Date.now();
    uniforms.localToWorld = euler3ToMat4(
      new Euler3(now * 0.0001, now * 0.00033, now * 0.000077),
      uniforms.localToWorld
    );
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
