//
// basic node
//
// Authors:
// * @bhouston
//

import { Geometry } from '../geometry/Geometry.js';
import { Material } from '../materials/Material.js';
import { ISceneNode, SceneNode } from './SceneNode.js';

export interface IMesh extends ISceneNode {
  geometry: Geometry;
  material: Material;
}
export class Mesh extends SceneNode {
  public geometry: Geometry;
  public material: Material;

  constructor(props: IMesh) {
    super(props);
    this.geometry = props.geometry;
    this.material = props.material;
  }
}
