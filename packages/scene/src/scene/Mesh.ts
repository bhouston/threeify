import { Geometry, Material } from '@threeify/core';

import { ISceneNodeProps, SceneNode } from './SceneNode';

export interface IMeshProps extends ISceneNodeProps {
  geometry: Geometry;
  material: Material;
}
export class MeshNode extends SceneNode {
  public geometry: Geometry;
  public material: Material;

  constructor(props: IMeshProps) {
    super(props);
    this.geometry = props.geometry;
    this.material = props.material;
  }
}
