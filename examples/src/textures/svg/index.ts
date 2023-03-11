import {
  Blending,
  blendModeToBlendState,
  DepthTestState,
  fetchImageElement,
  geometryToBufferGeometry,
  shaderMaterialToProgram,
  textureToTexImage2D,
  planeGeometry,
  renderBufferGeometry,
  RenderingContext,
  ShaderMaterial,
  Texture
} from '@threeify/core';
import { Vec2 } from '@threeify/math';

import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

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
  const material = new ShaderMaterial('index', vertexSource, fragmentSource);

  const context = new RenderingContext(
    document.getElementById('framebuffer') as HTMLCanvasElement
  );
  const { canvasFramebuffer } = context;
  window.addEventListener('resize', () => canvasFramebuffer.resize());

  context.blendState = blendModeToBlendState(Blending.Over, true);

  const program = await shaderMaterialToProgram(context, material);
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
