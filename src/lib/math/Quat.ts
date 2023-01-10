import { hashFloat4 } from '../core/hash';

export type QuatJSON = number[];

export class Quat {
  constructor(
    public x: number = 0,
    public y: number = 0,
    public z: number = 0,
    public w: number = 1
  ) {}

  getHashCode(): number {
    return hashFloat4(this.x, this.y, this.z, this.w);
  }

  clone(result = new Quat()): Quat {
    return result.set(this.x, this.y, this.z, this.w);
  }

  set(x: number, y: number, z: number, w: number): this {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    return this;
  }
}
