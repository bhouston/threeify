import { Vec2 } from '@threeify/vector-math';

import { passGeometry } from '../../../geometry/primitives/passGeometry.js';
import { ShaderMaterial } from '../../../materials/ShaderMaterial.js';
import {
  cubeFaceTargets,
  CubeMapTexture
} from '../../../textures/CubeTexture.js';
import { Texture } from '../../../textures/Texture.js';
import {
  BufferGeometry,
  makeBufferGeometryFromGeometry
} from '../buffers/BufferGeometry.js';
import { Attachment } from '../framebuffers/Attachment.js';
import { Framebuffer } from '../framebuffers/Framebuffer.js';
import {
  renderBufferGeometry,
  VirtualFramebuffer
} from '../framebuffers/VirtualFramebuffer.js';
import { makeProgramFromShaderMaterial, Program } from '../programs/Program.js';
import { RenderingContext } from '../RenderingContext.js';
import copyFragmentSource from './copy/fragment.glsl';
import copyVertexSource from './copy/vertex.glsl';
import cubeFaceFragmentSource from './cubeFaces/fragment.glsl';
import cubeFaceVertexSource from './cubeFaces/vertex.glsl';
import { PixelFormat } from './PixelFormat.js';
import { TexImage2D } from './TexImage2D.js';
import { TexParameters } from './TexParameters.js';
import { TextureFilter } from './TextureFilter.js';
import { TextureTarget } from './TextureTarget.js';
import { TextureWrap } from './TextureWrap.js';
export function makeTexImage2DFromTexture(
  context: RenderingContext,
  texture: Texture | CubeMapTexture,
  internalFormat: PixelFormat = PixelFormat.RGBA
): TexImage2D {
  const params = new TexParameters();
  params.anisotropyLevels = texture.anisotropicLevels;
  params.generateMipmaps = texture.generateMipmaps;
  params.magFilter = texture.magFilter;
  params.minFilter = texture.minFilter;
  if (texture instanceof CubeMapTexture) {
    params.wrapS = TextureWrap.ClampToEdge;
    params.wrapT = TextureWrap.ClampToEdge;
  } else {
    params.wrapS = texture.wrapS;
    params.wrapT = texture.wrapT;
  }
  const texImage2D = new TexImage2D(
    context,
    texture instanceof CubeMapTexture ? texture.images : [texture.image],
    texture.pixelFormat,
    texture.dataType,
    internalFormat,
    texture instanceof CubeMapTexture
      ? TextureTarget.TextureCubeMap
      : TextureTarget.Texture2D,
    params
  );
  texImage2D.version = texture.version;
  return texImage2D;
}

export function makeTexImage2DFromEquirectangularTexture(
  context: RenderingContext,
  latLongTexture: Texture,
  faceSize = new Vec2(512, 512),
  generateMipmaps = true
): TexImage2D {
  // required for proper reading.
  latLongTexture.wrapS = TextureWrap.Repeat;
  latLongTexture.wrapT = TextureWrap.ClampToEdge;
  latLongTexture.minFilter = TextureFilter.Linear;

  const cubeTexture = new CubeMapTexture([
    faceSize,
    faceSize,
    faceSize,
    faceSize,
    faceSize,
    faceSize
  ]);
  cubeTexture.generateMipmaps = generateMipmaps;

  const latLongMap = makeTexImage2DFromTexture(context, latLongTexture);
  const cubeFaceGeometry = passGeometry();

  const cubeFaceMaterial = new ShaderMaterial(
    cubeFaceVertexSource,
    cubeFaceFragmentSource
  );
  const cubeFaceProgram = makeProgramFromShaderMaterial(
    context,
    cubeFaceMaterial
  );
  const cubeFaceBufferGeometry = makeBufferGeometryFromGeometry(
    context,
    cubeFaceGeometry
  );
  const cubeMap = makeTexImage2DFromTexture(context, cubeTexture);

  const cubeFaceFramebuffer = new Framebuffer(context);
  const cubeFaceUniforms = {
    map: latLongMap,
    faceIndex: 0
  };

  cubeFaceTargets.forEach((target, index) => {
    cubeFaceFramebuffer.attach(Attachment.Color0, cubeMap, target, 0);
    cubeFaceUniforms.faceIndex = index;
    renderBufferGeometry({
      framebuffer: cubeFaceFramebuffer,
      program: cubeFaceProgram,
      uniforms: cubeFaceUniforms,
      bufferGeometry: cubeFaceBufferGeometry
    });
  });

  if (generateMipmaps) {
    cubeMap.generateMipmaps();
  }

  cubeFaceFramebuffer.flush();
  cubeFaceFramebuffer.finish();

  cubeFaceFramebuffer.dispose();
  // cubeFaceBufferGeometry.dispose(); - causes crashes.  Huh?
  cubeFaceProgram.dispose();
  latLongMap.dispose();

  cubeMap.version = latLongTexture.version;

  return cubeMap;
}

let copyPassProgram: Program | undefined;
let copyPassBufferGeometry: BufferGeometry | undefined;

export function copyPass(
  source: TexImage2D,
  target: TexImage2D | undefined
): void {
  const { context } = source;

  let targetFramebuffer: VirtualFramebuffer;
  if (target !== undefined) {
    const framebuffer = new Framebuffer(context);
    framebuffer.attach(Attachment.Color0, target);
    targetFramebuffer = framebuffer;
  } else {
    targetFramebuffer = source.context.canvasFramebuffer;
  }

  // TODO: cache geometry + bufferGeometry.
  if (copyPassBufferGeometry === undefined) {
    const geometry = passGeometry();
    copyPassBufferGeometry = makeBufferGeometryFromGeometry(context, geometry);
  }

  // TODO: cache material + program.
  if (copyPassProgram === undefined) {
    const material = new ShaderMaterial(copyVertexSource, copyFragmentSource);
    copyPassProgram = makeProgramFromShaderMaterial(context, material);
  }

  const uniforms = {
    map: source
  };

  renderBufferGeometry({
    framebuffer: targetFramebuffer,
    program: copyPassProgram,
    uniforms,
    bufferGeometry: copyPassBufferGeometry
  });

  if (target) {
    targetFramebuffer.flush();
    targetFramebuffer.finish();
    targetFramebuffer.dispose();
  }
}
