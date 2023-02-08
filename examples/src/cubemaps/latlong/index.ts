import {
  Blending,
  blendModeToBlendState,
  CullingState,
  DepthTestState,
  fetchImage,
  icosahedronGeometry,
  makeBufferGeometryFromGeometry,
  makeProgramFromShaderMaterial,
  makeTexImage2DFromEquirectangularTexture,
  Orbit,
  renderBufferGeometry,
  RenderingContext,
  ShaderMaterial,
  Texture
} from '@threeify/core';
import {
  Euler3,
  euler3ToQuat,
  mat4Compose,
  mat4PerspectiveFov,
  Vec2,
  Vec3
} from '@threeify/vector-math';

import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

async function init(): Promise<void> {
  const latLongTexture = new Texture(
    await fetchImage('/assets/textures/cube/debug/latLong.png')
  );
  const ennisTexture = new Texture(
    await fetchImage('/assets/textures/cube/ennis/latLong.jpg')
  );
  const geometry = icosahedronGeometry(3, 4, true);
  const material = new ShaderMaterial('index', vertexSource, fragmentSource);

  const context = new RenderingContext(
    document.getElementById('framebuffer') as HTMLCanvasElement
  );
  const { canvasFramebuffer } = context;
  window.addEventListener('resize', () => canvasFramebuffer.resize());

  const orbitController = new Orbit(context.canvas);
  orbitController.zoom = 1.5;
  orbitController.zoomMax = 9;

  const latLongCubeMap = makeTexImage2DFromEquirectangularTexture(
    context,
    latLongTexture,
    new Vec2(1024, 1024)
  );

  const ennisCubeMap = makeTexImage2DFromEquirectangularTexture(
    context,
    ennisTexture,
    new Vec2(1024, 1024)
  );

  const program = makeProgramFromShaderMaterial(context, material);
  const uniforms = {
    localToWorld: mat4Compose(
      new Vec3(0, 0, 0),
      euler3ToQuat(new Euler3(30, 0, 0)),
      new Vec3(1, 1, 1)
    ),
    worldToView: mat4Compose(
      new Vec3(0, 0, 0),
      euler3ToQuat(new Euler3(0, 0, 0)),
      new Vec3(1, 1, 1)
    ),
    viewToScreen: mat4PerspectiveFov(
      25,
      0.1,
      4,
      1,
      canvasFramebuffer.aspectRatio
    ),
    cubeMap: latLongCubeMap,
    mipCount: latLongCubeMap.mipCount,
    perceptualRoughness: 0
  };
  const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);
  const depthTestState = new DepthTestState(false);
  const cullingState = new CullingState(false);
  const blendState = blendModeToBlendState(Blending.Over, true);

  function animate(): void {
    requestAnimationFrame(animate);
    const now = Date.now();

    orbitController.update();

    uniforms.localToWorld = mat4Compose(
      new Vec3(0, 0, 0),
      orbitController.rotation,
      new Vec3(1, 1, 1)
    );
    uniforms.perceptualRoughness = Math.sin(now * 0.001) * 0.5 + 0.5;

    uniforms.cubeMap =
      Math.sin(now * 0.001) > 0 ? latLongCubeMap : ennisCubeMap;

    renderBufferGeometry({
      framebuffer: canvasFramebuffer,
      program,
      uniforms,
      bufferGeometry,
      cullingState
    });
  }

  animate();
}

init();
