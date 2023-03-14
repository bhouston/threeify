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
  Euler3,
  euler3ToMat4,
  EulerOrder3,
  Mat4,
  mat4PerspectiveFov,
  translation3ToMat4,
  Vec2,
  vec2MultiplyByScalar,
  Vec3
} from '@threeify/math';

import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

async function init(): Promise<void> {
  const geometry = planeGeometry(1.5, 1.5, 10, 10);
  // this is using the standard opengl normal map.
  const normalsTexture = await fetchTexture('/assets/textures/normalMap.png');

  const context = createRenderingContext(document, 'framebuffer');
  const { canvasFramebuffer } = context;
  window.addEventListener('resize', () => canvasFramebuffer.resize());

  const normalsMap = textureToTexImage2D(context, normalsTexture);
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
    pointLightRange: 12,

    // materials
    normalModulator: new Vec2(-1, 1),
    normalMap: normalsMap
  };
  const bufferGeometry = geometryToBufferGeometry(context, geometry);

  function animate(): void {
    const now = Date.now();

    uniforms.localToWorld = euler3ToMat4(
      new Euler3(0, 0, now * 0.0002, EulerOrder3.XZY),
      uniforms.localToWorld
    );
    // Q: Why is this one -1 required?  Is the tangent space from UV calculation incorrect?
    uniforms.normalModulator = vec2MultiplyByScalar(
      new Vec2(-1, 1),
      Math.cos(now * 0.001) * 0.5 + 0.5
    );
    uniforms.pointLightViewPosition = new Vec3(
      Math.cos(now * 0.001) * 3,
      Math.sin(now * 0.003) * 3,
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
