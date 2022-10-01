import {
  Blending,
  blendModeToBlendState,
  BufferBit,
  ClearState,
  fetchImage,
  fetchImageElement,
  makeBufferGeometryFromGeometry,
  makeMatrix4Concatenation,
  makeMatrix4Scale,
  makeMatrix4Translation,
  makeProgramFromShaderMaterial,
  makeTexImage2DFromTexture,
  Matrix4,
  planeGeometry,
  renderBufferGeometry,
  RenderingContext,
  ShaderMaterial,
  Texture,
  Vector2,
  Vector3,
} from '../../../lib/index';
import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

async function init(): Promise<null> {
  const material = new ShaderMaterial(vertexSource, fragmentSource);
  const fgTexture = new Texture(
    await fetchImageElement('/assets/textures/alphaCompositing/fg.svg', new Vector2(1024, 1024)),
  );
  const fgSplatTexture = new Texture(await fetchImage('/assets/textures/decals/splat.png'));
  const bgTexture = new Texture(
    await fetchImageElement('/assets/textures/alphaCompositing/bg.svg', new Vector2(1024, 1024)),
  );

  const context = new RenderingContext(document.getElementById('framebuffer') as HTMLCanvasElement);
  const { canvasFramebuffer } = context;
  window.addEventListener('resize', () => canvasFramebuffer.resize());

  const fgMap = makeTexImage2DFromTexture(context, fgTexture);
  const fgSplatMap = makeTexImage2DFromTexture(context, fgSplatTexture);
  const bgMap = makeTexImage2DFromTexture(context, bgTexture);

  const program = makeProgramFromShaderMaterial(context, material);
  const bgUniforms = {
    localToWorld: new Matrix4(),
    premultipliedAlpha: 0,
    alpha: 1,
    map: bgMap,
  };
  const fgUniforms = {
    localToWorld: new Matrix4(),
    premultipliedAlpha: 0,
    alpha: 1,
    map: fgMap,
  };

  const geometry = planeGeometry(1, 1, 1, 1);
  const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);

  const blendings = [Blending.Over, Blending.Add, Blending.Subtract, Blending.Multiply];
  const premultipliedAlphas = [false, true];
  const fgMaps = [fgMap, fgSplatMap];

  const blackClearState = new ClearState(new Vector3(0, 0, 0), 1.0);
  const whiteClearState = new ClearState(new Vector3(1, 1, 1), 1.0);

  function animate(): void {
    const time = Date.now();

    if (Math.floor((time * 0.0005) / Math.PI) % 2 === 0) {
      canvasFramebuffer.clearState = blackClearState;
    } else {
      canvasFramebuffer.clearState = whiteClearState;
    }
    canvasFramebuffer.clear(BufferBit.All);

    premultipliedAlphas.forEach((premultipliedAlpha, pIndex) => {
      fgMaps.forEach((fgMap, mIndex) => {
        blendings.forEach((blending, bIndex) => {
          let localToWorld = makeMatrix4Translation(new Vector3(-0.5 + bIndex / 4, (pIndex + mIndex * 2) / 4, 0));
          localToWorld = makeMatrix4Concatenation(localToWorld, makeMatrix4Scale(new Vector3(0.25, 0.25, 0)));

          bgUniforms.localToWorld = localToWorld;
          bgUniforms.premultipliedAlpha = premultipliedAlpha ? 1 : 0;
          canvasFramebuffer.blendState = blendModeToBlendState(Blending.Over, premultipliedAlpha);
          renderBufferGeometry(canvasFramebuffer, program, bgUniforms, bufferGeometry);

          fgUniforms.localToWorld = localToWorld;
          fgUniforms.premultipliedAlpha = premultipliedAlpha ? 1 : 0;
          fgUniforms.alpha = Math.cos(time * 0.001) * 0.5 + 0.5;
          fgUniforms.map = fgMap;
          canvasFramebuffer.blendState = blendModeToBlendState(blending, premultipliedAlpha);
          renderBufferGeometry(canvasFramebuffer, program, fgUniforms, bufferGeometry);
        });
      });
    });

    requestAnimationFrame(animate);
  }

  animate();

  return null;
}

init();
