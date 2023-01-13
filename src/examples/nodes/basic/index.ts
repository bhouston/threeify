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
  Mesh,
  Node,
  renderBufferGeometry,
  RenderingContext,
  ShaderMaterial,
  Texture,
  translation3ToMat4,
  Vec3
} from '../../../lib/index.js';
import { SpotLight } from '../../../lib/scene/lights/SpotLight.js';
import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

async function init(): Promise<null> {
  const geometry = icosahedronGeometry(0.75, 5);
  const material = new ShaderMaterial(vertexSource, fragmentSource);
  const texture = new Texture(
    await fetchImage('/assets/textures/planets/jupiter_2k.jpg')
  );

  const context = new RenderingContext(
    document.getElementById('framebuffer') as HTMLCanvasElement
  );
  const { canvasFramebuffer } = context;
  window.addEventListener('resize', () => canvasFramebuffer.resize());

  const root = new Node({ name: 'root' });
  const sphereMesh = new Mesh({
    geometry: icosahedronGeometry(0.75, 5),
    material: {
      materialName: 'physical',
      albedo: new Color3(1, 1, 1),
      albedoMap: texture
    }
  });
  root.children.push(sphereMesh);
  const spotLight = new SpotLight({
    color: new Color3(1, 1, 1),
    intensity: 40,
    range: 6,
    innerConeAngle: 0.5,
    outerConeAngle: 0.7,
    direction: new Vec3(1, 0, -0.5)
  });
  root.children.push(spotLight);

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
    pointLightViewPosition: new Vec3(1, 0, -0.5),
    pointLightIntensity: color3MultiplyByScalar(new Color3(1, 1, 1), 40),
    pointLightRange: 6,

    // materials
    albedoModulator: new Vec3(1, 1, 1),
    albedoMap: makeTexImage2DFromTexture(context, texture)
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
    uniforms.viewToScreen = mat4PerspectiveFov(
      25,
      0.1,
      4,
      1,
      canvasFramebuffer.aspectRatio
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
