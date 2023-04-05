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
  getPlanesFromGeometry,
  getTransformToUnitSphere,
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
  transformGeometry
} from '@threeify/core';
import {
  euler3ToMat4,
  Mat4,
  mat4Inverse,
  mat4PerspectiveFov,
  planeProjectPointOnPlane,
  translation3ToMat4,
  Vec2,
  Vec3,
  vec3Lerp
} from '@threeify/math';

import { getThreeJsHdriUrl, ThreeJsHdri } from '../../utilities/threeHdris';
import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

enum GeoMode {
  Unit,
  Local,
  LocalPlanes
}
let ior = IORConstants.Diamond;
let gemIndex = 13;
let maxBounces = 5;
let boostFactor = 1;
let squishRatio = 0;
let geoMode = GeoMode.Local;

type Gem = {
  geometry: Geometry;
  localGeometry?: Geometry;
  squishFactor: Vec3;
  bufferGeometry?: BufferGeometry;
  localBufferGeometry?: BufferGeometry;
  normalCubeMap?: TexImage2D;
  smoothNormals: boolean;
  localToGem: Mat4;
  gemToLocal: Mat4;
  pointOnPlanes: Vec3[];
  planeNormals: Vec3[];
};
const gems: Gem[] = [];

const maxOffset = 0;
let hitRefines = 1;

document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case ',':
      maxBounces -= 1;
      break;
    case '.':
      maxBounces += 1;
      break;
    case 'q':
      boostFactor -= 0.25;
      break;
    case 'w':
      boostFactor += 0.25;
      break;
    case 'a':
      squishRatio -= 0.1;
      break;
    case 's':
      squishRatio += 0.1;
      break;
    case 'z':
      hitRefines--;
      break;
    case 'x':
      hitRefines++;
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
    // space bar
    case ' ':
      geoMode = (geoMode + 1) % 3;
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
  hitRefines = Math.max(0, Math.min(10, hitRefines));
  maxBounces = Math.max(0, Math.min(30, maxBounces));
  gemIndex = (gemIndex + gems.length) % gems.length;
  boostFactor = Math.max(0, Math.min(boostFactor, 10));
  squishRatio = Math.max(0, Math.min(squishRatio, 1));

  console.log(
    'ior',
    Math.round(ior * 100) / 100,
    'hitRefines',
    hitRefines,
    'gem',
    gems[gemIndex].geometry.name,
    'bounces',
    maxBounces,
    'boostFactor',
    boostFactor,
    'squishRatio',
    squishRatio,
    'geoMode',
    GeoMode[geoMode]
  );
});

