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
  TexImage2D,
  Texture,
  TextureEncoding,
  TextureFilter,
  textureToTexImage2D,
  transformGeometryToUnitSphere
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
let maxBounces = 5;

type Gem = {
  geometry: Geometry;
  squishFactor: Vec3;
  bufferGeometry?: BufferGeometry;
  normalCubeMap?: TexImage2D;
  smoothNormals: boolean;
};
const gems: Gem[] = [];

document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case ',':
      maxBounces -= 1;
      break;
    case '.':
      maxBounces += 1;
      break;
    case 'ArrowUp':
      ior *= 1.025;
      break;
    case 'ArrowDown':
      ior /= 1.025;
      break;
    case 'ArrowLeft':
      gemIndex--;
      break;
    case 'ArrowRight':
      gemIndex++;
      break;
    case 'Escape':
      ior = IORConstants.Diamond;
      gemIndex = 0;
      break;
  }
  ior = Math.max(1, Math.min(5, ior));
  maxBounces = Math.max(-1, Math.min(30, maxBounces));
  gemIndex = (gemIndex + gems.length) % gems.length;

  console.log(
    'ior',
    Math.round(ior * 100) / 100,
    'gem',
    gems[gemIndex].geometry.name,
    'bounces',
    maxBounces
  );
});

async function init(): Promise<void> {
  for (let i = 1; i < 14; i++) {
    gems.push({
      geometry: (await fetchOBJ(`/assets/models/gems/gem${i}.obj`))[0],
      squishFactor: new Vec3(1, 0.5, 1),
      smoothNormals: false
    });
  }
  gems.push(
    {
      geometry: boxGeometry(0.25, 0.25, 0.25),
      squishFactor: new Vec3(1, 1, 1),
      smoothNormals: false
    },
    {
      geometry: cylinderGeometry(0.25, 0.25, 36),
      squishFactor: new Vec3(1, 1, 1),
      smoothNormals: false
    },
    {
      geometry: icosahedronGeometry(0.25, 2, false),
      squishFactor: new Vec3(1, 1, 1),
      smoothNormals: false
    },
    {
      geometry: icosahedronGeometry(0.25, 6, true),
      squishFactor: new Vec3(1, 1, 1),
      smoothNormals: true
    }
  );

  for (let i = 0; i < gems.length; i++) {
    transformGeometryToUnitSphere(gems[i].geometry);
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
    await fetchHDR(getThreeJSHDRIUrl(ThreeJSHRDI.san_giuseppe_bridge_2k))
  );
  const cubeMap = await equirectangularTextureToCubeMap(
    context,
    latLongTexture,
    TextureEncoding.RGBE,
    1024,
    InternalFormat.RGBA16F
  );

  for (const gem of gems) {
    gem.bufferGeometry = geometryToBufferGeometry(context, gem.geometry);
  }
  // render into the cube map
  const normalCube = await createNormalCube(context);

  for (const gem of gems) {
    const { bufferGeometry, smoothNormals } = gem;
    if (bufferGeometry === undefined)
      throw new Error('bufferGeometry is undefined');
    const imageSize = new Vec2(1024, 1024);
    const normalCubeTexture = new CubeMapTexture([
      imageSize,
      imageSize,
      imageSize,
      imageSize,
      imageSize,
      imageSize
    ]);
    normalCubeTexture.minFilter = smoothNormals
      ? TextureFilter.Linear
      : TextureFilter.Nearest;
    normalCubeTexture.magFilter = smoothNormals
      ? TextureFilter.Linear
      : TextureFilter.Nearest;
    normalCubeTexture.anisotropicLevels = 0;
    normalCubeTexture.generateMipmaps = false;
    const normalCubeMap = textureToTexImage2D(context, normalCubeTexture);

    normalCube.exec({
      cubeMap: normalCubeMap,
      bufferGeometry
    });

    gem.normalCubeMap = normalCubeMap;
  }

  const initGem = gems[0];

  const uniforms = {
    // ibl
    iblWorldMap: cubeMap,
    iblIntensity: 1,
    iblMipCount: cubeMap.mipCount,

    maxBounces: maxBounces,

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
    attenuationDistance: 0.1,
    attenuationColor: new Vec3(0.3, 0.3, 0.5),
    abbeNumber: AbbeConstants.Diamond,
    gemNormalCubeMap: initGem.normalCubeMap,
    squishFactor: initGem.squishFactor
  };

  function animate(): void {
    orbitController.update();

    const gem = gems[gemIndex];
    if (gem.bufferGeometry === undefined)
      throw new Error('gem.bufferGeometry is undefined');

    uniforms.maxBounces = maxBounces;
    uniforms.localToWorld = euler3ToMat4(orbitController.euler);
    uniforms.worldToLocal = mat4Inverse(uniforms.localToWorld);
    uniforms.viewToWorld = mat4Inverse(uniforms.worldToView);
    uniforms.gemNormalCubeMap = gem.normalCubeMap;
    uniforms.squishFactor = gem.squishFactor;

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
      worldToView: uniforms.worldToView,
      localToWorld: uniforms.localToWorld,
      viewToClip: uniforms.viewToClip,
      depth: 1,
      toneMapping: true,
      exposure: 1,
      sRGB: true
    });

    uniforms.ior = ior;

    renderBufferGeometry({
      framebuffer: canvasFramebuffer,
      program: mainProgram,
      uniforms,
      bufferGeometry: gem.bufferGeometry,
      depthTestState: DepthTestState.Less,
      cullingState: CullingState.Back,
      blendState: BlendState.PremultipliedOver
    });

    requestAnimationFrame(animate);
  }

  animate();
}

init();
