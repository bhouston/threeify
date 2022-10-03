import {
  BufferBit,
  ClearState,
  Color3,
  CullingState,
  DepthTestFunc,
  DepthTestState,
  diskGeometry,
  Euler3,
  EulerOrder3,
  fetchImage,
  makeBufferGeometryFromGeometry,
  makeMatrix4PerspectiveFov,
  makeMatrix4RotationFromEuler,
  makeMatrix4Translation,
  makeProgramFromShaderMaterial,
  makeTexImage2DFromTexture,
  Matrix4,
  renderBufferGeometry,
  RenderingContext,
  ShaderMaterial,
  Texture,
  Vector3
} from '../../../lib/index';
import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

async function init(): Promise<null> {
  const geometry = diskGeometry(0.5, 64);
  const material = new ShaderMaterial(vertexSource, fragmentSource);
  const anisotropicFlow1Texture = new Texture(
    await fetchImage('/assets/textures/anisotropic/radialSmallOverlapping.jpg')
  );
  const anisotropicFlow2Texture = new Texture(
    await fetchImage('/assets/textures/anisotropic/radialLarge.jpg')
  );

  const context = new RenderingContext(
    document.getElementById('framebuffer') as HTMLCanvasElement
  );
  const { canvasFramebuffer } = context;
  window.addEventListener('resize', () => canvasFramebuffer.resize());

  const anisotropicFlow1Map = makeTexImage2DFromTexture(
    context,
    anisotropicFlow1Texture
  );
  const anisotropicFlow2Map = makeTexImage2DFromTexture(
    context,
    anisotropicFlow2Texture
  );
  const program = makeProgramFromShaderMaterial(context, material);
  const uniforms = {
    // vertices
    localToWorld: new Matrix4(),
    worldToView: makeMatrix4Translation(new Vector3(0, 0, -1.0)),
    viewToScreen: makeMatrix4PerspectiveFov(
      35,
      0.1,
      4.0,
      1.0,
      canvasFramebuffer.aspectRatio
    ),

    // lights
    pointLightViewPosition: new Vector3(0.0, 0, 0.0),
    pointLightIntensity: new Color3(1, 1, 1).multiplyByScalar(0.7),
    pointLightRange: 12.0,

    // materials
    specularAnisotropicScale: 1.0,
    specularAnisotropicFlowMap: anisotropicFlow1Map
  };
  const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);
  canvasFramebuffer.depthTestState = new DepthTestState(
    true,
    DepthTestFunc.Less
  );
  canvasFramebuffer.clearState = new ClearState(new Vector3(0, 0, 0), 1.0);
  canvasFramebuffer.cullingState = new CullingState(true);

  function animate(): void {
    const now = Date.now();

    uniforms.localToWorld = makeMatrix4RotationFromEuler(
      new Euler3(-0.3 * Math.PI, 0, now * 0.0006, EulerOrder3.YXZ),
      uniforms.localToWorld
    );
    uniforms.specularAnisotropicFlowMap =
      Math.floor(now / 5000) % 2 === 0
        ? anisotropicFlow1Map
        : anisotropicFlow2Map;

    canvasFramebuffer.clear(BufferBit.All);
    renderBufferGeometry(canvasFramebuffer, program, uniforms, bufferGeometry);

    requestAnimationFrame(animate);
  }

  animate();

  return null;
}

init();
