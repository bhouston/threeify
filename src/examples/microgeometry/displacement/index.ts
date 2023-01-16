import {
  ClearState,
  Color3,
  color3MultiplyByScalar,
  CullingState,
  DepthTestState,
  Euler3,
  euler3ToMat4,
  EulerOrder3,
  fetchImage,
  fetchOBJ,
  makeBufferGeometryFromGeometry,
  makeProgramFromShaderMaterial,
  makeTexImage2DFromTexture,
  Mat4,
  mat4Multiply,
  mat4PerspectiveFov,
  renderBufferGeometry,
  RenderingContext,
  scale3ToMat4,
  ShaderMaterial,
  Texture,
  transformGeometry,
  translation3ToMat4,
  Vec2,
  vec2MultiplyByScalar,
  Vec3
} from '../../../lib/index.js';
import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

async function init(): Promise<null> {
  const [geometry] = await fetchOBJ('/assets/models/ninjaHead/ninjaHead.obj');
  transformGeometry(
    geometry,
    mat4Multiply(
      scale3ToMat4(new Vec3(0.06, 0.06, 0.06)),
      translation3ToMat4(new Vec3(0, -172, -4))
    )
  );
  const material = new ShaderMaterial(vertexSource, fragmentSource);
  const displacementTexture = new Texture(
    await fetchImage('/assets/models/ninjaHead/displacement.jpg')
  );
  const normalTexture = new Texture(
    await fetchImage('/assets/models/ninjaHead/normal.png')
  );

  const context = new RenderingContext(
    document.getElementById('framebuffer') as HTMLCanvasElement
  );
  const { canvasFramebuffer } = context;
  window.addEventListener('resize', () => canvasFramebuffer.resize());

  const displacementMap = makeTexImage2DFromTexture(
    context,
    displacementTexture
  );
  const normalMap = makeTexImage2DFromTexture(context, normalTexture);
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
    pointLightIntensity: color3MultiplyByScalar(new Color3(1, 1, 1), 40),
    pointLightRange: 12,

    // materials
    normalMap,
    normalScale: new Vec2(-1, 1),
    displacementMap,
    displacementScale: 1
  };

  const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);
  canvasFramebuffer.depthTestState = DepthTestState.Default;
  canvasFramebuffer.clearState = ClearState.Black;
  canvasFramebuffer.cullingState = new CullingState(true);

  function animate(): void {
    const now = Date.now();

    uniforms.localToWorld = euler3ToMat4(
      new Euler3(0.15 * Math.PI, now * 0.0002, 0, EulerOrder3.XZY),
      uniforms.localToWorld
    );

    const effectScale = Math.cos(now * 0.0008) * 0.5 + 0.5;
    uniforms.normalScale = vec2MultiplyByScalar(new Vec2(-1, 1), effectScale);
    uniforms.displacementScale = effectScale * 0.1;
    uniforms.pointLightViewPosition = new Vec3(
      Math.cos(now * 0.001) * 3,
      2,
      0.5
    );

    canvasFramebuffer.clear();
    renderBufferGeometry(canvasFramebuffer, program, uniforms, bufferGeometry);

    requestAnimationFrame(animate);
  }

  animate();

  return null;
}

init();
