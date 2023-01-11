import {
  BufferBit,
  ClearState,
  Color3,
  CullingState,
  DepthTestFunc,
  DepthTestState,
  Euler3,
  euler3ToMat4,
  EulerOrder3,
  fetchImage,
  makeBufferGeometryFromGeometry,
  makeProgramFromShaderMaterial,
  makeTexImage2DFromTexture,
  Mat4,
  mat4PerspectiveFov,
  planeGeometry,
  renderBufferGeometry,
  RenderingContext,
  ShaderMaterial,
  Texture,
  translation3ToMat4,
  Vec2,
  Vec3
} from '../../../lib/index.js';
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
    localToWorld: new Mat4(),
    worldToView: translation3ToMat4(new Vec3(0, 0, -3)),
    viewToScreen: mat4PerspectiveFov(
      25,
      0.1,
      4,
      1,
      canvasFramebuffer.aspectRatio
    ),

    // lights
    pointLightViewPosition: new Vec3(0, 0, 0),
    pointLightIntensity: color3MultiplyByScalar(new Color3(1, 1, 1), 30),
    pointLightRange: 12,

    // materials
    normalModulator: new Vec2(-1, 1),
    normalMap: normalsMap
  };
  const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);
  canvasFramebuffer.depthTestState = new DepthTestState(
    true,
    DepthTestFunc.Less
  );
  canvasFramebuffer.clearState = new ClearState(new Color3(0, 0, 0), 1);
  canvasFramebuffer.cullingState = new CullingState(true);

  function animate(): void {
    const now = Date.now();

    uniforms.localToWorld = euler3ToMat4(
      new Euler3(0, 0, now * 0.0002, EulerOrder3.XZY),
      uniforms.localToWorld
    );
    // Q: Why is this one -1 required?  Is the tangent space from UV calculation incorrect?
    uniforms.normalModulator = new Vec2(-1, 1).multiplyByScalar(
      Math.cos(now * 0.001) * 0.5 + 0.5
    );
    uniforms.pointLightViewPosition = new Vec3(
      Math.cos(now * 0.001) * 3,
      Math.sin(now * 0.003) * 3,
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
