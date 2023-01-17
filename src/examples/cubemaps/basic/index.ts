import {
  CubeMapTexture,
  DepthTestFunc,
  DepthTestState,
  Euler3,
  euler3ToMat4,
  fetchCubeImages,
  icosahedronGeometry,
  makeBufferGeometryFromGeometry,
  makeProgramFromShaderMaterial,
  makeTexImage2DFromCubeTexture,
  Mat4,
  mat4PerspectiveFov,
  renderBufferGeometry,
  RenderingContext,
  ShaderMaterial,
  translation3ToMat4,
  Vec3
} from '../../../lib/index.js';
import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

async function init(): Promise<null> {
  const geometry = icosahedronGeometry(0.75, 2, true);
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
    viewToScreen: mat4PerspectiveFov(
      25,
      0.1,
      4,
      1,
      canvasFramebuffer.aspectRatio
    ),
    cubeMap: makeTexImage2DFromCubeTexture(context, cubeTexture)
  };
  const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);
  const depthTestState = new DepthTestState(true, DepthTestFunc.Less);

  function animate(): void {
    requestAnimationFrame(animate);

    const now = Date.now();
    uniforms.localToWorld = euler3ToMat4(
      new Euler3(now * 0.0001, now * 0.00033, now * 0.000077),
      uniforms.localToWorld
    );
    renderBufferGeometry(
      canvasFramebuffer,
      program,
      uniforms,
      bufferGeometry,
      depthTestState
    );
  }

  animate();

  return null;
}

init();
