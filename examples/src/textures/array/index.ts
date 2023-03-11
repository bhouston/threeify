import {
  createSolidColorImageData,
  geometryToBufferGeometry,
  shaderMaterialToProgram,
  textureToTexImage2D,
  planeGeometry,
  renderBufferGeometry,
  RenderingContext,
  ShaderMaterial,
  TexImage2D,
  Texture
} from '@threeify/core';
import { Color4 } from '@threeify/math';

import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

async function init(): Promise<void> {
  const geometry = planeGeometry(1, 1, 1, 1);
  const material = new ShaderMaterial('index', vertexSource, fragmentSource);
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
  const context = new RenderingContext(
    document.getElementById('framebuffer') as HTMLCanvasElement
  );
  const { canvasFramebuffer } = context;
  window.addEventListener('resize', () => canvasFramebuffer.resize());

  const texImage2DArray: TexImage2D[] = [];
  textures.forEach((texture) => {
    texImage2DArray.push(textureToTexImage2D(context, texture));
  });
  const bufferGeometry = geometryToBufferGeometry(context, geometry);
  const program = await shaderMaterialToProgram(context, material);
  const uniforms = { maps: texImage2DArray };

  renderBufferGeometry({
    framebuffer: canvasFramebuffer,
    program,
    uniforms,
    bufferGeometry
  });
}

init();
