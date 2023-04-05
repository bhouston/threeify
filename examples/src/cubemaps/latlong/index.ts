import {
  createCubemapBackground,
  createRenderingContext,
  equirectangularTextureToCubeMap,
  fetchHDR,
  fetchTexture,
  InternalFormat,
  Orbit,
  Texture,
  TextureEncoding
} from '@threeify/core';
import { Mat4, mat4Compose, mat4PerspectiveFov, Vec3 } from '@threeify/math';

import { getThreeJsHdriUrl, ThreeJsHdri } from '../../utilities/threeHdris';

async function init(): Promise<void> {
  const latLongTexture = await fetchTexture(
    '/assets/textures/cube/debug/latLong.png'
  );
  const ennisTexture = new Texture(
    await fetchHDR(getThreeJsHdriUrl(ThreeJsHdri.royal_esplanade_1k))
  );

  const context = createRenderingContext(document, 'framebuffer');
  const { canvasFramebuffer, canvas } = context;
  window.addEventListener('resize', () => canvasFramebuffer.resize());

  const orbitController = new Orbit(canvas);
  orbitController.zoom = 1.5;
  orbitController.zoomMax = 9;

  const latLongCubeMap = await equirectangularTextureToCubeMap(
    context,
    latLongTexture,
    TextureEncoding.Linear,
    1024
  );

  const ennisCubeMap = await equirectangularTextureToCubeMap(
    context,
    ennisTexture,
    TextureEncoding.RGBE,
    1024,
    InternalFormat.RGBA16F
  );

  const cubemapBackground = await createCubemapBackground(context);

  const viewToClip = mat4PerspectiveFov(
    25,
    0.1,
    4,
    1,
    canvasFramebuffer.aspectRatio
  );

  function animate(): void {
    requestAnimationFrame(animate);
    const now = Date.now();

    orbitController.update();

    const worldToView = mat4Compose(
      new Vec3(0, 0, 0),
      orbitController.rotation,
      new Vec3(1, 1, 1)
    );

    cubemapBackground.exec({
      cubeMapTexImage2D:
        Math.sin(now * 0.002) > 0 ? latLongCubeMap : ennisCubeMap,
      cubeMapIntensity: 1,
      targetFramebuffer: canvasFramebuffer,
      localToWorld: new Mat4(),
      worldToView: worldToView,
      viewToClip,
      depth: 1,
      toneMapping: true,
      exposure: 1,
      sRGB: true
    });
  }

  animate();
}

init();
