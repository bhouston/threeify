import {
  Attachment,
  boxGeometry,
  BufferBit,
  ClearState,
  Color3,
  DepthTestState,
  Euler3,
  euler3ToMat4,
  fetchImage,
  Framebuffer,
  makeBufferGeometryFromGeometry,
  makeColorAttachment,
  makeDepthAttachment,
  makeProgramFromShaderMaterial,
  makeTexImage2DFromTexture,
  Mat4,
  mat4OrthographicSimple,
  renderBufferGeometry,
  RenderingContext,
  ShaderMaterial,
  Texture,
  translation3ToMat4,
  Vec2,
  Vec3
} from '@threeify/core';
import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

async function init(): Promise<null> {
  const geometry = boxGeometry(0.75, 0.75, 0.75);
  const material = new ShaderMaterial(vertexSource, fragmentSource);
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
    viewLightPosition: new Vec3(0, 0, 0),
    map: uvTestTexture
  };
  const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);
  const whiteClearState = new ClearState(new Color3(1, 1, 1), 1);

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
      bufferGeometry
    });

    uniforms.map = colorAttachment;
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

  return null;
}

init();
