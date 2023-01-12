import { hashFloat4 } from '../core/hash';

export class Quat {
  constructor(public x = 0, public y = 0, public z = 0, public w = 1) {}

  getHashCode(): number {
    return hashFloat4(this.x, this.y, this.z, this.w);
  }

  clone(result = new Quat()): Quat {
    return result.set(this.x, this.y, this.z, this.w);
  }

  copy(v: Quat): this {
    return this.set(v.x, v.y, v.z, v.w);
  }

  set(x: number, y: number, z: number, w: number): this {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    return this;
  }
}
