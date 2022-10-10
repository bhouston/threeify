import { IVersionable } from '../core/types.js';
import {
  makeMatrix3Concatenation,
  makeMatrix3RotationFromAngle,
  makeMatrix3Scale,
  makeMatrix3Translation
} from '../math/Matrix3.Functions.js';
import { Matrix3 } from '../math/Matrix3.js';
import { Vector2 } from '../math/Vector2.js';
import { Texture } from './Texture.js';

export class TextureAccessor implements IVersionable {
  version = 0;
  #uvTransform = new Matrix3();
  #uvTransformVersion = -1;

  constructor(
    public texture: Texture | undefined = undefined,
    public uvIndex = 0,
    public uvScale: Vector2 = new Vector2(1, 1),
    public uvRotation = 0,
    public uvTranslation: Vector2 = new Vector2()
  ) {}

  get uvTransform(): Matrix3 {
    if (this.#uvTransformVersion < this.version) {
      this.#uvTransform = makeMatrix3Translation(
        this.uvTranslation,
        this.#uvTransform
      );
      this.#uvTransform = makeMatrix3Concatenation(
        this.#uvTransform,
        makeMatrix3RotationFromAngle(this.uvRotation),
        this.#uvTransform
      );
      this.#uvTransform = makeMatrix3Concatenation(
        this.#uvTransform,
        makeMatrix3Scale(this.uvScale),
        this.#uvTransform
      );
      this.#uvTransformVersion = this.version;
    }
    return this.#uvTransform;
  }

  dirty(): void {
    this.version++;
  }
}
