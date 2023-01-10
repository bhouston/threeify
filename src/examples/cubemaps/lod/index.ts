import {
  convertToInterleavedGeometry,
  CubeMapTexture,
  DepthTestFunc,
  DepthTestState,
  Euler3,
  fetchCubeImages,
  icosahedronGeometry,
  makeBufferGeometryFromGeometry,
  makeMat4PerspectiveFov,
  makeMat4RotationFromEuler,
  translation3ToMat4,
  makeProgramFromShaderMaterial,
  makeTexImage2DFromCubeTexture,
  Mat4,
  renderBufferGeometry,
  RenderingContext,
  ShaderMaterial,
  Vec3
} from '../../../lib/index.js';
import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

async function init(): Promise<null> {
  const geometry = convertToInterleavedGeometry(icosahedronGeometry(0.75, 2));
  const material = new ShaderMaterial(vertexSource, fragmentSource);
  const cubeTexture = new CubeMapTexture(
    await fetchCubeImages('/assets/textures/cube/pisa/*.png')
  );

  const context = new RenderingContext(
    document.getElementById('framebuffer') as HTMLCanvasElement
  );
  const { canvasFramebuffer } = context;
  window.addEventListener('resize', () => canvasFramebuffer.resize());

  const program = makeProgramFromShaderMaterial(context, material);
  const uniforms = {
    localToWorld: new Mat4(),
    worldToView: translation3ToMat4(new Vec3(0, 0, -3)),
    viewToScreen: makeMat4PerspectiveFov(
      25,
      0.1,
      4,
      1,
      canvasFramebuffer.aspectRatio
    ),
    perceptualRoughness: 0,
    mipCount: cubeTexture.mipCount,
    cubeMap: makeTexImage2DFromCubeTexture(context, cubeTexture)
  };

  const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);
  const depthTestState = new DepthTestState(true, DepthTestFunc.Less);

  function animate(): void {
    const now = Date.now();
    uniforms.localToWorld = makeMat4RotationFromEuler(
      new Euler3(now * 0.0001, now * 0.00033, now * 0.000077),
      uniforms.localToWorld
    );
    uniforms.perceptualRoughness = Math.sin(now * 0.001) * 0.5 + 0.5;
    renderBufferGeometry(
      canvasFramebuffer,
      program,
      uniforms,
      bufferGeometry,
      depthTestState
    );

    requestAnimationFrame(animate);
  }

  animate();

  return null;
}

init();
