import { Vec3 } from './Vec3.js';

export class Box3 {
  constructor(
    public readonly min = new Vec3(
      Number.POSITIVE_INFINITY,
      Number.POSITIVE_INFINITY,
      Number.POSITIVE_INFINITY
    ),
    public readonly max = new Vec3(
      Number.NEGATIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
      Number.NEGATIVE_INFINITY
    )
  ) {}

  get x(): number {
    return this.min.x;
  }
  get y(): number {
    return this.min.y;
  }
  get z(): number {
    return this.min.z;
  }
  get width(): number {
    return this.max.x - this.min.x;
  }
  get height(): number {
    return this.max.y - this.min.y;
  }
  get depth(): number {
    return this.max.z - this.min.z;
  }

  set(min: Vec3, max: Vec3): this {
    min.clone(this.min);
    max.clone(this.max);

    return this;
  }

  clone(result = new Box3()): Box3 {
    return result.copy(this);
  }

  copy(box: Box3): this {
    box.min.clone(this.min);
    box.max.clone(this.max);

    return this;
  }
}
