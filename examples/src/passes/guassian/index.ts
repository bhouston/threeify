import {
  Attachment,
  createCopyPass,
  createGaussianBlur,
  createToneMapper,
  DataType,
  fetchHDR,
  Framebuffer,
  InternalFormat,
  makeColorAttachment,
  passGeometry,
  PixelFormat,
  RenderingContext,
  ShaderMaterial,
  TexImage2D,
  Texture,
  TextureEncoding,
  TextureFilter,
  textureToTexImage2D
} from '@threeify/core';

import { getThreeJSHDRIUrl, ThreeJSHRDI } from '../../utilities/threejsHDRIs';
import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

let blurRadius = 4.5;

let lodLevel = 0;

document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowUp':
      blurRadius = Math.min(blurRadius + 0.25, 128.5);
      break;
    case 'ArrowDown':
      blurRadius = Math.max(blurRadius - 0.25, 0.5);
      break;
    case 'ArrowLeft':
      lodLevel = Math.min(lodLevel + 1, 8);
      break;
    case 'ArrowRight':
      lodLevel = Math.max(lodLevel - 1, 0);
      break;
  }

  console.log('blurRadius', blurRadius);
  console.log('lodLevel', lodLevel);
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

  const copyPass = await createCopyPass(context);
  const gaussianBlur = await createGaussianBlur(context);
  const toneMapper = await createToneMapper(context);

  copyPass.exec({
    sourceTexImage2D: rgbeTexImage2D,
    sourceEncoding: TextureEncoding.RGBE,
    targetTexImage2D: hdrTexImage2D,
    targetEncoding: TextureEncoding.Linear
  });

  rgbeTexImage2D.dispose();

  hdrTexImage2D.generateMipmaps();

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

  function animate(): void {
    requestAnimationFrame(animate);

    gaussianBlur.exec({
      sourceTexImage2D: hdrTexImage2D,
      sourceLod: lodLevel,
      standardDeviationInTexels: blurRadius,
      tempTexImage2D: hFramebuffer.getAttachment(
        Attachment.Color0
      ) as TexImage2D,
      targetFramebuffer: vFramebuffer,
      targetAlpha: 1
    });

    toneMapper.exec({
      sourceTexImage2D: vFramebuffer.getAttachment(
        Attachment.Color0
      ) as TexImage2D,
      exposure: 1,
      targetFramebuffer: canvasFramebuffer
    });
  }

  animate();
}

init();
