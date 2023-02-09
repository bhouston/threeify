import { Color3 } from '@threeify/math';

import { ISceneNodeProps, SceneNode } from '../SceneNode';

export interface ILight extends ISceneNodeProps {
  color?: Color3;
  intensity?: number;
}
export class Light extends SceneNode {
  public color = Color3.White;
  public intensity = 1;

  constructor(props: ILight) {
    super(props);
    if (props.color !== undefined) this.color.copy(props.color);
    if (props.intensity !== undefined) this.intensity = props.intensity;
  }
}
