//
// point light initially based on PointLight from Three.js
//
// parameters modeled on the glTF punctual light standard:
// https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_lights_punctual
//
// Authors:
// * @bhouston
//

import { Color3 } from '../../math/Color3.js';
import { Vec3 } from '../../math/Vec3.js';
import {
  eulerToNegativeZDirection,
  negativeZDirectionToEuler
} from './Direction.js';
import { Light } from './Light.js';
import { LightType } from './LightType.js';

/**
 * Directional lights are light sources that act as though they are infinitely far
 * away and emit light in the direction of the local -z axis. This light type
 * inherits the orientation of the node that it belongs to; position and scale
 * are ignored except for their effect on the inherited node orientation. Because
 * it is at an infinite distance, the light is not attenuated. Its intensity is
 * defined in lumens per metre squared, or lux (lm/m2).
 */
export class DirectionalLight extends Light {
  /**
   * @param color - RGB value for light's color in linear space.
   * @param intensity - Illuminance in lux (lm/m2).
   */
  constructor(color = new Color3(1, 1, 1), intensity = 1) {
    super(LightType.Directional, color, intensity);
  }

  /**
   *  direction points in the -z local axis
   */
  get direction(): Vec3 {
    // figure out where the -z axis is pointing from the matrix.
    return eulerToNegativeZDirection(this.rotation);
  }

  /**
   *  direction points in the -z local axis
   */
  set direction(v: Vec3) {
    // adjust matrix to point in this direction.
    this.rotation = negativeZDirectionToEuler(v, this.rotation);
  }
}
