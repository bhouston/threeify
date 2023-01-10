import { generateUUID } from '../core/generateUuid.js';
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
  | { width: number; height: number };

export class VirtualTexture {
  disposed = false;
  uuid: string = generateUUID();
  version = 0;
  name = '';
  size: Vec2 = new Vec2();

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

  dirty(): void {
    this.version++;
  }

  dispose(): void {
    if (!this.disposed) {
      this.disposed = true;
      this.dirty();
    }
  }
}
