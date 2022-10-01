import { generateUUID } from '../core/generateUuid';
import { Vector2 } from '../math/Vector2';
import { DataType } from '../renderers/webgl/textures/DataType';
import { PixelFormat } from '../renderers/webgl/textures/PixelFormat';
import { TextureFilter } from '../renderers/webgl/textures/TextureFilter';
import { ArrayBufferImage } from './ArrayBufferImage';

export type TextureSource =
  | ArrayBufferImage
  | ImageData
  | HTMLImageElement
  | HTMLCanvasElement
  | HTMLVideoElement
  | OffscreenCanvas
  | ImageBitmap
  | Vector2;

export class VirtualTexture {
  disposed = false;
  uuid: string = generateUUID();
  version = 0;
  name = '';
  size: Vector2 = new Vector2();

  constructor(
    public level = 0,
    public magFilter = TextureFilter.Linear,
    public minFilter = TextureFilter.Linear,
    public pixelFormat = PixelFormat.RGBA,
    public dataType = DataType.UnsignedByte,
    public generateMipmaps = true,
    public anisotropicLevels = 1,
  ) {}

  get mipCount(): number {
    if (!this.generateMipmaps) {
      return 1;
    }
    return Math.floor(Math.log2(Math.max(this.size.width, this.size.height)));
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
