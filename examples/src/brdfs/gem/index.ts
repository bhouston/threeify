import {
  AbbeConstants,
  BlendState,
  createNormalCube,
  createRenderingContext,
  CubeMapTexture,
  CullingState,
  DepthTestState,
  equirectangularTextureToCubeMap,
  fetchImage,
  fetchOBJ,
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

import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

async function init(): Promise<void> {
  const [gemGeometry] = await fetchOBJ('/assets/models/gems/gemStone.obj');
  const sphereGeometry = icosahedronGeometry(0.75, 5, true);

  const geometry = sphereGeometry;

  //outputDebugInfo(geometry);
  const context = createRenderingContext(document, 'framebuffer');
  const { canvasFramebuffer, canvas } = context;
  window.addEventListener('resize', () => canvasFramebuffer.resize());

  const orbitController = new Orbit(canvas);
  orbitController.zoom = 1.5;
  orbitController.zoomMax = 9;

  const mainProgram = await shaderSourceToProgram(
    context,
    'index',
    vertexSource,
    fragmentSource
  );

  const latLongTexture = new Texture(
    await fetchImage('/assets/textures/cube/debug/latLong.png')
  );
  /*const latLongTexture = new Texture(
    await fetchHDR('./assets/textures/cube/debug/latLong.png')
      getThreeJSHDRIUrl(ThreeJSHRDI.royal_esplanade_1k))
  );*/
  const cubeMap = await equirectangularTextureToCubeMap(
    context,
    latLongTexture,
    TextureEncoding.RGBE,
    1024,
    InternalFormat.RGBA16F
  );

  const bufferGeometry = geometryToBufferGeometry(context, geometry);

  const imageSize = new Vec2(512, 512);
  const normalCubeTexture = new CubeMapTexture([
    imageSize,
    imageSize,
    imageSize,
    imageSize,
    imageSize,
    imageSize
  ]);
  normalCubeTexture.minFilter = TextureFilter.Linear;
  normalCubeTexture.generateMipmaps = false;
  const normalCubeMap = textureToTexImage2D(context, normalCubeTexture);

  // render into the cube map
  const normalCube = await createNormalCube(context);
  normalCube.exec({ bufferGeometry, cubeMap: normalCubeMap });

  const uniforms = {
    // ibl
    iblWorldMap: cubeMap,
    iblIntensity: 1,
    iblWorldMapMaxLod: cubeMap.mipCount,

    internalNormalMap: normalCubeMap,

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
    attenuationColor: new Vec3(1, 1, 1),
    abbeNumber: AbbeConstants.Diamond
  };

  function animate(): void {
    orbitController.update();

    uniforms.localToWorld = euler3ToMat4(orbitController.euler);
    uniforms.worldToLocal = mat4Inverse(uniforms.localToWorld);
    uniforms.viewToWorld = mat4Inverse(uniforms.worldToView);

    canvasFramebuffer.clear();

    renderBufferGeometry({
      framebuffer: canvasFramebuffer,
      program: mainProgram,
      uniforms,
      bufferGeometry,
      depthTestState: DepthTestState.Less,
      cullingState: CullingState.Back,
      blendState: BlendState.PremultipliedOver
    });

    requestAnimationFrame(animate);
  }

  animate();
}

init();
