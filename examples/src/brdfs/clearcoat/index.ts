import {
  createRenderingContext,
  fetchTexImage2D,
  geometryToBufferGeometry,
  icosahedronGeometry,
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
  const geometry = icosahedronGeometry(0.75, 5, true);

  const context = createRenderingContext(document, 'framebuffer');
  const { canvasFramebuffer } = context;
  window.addEventListener('resize', () => canvasFramebuffer.resize());

  const albedoMap = await fetchTexImage2D(
    context,
    '/assets/textures/planets/jupiter_2k.jpg'
  );
  const clearCoatBumpMap = await fetchTexImage2D(
    context,
    '/assets/textures/golfball/scratches.png'
  );
  const specularRoughnessMap = clearCoatBumpMap;
  const clearCoatRoughnessMap = specularRoughnessMap;

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
    pointLightViewPosition: Vec3.Zero,
    pointLightIntensity: color3MultiplyByScalar(Color3.White, 30),
    pointLightRange: 6,

    // materials
    albedoColor: new Color3(0.9, 0.9, 0.9),
    albedoMap: albedoMap,

    specularRoughnessFactor: 0.5,
    specularRoughnessMap: specularRoughnessMap,

    clearCoatStrength: 0.5,
    clearCoatTint: Color3.White,

    clearCoatBumpMap: clearCoatBumpMap,

    clearCoatRoughnessFactor: 0.1,
    clearCoatRoughnessMap: clearCoatRoughnessMap
  };
  const bufferGeometry = geometryToBufferGeometry(context, geometry);

  function animate(): void {
    const now = Date.now();

    uniforms.localToWorld = euler3ToMat4(
      new Euler3(0.15 * Math.PI, now * 0.0002, 0, EulerOrder3.XZY),
      uniforms.localToWorld
    );
    uniforms.pointLightViewPosition = new Vec3(
      Math.cos(now * 0.001) * 3,
      2,
      0.5
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
