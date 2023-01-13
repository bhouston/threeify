//
// basic light node initially based on Light from Three.js
//
// Authors:
// * @bhouston
//

import { Color3 } from '../../math/Color3.js';
import { ISceneNode, SceneNode } from '../SceneNode.js';

export interface ILight extends ISceneNode {
  color?: Color3;
  intensity?: number;
}
export class Light extends SceneNode {
  public color = new Color3(1, 1, 1);
  public intensity = 1;

  constructor(props: ILight) {
    super(props);
    if (props.color !== undefined) this.color.copy(props.color);
    if (props.intensity !== undefined) this.intensity = props.intensity;
  }
}
