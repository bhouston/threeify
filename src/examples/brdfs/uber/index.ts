import {
  BufferBit,
  ClearState,
  Color3,
  color3MultiplyByScalar,
  CullingState,
  DepthTestFunc,
  DepthTestState,
  Euler3,
  euler3ToMat4,
  EulerOrder3,
  fetchImage,
  icosahedronGeometry,
  makeBufferGeometryFromGeometry,
  makeProgramFromShaderMaterial,
  makeTexImage2DFromTexture,
  Mat4,
  mat4PerspectiveFov,
  renderBufferGeometry,
  RenderingContext,
  ShaderMaterial,
  Texture,
  translation3ToMat4,
  Vec3
} from '../../../lib/index.js';
import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

async function init(): Promise<null> {
  const geometry = icosahedronGeometry(0.75, 5, true);
  const material = new ShaderMaterial(vertexSource, fragmentSource);
  const texture = new Texture(
    await fetchImage('/assets/textures/planets/jupiter_2k.jpg')
  );
  const scratchesTexture = new Texture(
    await fetchImage('/assets/textures/golfball/scratches.png')
  );
  const anisotropicFlow1Texture = new Texture(
    await fetchImage('/assets/textures/anisotropic/radialSmallOverlapping.jpg')
  );
  const normalTexture = new Texture(
    await fetchImage('/assets/textures/golfball/normals2.jpg')
  );

  const context = new RenderingContext(
    document.getElementById('framebuffer') as HTMLCanvasElement
  );
  const { canvasFramebuffer } = context;
  window.addEventListener('resize', () => canvasFramebuffer.resize());

  const albedoMap = makeTexImage2DFromTexture(context, texture);
  const clearCoatBumpMap = makeTexImage2DFromTexture(context, scratchesTexture);
  const specularAnisotropicFlowMap = makeTexImage2DFromTexture(
    context,
    anisotropicFlow1Texture
  );
  const normalMap = makeTexImage2DFromTexture(context, normalTexture);

  const specularRoughnessMap = clearCoatBumpMap;
  const displacementMap = clearCoatBumpMap;
  const clearCoatRoughnessMap = specularRoughnessMap;
  const sheenMap = specularAnisotropicFlowMap; // not a great choice.

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
    pointLightRange: 6,

    // materials
    featureFlags: 0xffff,

    albedoColor: new Color3(0.9, 0.9, 0.9),
    albedoMap,

    normalMap,

    displacementScale: 0.1,
    displacementMap,

    specularRoughnessFactor: 0.5,
    specularRoughnessMap,

    specularAnisotropicStrength: 0.5,
    specularAnisotropicFlowMap,

    sheenIntensity: 1,
    sheenColor: new Color3(0.3, 0.3, 1),
    sheenMap,

    clearCoatStrength: 0.5,
    clearCoatTint: new Color3(1, 1, 1),
    clearCoatBumpMap,

    clearCoatRoughnessFactor: 0.1,
    clearCoatRoughnessMap
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
      new Euler3(0.15 * Math.PI, now * 0.0002, 0, EulerOrder3.XZY),
      uniforms.localToWorld
    );
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
