import {
  BufferBit,
  ClearState,
  CullingState,
  DepthTestFunc,
  DepthTestState,
  Euler3,
  EulerOrder3,
  fetchOBJ,
  makeBufferGeometryFromGeometry,
  makeMatrix4Concatenation,
  makeMatrix4PerspectiveFov,
  makeMatrix4RotationFromEuler,
  makeMatrix4Scale,
  makeMatrix4Translation,
  makeProgramFromShaderMaterial,
  Matrix4,
  renderBufferGeometry,
  RenderingContext,
  ShaderMaterial,
  transformGeometry,
  Vector3
} from '../../../lib/index';
import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

async function init(): Promise<null> {
  const geometry = (await fetchOBJ('/assets/models/cloth/cloth.obj'))[0];
  transformGeometry(
    geometry,
    makeMatrix4Concatenation(
      makeMatrix4Translation(new Vector3(0, -0.5, 0)),
      makeMatrix4Scale(new Vector3(10, 10, 10))
    )
  );
  const material = new ShaderMaterial(vertexSource, fragmentSource);

  const context = new RenderingContext(
    document.getElementById('framebuffer') as HTMLCanvasElement
  );
  const { canvasFramebuffer } = context;
  window.addEventListener('resize', () => canvasFramebuffer.resize());

  const program = makeProgramFromShaderMaterial(context, material);
  const uniforms = {
    // vertices
    localToWorld: new Matrix4(),
    worldToView: makeMatrix4Translation(new Vector3(0, 0, -2.0)),
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
    pointLightRange: 6.0,

    // materials
    sheenIntensity: 1.0,
    sheenColor: new Vector3(0.3, 0.3, 1.0),
    sheenRoughness: 0.5
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
      new Euler3(0.15 * Math.PI, now * 0.0002, 0, EulerOrder3.XZY),
      uniforms.localToWorld
    );
    uniforms.sheenRoughness = Math.cos(now * 0.0003) * 0.5 + 0.5;
    uniforms.pointLightViewPosition = new Vector3(
      Math.cos(now * 0.001) * 3.0,
      2.0,
      0.5
    );

    canvasFramebuffer.clear(BufferBit.All);
    renderBufferGeometry(canvasFramebuffer, program, uniforms, bufferGeometry);

    requestAnimationFrame(animate);
  }

  animate();

  return null;
}

init();
