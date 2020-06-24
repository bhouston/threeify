//
// basic light node initially based on Light from Three.js
//
// Authors:
// * @bhouston
//

import { Vector3 } from "../../math/Vector3";
import { Node } from "../Node";
import { LightType } from "./LightType";

export class Light extends Node {
  /**
   * @param color - RGB value for light's color in linear space.
   * @param intensity - Brightness of light.  Units depend on the light type.
   */
  constructor(public readonly type: LightType, public color: Vector3 = new Vector3(1, 1, 1), public intensity = 1) {
    super();
  }
}
