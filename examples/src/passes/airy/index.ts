import {
  Attachment,
  CopyPass,
  DataType,
  fetchHDR,
  Framebuffer,
  InternalFormat,
  geometryToBufferGeometry,
  makeColorAttachment,
  shaderMaterialToProgram,
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
  ToneMapper
} from '@threeify/core';
import { Vec2 } from '@threeify/math';

import { getThreeJSHDRIUrl, ThreeJSHRDI } from '../../utilities/threejsHDRIs';
import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';
import toneMappingFragmentSource from './toneMapping/fragment.glsl';
import toneMappingVertexSource from './toneMapping/vertex.glsl';

let blurRadius = 2.5;

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

  event.preventDefault();
});

async function init(): Promise<void> {
  const geometry = passGeometry();
  const passMaterial = new ShaderMaterial(
    'index',
    vertexSource,
    fragmentSource
  );
  const toneMappingMaterial = new ShaderMaterial(
    'index',
    toneMappingVertexSource,
    toneMappingFragmentSource
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
   await copyPass.ready();

   copyPass.exec({
     sourceTexImage2D: rgbeTexImage2D,
     sourceEncoding: TextureEncoding.RGBE,
     targetTexImage2D: hdrTexImage2D,
     targetEncoding: TextureEncoding.Linear
   });

  rgbeTexImage2D.dispose();

  const passProgram = await shaderMaterialToProgram(
    context,
    passMaterial
  );
  const passUniforms = {
    standardDeviation: blurRadius,
    textureMap: hdrTexImage2D,
    direction: new Vec2(1, 0)
  };

  const toneMappingProgram = await shaderMaterialToProgram(
    context,
    toneMappingMaterial
  );

  // 0.01749417950271505 - ratio of primary airy disk to secondary airy disk at F.

  const toneMappingUniforms = {
    baseMap: hdrTexImage2D,
    baseScale: 1 - 0.025,
    overlapMap: null,
    overlapScale: 0.025,
    exposure: 1.0
  };

  const bufferGeometry = geometryToBufferGeometry(context, geometry);

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

  const toneMappingPass = new ToneMapper(context);

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

    passUniforms.textureMap = hFramebuffer.getAttachment(
      Attachment.Color0
    ) as TexImage2D;
    passUniforms.direction = new Vec2(0, 1);

    renderBufferGeometry({
      framebuffer: vFramebuffer,
      program: passProgram,
      uniforms: passUniforms,
      bufferGeometry
    });

    toneMappingUniforms.overlapMap = vFramebuffer.getAttachment(
      Attachment.Color0
    ) as TexImage2D;

    renderBufferGeometry({
      framebuffer: canvasFramebuffer,
      program: toneMappingProgram,
      uniforms: toneMappingUniforms,
      bufferGeometry
    });
  }

  animate();
}

init();
