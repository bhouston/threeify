import {
  fetchImage,
  icosahedronGeometry,
  makeBufferGeometryFromGeometry,
  makeProgramFromShaderMaterial,
  makeTexImage2DFromEquirectangularTexture,
  Mat4,
  mat4PerspectiveFov,
  renderBufferGeometry,
  RenderingContext,
  ShaderMaterial,
  Texture,
  translation3ToMat4,
  Vec2,
  Vec3
} from '@threeify/core';

import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

async function init(): Promise<void> {
  const debugTexture = new Texture(
    await fetchImage('/assets/textures/cube/debug/latLong.png')
  );

  const geometry = icosahedronGeometry(0.75, 4, true);
  const material = new ShaderMaterial(vertexSource, fragmentSource);

  const context = new RenderingContext(
    document.getElementById('framebuffer') as HTMLCanvasElement
  );
  const { canvasFramebuffer } = context;
  window.addEventListener('resize', () => canvasFramebuffer.resize());

  const cubeMap = makeTexImage2DFromEquirectangularTexture(
    context,
    debugTexture,
    new Vec2(1024, 1024)
  );

  const program = makeProgramFromShaderMaterial(context, material);
  const uniforms = {
    localToWorld: new Mat4(),
    worldToView: translation3ToMat4(new Vec3(0, 0, -3)),
    viewToScreen: mat4PerspectiveFov(
      25,
      0.1,
      4,
      1,
      canvasFramebuffer.aspectRatio
    ),
    cubeMap,
    mipCount: cubeMap.mipCount,
    perceptualRoughness: 0
  };
  const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);

  function animate(): void {
    requestAnimationFrame(animate);
    const now = Date.now();

    /* uniforms.localToWorld = euler3ToMat4(
      new Euler3(now * 0.0001, now * 0.00033, now * 0.000077),
      uniforms.localToWorld,
    ); */
    uniforms.perceptualRoughness = Math.sin(now * 0.001) * 0.5 + 0.5;

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
