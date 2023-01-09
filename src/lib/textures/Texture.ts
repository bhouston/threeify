//
// point light initially based on PointLight from Three.js
//
// Authors:
// * @bhouston
//

import { Vec2 } from '../math/Vec2.js';
import { DataType } from '../renderers/webgl/textures/DataType.js';
import { PixelFormat } from '../renderers/webgl/textures/PixelFormat.js';
import { TextureFilter } from '../renderers/webgl/textures/TextureFilter.js';
import { TextureWrap } from '../renderers/webgl/textures/TextureWrap.js';
import { TextureSource, VirtualTexture } from './VirtualTexture.js';

export class Texture extends VirtualTexture {
  constructor(
    public image: TextureSource,
    public wrapS = TextureWrap.ClampToEdge,
    public wrapT = TextureWrap.ClampToEdge,
    level = 0,
    magFilter = TextureFilter.Linear,
    minFilter = TextureFilter.LinearMipmapLinear,
    pixelFormat = PixelFormat.RGBA,
    dataType = DataType.UnsignedByte,
    generateMipmaps = true,
    anisotropicLevels = 1
  ) {
    super(
      level,
      magFilter,
      minFilter,
      pixelFormat,
      dataType,
      generateMipmaps,
      anisotropicLevels
    );
    this.size = new Vec2(image.width, image.height);
  }
}

export function makeTextureFromVideoElement(video: HTMLVideoElement): Texture {
  return new Texture(
    video,
    TextureWrap.ClampToEdge,
    TextureWrap.ClampToEdge,
    0,
    TextureFilter.Linear,
    TextureFilter.Linear,
    PixelFormat.RGB,
    DataType.UnsignedByte,
    false,
    0
  );
}
