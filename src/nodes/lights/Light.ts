//
// basic light node initially based on Light from Three.js
//
// Authors:
// * @bhouston
//

import { Color } from "../../math/Color";
import { Node } from "../Node";

export class Light extends Node {
  constructor(public color: Color = new Color(1, 1, 1), public intensity = 1) {
    super();
  }
}
