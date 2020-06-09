//
// point light initially based on PointLight from Three.js
//
// Authors:
// * @bhouston
//

import { Color } from "../../math/Color";
import { Light } from "./Light";

export class PointLight extends Light {
  constructor(color: Color = new Color(1, 1, 1), intensity = 1.0, public distance = -1, public decay = 2.0) {
    super(color, intensity);
  }

  get power(): number {
    // intensity = power per solid angle. ref: equation (15) from
    // https://seblagarde.files.wordpress.com/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf
    return this.intensity * 4 * Math.PI;
  }

  set power(value: number) {
    // intensity = power per solid angle. ref: equation (15) from
    // https://seblagarde.files.wordpress.com/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf
    this.intensity = value / (4 * Math.PI);
  }
}
