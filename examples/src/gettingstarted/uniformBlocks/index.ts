import {
  createRenderingContext,
  CullingState,
  DepthTestState,
  Geometry,
  geometryToBufferGeometry,
  makeFloat32Attribute,
  makeUint32Attribute,
  renderBufferGeometry,
  shaderSourceToProgram
} from '@threeify/core';
import { Color3, hslToColor3 } from '@threeify/math';
import { ColorHSL } from '@threeify/math/src/ColorHSL.js';

import fragmentSource from './fragment.glsl.js';
import vertexSource from './vertex.glsl.js';

async function init() {
  const geometry = new Geometry();
  geometry.attributes.position = makeFloat32Attribute(
    [0, 0.5, 0.5, -0.5, -0.5, -0.5],
    2
  );
  geometry.indices = makeUint32Attribute([0, 1, 2], 1);

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
  const materialUniformBlock = program.uniformBlocks['Material'];
  const materialUniformBuffer = materialUniformBlock.allocateUniformBuffer();
  const uniforms = { scale: 1 };
  const materialUniforms = { color: new Color3() };
  materialUniformBlock.setUniformsIntoBuffer(
    materialUniforms,
    materialUniformBuffer
  );

  context.depthTestState = DepthTestState.Less;
  context.cullingState = CullingState.None;

  function animate(): void {
    requestAnimationFrame(animate);

    uniforms.scale = 0.6 + 0.4 * Math.cos(Date.now() * 0.001);

    materialUniforms.color = hslToColor3(
      new ColorHSL(Date.now() * 0.001, 1, 0.5),
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
}

init();
