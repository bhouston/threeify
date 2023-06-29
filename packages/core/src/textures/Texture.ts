//
// point light initially based on PointLight from Three.js
//
// Authors:
// * @bhouston
//

import { DataType } from '../renderers/webgl/textures/DataType.js';
import {
  InternalFormat,
  internalFormatToDataType
} from '../renderers/webgl/textures/InternalFormat.js';
import { TextureFilter } from '../renderers/webgl/textures/TextureFilter.js';
import { TextureWrap } from '../renderers/webgl/textures/TextureWrap.js';
import { fetchImage } from './loaders/Image.js';
import {
  getTextureSourceSize,
  TextureSource,
  VirtualTexture
} from './VirtualTexture.js';
export class Texture extends VirtualTexture {
  constructor(
    public image: TextureSource,
    public wrapS = TextureWrap.Repeat,
    public wrapT = TextureWrap.Repeat,
    level = 0,
    magFilter = TextureFilter.Linear,
    minFilter = TextureFilter.LinearMipmapLinear,
    internalFormat = InternalFormat.RGBA8,
    dataType = internalFormatToDataType(internalFormat),
    generateMipmaps = true,
    anisotropicLevels = 1
  ) {
    super(
      level,
      magFilter,
      minFilter,
      internalFormat,
      dataType,
      generateMipmaps,
      anisotropicLevels
    );
    this.size = getTextureSourceSize(image);
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
    InternalFormat.RGB8,
    DataType.UnsignedByte,
    false,
    0
  );
}

export async function fetchTexture(url: string): Promise<Texture> {
  return new Texture(await fetchImage(url));
}
