import {
  diskGeometry,
  fetchImage,
  makeBufferGeometryFromGeometry,
  makeProgramFromShaderMaterial,
  renderBufferGeometry,
  RenderingContext,
  ShaderMaterial,
  Texture,
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
  Vec3
} from '@threeify/math';

import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

async function init(): Promise<void> {
  const geometry = diskGeometry(0.5, 64);
  const material = new ShaderMaterial('index', vertexSource, fragmentSource);
  const anisotropicFlow1Texture = new Texture(
    await fetchImage('/assets/textures/anisotropic/radialSmallOverlapping.jpg')
  );
  const anisotropicFlow2Texture = new Texture(
    await fetchImage('/assets/textures/anisotropic/radialLarge.jpg')
  );

  const context = new RenderingContext(
    document.getElementById('framebuffer') as HTMLCanvasElement
  );
  const { canvasFramebuffer } = context;
  window.addEventListener('resize', () => canvasFramebuffer.resize());

  const anisotropicFlow1Map = textureToTexImage2D(
    context,
    anisotropicFlow1Texture
  );
  const anisotropicFlow2Map = textureToTexImage2D(
    context,
    anisotropicFlow2Texture
  );
  const program = await makeProgramFromShaderMaterial(context, material);
  const uniforms = {
    // vertices
    localToWorld: new Mat4(),
    worldToView: translation3ToMat4(new Vec3(0, 0, -1)),
    viewToScreen: mat4PerspectiveFov(
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
  const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);

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
