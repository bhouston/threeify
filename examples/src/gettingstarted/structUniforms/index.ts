import {
  CullingSide,
  CullingState,
  DepthTestFunc,
  DepthTestState,
  Geometry,
  makeBufferGeometryFromGeometry,
  makeFloat32Attribute,
  makeProgramFromShaderMaterial,
  makeUint32Attribute,
  renderBufferGeometry,
  RenderingContext,
  ShaderMaterial
} from '@threeify/core';
import { Color3, hslToColor3, Vec3 } from '@threeify/vector-math';

import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

const geometry = new Geometry();
geometry.attributes.position = makeFloat32Attribute(
  [0, 0.5, 0.5, -0.5, -0.5, -0.5],
  2
);
geometry.indices = makeUint32Attribute([0, 1, 2], 1);

const material = new ShaderMaterial('index', vertexSource, fragmentSource);

const context = new RenderingContext(
  document.getElementById('framebuffer') as HTMLCanvasElement
);
const { canvasFramebuffer } = context;
window.addEventListener('resize', () => canvasFramebuffer.resize());

const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);
const program = makeProgramFromShaderMaterial(context, material);
const uniforms = { scale: 1, color: new Color3() };
context.depthTestState = new DepthTestState(true, DepthTestFunc.Less);
context.cullingState = new CullingState(false, CullingSide.Back);

function animate(): void {
  requestAnimationFrame(animate);

  uniforms.scale = 0.6 + 0.4 * Math.cos(Date.now() * 0.001);
  uniforms.color = hslToColor3(
    new Vec3(Date.now() * 0.001, 1, 0.5),
    uniforms.color
  );

  renderBufferGeometry({
    framebuffer: canvasFramebuffer,
    program,
    uniforms,
    bufferGeometry
  });
}

animate();
