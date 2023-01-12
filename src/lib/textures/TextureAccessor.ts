import { composeMat3 } from '../math/Mat3.Functions.js';
import { Mat3 } from '../math/Mat3.js';
import { Vec2 } from '../math/Vec2.js';
import { Texture } from './Texture.js';

export class TextureAccessor {
  constructor(
    public texture: Texture | undefined = undefined,
    public uvIndex = 0,
    public uvTranslation: Vec2 = new Vec2(),
    public uvRotation = 0,
    public uvScale: Vec2 = new Vec2(1, 1)
  ) {}

  get uvTransform(): Mat3 {
    return composeMat3(this.uvTranslation, this.uvRotation, this.uvScale);
  }
}
