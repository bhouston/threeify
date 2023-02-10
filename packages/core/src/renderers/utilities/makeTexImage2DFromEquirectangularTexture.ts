import { Vec2 } from '@threeify/math';

import { PassGeometry } from '../../geometry/primitives/passGeometry';
import { ShaderMaterial } from '../../materials/ShaderMaterial';
import { cubeFaceTargets, CubeMapTexture } from '../../textures/CubeTexture';
import { Texture } from '../../textures/Texture';
import { makeBufferGeometryFromGeometry } from '../webgl/buffers/BufferGeometry';
import { CullingState } from '../webgl/CullingState';
import { Attachment } from '../webgl/framebuffers/Attachment';
import { Framebuffer } from '../webgl/framebuffers/Framebuffer';
import { renderBufferGeometry } from '../webgl/framebuffers/VirtualFramebuffer';
import { makeProgramFromShaderMaterial } from '../webgl/programs/Program';
import { RenderingContext } from '../webgl/RenderingContext';
import {
  makeTexImage2DFromTexture as textureToTexImage2D,
  TexImage2D
} from '../webgl/textures/TexImage2D';
import { TextureFilter } from '../webgl/textures/TextureFilter';
import { TextureWrap } from '../webgl/textures/TextureWrap';
import cubeFaceFragmentSource from './cubeFaces/fragment.glsl';
import cubeFaceVertexSource from './cubeFaces/vertex.glsl';

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

  const latLongMap = textureToTexImage2D(context, latLongTexture);

  const cubeFaceMaterial = new ShaderMaterial(
    'latLongToCubeMap',
    cubeFaceVertexSource,
    cubeFaceFragmentSource
  );
  const cubeFaceProgram = makeProgramFromShaderMaterial(
    context,
    cubeFaceMaterial
  );
  const cubeFaceBufferGeometry = makeBufferGeometryFromGeometry(
    context,
    PassGeometry
  );
  const cubeMap = textureToTexImage2D(context, cubeTexture);

  const cubeFaceFramebuffer = new Framebuffer(context);
  const cubeFaceUniforms = {
    map: latLongMap,
    faceIndex: 0
  };

  const cullingState = new CullingState(false);

  cubeFaceTargets.forEach((target, index) => {
    cubeFaceFramebuffer.attach(Attachment.Color0, cubeMap, target, 0);
    cubeFaceUniforms.faceIndex = index;
    renderBufferGeometry({
      framebuffer: cubeFaceFramebuffer,
      program: cubeFaceProgram,
      uniforms: cubeFaceUniforms,
      bufferGeometry: cubeFaceBufferGeometry,
      cullingState
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
