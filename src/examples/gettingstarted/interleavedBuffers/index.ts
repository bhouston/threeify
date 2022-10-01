import {
  convertToInterleavedGeometry,
  Geometry,
  makeBufferGeometryFromGeometry,
  makeFloat32Attribute,
  makeProgramFromShaderMaterial,
  makeUint8Attribute,
  renderBufferGeometry,
  RenderingContext,
  ShaderMaterial,
} from '../../../lib/index';
import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

let geometry = new Geometry();
geometry.attributes.position = makeFloat32Attribute([0, 0.5, 0.5, -0.5, -0.5, -0.5], 2);
geometry.attributes.color = makeUint8Attribute([255, 0, 0, 0, 255, 0, 0, 0, 255], 3, true);
geometry = convertToInterleavedGeometry(geometry);

const material = new ShaderMaterial(vertexSource, fragmentSource);

const context = new RenderingContext(document.getElementById('framebuffer') as HTMLCanvasElement);
const { canvasFramebuffer } = context;
window.addEventListener('resize', () => canvasFramebuffer.resize());

const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);
const program = makeProgramFromShaderMaterial(context, material);
const uniforms = {};

renderBufferGeometry(canvasFramebuffer, program, uniforms, bufferGeometry);
