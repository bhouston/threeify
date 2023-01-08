import { composeMatrix3 } from '../math/Matrix3.Functions.js';
import { Matrix3 } from '../math/Matrix3.js';
import { Vector2 } from '../math/Vector2.js';
import { Texture } from './Texture.js';

export class TextureAccessor {
  constructor(
    public texture: Texture | undefined = undefined,
    public uvIndex = 0,
    public uvTranslation: Vector2 = new Vector2(),
    public uvRotation = 0,
    public uvScale: Vector2 = new Vector2(1, 1)
  ) {}

  get uvTransform(): Matrix3 {
    return composeMatrix3(this.uvTranslation, this.uvRotation, this.uvScale);
  }
}
