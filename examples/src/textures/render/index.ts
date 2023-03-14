import {
  Attachment,
  Blending,
  blendModeToBlendState,
  boxGeometry,
  BufferBit,
  ClearState,
  DepthTestState,
  fetchImage,
  Framebuffer,
  geometryToBufferGeometry,
  makeColorAttachment,
  makeDepthAttachment,
  shaderMaterialToProgram,
  renderBufferGeometry,
  RenderingContext,
  ShaderMaterial,
  Texture,
  textureToTexImage2D
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
  const material = new ShaderMaterial('index', vertexSource, fragmentSource);
  const texture = new Texture(
    await fetchImage('/assets/textures/uv_grid_opengl.jpg')
  );

  const context = new RenderingContext(
    document.getElementById('framebuffer') as HTMLCanvasElement
  );
  const { canvasFramebuffer } = context;
  window.addEventListener('resize', () => canvasFramebuffer.resize());

  const framebufferSize = new Vec2(1024, 1024);
  const colorAttachment = makeColorAttachment(context, framebufferSize);
  const framebuffer = new Framebuffer(context);
  framebuffer.attach(Attachment.Color0, colorAttachment);
  framebuffer.attach(
    Attachment.Depth,
    makeDepthAttachment(context, framebufferSize)
  );

  const program = await shaderMaterialToProgram(context, material);
  const uvTestTexture = textureToTexImage2D(context, texture);

  const uniforms = {
    localToWorld: new Mat4(),
    worldToView: translation3ToMat4(new Vec3(0, 0, -1)),
    viewToClip: mat4OrthographicSimple(
      1.5,
      new Vec2(),
      0.1,
      4,
      1,
      canvasFramebuffer.aspectRatio
    ),
    viewLightPosition: new Vec3(0, 0, -2),
    map: uvTestTexture
  };
  const bufferGeometry = geometryToBufferGeometry(context, geometry);
  const whiteClearState = new ClearState(Color3.Black, 0);

  const depthTestState = new DepthTestState(false);
  const blendState = blendModeToBlendState(Blending.Over, true);

  function animate(): void {
    const now = Date.now();
    uniforms.localToWorld = euler3ToMat4(
      new Euler3(now * 0.001, now * 0.00033, now * 0.00077),
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

    uniforms.map = colorAttachment;
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
