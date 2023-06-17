import { Vec2 } from '@threeify/math';

import { generateUUID } from '../core/generateUuid';
import { IDisposable, IIdentifiable, IVersionable } from '../core/types';
import { DataType } from '../renderers/webgl/textures/DataType';
import {
  InternalFormat,
  internalFormatToPixelFormat
} from '../renderers/webgl/textures/InternalFormat';
import { PixelFormat } from '../renderers/webgl/textures/PixelFormat';
import { TextureFilter } from '../renderers/webgl/textures/TextureFilter';
import {
  Float16ArrayImage,
  Float32ArrayImage,
  Uint8ArrayImage
} from './ArrayBufferImage';
export type TextureSource =
  | Float32ArrayImage
  | Uint8ArrayImage
  | Float16ArrayImage
  | ImageData
  | HTMLImageElement
  | HTMLCanvasElement
  | HTMLVideoElement
  | OffscreenCanvas
  | ImageBitmap
  | Vec2;

export function getTextureSourceSize(textureSource: TextureSource): Vec2 {
  if (textureSource instanceof Vec2) {
    return textureSource;
  }
  return new Vec2(textureSource.width, textureSource.height);
}

export class VirtualTexture
  implements IDisposable, IIdentifiable, IVersionable
{
  public readonly id: string = generateUUID();
  public version = 0;
  public disposed = false;
  public name = '';
  public size: Vec2 = new Vec2();
  public pixelFormat: PixelFormat;

  constructor(
    public level = 0,
    public magFilter = TextureFilter.Linear,
    public minFilter = TextureFilter.Linear,
    public internalFormat = InternalFormat.RGBA8,
    public dataType = DataType.UnsignedByte,
    public generateMipmaps = true,
    public anisotropicLevels = 1
  ) {
    this.pixelFormat = internalFormatToPixelFormat(internalFormat);
  }

  get mipCount(): number {
    if (!this.generateMipmaps) {
      return 1;
    }
    return Math.floor(Math.log2(Math.max(this.size.x, this.size.y)));
  }

  dispose(): void {
    this.disposed = true;
  }

  dirty(): void {
    this.version++;
  }
}
