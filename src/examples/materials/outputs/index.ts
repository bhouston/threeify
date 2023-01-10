import {
  BufferBit,
  ClearState,
  Color3,
  CullingState,
  DepthTestFunc,
  DepthTestState,
  Euler3,
  EulerOrder3,
  fetchImage,
  fetchOBJ,
  makeBufferGeometryFromGeometry,
  mat4Multiply,
  makeMat4PerspectiveFov,
  makeMat4RotationFromEuler,
  scale3ToMat4,
  translation3ToMat4,
  makeProgramFromShaderMaterial,
  makeTexImage2DFromTexture,
  Mat4,
  OutputChannels,
  renderBufferGeometry,
  RenderingContext,
  ShaderMaterial,
  Texture,
  transformGeometry,
  Vec3,
  Vec2
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
    viewToScreen: makeMat4PerspectiveFov(
      25,
      0.1,
      4,
      1,
      canvasFramebuffer.aspectRatio
    ),

    // lights
    pointLightViewPosition: new Vec3(0, 0, 0),
    pointLightIntensity: new Color3(1, 1, 1).multiplyByScalar(40),
    pointLightRange: 12,

    // materials
    normalMap,
    normalScale: new Vec2(1, 1),
    displacementMap,
    displacementScale: 1,

    // shader output
    time: 0
  };
  const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);
  canvasFramebuffer.depthTestState = new DepthTestState(
    true,
    DepthTestFunc.Less
  );
  canvasFramebuffer.clearState = new ClearState(new Vec3(0, 0, 0), 1);
  canvasFramebuffer.cullingState = new CullingState(true);

  const fragmentOutputs = [
    OutputChannels.Depth,
    OutputChannels.DepthPacked,
    OutputChannels.Beauty,
    OutputChannels.Normal,
    OutputChannels.Albedo,
    OutputChannels.Diffuse,
    OutputChannels.Specular
  ];

  let lastNow = Date.now();
  let averageDelta = -1;

  function animate(): void {
    const now = Date.now();
    averageDelta =
      averageDelta < 0
        ? lastNow - now
        : averageDelta * 0.9 + (lastNow - now) * 0.1;
    lastNow = now;

    uniforms.time += averageDelta;
    uniforms.localToWorld = makeMat4RotationFromEuler(
      new Euler3(0.15 * Math.PI, now * 0.0002, 0, EulerOrder3.XZY),
      uniforms.localToWorld
    );

    const effectScale = Math.cos(now * 0.0008) * 0.5 + 0.5;
    uniforms.normalScale = new Vec2(-1, 1).multiplyByScalar(effectScale);
    uniforms.displacementScale = effectScale * 0.1;
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
