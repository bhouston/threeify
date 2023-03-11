import {
  Attachment,
  biltFramebuffers,
  Blending,
  blendModeToBlendState,
  BlendState,
  boxGeometry,
  BufferBit,
  ClearState,
  CopyPass,
  CullingSide,
  CullingState,
  DepthTestFunc,
  DepthTestState,
  fetchImage,
  Framebuffer,
  InternalFormat,
  geometryToBufferGeometry,
  makeColorAttachment,
  shaderMaterialToProgram,
  Renderbuffer,
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
    document.getElementById('framebuffer') as HTMLCanvasElement,
    { antialias: false }
  );

  const { canvasFramebuffer } = context;
  canvasFramebuffer.devicePixelRatio = 1;
  window.addEventListener('resize', () => canvasFramebuffer.resize());
  canvasFramebuffer.resize();
  const gpuRender = new GPUTimerPanel(context);
  stats.addPanel(gpuRender);

  const colorInternalFormat = InternalFormat.RGBA16F;
  const framebufferSize = canvasFramebuffer.size;
  const msaaColorRenderbuffer = new Renderbuffer(
    context,
    4,
    colorInternalFormat,
    framebufferSize
  );
  const msaaDepthRenderbuffer = new Renderbuffer(
    context,
    4,
    InternalFormat.DepthComponent24,
    framebufferSize
  );
  const multisampleFramebuffer = new Framebuffer(context);

  multisampleFramebuffer.attach(Attachment.Color0, msaaColorRenderbuffer);
  multisampleFramebuffer.attach(Attachment.Depth, msaaDepthRenderbuffer);
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

  const program = await shaderMaterialToProgram(context, material);
  const uvTestTexture = textureToTexImage2D(context, texture);

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
  const bufferGeometry = geometryToBufferGeometry(context, geometry);
  const whiteClearState = new ClearState(Color3.Black, 0);

  const depthTestState = new DepthTestState(false);
  const blendState = blendModeToBlendState(Blending.Over, true);

  const normalDepthTesting = new DepthTestState(true, DepthTestFunc.Less, true);
  const noBlending = BlendState.None;

  const normalCulling = new CullingState(true, CullingSide.Back);
  const noCulling = new CullingState(false);

  const noDepthTesting = new DepthTestState(false);

  const copyPass = new CopyPass(context);

  function animate(): void {
    stats.time(() => {
      const now = Date.now();
      uniforms.localToWorld = euler3ToMat4(
        new Euler3(now * 0.0001, now * 0.000033, now * 0.000077),
        uniforms.localToWorld
      );
      uniforms.map = uvTestTexture;

      multisampleFramebuffer.clear(BufferBit.All, whiteClearState);
      gpuRender.time(async () => {
        renderBufferGeometry({
          framebuffer: multisampleFramebuffer,
          program,
          uniforms,
          bufferGeometry,
          depthTestState: normalDepthTesting,
          blendState: noBlending,
          cullingState: noCulling
        });

        biltFramebuffers(multisampleFramebuffer, simpleFramebuffer);

        await copyPass.exec({
          sourceTexImage2D: colorAttachment,
          targetFramebuffer: canvasFramebuffer
        });
      });
    });

    requestAnimationFrame(animate);
  }

  animate();
}

init();
