import { Vec3 } from './Vec3';

export class Sphere {
  constructor(public readonly center = new Vec3(), public radius = -1) {}

  set(center: Vec3, radius: number): this {
    center.clone(this.center);
    this.radius = radius;

    return this;
  }

  clone(result = new Sphere()): Sphere {
    this.center.clone(result.center);
    result.radius = this.radius;
    return result;
  }

  copy(s: Sphere): this {
    return this.set(s.center, s.radius);
  }
}
