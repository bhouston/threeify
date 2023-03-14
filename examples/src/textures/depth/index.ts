import {
  Attachment,
  Blending,
  blendModeToBlendState,
  boxGeometry,
  BufferBit,
  ClearState,
  createRenderingContext,
  DepthTestFunc,
  DepthTestState,
  fetchTexImage2D,
  Framebuffer,
  geometryToBufferGeometry,
  makeDepthAttachment,
  renderBufferGeometry,
  shaderSourceToProgram
} from '@threeify/core';
import {
  Color3,
  Euler3,
  euler3ToMat4,
  Mat4,
  mat4OrthographicSimple,
  translation3ToMat4,
  Vec2,
  Vec3
} from '@threeify/math';

import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

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

  const uvTestTexture = await fetchTexImage2D(
    context,
    '/assets/textures/uv_grid_opengl.jpg'
  );
  const uniforms = {
    localToWorld: new Mat4(),
    worldToView: translation3ToMat4(new Vec3(0, 0, -2)),
    viewToClip: mat4OrthographicSimple(
      1.5,
      new Vec2(),
      0.1,
      5,
      1,
      canvasFramebuffer.aspectRatio
    ),
    viewLightPosition: new Vec3(0, 0, -2),
    map: uvTestTexture
  };
  const bufferGeometry = geometryToBufferGeometry(context, geometry);

  const whiteClearState = new ClearState(Color3.White, 1);

  const framebufferSize = new Vec2(1024, 1024);
  const depthAttachment = makeDepthAttachment(context, framebufferSize);
  const framebuffer = new Framebuffer(context);
  framebuffer.attach(Attachment.Depth, depthAttachment);

  const depthTestState = new DepthTestState(true, DepthTestFunc.LessOrEqual);
  const blendState = blendModeToBlendState(Blending.Over, true);

  function animate(): void {
    const now = Date.now();
    uniforms.localToWorld = euler3ToMat4(
      new Euler3(now * 0.001, now * 0.0033, now * 0.00077),
      uniforms.localToWorld
    );

    uniforms.map = uvTestTexture;
    framebuffer.clear(BufferBit.All, whiteClearState);
    renderBufferGeometry({
      framebuffer,
      program,
      uniforms,
      bufferGeometry,
      depthTestState,
      blendState
    });

    uniforms.map = depthAttachment;
    canvasFramebuffer.clear(BufferBit.All, whiteClearState);
    renderBufferGeometry({
      framebuffer: canvasFramebuffer,
      program,
      uniforms,
      bufferGeometry,
      depthTestState,
      blendState
    });

    requestAnimationFrame(animate);
  }

  animate();
}

init();
