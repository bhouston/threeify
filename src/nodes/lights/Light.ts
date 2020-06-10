//
// basic light node initially based on Light from Three.js
//
// Authors:
// * @bhouston
//

import { Color } from "../../math/Color";
import { Node } from "../Node";

export class Light extends Node {
  color: Color;
  intensity: number;

  constructor(color: Color = new Color(1, 1, 1), intensity = 1) {
    super();

    this.color = color;
    this.intensity = intensity;
  }
}
