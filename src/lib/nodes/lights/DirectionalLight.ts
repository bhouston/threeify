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

export interface IDirectionalLight extends ILight {
  direction?: Vec3;
}

export class DirectionalLight extends Light {
  public direction = new Vec3(0, 0, -1);

  constructor(props: IDirectionalLight) {
    super(props);
    if (props.direction !== undefined) this.direction.copy(props.direction);
  }
}
