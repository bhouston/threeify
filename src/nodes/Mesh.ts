//
// basic node
//
// Authors:
// * @bhouston
//

import { Geometry } from "../core/Geometry";
import { Material } from "../materials/Material";
import { Group } from "./Group";

export class Mesh extends Group {
  constructor(public geometry: Geometry, public material: Material) {
    super();
  }
}
