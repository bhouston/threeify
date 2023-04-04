import { Vec3 } from './Vec3.js';

export class Plane {
  static readonly NUM_COMPONENTS = 4;

  constructor(
    public readonly normal = new Vec3(0, 0, -1),
    public distance = 0 // distance of plane from origin in the normal direction, this is -1* the Three.js plane constant
  ) {}

  set(normal: Vec3, distance: number): this {
    normal.clone(this.normal);
    this.distance = distance;

    return this;
  }

  clone(): Plane {
    return new Plane().copy(this);
  }

  copy(plane: Plane): this {
    plane.normal.clone(this.normal);
    this.distance = plane.distance;

    return this;
  }
}
