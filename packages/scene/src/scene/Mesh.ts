import { Geometry, Material } from "@threeify/core";
import { ISceneNode, SceneNode } from "./SceneNode";

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
