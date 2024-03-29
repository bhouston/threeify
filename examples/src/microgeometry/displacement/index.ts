import {
  createRenderingContext,
  fetchOBJ,
  fetchTexture,
  geometryToBufferGeometry,
  renderBufferGeometry,
  shaderSourceToProgram,
  textureToTexImage2D,
  transformGeometry
} from '@threeify/core';
import {
  Color3,
  color3MultiplyByScalar,
  Euler3,
  euler3ToMat4,
  EulerOrder3,
  Mat4,
  mat4Multiply,
  mat4PerspectiveFov,
  scale3ToMat4,
  translation3ToMat4,
  Vec2,
  vec2MultiplyByScalar,
  Vec3
} from '@threeify/math';

import fragmentSource from './fragment.glsl.js';
import vertexSource from './vertex.glsl.js';

async function init(): Promise<void> {
  const [geometry] = await fetchOBJ('/assets/models/ninjaHead/ninjaHead.obj');
  transformGeometry(
    geometry,
    mat4Multiply(
      scale3ToMat4(new Vec3(0.06, 0.06, 0.06)),
      translation3ToMat4(new Vec3(0, -172, -4))
    )
  );
  const displacementTexture = await fetchTexture(
    '/assets/models/ninjaHead/displacement.jpg'
  );
  const normalTexture = await fetchTexture(
    '/assets/models/ninjaHead/normal.png'
  );

  const context = createRenderingContext(document, 'framebuffer');
  const { canvasFramebuffer } = context;
  window.addEventListener('resize', () => canvasFramebuffer.resize());

  const displacementMap = textureToTexImage2D(context, displacementTexture);
  const normalMap = textureToTexImage2D(context, normalTexture);
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
    pointLightIntensity: color3MultiplyByScalar(Color3.White, 40),
    pointLightRange: 12,

    // materials
    normalMap,
    normalScale: new Vec2(-1, 1),
    displacementMap,
    displacementScale: 1
  };

  const bufferGeometry = geometryToBufferGeometry(context, geometry);

  function animate(): void {
    const now = Date.now();

    uniforms.localToWorld = euler3ToMat4(
      new Euler3(0.15 * Math.PI, now * 0.0002, 0, EulerOrder3.XZY),
      uniforms.localToWorld
    );

    const effectScale = Math.cos(now * 0.0008) * 0.5 + 0.5;
    uniforms.normalScale = vec2MultiplyByScalar(new Vec2(-1, 1), effectScale);
    uniforms.displacementScale = effectScale * 0.1;
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
