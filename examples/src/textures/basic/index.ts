import {
  createRenderingContext,
  fetchImage,
  geometryToBufferGeometry,
  planeGeometry,
  renderBufferGeometry,
  shaderSourceToProgram,
  Texture,
  textureToTexImage2D
} from '@threeify/core';

import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

async function init(): Promise<void> {
  const geometry = planeGeometry(1, 1, 1, 1);
  const texture = new Texture(
    await fetchImage('/assets/textures/uv_grid_opengl.jpg')
  );

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
  const texImage2D = textureToTexImage2D(context, texture);

  const uniforms = { map: texImage2D };

  renderBufferGeometry({
    framebuffer: canvasFramebuffer,
    program,
    uniforms,
    bufferGeometry
  });
}

init();
