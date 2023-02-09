import { hashFloat2 } from './utils/hash.js';
import { Vec3 } from './Vec3.js';

export class Ray3 {
  constructor(
    public readonly origin = new Vec3(),
    public readonly direction = new Vec3(0, 0, -1)
  ) {}

  getHashCode(): number {
    return hashFloat2(this.origin.getHashCode(), this.direction.getHashCode());
  }

  set(origin: Vec3, direction: Vec3): this {
    origin.clone(this.origin);
    direction.clone(this.direction);

    return this;
  }

  clone(result = new Ray3()): Ray3 {
    return result.set(this.origin, this.direction);
  }

  copy(s: Ray3): this {
    return this.set(s.origin, s.direction);
  }
}
