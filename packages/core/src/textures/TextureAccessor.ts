import {
  IMaterialParametersProvider,
  MaterialParameters
} from '../materials/MaterialParameters.js';
import { composeMat3 } from '../math/Mat3.Functions.js';
import { Mat3 } from '../math/Mat3.js';
import { Vec2 } from '../math/Vec2.js';
import { Texture } from './Texture.js';

export class TextureAccessor implements IMaterialParametersProvider {
  public uvTransform = new Mat3();

  constructor(
    public texture: Texture,
    public uvIndex = 0,
    public uvTranslation: Vec2 = new Vec2(),
    public uvRotation = 0,
    public uvScale: Vec2 = new Vec2(1, 1)
  ) {
    this.uvTransform = composeMat3(
      this.uvTranslation,
      this.uvRotation,
      this.uvScale
    );
  }

  public getParameters(): MaterialParameters {
    return {
      texture: this.texture,
      uvTransform: this.uvTransform,
      uvIndex: this.uvIndex
    };
  }
}
