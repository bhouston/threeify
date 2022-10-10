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
  icosahedronGeometry,
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
} from '../../../lib/index.js';
import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

async function init(): Promise<null> {
  const geometry = icosahedronGeometry(0.75, 5);
  const material = new ShaderMaterial(vertexSource, fragmentSource);
  const texture = new Texture(
    await fetchImage('/assets/textures/planets/moon_2k.jpg')
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
    localToWorld: new Matrix4(),
    worldToView: makeMatrix4Translation(new Vector3(0, 0, -3)),
    viewToScreen: makeMatrix4PerspectiveFov(
      25,
      0.1,
      4,
      1,
      canvasFramebuffer.aspectRatio
    ),

    // lights
    numPunctualLights: 3,
    punctualLightType: [0, 1, 2],
    punctualLightViewPosition: [
      new Vector3(-1, 0, 0),
      new Vector3(0, 0, 0),
      new Vector3()
    ],
    punctualLightViewDirection: [
      new Vector3(),
      new Vector3(0, 0, -1),
      new Vector3(0, -1, -1).normalize()
    ],
    punctualLightColor: [
      new Color3(60, 4, 4),
      new Color3(4, 30, 4),
      new Color3(0.1, 0.1, 1)
    ],
    punctualLightRange: [15, 15, 0],
    punctualLightInnerCos: [0, 0.95, 0],
    punctualLightOuterCos: [0, 0.9, 0],

    // materials
    albedoMap: map
  };

  const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);
  canvasFramebuffer.depthTestState = new DepthTestState(
    true,
    DepthTestFunc.Less
  );
  canvasFramebuffer.clearState = new ClearState(new Vector3(0, 0, 0), 1);
  canvasFramebuffer.cullingState = new CullingState(true);

  function animate(): void {
    const now = Date.now();

    uniforms.localToWorld = makeMatrix4RotationFromEuler(
      new Euler3(0.15 * Math.PI, now * 0.0002, 0, EulerOrder3.XZY),
      uniforms.localToWorld
    );
    uniforms.punctualLightViewDirection[2] = new Vector3(
      Math.cos(now * 0.001) * 0.5,
      Math.cos(now * 0.00087) * 0.5,
      Math.cos(now * 0.00045) * 0.5
    ).normalize();
    uniforms.punctualLightViewPosition[0] = new Vector3(
      Math.cos(now * 0.00097) * 5,
      Math.cos(now * 0.00082) * 5,
      1.5
    );
    uniforms.punctualLightInnerCos[1] = 1;
    uniforms.punctualLightOuterCos[1] = 0.97 + 0.025 * Math.cos(now * 0.0017);

    canvasFramebuffer.clear(BufferBit.All);
    renderBufferGeometry(canvasFramebuffer, program, uniforms, bufferGeometry);

    requestAnimationFrame(animate);
  }

  animate();

  return null;
}

init();
