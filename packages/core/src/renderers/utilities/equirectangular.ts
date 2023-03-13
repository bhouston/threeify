import { Vec2 } from '@threeify/math';

import { ShaderMaterial } from '../../materials/ShaderMaterial';
import { cubeFaceTargets, CubeMapTexture } from '../../textures/CubeTexture';
import { Texture } from '../../textures/Texture';
import { createCopyPass } from '../effects/copy/CopyPass';
import { CullingState } from '../webgl/CullingState';
import { Attachment } from '../webgl/framebuffers/Attachment';
import { Framebuffer } from '../webgl/framebuffers/Framebuffer';
import { renderPass } from '../webgl/framebuffers/VirtualFramebuffer';
import { shaderMaterialToProgram } from '../webgl/programs/Program';
import { RenderingContext } from '../webgl/RenderingContext';
import {
  InternalFormat,
  internalFormatToDataType,
  internalFormatToPixelFormat
} from '../webgl/textures/InternalFormat';
import {
  TexImage2D,
  textureToTexImage2D as textureToTexImage2D
} from '../webgl/textures/TexImage2D';
import { TexParameters } from '../webgl/textures/TexParameters';
import { TextureFilter } from '../webgl/textures/TextureFilter';
import { TextureTarget } from '../webgl/textures/TextureTarget';
import { TextureWrap } from '../webgl/textures/TextureWrap';
import cubeFaceFragmentSource from './cubeFaces/fragment.glsl';
import cubeFaceVertexSource from './cubeFaces/vertex.glsl';
import { TextureEncoding } from './TextureEncoding';

export async function equirectangularTexImage2DToCubeMapTexImage2D(
  context: RenderingContext,
  latLongTexture: TexImage2D,
  faceWidth = 512,
  targetInternalFormat = InternalFormat.RGBA8,
  generateMipmaps = true
): Promise<TexImage2D> {
  const faceSize = new Vec2(faceWidth, faceWidth);
  const cubeTexture = new CubeMapTexture(
    [faceSize, faceSize, faceSize, faceSize, faceSize, faceSize],
    0,
    undefined,
    undefined,
    targetInternalFormat,
    internalFormatToDataType(targetInternalFormat)
  );
  cubeTexture.generateMipmaps = generateMipmaps;

  const cubeFaceMaterial = new ShaderMaterial(
    'latLongToCubeMap',
    cubeFaceVertexSource,
    cubeFaceFragmentSource
  );
  const cubeFaceProgram = await shaderMaterialToProgram(
    context,
    cubeFaceMaterial
  );
  const cubeMap = textureToTexImage2D(context, cubeTexture);

  const cubeFaceFramebuffer = new Framebuffer(context);
  const cubeFaceUniforms = {
    map: latLongTexture,
    faceIndex: 0
  };

  const cullingState = new CullingState(false);

  cubeFaceTargets.forEach((target, index) => {
    cubeFaceFramebuffer.attach(Attachment.Color0, cubeMap, target, 0);
    cubeFaceUniforms.faceIndex = index;
    renderPass({
      framebuffer: cubeFaceFramebuffer,
      program: cubeFaceProgram,
      uniforms: cubeFaceUniforms,
      cullingState
    });
  });

  if (generateMipmaps) {
    cubeMap.generateMipmaps();
  }

  cubeFaceFramebuffer.dispose();
  cubeFaceProgram.dispose();

  cubeMap.version = latLongTexture.version;

  return cubeMap;
}

export async function equirectangularTextureToCubeMap(
  context: RenderingContext,
  latLongTexture: Texture,
  sourceEncoding = TextureEncoding.Linear,
  faceWidth = 512,
  targetInternalFormat = InternalFormat.RGBA8
) {
  // convert to TexImage2D
  latLongTexture.wrapS = TextureWrap.Repeat;
  latLongTexture.wrapT = TextureWrap.ClampToEdge;
  latLongTexture.minFilter = TextureFilter.Linear;
  const latLongMap = textureToTexImage2D(context, latLongTexture);

  let linearLatLongMap = latLongMap;
  if (sourceEncoding !== TextureEncoding.Linear) {
    //console.log('converting to linear from ' + TextureEncoding[sourceEncoding]);
    // convert from RGBE to Linear
    linearLatLongMap = new TexImage2D(
      context,
      [latLongMap.size],
      targetInternalFormat,
      internalFormatToDataType(targetInternalFormat),
      internalFormatToPixelFormat(targetInternalFormat),
      TextureTarget.Texture2D,
      new TexParameters(
        TextureFilter.Linear,
        TextureFilter.Linear,
        TextureWrap.Repeat,
        TextureWrap.ClampToEdge
      )
    );

    const copyPass = await createCopyPass(context);
    copyPass.exec({
      sourceTexImage2D: latLongMap,
      sourceEncoding: TextureEncoding.RGBE,
      targetFramebufferOrTexImage2D: linearLatLongMap,
      targetEncoding: TextureEncoding.Linear
    });

    copyPass.dispose();
  }

  const cubeMap = await equirectangularTexImage2DToCubeMapTexImage2D(
    context,
    linearLatLongMap,
    faceWidth,
    targetInternalFormat,
    true
  );

  latLongMap.dispose();
  linearLatLongMap.dispose();

  return cubeMap;
}
