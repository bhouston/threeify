import { DataType, PixelFormat, TextureFilter } from ".";
import { generateUUID } from "../core/generateUuid";
import { IDisposable, IIdentifiable, IVersionable } from "../core/types";
import { Vector2 } from "../math/Vector2";

export abstract class VirtualTexture implements IIdentifiable, IVersionable, IDisposable {
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

  copy(source: VirtualTexture): void {
    this.name = source.name;
    this.size.copy(source.size);
    this.level = source.level;
    this.magFilter = source.magFilter;
    this.minFilter = source.minFilter;
    this.pixelFormat = source.pixelFormat;
    this.dataType = source.dataType;
    this.anisotropicLevels = source.anisotropicLevels;
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
