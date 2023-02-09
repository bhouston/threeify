import {
  Attachment,
  biltFramebuffers,
  Blending,
  blendModeToBlendState,
  BlendState,
  boxGeometry,
  BufferBit,
  ClearState,
  copyPass,
  CullingSide,
  CullingState,
  DepthTestState,
  fetchImage,
  Framebuffer,
  InternalFormat,
  makeBufferGeometryFromGeometry,
  makeColorAttachment,
  makeProgramFromShaderMaterial,
  makeTexImage2DFromTexture,
  Renderbuffer,
  renderBufferGeometry,
  RenderingContext,
  ShaderMaterial,
  Texture
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

import { GPUTimerPanel, Stats } from '../../utilities/Stats';
import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

const stats = new Stats();

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
  const gpuRender = new GPUTimerPanel(context);
  stats.addPanel(gpuRender);

  const colorInternalFormat = InternalFormat.RGBA16F;
  const framebufferSize = new Vec2(1024, 1024);
  const colorRenderbuffer = new Renderbuffer(
    context,
    4,
    colorInternalFormat,
    framebufferSize
  );
  const multisampleFramebuffer = new Framebuffer(context);
  multisampleFramebuffer.attach(Attachment.Color0, colorRenderbuffer);
  /* framebuffer.attachTexImage2D(
    Attachment.Depth,
    makeDepthAttachment(context, framebufferSize)
  );*/

  const colorAttachment = makeColorAttachment(
    context,
    framebufferSize,
    colorInternalFormat
  );
  const simpleFramebuffer = new Framebuffer(context);
  simpleFramebuffer.attach(Attachment.Color0, colorAttachment);

  const program = makeProgramFromShaderMaterial(context, material);
  const uvTestTexture = makeTexImage2DFromTexture(context, texture);

  const uniforms = {
    localToWorld: new Mat4(),
    worldToView: translation3ToMat4(new Vec3(0, 0, -1)),
    viewToScreen: mat4OrthographicSimple(
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
  const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);
  const whiteClearState = new ClearState(Color3.Black, 0);

  const depthTestState = new DepthTestState(false);
  const blendState = blendModeToBlendState(Blending.Over, true);

  const noBlending = BlendState.None;

  const normalCulling = new CullingState(true, CullingSide.Back);

  const noDepthTesting = new DepthTestState(false);

  function animate(): void {
    stats.time(() => {
      const now = Date.now();
      uniforms.localToWorld = euler3ToMat4(
        new Euler3(now * 0.001, now * 0.00033, now * 0.00077),
        uniforms.localToWorld
      );
      uniforms.map = uvTestTexture;

      multisampleFramebuffer.clear(BufferBit.All, whiteClearState);
      gpuRender.time(() => {
        renderBufferGeometry({
          framebuffer: multisampleFramebuffer,
          program,
          uniforms,
          bufferGeometry,
          depthTestState: noDepthTesting,
          blendState: noBlending
        });

        biltFramebuffers(multisampleFramebuffer, simpleFramebuffer);

        copyPass({
          sourceTexImage2D: colorAttachment,
          targetFramebuffer: canvasFramebuffer,
          depthTestState: noDepthTesting,
          blendState: noBlending
        });
      });

      requestAnimationFrame(animate);
    });
  }

  animate();
}

init();
