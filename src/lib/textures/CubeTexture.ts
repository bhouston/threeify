//
// point light initially based on PointLight from Three.js
//
// Authors:
// * @bhouston
//

import { Vector2 } from "../math/Vector2";
import { IPoolUser } from "../renderers/Pool";
import { DataType } from "../renderers/webgl2/textures/DataType";
import { PixelFormat } from "../renderers/webgl2/textures/PixelFormat";
import { TextureFilter } from "../renderers/webgl2/textures/TextureFilter";
import { TextureTarget } from "../renderers/webgl2/textures/TextureTarget";
import { ArrayBufferImage } from "./ArrayBufferImage";
import { VirtualTexture } from "./VirtualTexture";

// the official ordering of the cubemap faces
export const imageIndexToCubeMapFaceTarget = [
  TextureTarget.CubeMapPositiveX,
  TextureTarget.CubeMapNegativeX,
  TextureTarget.CubeMapPositiveY,
  TextureTarget.CubeMapNegativeY,
  TextureTarget.CubeMapPositiveZ,
  TextureTarget.CubeMapNegativeZ,
];

export class CubeTexture extends VirtualTexture implements IPoolUser {
  constructor(
    public images: ArrayBufferImage[] | HTMLImageElement[],
    level = 0,
    magFilter = TextureFilter.Linear,
    minFilter = TextureFilter.Linear,
    pixelFormat = PixelFormat.RGBA,
    dataType = DataType.UnsignedByte,
    generateMipmaps = true,
    anisotropicLevels = 1,
  ) {
    super(level, magFilter, minFilter, pixelFormat, dataType, generateMipmaps, anisotropicLevels);
    if (this.images.length !== 6) {
      throw new Error("images must be of length 6");
    }
    this.size = new Vector2(images[0].width, images[0].height);
  }
}
