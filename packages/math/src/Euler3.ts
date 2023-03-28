export enum EulerOrder3 {
  XYZ,
  XZY,
  YXZ,
  YZX,
  ZYX,
  ZXY,
  Default = XYZ
}

export type Euler3JSON = number[];

export class Euler3 {
  static readonly NUM_COMPONENTS = 4;

  constructor(
    public x = 0,
    public y = 0,
    public z = 0,
    public order: EulerOrder3 = EulerOrder3.XYZ
  ) {}

  clone(result = new Euler3()): Euler3 {
    return result.set(this.x, this.y, this.z, this.order);
  }

  copy(v: Euler3): this {
    return this.set(v.x, v.y, v.z, v.order);
  }

  set(x: number, y: number, z: number, order: EulerOrder3): this {
    this.x = x;
    this.y = y;
    this.z = z;
    this.order = order;
    return this;
  }

  setComponent(index: number, value: number): this {
    switch (index) {
      case 0:
        this.x = value;
        break;
      case 1:
        this.y = value;
        break;
      case 2:
        this.z = value;
        break;
      case 3:
        this.order = value as EulerOrder3;
        break;
      default:
        throw new Error(`index is out of range: ${index}`);
    }
    return this;
  }

  getComponent(index: number): number {
    switch (index) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      case 2:
        return this.z;
      case 3:
        return this.order as number;
      default:
        throw new Error(`index is out of range: ${index}`);
    }
  }
}
