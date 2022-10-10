import {
  Color3,
  Geometry,
  makeBufferGeometryFromGeometry,
  makeColor3FromHSL,
  makeFloat32Attribute,
  makeProgramFromShaderMaterial,
  makeUint32Attribute,
  renderBufferGeometry,
  RenderingContext,
  ShaderMaterial
} from '../../../lib/index.js';
import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

const geometry = new Geometry();
geometry.attributes.position = makeFloat32Attribute(
  [0, 0.5, 0.5, -0.5, -0.5, -0.5],
  2
);
geometry.indices = makeUint32Attribute([0, 1, 2], 1);

const material = new ShaderMaterial(vertexSource, fragmentSource);

const context = new RenderingContext(
  document.getElementById('framebuffer') as HTMLCanvasElement
);
const { canvasFramebuffer } = context;
window.addEventListener('resize', () => canvasFramebuffer.resize());

const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);
const program = makeProgramFromShaderMaterial(context, material);
const uniforms = { scale: 1, color: new Color3() };

function animate(): void {
  requestAnimationFrame(animate);

  uniforms.scale = 0.6 + 0.4 * Math.cos(Date.now() * 0.001);
  uniforms.color = makeColor3FromHSL(
    Date.now() * 0.001,
    1,
    0.5,
    uniforms.color
  );

  renderBufferGeometry(canvasFramebuffer, program, uniforms, bufferGeometry);
}

animate();
