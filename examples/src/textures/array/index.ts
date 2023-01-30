import {
  createSolidColorImageData,
  makeBufferGeometryFromGeometry,
  makeProgramFromShaderMaterial,
  makeTexImage2DFromTexture,
  planeGeometry,
  renderBufferGeometry,
  RenderingContext,
  ShaderMaterial,
  TexImage2D,
  Texture
} from '@threeify/core';
import { Color4 } from '@threeify/vector-math';

import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

async function init(): Promise<void> {
  const geometry = planeGeometry(1, 1, 1, 1);
  const material = new ShaderMaterial(vertexSource, fragmentSource);
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
    texImage2DArray.push(makeTexImage2DFromTexture(context, texture));
  });
  const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);
  const program = makeProgramFromShaderMaterial(context, material);
  const uniforms = { maps: texImage2DArray };

  renderBufferGeometry({
    framebuffer: canvasFramebuffer,
    program,
    uniforms,
    bufferGeometry
  });
}

init();
