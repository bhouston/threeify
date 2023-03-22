import {
  AbbeConstants,
  BlendState,
  boxGeometry,
  BufferGeometry,
  createCubemapBackground,
  createNormalCube,
  createRenderingContext,
  CubeMapTexture,
  CullingState,
  cylinderGeometry,
  DepthTestState,
  equirectangularTextureToCubeMap,
  fetchHDR,
  fetchOBJ,
  Geometry,
  geometryToBufferGeometry,
  icosahedronGeometry,
  InternalFormat,
  IORConstants,
  Orbit,
  renderBufferGeometry,
  shaderSourceToProgram,
  Texture,
  TextureEncoding,
  TextureFilter,
  textureToTexImage2D
} from '@threeify/core';
import {
  euler3ToMat4,
  Mat4,
  mat4Inverse,
  mat4PerspectiveFov,
  translation3ToMat4,
  Vec2,
  Vec3
} from '@threeify/math';

import { getThreeJSHDRIUrl, ThreeJSHRDI } from '../../utilities/threejsHDRIs';
import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

let ior = IORConstants.Diamond;
let gemIndex = 0;

document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowUp':
      ior += 0.1;
      break;
    case 'ArrowDown':
      ior -= 0.1;
      break;
    case 'ArrowLeft':
      gemIndex++;
      break;
    case 'ArrowRight':
      gemIndex--;
      break;
    case 'Escape':
      ior = IORConstants.Diamond;
      break;
  }
  ior = Math.max(1, Math.min(3, ior));
});

async function init(): Promise<void> {
  const gemGeometries: Geometry[] = [];
  gemGeometries.push(
    icosahedronGeometry(0.25, 2, false),
    boxGeometry(0.25, 0.25, 0.25),
    cylinderGeometry(0.25, 0.25, 36)
  );
  for (let i = 1; i < 14; i++) {
    gemGeometries.push(...(await fetchOBJ(`/assets/models/gems/gem${i}.obj`)));
  }

  //outputDebugInfo(geometry);
  const context = createRenderingContext(document, 'framebuffer');
  const { canvasFramebuffer, canvas } = context;
  window.addEventListener('resize', () => canvasFramebuffer.resize());

  const orbitController = new Orbit(canvas);
  orbitController.zoom = 1.5;
  orbitController.zoomMax = 9;

  const cubemapBackground = await createCubemapBackground(context);

  const mainProgram = await shaderSourceToProgram(
    context,
    'index',
    vertexSource,
    fragmentSource
  );

  /*const latLongTexture = new Texture(
    await fetchImage('/assets/textures/cube/debug/latLong.png')
  );*/
  const latLongTexture = new Texture(
    await fetchHDR(getThreeJSHDRIUrl(ThreeJSHRDI.royal_esplanade_1k))
  );
  const cubeMap = await equirectangularTextureToCubeMap(
    context,
    latLongTexture,
    TextureEncoding.RGBE,
    1024,
    InternalFormat.RGBA16F
  );

  const bufferGeometries: BufferGeometry[] = [];
  for (const geometry of gemGeometries) {
    bufferGeometries.push(geometryToBufferGeometry(context, geometry));
  }

  const imageSize = new Vec2(512, 512);
  const normalCubeTexture = new CubeMapTexture([
    imageSize,
    imageSize,
    imageSize,
    imageSize,
    imageSize,
    imageSize
  ]);
  normalCubeTexture.minFilter = TextureFilter.Nearest;
  normalCubeTexture.generateMipmaps = false;
  const gemLocalNormalMap = textureToTexImage2D(context, normalCubeTexture);

  let lastGemIndex = -1;

  // render into the cube map
  const normalCube = await createNormalCube(context);

  const uniforms = {
    // ibl
    iblWorldMap: cubeMap,
    iblIntensity: 1,
    iblMipCount: cubeMap.mipCount,

    gemLocalNormalMap: gemLocalNormalMap,

    // vertices
    localToWorld: new Mat4(),
    worldToView: translation3ToMat4(new Vec3(0, 0, -2)),
    viewToClip: mat4PerspectiveFov(
      25,
      0.1,
      4,
      1,
      canvasFramebuffer.aspectRatio
    ),
    worldToLocal: new Mat4(),
    viewToWorld: new Mat4(),

    // material
    ior: IORConstants.Diamond,
    transmissionFactor: 0.5,
    attenuationDistance: 0.5,
    attenuationColor: new Vec3(1, 0.8, 0.8),
    abbeNumber: AbbeConstants.Diamond
  };

  function animate(): void {
    orbitController.update();

    if (lastGemIndex !== gemIndex) {
      gemIndex = (gemIndex + bufferGeometries.length) % bufferGeometries.length;
      lastGemIndex = gemIndex;
      const bufferGeometry =
        bufferGeometries[gemIndex % bufferGeometries.length];
      normalCube.exec({
        cubeMap: gemLocalNormalMap,
        bufferGeometry
      });
    }

    uniforms.localToWorld = euler3ToMat4(orbitController.euler);
    uniforms.worldToLocal = mat4Inverse(uniforms.localToWorld);
    uniforms.viewToWorld = mat4Inverse(uniforms.worldToView);

    uniforms.viewToClip = mat4PerspectiveFov(
      25,
      0.1,
      4,
      orbitController.zoom,
      canvasFramebuffer.aspectRatio
    );

    canvasFramebuffer.clear();

    cubemapBackground.exec({
      cubeMapTexImage2D: uniforms.iblWorldMap,
      cubeMapIntensity: 1,
      targetFramebuffer: canvasFramebuffer,
      viewToWorld: uniforms.viewToWorld,

      clipToView: mat4Inverse(uniforms.viewToClip)
    });

    uniforms.ior = ior;

    renderBufferGeometry({
      framebuffer: canvasFramebuffer,
      program: mainProgram,
      uniforms,
      bufferGeometry: bufferGeometries[gemIndex],
      depthTestState: DepthTestState.Less,
      cullingState: CullingState.Back,
      blendState: BlendState.PremultipliedOver
    });

    requestAnimationFrame(animate);
  }

  animate();
}

init();
