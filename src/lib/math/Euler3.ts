import { hashFloat4 } from '../core/hash.js';

export enum EulerOrder3 {
  XYZ = 0,
  YXZ = 1,
  ZXY = 2,
  ZYX = 3,
  YZX = 4,
  XZY = 5,
  Default = EulerOrder3.XYZ
}

export type Euler3JSON = number[];

export class Euler3 {
  constructor(
    public x: number = 0,
    public y: number = 0,
    public z: number = 0,
    public order: EulerOrder3 = EulerOrder3.Default
  ) {}

  getHashCode(): number {
    return hashFloat4(this.x, this.y, this.z, this.order as number);
  }

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
}
