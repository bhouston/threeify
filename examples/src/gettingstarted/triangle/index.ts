import {
  CullingSide,
  CullingState,
  DepthTestFunc,
  DepthTestState,
  Geometry,
  geometryToBufferGeometry,
  makeFloat32Attribute,
  shaderMaterialToProgram,
  makeUint8Attribute,
  renderBufferGeometry,
  RenderingContext,
  ShaderMaterial
} from '@threeify/core';

import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

async function init() {
  const geometry = new Geometry();
  geometry.attributes.position = makeFloat32Attribute(
    [0, 0.5, 0.5, -0.5, -0.5, -0.5],
    2
  );
  geometry.attributes.color = makeUint8Attribute(
    [255, 0, 0, 0, 255, 0, 0, 0, 255],
    3,
    true
  );

  const material = new ShaderMaterial('index', vertexSource, fragmentSource);

  const context = new RenderingContext(
    document.getElementById('framebuffer') as HTMLCanvasElement
  );
  const { canvasFramebuffer } = context;
  window.addEventListener('resize', () => canvasFramebuffer.resize());

  const bufferGeometry = geometryToBufferGeometry(context, geometry);
  const program = await shaderMaterialToProgram(context, material);
  const uniforms = {};

  context.depthTestState = new DepthTestState(true, DepthTestFunc.Less);
  context.cullingState = new CullingState(false, CullingSide.Back);

  renderBufferGeometry({
    framebuffer: canvasFramebuffer,
    program,
    uniforms,
    bufferGeometry
  });
}

init();
