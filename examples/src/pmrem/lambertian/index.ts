import {
  Attachment,
  createRenderingContext,
  cubeFaceTargets,
  CubeMapTexture,
  equirectangularTextureToCubeMap,
  fetchTexture,
  Framebuffer,
  geometryToBufferGeometry,
  icosahedronGeometry,
  renderBufferGeometry,
  renderPass,
  shaderMaterialToProgram,
  shaderSourceToProgram,
  TextureEncoding,
  TextureFilter,
  textureToTexImage2D,
  TextureWrap
} from '@threeify/core';
import {
  Euler3,
  euler3ToMat4,
  Mat4,
  mat4PerspectiveFov,
  translation3ToMat4,
  Vec2,
  Vec3
} from '@threeify/math';

import fragmentSource from './fragment.glsl.js';
import { samplerMaterial } from './sampler/SamplerMaterial.js';
import vertexSource from './vertex.glsl.js';

async function init(): Promise<void> {
  const geometry = icosahedronGeometry(0.75, 2, true);
  const garageTexture = await fetchTexture(
    '/assets/textures/cube/garage/latLong.jpg'
  );

  garageTexture.wrapS = TextureWrap.Repeat;
  garageTexture.wrapT = TextureWrap.ClampToEdge;
  garageTexture.minFilter = TextureFilter.Linear;

  const imageSize = new Vec2(1024, 1024);
  const lambertianCubeTexture = new CubeMapTexture([
    imageSize,
    imageSize,
    imageSize,
    imageSize,
    imageSize,
    imageSize
  ]);
  lambertianCubeTexture.minFilter = TextureFilter.Linear;
  lambertianCubeTexture.generateMipmaps = false;

  const context = createRenderingContext(document, 'framebuffer');
  const { canvasFramebuffer } = context;
  window.addEventListener('resize', () => canvasFramebuffer.resize());

  const envCubeMap = await equirectangularTextureToCubeMap(
    context,
    garageTexture,
    TextureEncoding.Linear,
    1024
  );

  const samplerProgram = await shaderMaterialToProgram(
    context,
    samplerMaterial
  );
  const samplerUniforms = {
    envCubeMap: envCubeMap,
    faceIndex: 0
  };

  const lambertianCubeMap = textureToTexImage2D(context, lambertianCubeTexture);

  const framebuffer = new Framebuffer(context);

  cubeFaceTargets.forEach((target, index) => {
    framebuffer.attach(Attachment.Color0, lambertianCubeMap, target, 0);
    samplerUniforms.faceIndex = index;

    renderPass({
      framebuffer,
      program: samplerProgram,
      uniforms: samplerUniforms
    });
  });

  const program = await shaderSourceToProgram(
    context,
    'index',
    vertexSource,
    fragmentSource
  );

  const uniforms = {
    localToWorld: new Mat4(),
    worldToView: translation3ToMat4(new Vec3(0, 0, -3)),
    viewToClip: mat4PerspectiveFov(
      25,
      0.1,
      10,
      1,
      canvasFramebuffer.aspectRatio
    ),
    cubeMap: lambertianCubeMap
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
