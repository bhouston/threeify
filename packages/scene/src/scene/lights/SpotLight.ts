//
// point light initially based on PointLight from Three.js
//
// parameters modeled on the glTF punctual light standard:
// https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_lights_punctual
//
// Authors:
// * @bhouston
//

import { Vec3 } from '../../math/Vec3.js';
import { ILight, Light } from './Light.js';

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
