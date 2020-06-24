//
// point light initially based on PointLight from Three.js
//
// parameters modeled on the glTF punctual light standard:
// https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_lights_punctual
//
// Authors:
// * @bhouston
//

import { Vector3 } from "../../math/Vector3";
import { eulerToNegativeZDirection, negativeZDirectionToEuler } from "./Direction";
import { Light } from "./Light";
import { LightType } from "./LightType";

/**
 * Spot lights emit light in a cone in the direction of the local -z axis. The angle and
 * falloff of the cone is defined using two numbers, the innerConeAngle and outerConeAngle.
 * As with point lights, the brightness also attenuates in a physically correct manner as
 * distance increases from the light's position (i.e. brightness goes like the inverse
 * square of the distance). Spot light intensity refers to the brightness inside the
 * innerConeAngle (and at the location of the light) and is defined in candela, which is
 * lumens per square radian (lm/sr). Engines that don't support two angles for spotlights
 * should use outerConeAngle as the spotlight angle (leaving innerConeAngle to implicitly be 0).
 */
export class SpotLight extends Light {
  /**
   * @param color - RGB value for light's color in linear space.
   * @param intensity - Luminous intensity in candela (lm/sr)
   * @param range - The distance cutoff at which the light's intensity reaches zero.  If <= 0, assumed to be infinite.
   * @param innerConeAngle	Angle, in radians, from centre of spotlight where falloff begins.
   * Must be greater than or equal to 0 and less than outerConeAngle.
   * @param outerConeAngle	Angle, in radians, from centre of spotlight where falloff ends.
   * Must be greater than innerConeAngle and less than or equal to PI / 2.0.
   */
  constructor(
    color: Vector3 = new Vector3(1, 1, 1),
    intensity = 1.0,
    public range = -1,
    public innerConeAngle = 0,
    public outerConeAngle = Math.PI / 4.0,
  ) {
    super(LightType.Spot, color, intensity);
  }

  /*
  intensity = power per solid angle. ref: equation (15) from
  https://seblagarde.files.wordpress.com/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf
  */
  get power(): number {
    return this.intensity * 4 * Math.PI;
  }

  /*
  intensity = power per solid angle. ref: equation (15) from
  https://seblagarde.files.wordpress.com/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf
  */
  set power(value: number) {
    this.intensity = value / (4 * Math.PI);
  }

  // direction points in the -z local axis
  get direction(): Vector3 {
    // figure out where the -z axis is pointing from the matrix.
    return eulerToNegativeZDirection(this.rotation);
  }
  set direction(v: Vector3) {
    // adjust matrix to point in this direction.
    this.rotation = negativeZDirectionToEuler(v);
  }
}
