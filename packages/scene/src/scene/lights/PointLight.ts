import { ILight, Light } from "./Light";

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
