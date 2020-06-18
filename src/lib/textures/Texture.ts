//
// point light initially based on PointLight from Three.js
//
// Authors:
// * @bhouston
//

import { Vector2 } from "../math/Vector2";
import { DataType } from "../renderers/webgl2/textures/DataType";
import { PixelFormat } from "../renderers/webgl2/textures/PixelFormat";
import { TextureFilter } from "../renderers/webgl2/textures/TextureFilter";
import { TextureWrap } from "../renderers/webgl2/textures/TextureWrap";
import { ArrayBufferImage } from "./ArrayBufferImage";
import { VirtualTexture } from "./VirtualTexture";

export type TextureImage = ArrayBufferImage | HTMLImageElement;

export class Texture extends VirtualTexture {
  constructor(
    public image: TextureImage,
    public wrapS = TextureWrap.ClampToEdge,
    public wrapT = TextureWrap.ClampToEdge,
    level = 0,
    magFilter = TextureFilter.Linear,
    minFilter = TextureFilter.LinearMipmapLinear,
    pixelFormat = PixelFormat.RGBA,
    dataType = DataType.UnsignedByte,
    generateMipmaps = true,
    anisotropicLevels = 1,
  ) {
    super(level, magFilter, minFilter, pixelFormat, dataType, generateMipmaps, anisotropicLevels);
    this.size = new Vector2(image.width, image.height);
  }
}
