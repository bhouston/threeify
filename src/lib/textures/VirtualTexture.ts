import { generateUUID } from "../core/generateUuid";
import { Vector2 } from "../math/Vector2";
import { DataType } from "../renderers/webgl2/textures/DataType";
import { PixelFormat } from "../renderers/webgl2/textures/PixelFormat";
import { TextureFilter } from "../renderers/webgl2/textures/TextureFilter";

export class VirtualTexture {
  disposed = false;
  uuid: string = generateUUID();
  version = 0;
  name = "";
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
