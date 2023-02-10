import {
  fetchImage,
  makeBufferGeometryFromGeometry,
  makeProgramFromShaderMaterial,
  textureToTexImage2D,
  planeGeometry,
  renderBufferGeometry,
  RenderingContext,
  ShaderMaterial,
  Texture
} from '@threeify/core';

import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

async function init(): Promise<void> {
  const geometry = planeGeometry(1, 1, 1, 1);
  const material = new ShaderMaterial('index', vertexSource, fragmentSource);
  const texture = new Texture(
    await fetchImage('/assets/textures/uv_grid_opengl.jpg')
  );

  const context = new RenderingContext(
    document.getElementById('framebuffer') as HTMLCanvasElement
  );
  const { canvasFramebuffer } = context;
  window.addEventListener('resize', () => canvasFramebuffer.resize());

  const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);
  const program = makeProgramFromShaderMaterial(context, material);
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
