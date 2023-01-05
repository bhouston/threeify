//
// basic node
//
// Authors:
// * @bhouston
//

import { Geometry } from '../geometry/Geometry.js';
import { Material } from '../materials/Material.js';
import { Node } from './Node.js';

export class Mesh extends Node {
  constructor(public geometry: Geometry, public material: Material) {
    super();
  }
}
