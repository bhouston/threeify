//
// basic light node initially based on Light from Three.js
//
// Authors:
// * @bhouston
//

import { Color } from "../../math/Color";
import { Node } from "../Node";

export class Light extends Node {
  /**
   * @param color - RGB value for light's color in linear space.
   * @param intensity - Brightness of light.  Units depend on the light type.
   */
  constructor(public color = new Color(1, 1, 1), public intensity = 1) {
    super();
  }
}
