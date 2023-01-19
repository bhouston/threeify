import { Vec3 } from "@threeify/core";
import { ILight, Light } from "./Light";

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
