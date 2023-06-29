import {
  createRenderingContext,
  diskGeometry,
  fetchTexImage2D,
  geometryToBufferGeometry,
  renderBufferGeometry,
  shaderSourceToProgram
} from '@threeify/core';
import {
  Color3,
  color3MultiplyByScalar,
  Euler3,
  euler3ToMat4,
  EulerOrder3,
  Mat4,
  mat4PerspectiveFov,
  translation3ToMat4,
  Vec3
} from '@threeify/math';

import fragmentSource from './fragment.glsl.js';
import vertexSource from './vertex.glsl.js';

async function init(): Promise<void> {
  const geometry = diskGeometry(0.5, 64);

  const context = createRenderingContext(document, 'framebuffer');
  const { canvasFramebuffer } = context;
  window.addEventListener('resize', () => canvasFramebuffer.resize());

  const anisotropicFlow1Map = await fetchTexImage2D(
    context,

    '/assets/textures/anisotropic/radialSmallOverlapping.jpg'
  );
  const anisotropicFlow2Map = await fetchTexImage2D(
    context,
    '/assets/textures/anisotropic/radialLarge.jpg'
  );
  const program = await shaderSourceToProgram(
    context,
    'index',
    vertexSource,
    fragmentSource
  );
  const uniforms = {
    // vertices
    localToWorld: new Mat4(),
    worldToView: translation3ToMat4(new Vec3(0, 0, -1)),
    viewToClip: mat4PerspectiveFov(
      35,
      0.1,
      4,
      1,
      canvasFramebuffer.aspectRatio
    ),

    // lights
    pointLightViewPosition: Vec3.Zero,
    pointLightIntensity: color3MultiplyByScalar(Color3.White, 0.7),
    pointLightRange: 12,

    // materials
    specularAnisotropicStrength: 0.5,
    specularAnisotropicFlowMap: anisotropicFlow1Map
  };
  const bufferGeometry = geometryToBufferGeometry(context, geometry);

  function animate(): void {
    const now = Date.now();

    uniforms.localToWorld = euler3ToMat4(
      new Euler3(-0.3 * Math.PI, 0, now * 0.0006, EulerOrder3.YXZ),
      uniforms.localToWorld
    );
    uniforms.specularAnisotropicFlowMap =
      Math.floor(now / 5000) % 2 === 0
        ? anisotropicFlow1Map
        : anisotropicFlow2Map;

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
