//
// basic node
//
// Authors:
// * @bhouston
//

import { Geometry } from '../geometry/Geometry.js';
import { Material } from '../materials/Material.js';
import { INode, Node } from './Node.js';

export interface IMesh extends INode {
  geometry: Geometry;
  material: Material;
}
export class Mesh extends Node {
  public geometry: Geometry;
  public material: Material;

  constructor(props: IMesh) {
    super(props);
    this.geometry = props.geometry;
    this.material = props.material;
  }
}