async function init(): Promise<void> {
  for (let i = 1; i < 15; i++) {
    gems.push({
      geometry: transformGeometry(
        (await fetchOBJ(`/assets/models/gems/gem${i}.obj`))[0],
        translation3ToMat4(
          new Vec3(
            maxOffset * Math.random() - maxOffset * 0.5,
            maxOffset * Math.random() - maxOffset * 0.5,
            maxOffset * Math.random() - maxOffset * 0.5
          )
        )
      ),
      squishFactor: new Vec3(1, 0.25, 1),
      smoothNormals: true,
      localToGem: new Mat4(),
      gemToLocal: new Mat4(),
      pointOnPlanes: [],
      planeNormals: []
    });
  }
  gems.push(
    {
      geometry: transformGeometry(
        boxGeometry(0.25, 0.25, 0.25),
        translation3ToMat4(
          new Vec3(
            maxOffset * Math.random() - maxOffset * 0.5,
            maxOffset * Math.random() - maxOffset * 0.5,
            maxOffset * Math.random() - maxOffset * 0.5
          )
        )
      ),
      squishFactor: new Vec3(1, 1, 1),
      smoothNormals: false,
      localToGem: new Mat4(),
      gemToLocal: new Mat4(),
      pointOnPlanes: [],
      planeNormals: []
    },
    {
      geometry: transformGeometry(
        cylinderGeometry(0.25, 0.25, 36),
        translation3ToMat4(
          new Vec3(
            maxOffset * Math.random() - maxOffset * 0.5,
            maxOffset * Math.random() - maxOffset * 0.5,
            maxOffset * Math.random() - maxOffset * 0.5
          )
        )
      ),
      squishFactor: new Vec3(1, 1, 1),
      smoothNormals: false,
      localToGem: new Mat4(),
      gemToLocal: new Mat4(),
      pointOnPlanes: [],
      planeNormals: []
    },
    {
      geometry: icosahedronGeometry(0.25, 2, false),
      squishFactor: new Vec3(1, 1, 1),
      smoothNormals: false,
      localToGem: new Mat4(),
      gemToLocal: new Mat4(),
      pointOnPlanes: [],
      planeNormals: []
    },
    {
      geometry: icosahedronGeometry(0.25, 6, true),
      squishFactor: new Vec3(1, 1, 1),
      smoothNormals: true,
      localToGem: new Mat4(),
      gemToLocal: new Mat4(),
      pointOnPlanes: [],
      planeNormals: []
    }
  );

  for (let i = 0; i < gems.length; i++) {
    const localToGem = getTransformToUnitSphere(gems[i].geometry);
    gems[i].localToGem.copy(localToGem);
    gems[i].gemToLocal.copy(mat4Inverse(localToGem));

    const localGeometry = gems[i].geometry.clone();
    transformGeometry(localGeometry, localToGem);
    gems[i].localGeometry = localGeometry;
    if (localGeometry.indices !== undefined) {
      console.log(
        'face count',
        localGeometry.name,
        localGeometry.indices.count / 3
      );
    }

    const planes = getPlanesFromGeometry(localGeometry);
    const pointsOnPlanes: Vec3[] = [];
    const planeNormals: Vec3[] = [];
    for (let j = 0; j < Math.min(planes.length, 40); j++) {
      const plane = planes[j];
      pointsOnPlanes.push(planeProjectPointOnPlane(plane, new Vec3(0, 0, 0)));
      planeNormals.push(plane.normal);
    }
    gems[i].pointOnPlanes = pointsOnPlanes;
    gems[i].planeNormals = planeNormals;
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
    await fetchHDR(getThreeJsHdriUrl(ThreeJsHdri.san_giuseppe_bridge_2k))
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
    const localGeometry = gem.localGeometry;
    if (localGeometry !== undefined) {
      gem.localBufferGeometry = geometryToBufferGeometry(
        context,
        localGeometry
      );
    }
  }
  // render into the cube map
  const normalCube = await createNormalCube(context);

  for (const gem of gems) {
    const { bufferGeometry, smoothNormals, localToGem } = gem;
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
      bufferGeometry,
      localToCube: localToGem
    });

    gem.normalCubeMap = normalCubeMap;
  }

  const initGem = gems[0];

  const uniforms = {
    // ibl
    iblWorldMap: cubeMap,
    iblIntensity: 1,
    iblMipCount: cubeMap.mipCount,

    gemMaxBounces: maxBounces,

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

    gemToLocal: new Mat4(),
    localToGem: new Mat4(),

    // material
    ior: IORConstants.Diamond,
    transmissionFactor: 0.5,
    attenuationDistance: 0.1,
    attenuationColor: new Vec3(0.3, 0.3, 0.5),
    abbeNumber: AbbeConstants.Diamond,
    gemNormalCubeMap: initGem.normalCubeMap,
    gemSquishFactor: initGem.squishFactor,
    gemBoostFactor: boostFactor,
    hitRefines: hitRefines,

    planeNormals: initGem.planeNormals,
    numPlanes: initGem.planeNormals.length,
    pointOnPlanes: initGem.pointOnPlanes,
    usePlanes: geoMode === GeoMode.LocalPlanes
  };

  function animate(): void {
    orbitController.update();

    const gem = gems[gemIndex];
    const gemLocal =
      geoMode === GeoMode.Local || geoMode === GeoMode.LocalPlanes;
    const bufferGeometry = gemLocal
      ? gem.bufferGeometry
      : gem.localBufferGeometry;

    if (bufferGeometry === undefined)
      throw new Error('bufferGeometry is undefined');

    uniforms.gemMaxBounces = maxBounces;
    uniforms.gemBoostFactor = boostFactor;
    uniforms.localToWorld = euler3ToMat4(orbitController.euler);
    uniforms.worldToLocal = mat4Inverse(uniforms.localToWorld);
    uniforms.viewToWorld = mat4Inverse(uniforms.worldToView);
    uniforms.gemNormalCubeMap = gem.normalCubeMap;
    uniforms.gemToLocal = gemLocal ? gem.gemToLocal : new Mat4();
    uniforms.localToGem = gemLocal ? gem.localToGem : new Mat4();
    uniforms.planeNormals = gem.planeNormals;
    uniforms.pointOnPlanes = gem.pointOnPlanes;
    uniforms.usePlanes = geoMode === GeoMode.LocalPlanes;
    uniforms.numPlanes = gem.planeNormals.length;

    uniforms.gemMaxBounces = maxBounces;
    uniforms.gemBoostFactor = boostFactor;

    uniforms.hitRefines = hitRefines;
    uniforms.gemSquishFactor = vec3Lerp(
      new Vec3(1, 1, 1),
      gem.squishFactor,
      squishRatio
    );

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
