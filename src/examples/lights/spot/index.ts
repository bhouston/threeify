import {
  BufferBit,
  ClearState,
  CullingState,
  DepthTestFunc,
  DepthTestState,
  fetchImage,
  makeBufferGeometryFromGeometry,
  makeMat4PerspectiveFov,
  translation3ToMat4,
  makeProgramFromShaderMaterial,
  makeTexImage2DFromTexture,
  Mat4,
  planeGeometry,
  renderBufferGeometry,
  RenderingContext,
  ShaderMaterial,
  Texture,
  Vec3
} from '../../../lib/index.js';
import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

async function init(): Promise<null> {
  const geometry = planeGeometry(3, 3);
  const material = new ShaderMaterial(vertexSource, fragmentSource);
  const texture = new Texture(
    await fetchImage('/assets/textures/uv_grid_opengl.jpg')
  );

  const context = new RenderingContext(
    document.getElementById('framebuffer') as HTMLCanvasElement
  );
  const { canvasFramebuffer } = context;
  window.addEventListener('resize', () => canvasFramebuffer.resize());

  const map = makeTexImage2DFromTexture(context, texture);
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
    spotLightViewPosition: new Vec3(0, 0, 0),
    spotLightViewDirection: new Vec3(0, 0, -1),
    spotLightColor: new Vec3(1, 1, 1).multiplyByScalar(10),
    spotLightRange: 15,
    spotLightInnerCos: 1,
    spotLightOuterCos: Math.cos(Math.PI * 0.5),

    // materials
    albedoMap: map
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

    /* uniforms.localToWorld = makeMat4RotationFromEuler(
      new Euler3(0.15 * Math.PI, now * 0.0002, 0, EulerOrder3.XZY),
      uniforms.localToWorld,
    ); */
    uniforms.spotLightInnerCos = Math.cos(
      Math.PI * 0.05 * Math.cos(now * 0.0023)
    );
    uniforms.spotLightOuterCos =
      uniforms.spotLightInnerCos *
      Math.cos(Math.PI * 0.05 * Math.cos(now * 0.0017));
    uniforms.spotLightViewPosition = new Vec3(
      Math.cos(now * 0.001) * 0.5,
      Math.cos(now * 0.00087) * 0.5,
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
