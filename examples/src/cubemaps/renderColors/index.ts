import {
  Attachment,
  createCubemapBackground,
  createRenderingContext,
  cubeFaceTargets,
  CubeMapTexture,
  Framebuffer,
  renderPass,
  shaderMaterialToProgram,
  TextureFilter,
  textureToTexImage2D
} from '@threeify/core';
import {
  Color3,
  Euler3,
  euler3ToMat4,
  hslToColor3,
  Mat4,
  mat4PerspectiveFov,
  translation3ToMat4,
  Vec2,
  Vec3
} from '@threeify/math';
import { ColorHSL } from '@threeify/math/src/ColorHSL.js';

import { patternMaterial } from './pattern/PatternMaterial.js';

async function init(): Promise<void> {
  // TODO: Required because of a timing error on Threeify.org website.  Fix this.
  // const texture = new Texture(await fetchImage("/assets/textures/uv_grid_opengl.jpg"));

  const imageSize = new Vec2(1024, 1024);
  const cubeTexture = new CubeMapTexture([
    imageSize,
    imageSize,
    imageSize,
    imageSize,
    imageSize,
    imageSize
  ]);
  cubeTexture.minFilter = TextureFilter.Linear;
  cubeTexture.generateMipmaps = false;

  const context = createRenderingContext(document, 'framebuffer');
  const { canvasFramebuffer } = context;
  window.addEventListener('resize', () => canvasFramebuffer.resize());

  const patternProgram = await shaderMaterialToProgram(
    context,
    patternMaterial
  );
  const patternUniforms = {
    color: new Color3(1, 0, 0)
  };

  const cubeMap = textureToTexImage2D(context, cubeTexture);

  const framebuffer = new Framebuffer(context);
  const cubemapBackground = await createCubemapBackground(context);

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
    cubeMap: cubeMap
  };

  function animate(): void {
    requestAnimationFrame(animate);
    const now = Date.now();

    cubeFaceTargets.forEach((target, index) => {
      framebuffer.attach(Attachment.Color0, cubeMap, target, 0);
      patternUniforms.color = hslToColor3(
        new ColorHSL(index / 6 + now * 0.0001, 0.5, 0.5)
      );

      renderPass({
        framebuffer,
        program: patternProgram,
        uniforms: patternUniforms
      });
    });

    uniforms.localToWorld = euler3ToMat4(
      new Euler3(now * 0.0001, now * 0.00033, now * 0.000077),
      uniforms.localToWorld
    );

    cubemapBackground.exec({
      cubeMapTexImage2D: cubeMap,
      cubeMapIntensity: 1,
      targetFramebuffer: canvasFramebuffer,
      localToWorld: uniforms.localToWorld,
      worldToView: uniforms.worldToView,
      viewToClip: uniforms.viewToClip,
      depth: 1,
      toneMapping: true,
      exposure: 1,
      sRGB: true
    });
  }

  animate();
}

init();
