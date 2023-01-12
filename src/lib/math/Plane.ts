import { hashFloat4 } from '../core/hash.js';
import { Vec3 } from './Vec3.js';

export class Plane {
  constructor(public normal = new Vec3(0, 0, -1), public constant = 0) {}

  getHashCode(): number {
    return hashFloat4(
      this.normal.x,
      this.normal.y,
      this.normal.z,
      this.constant
    );
  }

  set(normal: Vec3, constant: number): this {
    normal.clone(this.normal);
    this.constant = constant;

    return this;
  }

  clone(): Plane {
    return new Plane().copy(this);
  }

  copy(plane: Plane): this {
    plane.normal.clone(this.normal);
    this.constant = plane.constant;

    return this;
  }
}
