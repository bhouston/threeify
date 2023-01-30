import { Vec3 } from '@threeify/vector-math';

import { ILight, Light } from './Light';

export interface ISpotLight extends ILight {
  direction?: Vec3;
  range?: number;
  innerConeAngle?: number;
  outerConeAngle?: number;
  power?: number;
}

export class SpotLight extends Light {
  public direction = new Vec3(0, 0, -1);
  public range = -1;
  public innerConeAngle = 0;
  public outerConeAngle = Math.PI / 4;

  constructor(props: ISpotLight) {
    super(props);
    if (props.direction !== undefined) this.direction.copy(props.direction);
    if (props.range !== undefined) this.range = props.range;
    if (props.innerConeAngle !== undefined)
      this.innerConeAngle = props.innerConeAngle;
    if (props.outerConeAngle !== undefined)
      this.outerConeAngle = props.outerConeAngle;
    if (props.power !== undefined) this.power = props.power;
  }

  get power(): number {
    return this.intensity * 4 * Math.PI;
  }
  set power(value: number) {
    this.intensity = value / (4 * Math.PI);
  }
}
