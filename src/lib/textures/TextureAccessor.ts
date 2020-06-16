import { ICloneable, ICopyable, IVersionable } from "../core/types";
import { Matrix3 } from "../math/Matrix3";
import { Vector2 } from "../math/Vector2";
import { Texture } from "./Texture";

export class TextureAccessor implements ICloneable<TextureAccessor>, ICopyable<TextureAccessor>, IVersionable {
  version = 0;
  #uvTransform = new Matrix3();
  #uvTransformVersion = -1;

  constructor(
    public texture: Texture | undefined = undefined,
    public uvIndex = 0,
    public uvScale: Vector2 = new Vector2(1, 1),
    public uvRotation = 0,
    public uvTranslation: Vector2 = new Vector2(),
  ) {}

  clone(): TextureAccessor {
    return new TextureAccessor(this.texture, this.uvIndex, this.uvScale, this.uvRotation, this.uvTranslation);
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
    if (this.#uvTransformVersion < this.version) {
      this.#uvTransform.makeTranslation2(this.uvTranslation);
      this.#uvTransform.makeConcatenation(this.#uvTransform, new Matrix3().makeRotation2FromAngle(this.uvRotation));
      this.#uvTransform.makeConcatenation(this.#uvTransform, new Matrix3().makeScale2(this.uvScale));
      this.#uvTransformVersion = this.version;
    }
    return this.#uvTransform;
  }

  dirty(): void {
    this.version++;
  }
}
