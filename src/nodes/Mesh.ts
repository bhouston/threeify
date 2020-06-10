//
// basic node
//
// Authors:
// * @bhouston
//

import { Geometry } from "../core/Geometry";
import { Material } from "../materials/Material";
import { Node } from "../nodes/Node";

export class Mesh extends Node {
  constructor(public geometry: Geometry, public material: Material) {
    super();
  }
}
