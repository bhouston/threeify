//
// basic node
//
// Authors:
// * @bhouston
//

import { Geometry } from '../geometry/Geometry';
import { Material } from '../materials/Material';
import { Node } from './Node';

export class Mesh extends Node {
  constructor(public geometry: Geometry, public material: Material) {
    super();
  }
}
