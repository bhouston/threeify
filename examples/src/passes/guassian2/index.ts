import {
  Attachment,
  BufferBit,
  CopyPass,
  DataType,
  fetchHDR,
  Framebuffer,
  InternalFormat,
  makeBufferGeometryFromGeometry,
  makeColorAttachment,
  makeProgramFromShaderMaterial,
  passGeometry,
  PixelFormat,
  renderBufferGeometry,
  RenderingContext,
  ShaderMaterial,
  TexImage2D,
  Texture,
  TextureEncoding,
  TextureFilter,
  textureToTexImage2D,
  ToneMappingPass
} from '@threeify/core';
import { Vec2 } from '@threeify/math';

import { getThreeJSHDRIUrl, ThreeJSHRDI } from '../../utilities/threejsHDRIs';
import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

let blurRadius = 4.5;

document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowUp':
      blurRadius = Math.min(blurRadius + 0.25, 128.5);
      break;
    case 'ArrowDown':
      blurRadius = Math.max(blurRadius - 0.25, 0.5);
      break;
  }

  console.log('blurRadius', blurRadius);
});

async function init(): Promise<void> {
  const geometry = passGeometry();
  const passMaterial = new ShaderMaterial(
    'index',
    vertexSource,
    fragmentSource
  );

  const context = new RenderingContext(
    document.getElementById('framebuffer') as HTMLCanvasElement
  );

  const hdrPromise = fetchHDR(
    getThreeJSHDRIUrl(ThreeJSHRDI.royal_esplanade_1k)
  );
  const latLongTexturePromise = hdrPromise.then((hdr) => {
    return new Texture(hdr);
  });

  const { canvasFramebuffer } = context;
  window.addEventListener('resize', () => canvasFramebuffer.resize());

  const texture = await latLongTexturePromise;
  const rgbeTexImage2D = textureToTexImage2D(context, texture);
  const hdrTexImage2D = new TexImage2D(
    context,
    [rgbeTexImage2D.size],
    InternalFormat.RGBA16F,
    DataType.HalfFloat,
    PixelFormat.RGBA
  );

  const copyPass = new CopyPass(context);
  await copyPass.exec({
    sourceTexImage2D: rgbeTexImage2D,
    sourceEncoding: TextureEncoding.RGBE,
    targetTexImage2D: hdrTexImage2D,
    targetEncoding: TextureEncoding.Linear
  });

  rgbeTexImage2D.dispose();

  const passProgram = await makeProgramFromShaderMaterial(
    context,
    passMaterial
  );
  const passUniforms = {
    standardDeviation: blurRadius,
    textureMap: hdrTexImage2D,
    direction: new Vec2( 1, 0 )
  };
  const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);

    const hFramebuffer = new Framebuffer(context);
    hFramebuffer.attach(
      Attachment.Color0,
      makeColorAttachment(
        context,
        hdrTexImage2D.size,
        InternalFormat.RGBA16F,
        TextureFilter.Linear,
        TextureFilter.Linear
      )
    );

      const vFramebuffer = new Framebuffer(context);
      vFramebuffer.attach(
        Attachment.Color0,
        makeColorAttachment(
          context,
          hdrTexImage2D.size,
          InternalFormat.RGBA16F,
          TextureFilter.Linear,
          TextureFilter.Linear
        )
      );

      const toneMappingPass = new ToneMappingPass(context);

  function animate(): void {
    requestAnimationFrame(animate);

    passUniforms.standardDeviation = blurRadius;
    passUniforms.textureMap = hdrTexImage2D;
    passUniforms.direction = new Vec2(1, 0);

    renderBufferGeometry({
      framebuffer: hFramebuffer,
      program: passProgram,
      uniforms: passUniforms,
      bufferGeometry
    });
    
    passUniforms.textureMap = hFramebuffer.getAttachment(Attachment.Color0) as TexImage2D;
    passUniforms.direction = new Vec2(0, 1);

    renderBufferGeometry({
      framebuffer: vFramebuffer,
      program: passProgram,
      uniforms: passUniforms,
      bufferGeometry
    });

    toneMappingPass.exec({
      sourceTexImage2D: vFramebuffer.getAttachment(Attachment.Color0) as TexImage2D,
      exposure: 1,
      targetFramebuffer: canvasFramebuffer
    });
  }

  animate();
}

init();
