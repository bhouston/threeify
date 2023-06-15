import { Texture } from '@threeify/core';
import { Mat3 } from '@threeify/math';

import {
  IMaterialParameterProvider,
  MaterialParameters
} from './MaterialParameters';

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
