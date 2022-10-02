//
// point light initially based on PointLight from Three.js
//
// parameters modeled on the glTF punctual light standard:
// https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_lights_punctual
//
// Authors:
// * @bhouston
//

import { Vector3 } from '../../math/Vector3';
import { Light } from './Light';
import { LightType } from './LightType';

/**
 * Point lights emit light in all directions from their position in space; rotation and
 * scale are ignored except for their effect on the inherited node position. The brightness
 * of the light attenuates in a physically correct manner as distance increases from the
 * light's position (i.e. brightness goes like the inverse square of the distance). Point
 * light intensity is defined in candela, which is lumens per square radian (lm/sr).
 */
export class PointLight extends Light {
  /**
   * @param color - RGB value for light's color in linear space.
   * @param intensity - Luminous intensity in candela (lm/sr)
   * @param range - The distance cutoff at which the light's intensity reaches zero.  If <= 0, assumed to be infinite.
   */
  constructor(
    color: Vector3 = new Vector3(1, 1, 1),
    intensity = 1.0,
    public range = -1
  ) {
    super(LightType.Point, color, intensity);
  }

  /**
   * luminous power, AKA luminous flux (lm)
   */
  get power(): number {
    return this.intensity * 4 * Math.PI;
  }

  /**
   * luminous power, AKA luminous flux (lm)
   */
  set power(value: number) {
    this.intensity = value / (4 * Math.PI);
  }
}
