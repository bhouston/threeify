import {
  BufferBit,
  ClearState,
  Color3,
  CullingState,
  DepthTestFunc,
  DepthTestState,
  Euler3,
  EulerOrder3,
  fetchOBJ,
  makeBufferGeometryFromGeometry,
  mat4Multiply,
  makeMat4PerspectiveFov,
  makeMat4RotationFromEuler,
  scale3ToMat4,
  translation3ToMat4,
  makeProgramFromShaderMaterial,
  Mat4,
  renderBufferGeometry,
  RenderingContext,
  ShaderMaterial,
  transformGeometry,
  Vec3
} from '../../../lib/index.js';
import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

async function init(): Promise<null> {
  const [geometry] = await fetchOBJ('/assets/models/cloth/cloth.obj');
  transformGeometry(
    geometry,
    mat4Multiply(
      translation3ToMat4(new Vec3(0, -0.5, 0)),
      scale3ToMat4(new Vec3(10, 10, 10))
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
    localToWorld: new Mat4(),
    worldToView: translation3ToMat4(new Vec3(0, 0, -2)),
    viewToScreen: makeMat4PerspectiveFov(
      25,
      0.1,
      4,
      1,
      canvasFramebuffer.aspectRatio
    ),

    // lights
    pointLightViewPosition: new Vec3(0, 0, 0),
    pointLightIntensity: new Color3(1, 1, 1).multiplyByScalar(30),
    pointLightRange: 6,

    // materials
    sheenIntensity: 1,
    sheenColor: new Color3(0.3, 0.3, 1),
    sheenRoughness: 0.5
  };
  const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);
  canvasFramebuffer.depthTestState = new DepthTestState(
    true,
    DepthTestFunc.Less
  );
  canvasFramebuffer.clearState = new ClearState(new Vec3(0, 0, 0), 1);
  canvasFramebuffer.cullingState = new CullingState(true);

  function animate(): void {
    const now = Date.now();

    uniforms.localToWorld = makeMat4RotationFromEuler(
      new Euler3(0.15 * Math.PI, now * 0.0002, 0, EulerOrder3.XZY),
      uniforms.localToWorld
    );
    uniforms.sheenRoughness = Math.cos(now * 0.0003) * 0.5 + 0.5;
    uniforms.pointLightViewPosition = new Vec3(
      Math.cos(now * 0.001) * 3,
      2,
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
