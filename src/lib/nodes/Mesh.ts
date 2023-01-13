//
// basic node
//
// Authors:
// * @bhouston
//

import { Geometry } from '../geometry/Geometry.js';
import { IMaterial } from '../materials/IMaterial.js';
import { INode, Node } from './Node.js';

export interface IMesh extends INode {
  geometry: Geometry;
  material: IMaterial;
}
export class Mesh extends Node {
  public geometry: Geometry;
  public material: IMaterial;

  constructor(props: IMesh) {
    super(props);
    this.geometry = props.geometry;
    this.material = props.material;
  }
}
