//
// point light initially based on PointLight from Three.js
//
// parameters modeled on the glTF punctual light standard:
// https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_lights_punctual
//
// Authors:
// * @bhouston
//

import { ILight, Light } from './Light.js';

export interface IPointLight extends ILight {
  range?: number;
  power?: number;
}

export class PointLight extends Light {
  public range = -1;

  constructor(props: IPointLight) {
    super(props);
    if (props.power !== undefined) this.power = props.power;
    if (props.range !== undefined) this.range = props.range;
  }

  get power(): number {
    return this.intensity * 4 * Math.PI;
  }
  set power(value: number) {
    this.intensity = value / (4 * Math.PI);
  }
}
