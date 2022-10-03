import {
  CubeMapTexture,
  DepthTestFunc,
  DepthTestState,
  Euler3,
  fetchImage,
  icosahedronGeometry,
  makeBufferGeometryFromGeometry,
  makeMatrix4PerspectiveFov,
  makeMatrix4RotationFromEuler,
  makeMatrix4Translation,
  makeProgramFromShaderMaterial,
  makeTexImage2DFromCubeTexture,
  Matrix4,
  renderBufferGeometry,
  RenderingContext,
  ShaderMaterial,
  Vector3
} from '../../../lib/index';
import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

async function init(): Promise<null> {
  const geometry = icosahedronGeometry(0.75, 4);
  const material = new ShaderMaterial(vertexSource, fragmentSource);
  const images = [];
  for (let level = 0; level < 9; level++) {
    for (let face = 0; face < 6; face++) {
      images.push(
        fetchImage(
          `/assets/textures/cube/angusMipmaps/cube_m0${level}_c0${face}.jpg`
        )
      );
    }
  }
  const cubeTexture = new CubeMapTexture(await Promise.all(images));
  cubeTexture.generateMipmaps = false;

  const context = new RenderingContext(
    document.getElementById('framebuffer') as HTMLCanvasElement
  );
  const { canvasFramebuffer } = context;
  window.addEventListener('resize', () => canvasFramebuffer.resize());

  const program = makeProgramFromShaderMaterial(context, material);
  const uniforms = {
    localToWorld: new Matrix4(),
    worldToView: makeMatrix4Translation(new Vector3(0, 0, -3.0)),
    viewToScreen: makeMatrix4PerspectiveFov(
      25,
      0.1,
      4.0,
      1.0,
      canvasFramebuffer.aspectRatio
    ),
    cubeMap: makeTexImage2DFromCubeTexture(context, cubeTexture),
    perceptualRoughness: 0,
    mipCount: cubeTexture.mipCount
  };
  const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);
  const depthTestState = new DepthTestState(true, DepthTestFunc.Less);

  function animate(): void {
    requestAnimationFrame(animate);
    const now = Date.now();

    uniforms.localToWorld = makeMatrix4RotationFromEuler(
      new Euler3(now * 0.0001, now * 0.00033, now * 0.000077),
      uniforms.localToWorld
    );
    uniforms.perceptualRoughness = Math.sin(now * 0.005) * 0.5 + 0.5;

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
