import { hashFloat3 } from '../core/hash';

export class Vec3 {
  constructor(
    public x: number = 0,
    public y: number = 0,
    public z: number = 0
  ) {}

  getHashCode(): number {
    return hashFloat3(this.x, this.y, this.z);
  }

  clone(result = new Vec3()): Vec3 {
    return result.set(this.x, this.y, this.z);
  }

  set(x: number, y: number, z: number): this {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }
}
