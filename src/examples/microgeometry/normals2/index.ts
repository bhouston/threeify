import {
  BufferBit,
  ClearState,
  CullingState,
  DepthTestFunc,
  DepthTestState,
  Euler,
  EulerOrder,
  fetchImage,
  makeBufferGeometryFromGeometry,
  makeMatrix4PerspectiveFov,
  makeMatrix4RotationFromEuler,
  makeMatrix4Translation,
  makeProgramFromShaderMaterial,
  makeTexImage2DFromTexture,
  Matrix4,
  planeGeometry,
  renderBufferGeometry,
  RenderingContext,
  ShaderMaterial,
  Texture,
  Vector2,
  Vector3
} from '../../../lib/index';
import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

async function init(): Promise<null> {
  const geometry = planeGeometry(1.5, 1.5, 10, 10);
  const material = new ShaderMaterial(vertexSource, fragmentSource);
  // this is using the standard opengl normal map.
  const normalsTexture = new Texture(
    await fetchImage('/assets/textures/normalMap.png')
  );

  const context = new RenderingContext(
    document.getElementById('framebuffer') as HTMLCanvasElement
  );
  const { canvasFramebuffer } = context;
  window.addEventListener('resize', () => canvasFramebuffer.resize());

  const normalsMap = makeTexImage2DFromTexture(context, normalsTexture);
  const program = makeProgramFromShaderMaterial(context, material);
  const uniforms = {
    // vertices
    localToWorld: new Matrix4(),
    worldToView: makeMatrix4Translation(new Vector3(0, 0, -3.0)),
    viewToScreen: makeMatrix4PerspectiveFov(
      25,
      0.1,
      4.0,
      1.0,
      canvasFramebuffer.aspectRatio
    ),

    // lights
    pointLightViewPosition: new Vector3(0.0, 0, 0.0),
    pointLightIntensity: new Vector3(1, 1, 1).multiplyByScalar(30.0),
    pointLightRange: 12.0,

    // materials
    normalModulator: new Vector2(-1, 1),
    normalMap: normalsMap
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
      new Euler(0, 0, now * 0.0002, EulerOrder.XZY),
      uniforms.localToWorld
    );
    // Q: Why is this one -1 required?  Is the tangent space from UV calculation incorrect?
    uniforms.normalModulator = new Vector2(-1, 1).multiplyByScalar(
      Math.cos(now * 0.001) * 0.5 + 0.5
    );
    uniforms.pointLightViewPosition = new Vector3(
      Math.cos(now * 0.001) * 3.0,
      Math.sin(now * 0.003) * 3.0,
      1.5
    );

    canvasFramebuffer.clear(BufferBit.All);
    renderBufferGeometry(canvasFramebuffer, program, uniforms, bufferGeometry);

    requestAnimationFrame(animate);
  }

  animate();

  return null;
}

init();
