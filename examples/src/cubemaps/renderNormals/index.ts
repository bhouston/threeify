import {
  BlendState,
  createNormalCube,
  createRenderingContext,
  CubeMapTexture,
  CullingState,
  DepthTestState,
  fetchOBJ,
  geometryToBufferGeometry,
  icosahedronGeometry,
  Orbit,
  renderBufferGeometry,
  shaderSourceToProgram,
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
  const sphereGeometry = icosahedronGeometry(0.75, 3, true);

  const geometry = gemGeometry;

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
    normalCubeMap: normalCubeMap,

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
    viewToWorld: new Mat4()
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
