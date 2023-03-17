import {
  convertToInterleavedGeometry,
  createRenderingContext,
  CullingState,
  DepthTestState,
  Geometry,
  geometryToBufferGeometry,
  makeFloat32Attribute,
  makeUint8Attribute,
  renderBufferGeometry,
  shaderSourceToProgram
} from '@threeify/core';

import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

async function init() {
  let geometry = new Geometry();
  geometry.attributes.position = makeFloat32Attribute(
    [0, 0.5, 0.5, -0.5, -0.5, -0.5],
    2
  );
  geometry.attributes.color = makeUint8Attribute(
    [255, 0, 0, 0, 255, 0, 0, 0, 255],
    3,
    true
  );
  geometry = convertToInterleavedGeometry(geometry);

  const context = createRenderingContext(document, 'framebuffer');
  const { canvasFramebuffer } = context;
  window.addEventListener('resize', () => canvasFramebuffer.resize());

  const bufferGeometry = geometryToBufferGeometry(context, geometry);
  const program = await shaderSourceToProgram(
    context,
    'index',
    vertexSource,
    fragmentSource
  );
  const uniforms = {};

  context.depthTestState = DepthTestState.Less;
  context.cullingState = CullingState.None;

  renderBufferGeometry({
    framebuffer: canvasFramebuffer,
    program,
    uniforms,
    bufferGeometry
  });
}

init();
