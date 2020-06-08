import { ICloneable, ICopyable, IVersionable } from "../model/interfaces";
import { Matrix3 } from "../math/Matrix3";
import { Texture } from "./Texture";
import { Vector2 } from "../math/Vector2";

export class TextureAccessor
  implements ICloneable<TextureAccessor>, ICopyable<TextureAccessor>, IVersionable {
  version = 0;
  private _uvTransform = new Matrix3();
  private _uvTransformVersion = -1;

  constructor(
    public texture: Texture | null = null,
    public uvIndex = 0,
    public uvScale: Vector2 = new Vector2(1, 1),
    public uvRotation = 0,
    public uvTranslation: Vector2 = new Vector2(),
  ) {}

  clone(): TextureAccessor {
    return new TextureAccessor(
      this.texture,
      this.uvIndex,
      this.uvScale,
      this.uvRotation,
      this.uvTranslation,
    );
  }

  copy(ta: TextureAccessor): this {
    this.texture = ta.texture;
    this.uvIndex = ta.uvIndex;
    this.uvScale = ta.uvScale;
    this.uvTranslation = ta.uvTranslation;
    this.uvRotation = ta.uvRotation;
    return this;
  }

  get uvTransform(): Matrix3 {
    if (this._uvTransformVersion < this.version) {
      this._uvTransform.makeTranslation2(this.uvTranslation);
      this._uvTransform.makeConcatenation(
        this._uvTransform,
        new Matrix3().makeRotation2FromAngle(this.uvRotation),
      );
      this._uvTransform.makeConcatenation(
        this._uvTransform,
        new Matrix3().makeScale2(this.uvScale),
      );
      this._uvTransformVersion = this.version;
    }
    return this._uvTransform;
  }

  dirty(): void {
    this.version++;
  }
}
