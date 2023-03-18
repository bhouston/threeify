import {
  Attachment,
  ClearState,
  createRenderingContext,
  fetchOBJ,
  Framebuffer,
  geometryToBufferGeometry,
  InternalFormat,
  makeColorAttachment,
  makeDepthAttachment,
  renderBufferGeometry,
  shaderSourceToProgram,
  TexImage2D,
  TextureFilter,
  transformGeometry
} from '@threeify/core';
import {
  Color3,
  color3MultiplyByScalar,
  Euler3,
  euler3ToMat4,
  EulerOrder3,
  Mat4,
  mat4Inverse,
  mat4Multiply,
  mat4PerspectiveFov,
  scale3ToMat4,
  translation3ToMat4,
  Vec3
} from '@threeify/math';

import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

async function init(): Promise<void> {
  const [geometry] = await fetchOBJ('/assets/models/cloth/cloth.obj');
  transformGeometry(
    geometry,
    mat4Multiply(
      translation3ToMat4(new Vec3(0, -0.5, 0)),
      scale3ToMat4(new Vec3(10, 10, 10))
    )
  );

  const context = createRenderingContext(document, 'framebuffer');
  const { canvasFramebuffer } = context;
  window.addEventListener('resize', () => canvasFramebuffer.resize());

  const offscreenFramebuffer = new Framebuffer(context);
  offscreenFramebuffer.attach(
    Attachment.Color0,
    makeColorAttachment(
      context,
      canvasFramebuffer.size,
      InternalFormat.RGBA8,
      TextureFilter.Linear,
      TextureFilter.Linear
    )
  );
  offscreenFramebuffer.attach(
    Attachment.Depth,
    makeDepthAttachment(context, canvasFramebuffer.size)
  );

  const depthMap = offscreenFramebuffer.getAttachment(
    Attachment.Depth
  ) as TexImage2D;

  const program = await shaderSourceToProgram(
    context,
    'index',
    vertexSource,
    fragmentSource
  );
  const viewToClip = mat4PerspectiveFov(
    25,
    0.1,
    4,
    1,
    canvasFramebuffer.aspectRatio
  );
  const uniforms = {
    // vertices
    localToWorld: new Mat4(),
    worldToView: translation3ToMat4(new Vec3(0, 0, -2)),
    viewToClip,
    clipToView: mat4Inverse(viewToClip),
  };
  const bufferGeometry = geometryToBufferGeometry(context, geometry);

  function animate(): void {
    const now = Date.now();

    uniforms.localToWorld = euler3ToMat4(
      new Euler3(0.15 * Math.PI, now * 0.0002, 0, EulerOrder3.XZY),
      uniforms.localToWorld
    );

    // render to the depth buffer.
    offscreenFramebuffer.clear();
    renderBufferGeometry({
      framebuffer: canvasFramebuffer,
      program,
      uniforms: {
        mode: 0,
        ...uniforms
      },
      bufferGeometry
    });

    // access the depth buffer and compare it to the true position.
    // output the error as an hsl color.
    /*canvasFramebuffer.clear();
    renderBufferGeometry({
      framebuffer: canvasFramebuffer,
      program,
      uniforms: {
        mode: 2,
        depthMap: depthMap,
        ...uniforms
      },
      bufferGeometry
    });*/

    requestAnimationFrame(animate);
  }

  animate();
}

init();
