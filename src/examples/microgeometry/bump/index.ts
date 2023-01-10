import {
  boxGeometry,
  BufferBit,
  ClearState,
  Color3,
  CullingState,
  DepthTestFunc,
  DepthTestState,
  Euler3,
  EulerOrder3,
  fetchImage,
  makeBufferGeometryFromGeometry,
  makeMat4PerspectiveFov,
  makeMat4RotationFromEuler,
  translation3ToMat4,
  makeProgramFromShaderMaterial,
  makeTexImage2DFromTexture,
  Mat4,
  renderBufferGeometry,
  RenderingContext,
  ShaderMaterial,
  Texture,
  Vec3
} from '../../../lib/index.js';
import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

async function init(): Promise<null> {
  const geometry = boxGeometry(0.75, 0.75, 0.75);
  const material = new ShaderMaterial(vertexSource, fragmentSource);
  const albedoTexture = new Texture(
    await fetchImage('/assets/textures/bricks/albedo.jpg')
  );
  const bumpTexture = new Texture(
    await fetchImage('/assets/textures/bricks/bump.jpg')
  );
  const specularRoughnessTexture = new Texture(
    await fetchImage('/assets/textures/bricks/roughness.jpg')
  );

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
    pointLightViewPosition: new Vec3(2, 0, 3),
    pointLightIntensity: new Color3(1, 1, 1).multiplyByScalar(10),
    pointLightRange: 12,

    // materials
    albedoMap: makeTexImage2DFromTexture(context, albedoTexture),
    bumpMap: makeTexImage2DFromTexture(context, bumpTexture),
    specularRoughnessMap: makeTexImage2DFromTexture(
      context,
      specularRoughnessTexture
    )
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
    uniforms.pointLightViewPosition = new Vec3(
      Math.cos(now * 0.001) * 3,
      Math.cos(now * 0.002) * 2,
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
