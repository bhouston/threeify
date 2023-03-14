import {
  createRenderingContext,
  createSolidColorImageData,
  geometryToBufferGeometry,
  planeGeometry,
  renderBufferGeometry,
  shaderSourceToProgram,
  TexImage2D,
  Texture,
  textureToTexImage2D
} from '@threeify/core';
import { Color4 } from '@threeify/math';

import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

async function init(): Promise<void> {
  const geometry = planeGeometry(1, 1, 1, 1);
  const colors = [
    new Color4(1, 0, 0, 1),
    new Color4(0, 1, 0, 1),
    new Color4(1, 1, 0, 1),
    new Color4(0, 0, 1, 1)
  ];
  const textures: Texture[] = [];
  colors.forEach((color) => {
    textures.push(new Texture(createSolidColorImageData(color, 1, 1, 'sRGB')));
  });
  const context = createRenderingContext(document, 'framebuffer');
  const { canvasFramebuffer } = context;
  window.addEventListener('resize', () => canvasFramebuffer.resize());

  const texImage2DArray: TexImage2D[] = [];
  textures.forEach((texture) => {
    texImage2DArray.push(textureToTexImage2D(context, texture));
  });
  const bufferGeometry = geometryToBufferGeometry(context, geometry);
  const program = await shaderSourceToProgram(
    context,
    'index',
    vertexSource,
    fragmentSource
  );
  const uniforms = { maps: texImage2DArray };

  renderBufferGeometry({
    framebuffer: canvasFramebuffer,
    program,
    uniforms,
    bufferGeometry
  });
}

init();
