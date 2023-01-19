import {
  Blending,
  blendModeToBlendState,
  fetchImageElement,
  makeBufferGeometryFromGeometry,
  makeProgramFromShaderMaterial,
  makeTexImage2DFromTexture,
  planeGeometry,
  renderBufferGeometry,
  RenderingContext,
  ShaderMaterial,
  Texture,
  Vec2
} from '@threeify/core';
import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

async function init(): Promise<null> {
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
  const material = new ShaderMaterial(vertexSource, fragmentSource);

  const context = new RenderingContext(
    document.getElementById('framebuffer') as HTMLCanvasElement
  );
  const { canvasFramebuffer } = context;
  window.addEventListener('resize', () => canvasFramebuffer.resize());

  context.blendState = blendModeToBlendState(Blending.Over, true);

  const program = makeProgramFromShaderMaterial(context, material);
  const bgUniforms = { map: makeTexImage2DFromTexture(context, bgTexture) };
  const fgUniforms = { map: makeTexImage2DFromTexture(context, fgTexture) };

  const geometry = planeGeometry(1, 1, 1, 1);
  const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);

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

  return null;
}

init();
