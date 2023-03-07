import {
  CopyPass,
  DataType,
  fetchHDR,
  InternalFormat,
  makeBufferGeometryFromGeometry,
  makeProgramFromShaderMaterial,
  passGeometry,
  PixelFormat,
  renderBufferGeometry,
  RenderingContext,
  ShaderMaterial,
  TexImage2D,
  Texture,
  TextureEncoding,
  textureToTexImage2D
} from '@threeify/core';

import { getThreeJSHDRIUrl, ThreeJSHRDI } from '../../utilities/threejsHDRIs';
import fragmentSource from './fragment.glsl';
import vertexSource from './vertex.glsl';

let blurRadius = 16;

document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowUp':
      blurRadius = Math.min(blurRadius * 2, 128);
      break;
    case 'ArrowDown':
      blurRadius = Math.max(blurRadius / 2, 1);
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

  hdrTexImage2D.generateMipmaps();
  rgbeTexImage2D.dispose();

  const passProgram = await makeProgramFromShaderMaterial(
    context,
    passMaterial
  );
  const passUniforms = {
    standardDeviation: blurRadius,
    texture: hdrTexImage2D
  };
  const bufferGeometry = makeBufferGeometryFromGeometry(context, geometry);

  function animate(): void {
    requestAnimationFrame(animate);

    passUniforms.standardDeviation = blurRadius;

    renderBufferGeometry({
      framebuffer: canvasFramebuffer,
      program: passProgram,
      uniforms: passUniforms,
      bufferGeometry
    });
  }

  animate();
}

init();
