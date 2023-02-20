import {
  BufferBit,
  ClearState,
  fetchImage,
  makeBufferGeometryFromGeometry,
  makeProgramFromShaderMaterial,
  textureToTexImage2D,
  makeTextureFromVideoElement,
  planeGeometry,
  renderBufferGeometry,
  RenderingContext,
  ShaderMaterial,
  TexImage2D,
  Texture
} from '@threeify/core';
import {
  Color3,
  makeVec2View,
  Mat4,
  mat4OrthographicSimple,
  translation3ToMat4,
  Vec2,
  Vec3
} from '@threeify/math';

import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

async function init(): Promise<void> {
  const geometry = planeGeometry(1, 0.5);
  const uv0 = geometry.attributes.uv0;
  if (uv0 !== undefined) {
    const uvView = makeVec2View(uv0.attributeData.arrayBuffer);
    const uv = new Vec2();
    for (let u = 0; u < uvView.count; u++) {
      uvView.get(u, uv);
      uv.y = 1 - uv.y;
      uvView.set(u, uv);
    }
  }
  const material = new ShaderMaterial('index', vertexSource, fragmentSource);
  const clickToPlayTexture = new Texture(
    await fetchImage('/assets/textures/videos/ClickToPlay.png')
  );

  const context = new RenderingContext(
    document.getElementById('framebuffer') as HTMLCanvasElement
  );
  const { canvasFramebuffer } = context;
  window.addEventListener('resize', () => canvasFramebuffer.resize());

  const program = makeProgramFromShaderMaterial(context, material);
  const clickToPlayMap = textureToTexImage2D(context, clickToPlayTexture);
  const uniforms = {
    localToWorld: new Mat4(),
    worldToView: translation3ToMat4(new Vec3(0, 0, -1)),
    viewToScreen: mat4OrthographicSimple(
      1.5,
      new Vec2(),
      0.1,
      2,
      1,
      canvasFramebuffer.aspectRatio
    ),
    viewLightPosition: Vec3.Zero,
    map: clickToPlayMap
  };

  const video = document.createElement('video');
  const source = document.createElement('source');
  source.type = 'video/mp4';
  source.src = '/assets/textures/videos/sintel.mp4';
  video.appendChild(source);

  let videoTexture: Texture | undefined;
  let videoMap: TexImage2D | undefined;

  const body = document.getElementsByTagName('body')[0];
  body.addEventListener(
    'click',
    async (): Promise<void> => {
      if (videoTexture === undefined) {
        await video.play();
        video.currentTime = 3; // jump ahead to content
        videoTexture = makeTextureFromVideoElement(video);
      }
    },
    false
  );

  const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);
  const whiteClearState = new ClearState(Color3.White, 1);

  function animate(): void {
    const now = Date.now();
    uniforms.localToWorld = translation3ToMat4(
      new Vec3(
        Math.cos(now * 0.00077) * 0.25,
        Math.sin(now * 0.001 + 0.4) * 0.25,
        0
      ),
      uniforms.localToWorld
    );
    if (
      videoTexture !== undefined &&
      video.readyState >= video.HAVE_CURRENT_DATA
    ) {
      if (videoMap === undefined) {
        videoMap = textureToTexImage2D(context, videoTexture);
        uniforms.map = videoMap;
      }
      videoMap.loadImages([video]);
    }
    canvasFramebuffer.clear(BufferBit.All, whiteClearState);
    renderBufferGeometry({
      framebuffer: canvasFramebuffer,
      program,
      uniforms,
      bufferGeometry
    });

    requestAnimationFrame(animate);
  }

  animate();
}

init();
