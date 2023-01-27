import {
  IMaterialParametersProvider,
  MaterialParameters
} from '../materials/MaterialParameters.js';
import { Mat3 } from '../math/Mat3.js';
import { Texture } from './Texture.js';

export class TextureAccessor implements IMaterialParametersProvider {
  constructor(
    public texture: Texture,
    public uvTransform = new Mat3(),
    public uvIndex = 0
  ) {}

  public getParameters(): MaterialParameters {
    return {
      texture: this.texture,
      uvTransform: this.uvTransform,
      uvIndex: this.uvIndex
    };
  }
}
