import {
  Color3,
  CullingSide,
  CullingState,
  DepthTestFunc,
  DepthTestState,
  Geometry,
  hslToColor3,
  makeBufferGeometryFromGeometry,
  makeFloat32Attribute,
  makeProgramFromShaderMaterial,
  makeUint32Attribute,
  renderBufferGeometry,
  RenderingContext,
  ShaderMaterial,
  Vec3
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
const materialUniformBlock = program.uniformBlocks['Material'];
const materialUniformBuffer = materialUniformBlock.allocateUniformBuffer();
const uniforms = { scale: 1 };
const materialUniforms = { color: new Color3() };
materialUniformBlock.setUniformsIntoBuffer(
  materialUniforms,
  materialUniformBuffer
);

context.depthTestState = new DepthTestState(true, DepthTestFunc.Less);
context.cullingState = new CullingState(false, CullingSide.Back);

function animate(): void {
  requestAnimationFrame(animate);

  uniforms.scale = 0.6 + 0.4 * Math.cos(Date.now() * 0.001);

  materialUniforms.color = hslToColor3(
    new Vec3(Date.now() * 0.001, 1, 0.5),
    materialUniforms.color
  );
  materialUniformBlock.setUniformsIntoBuffer(
    materialUniforms,
    materialUniformBuffer
  );

  renderBufferGeometry({
    framebuffer: canvasFramebuffer,
    program,
    uniforms,
    uniformBuffers: { Material: materialUniformBuffer },
    bufferGeometry
  });
}

animate();
