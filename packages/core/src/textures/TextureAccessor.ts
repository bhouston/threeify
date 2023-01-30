import { Mat3 } from '@threeify/vector-math';

import {
  IMaterialParameterProvider,
  MaterialParameters
} from '../materials/MaterialParameters.js';
import { Texture } from './Texture.js';

export class TextureAccessor implements IMaterialParameterProvider {
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
