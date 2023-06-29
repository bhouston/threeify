import {
  Blending,
  blendModeToBlendState,
  createRenderingContext,
  DepthTestState,
  fetchImageElement,
  geometryToBufferGeometry,
  planeGeometry,
  renderBufferGeometry,
  shaderSourceToProgram,
  Texture,
  textureToTexImage2D
} from '@threeify/core';
import { Vec2 } from '@threeify/math';

import fragmentSource from './fragment.glsl.js';
import vertexSource from './vertex.glsl.js';

async function init(): Promise<void> {
  const fgTexture = new Texture(
    await fetchImageElement(
      '/assets/textures/alphaCompositing/fg75.svg',
      new Vec2(1024, 1024)
    )
  );
  const bgTexture = new Texture(
    await fetchImageElement(
      '/assets/textures/alphaCompositing/bg.svg',
      new Vec2(1024, 1024)
    )
  );

  const context = createRenderingContext(document, 'framebuffer');
  const { canvasFramebuffer } = context;
  window.addEventListener('resize', () => canvasFramebuffer.resize());

  context.blendState = blendModeToBlendState(Blending.Over, true);

  const program = await shaderSourceToProgram(
    context,
    'index',
    vertexSource,
    fragmentSource
  );
  const bgUniforms = { map: textureToTexImage2D(context, bgTexture) };
  const fgUniforms = { map: textureToTexImage2D(context, fgTexture) };

  const geometry = planeGeometry(1, 1, 1, 1);
  const bufferGeometry = geometryToBufferGeometry(context, geometry);

  context.depthTestState = new DepthTestState(false);
  renderBufferGeometry({
    framebuffer: canvasFramebuffer,
    program,
    uniforms: bgUniforms,
    bufferGeometry
  });
  renderBufferGeometry({
    framebuffer: canvasFramebuffer,
    program,
    uniforms: fgUniforms,
    bufferGeometry
  });
}

init();
