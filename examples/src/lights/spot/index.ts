import {
  createRenderingContext,
  fetchTexture,
  geometryToBufferGeometry,
  planeGeometry,
  renderBufferGeometry,
  shaderSourceToProgram,
  textureToTexImage2D
} from '@threeify/core';
import {
  Color3,
  color3MultiplyByScalar,
  Mat4,
  mat4PerspectiveFov,
  translation3ToMat4,
  Vec3
} from '@threeify/math';

import fragmentSource from './fragment.glsl.js';
import vertexSource from './vertex.glsl.js';

async function init(): Promise<void> {
  const geometry = planeGeometry(3, 3);
  const texture = await fetchTexture('/assets/textures/uv_grid_opengl.jpg');

  const context = createRenderingContext(document, 'framebuffer');
  const { canvasFramebuffer } = context;
  window.addEventListener('resize', () => canvasFramebuffer.resize());

  const map = textureToTexImage2D(context, texture);
  const program = await shaderSourceToProgram(
    context,
    'index',
    vertexSource,
    fragmentSource
  );
  const uniforms = {
    // vertices
    localToWorld: new Mat4(),
    worldToView: translation3ToMat4(new Vec3(0, 0, -3)),
    viewToClip: mat4PerspectiveFov(
      25,
      0.1,
      4,
      1,
      canvasFramebuffer.aspectRatio
    ),

    // lights
    spotLightViewPosition: Vec3.Zero,
    spotLightViewDirection: new Vec3(0, 0, -1),
    spotLightColor: color3MultiplyByScalar(Color3.White, 10),
    spotLightRange: 15,
    spotLightInnerCos: 1,
    spotLightOuterCos: Math.cos(Math.PI * 0.5),

    // materials
    albedoMap: map
  };
  const bufferGeometry = geometryToBufferGeometry(context, geometry);

  function animate(): void {
    const now = Date.now();

    /* uniforms.localToWorld = euler3ToMat4(
      new Euler3(0.15 * Math.PI, now * 0.0002, 0, EulerOrder3.XZY),
      uniforms.localToWorld,
    ); */
    uniforms.spotLightInnerCos = Math.cos(
      Math.PI * 0.05 * Math.cos(now * 0.0023)
    );
    uniforms.spotLightOuterCos =
      uniforms.spotLightInnerCos *
      Math.cos(Math.PI * 0.05 * Math.cos(now * 0.0017));
    uniforms.spotLightViewPosition = new Vec3(
      Math.cos(now * 0.001) * 0.5,
      Math.cos(now * 0.00087) * 0.5,
      1.5
    );

    canvasFramebuffer.clear();
    renderBufferGeometry({
      framebuffer: canvasFramebuffer,
      program,
      uniforms,
      bufferGeometry
    });

    requestAnimationFrame(animate);
  }

  animate();
}

init();
