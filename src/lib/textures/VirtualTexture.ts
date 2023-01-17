import { generateUUID } from '../core/generateUuid.js';
import { IDisposable, IIdentifiable, IVersionable } from '../core/types.js';
import { Vec2 } from '../math/Vec2.js';
import { DataType } from '../renderers/webgl/textures/DataType.js';
import { PixelFormat } from '../renderers/webgl/textures/PixelFormat.js';
import { TextureFilter } from '../renderers/webgl/textures/TextureFilter.js';
import { ArrayBufferImage } from './ArrayBufferImage.js';

export type TextureSource =
  | ArrayBufferImage
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

  constructor(
    public level = 0,
    public magFilter = TextureFilter.Linear,
    public minFilter = TextureFilter.Linear,
    public pixelFormat = PixelFormat.RGBA,
    public dataType = DataType.UnsignedByte,
    public generateMipmaps = true,
    public anisotropicLevels = 1
  ) {}

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
