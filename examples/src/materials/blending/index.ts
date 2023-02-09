import {
  Blending,
  blendModeToBlendState,
  ClearState,
  fetchImage,
  fetchImageElement,
  makeBufferGeometryFromGeometry,
  makeProgramFromShaderMaterial,
  makeTexImage2DFromTexture,
  planeGeometry,
  renderBufferGeometry,
  RenderingContext,
  ShaderMaterial,
  Texture
} from '@threeify/core';
import {
  Color3,
  Mat4,
  mat4Multiply,
  scale3ToMat4,
  translation3ToMat4,
  Vec2,
  Vec3
} from '@threeify/vector-math';

import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

async function init(): Promise<void> {
  const material = new ShaderMaterial('index', vertexSource, fragmentSource);
  const fgTexture = new Texture(
    await fetchImageElement(
      '/assets/textures/alphaCompositing/fg.svg',
      new Vec2(1024, 1024)
    )
  );
  const fgSplatTexture = new Texture(
    await fetchImage('/assets/textures/decals/splat.png')
  );
  const bgTexture = new Texture(
    await fetchImageElement(
      '/assets/textures/alphaCompositing/bg.svg',
      new Vec2(1024, 1024)
    )
  );

  const context = new RenderingContext(
    document.getElementById('framebuffer') as HTMLCanvasElement
  );
  const { canvasFramebuffer } = context;
  window.addEventListener('resize', () => canvasFramebuffer.resize());

  const fgMap = makeTexImage2DFromTexture(context, fgTexture);
  const fgSplatMap = makeTexImage2DFromTexture(context, fgSplatTexture);
  const bgMap = makeTexImage2DFromTexture(context, bgTexture);

  const program = makeProgramFromShaderMaterial(context, material);
  const bgUniforms = {
    localToWorld: new Mat4(),
    premultipliedAlpha: 0,
    alpha: 1,
    map: bgMap
  };
  const fgUniforms = {
    localToWorld: new Mat4(),
    premultipliedAlpha: 0,
    alpha: 1,
    map: fgMap
  };

  const geometry = planeGeometry(1, 1, 1, 1);
  const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);

  const blendings = [
    Blending.Over,
    Blending.Add,
    Blending.Subtract,
    Blending.Multiply
  ];
  const premultipliedAlphas = [false, true];
  const fgMaps = [fgMap, fgSplatMap];

  const blackClearState = new ClearState(Color3.Black, 1);
  const whiteClearState = new ClearState(Color3.White, 1);

  function animate(): void {
    const time = Date.now();

    canvasFramebuffer.clearState =
      Math.floor((time * 0.0005) / Math.PI) % 2 === 0
        ? blackClearState
        : whiteClearState;
    canvasFramebuffer.clear();

    premultipliedAlphas.forEach((premultipliedAlpha, pIndex) => {
      fgMaps.forEach((fgMap, mIndex) => {
        blendings.forEach((blending, bIndex) => {
          let localToWorld = translation3ToMat4(
            new Vec3(-0.5 + bIndex / 4, (pIndex + mIndex * 2) / 4, 0)
          );
          localToWorld = mat4Multiply(
            localToWorld,
            scale3ToMat4(new Vec3(0.25, 0.25, 0))
          );

          bgUniforms.localToWorld = localToWorld;
          bgUniforms.premultipliedAlpha = premultipliedAlpha ? 1 : 0;
          canvasFramebuffer.blendState = blendModeToBlendState(
            Blending.Over,
            premultipliedAlpha
          );
          renderBufferGeometry({
            framebuffer: canvasFramebuffer,
            program,
            uniforms: bgUniforms,
            bufferGeometry
          });

          fgUniforms.localToWorld = localToWorld;
          fgUniforms.premultipliedAlpha = premultipliedAlpha ? 1 : 0;
          fgUniforms.alpha = Math.cos(time * 0.001) * 0.5 + 0.5;
          fgUniforms.map = fgMap;
          canvasFramebuffer.blendState = blendModeToBlendState(
            blending,
            premultipliedAlpha
          );
          renderBufferGeometry({
            framebuffer: canvasFramebuffer,
            program,
            uniforms: fgUniforms,
            bufferGeometry
          });
        });
      });
    });

    requestAnimationFrame(animate);
  }

  animate();
}

init();
