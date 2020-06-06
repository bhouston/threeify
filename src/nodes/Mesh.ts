//
// basic node
//
// Authors:
// * @bhouston
//

import { Geometry } from "../core/Geometry";
import { Node } from "../nodes/Node";

export class Mesh extends Node {
  constructor(public geometry: Geometry) {
    super();
  }
}
