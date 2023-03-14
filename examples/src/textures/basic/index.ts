import {
  createRenderingContext,
  fetchTexImage2D,
  geometryToBufferGeometry,
  planeGeometry,
  renderBufferGeometry,
  shaderSourceToProgram
} from '@threeify/core';

import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

async function init(): Promise<void> {
  const geometry = planeGeometry(1, 1, 1, 1);

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
  const texImage2D = await fetchTexImage2D(
    context,
    '/assets/textures/uv_grid_opengl.jpg'
  );

  const uniforms = { map: texImage2D };

  renderBufferGeometry({
    framebuffer: canvasFramebuffer,
    program,
    uniforms,
    bufferGeometry
  });
}

init();
