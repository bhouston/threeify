import {
  boxGeometry,
  BufferBit,
  ClearState,
  createRenderingContext,
  geometryToBufferGeometry,
  renderBufferGeometry,
  shaderSourceToProgram,
  Texture,
  textureToTexImage2D
} from '@threeify/core';
import {
  Color3,
  color3ToHexString,
  Euler3,
  euler3ToMat4,
  hslToColor3,
  Mat4,
  mat4OrthographicSimple,
  translation3ToMat4,
  Vec2,
  Vec3
} from '@threeify/math';

import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

function updateCanvas(
  ctx: CanvasRenderingContext2D | null,
  frameNumber: number
): void {
  if (ctx === null) {
    return;
  }
  const grd = ctx.createLinearGradient(0, 0, 256, frameNumber % 256);
  grd.addColorStop(
    0,
    `#${color3ToHexString(hslToColor3(new Vec3(frameNumber / 256, 0.5, 0.5)))}`
  );
  grd.addColorStop(
    1,
    `#${color3ToHexString(hslToColor3(new Vec3(frameNumber / 193, 0.5, 0.5)))}`
  );

  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, 256, 256);

  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';
  ctx.font = '30px Arial';
  ctx.fillText('Canvas Texture', 128, 100);
  ctx.fillText(`Frame #${frameNumber}`, 128, 156);
}
async function init(): Promise<void> {
  const geometry = boxGeometry(0.75, 0.75, 0.75);

  const context = createRenderingContext(document, 'framebuffer');
  const { canvasFramebuffer } = context;
  window.addEventListener('resize', () => canvasFramebuffer.resize());

  const program = await shaderSourceToProgram(
    context,
    'index',
    vertexSource,
    fragmentSource
  );

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  canvas.style.display = 'none';
  const ctx = canvas.getContext('2d');

  const texture = new Texture(canvas);
  const uvTestTexture = textureToTexImage2D(context, texture);

  const uniforms = {
    localToWorld: new Mat4(),
    worldToView: translation3ToMat4(new Vec3(0, 0, -1)),
    viewToClip: mat4OrthographicSimple(
      1.5,
      new Vec2(),
      0.1,
      2,
      1,
      canvasFramebuffer.aspectRatio
    ),
    viewLightPosition: Vec3.Zero,
    map: uvTestTexture
  };
  const bufferGeometry = geometryToBufferGeometry(context, geometry);

  const whiteClearState = new ClearState(Color3.White, 1);

  let frameNumber = 0;
  function animate(): void {
    frameNumber++;
    const now = Date.now();
    uniforms.localToWorld = euler3ToMat4(
      new Euler3(now * 0.001, now * 0.0033, now * 0.00077),
      uniforms.localToWorld
    );
    updateCanvas(ctx, frameNumber);
    uvTestTexture.loadImages([canvas]);
    uniforms.map = uvTestTexture;

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
