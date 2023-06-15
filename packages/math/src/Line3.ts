//
// based on Line3 from Three.js
//
// Authors:
// * @bhouston
//

import { hashFloat2 } from './utils/hash';
import { Vec3 } from './Vec3';

export class Line3 {
  constructor(
    public readonly start = new Vec3(),
    public readonly end = new Vec3()
  ) {}

  getHashCode(): number {
    return hashFloat2(this.start.getHashCode(), this.end.getHashCode());
  }

  set(start: Vec3, end: Vec3): this {
    this.start.copy(start);
    this.end.copy(end);

    return this;
  }

  clone(): Line3 {
    return new Line3().copy(this);
  }

  copy(l: Line3): this {
    this.start.copy(l.start);
    this.end.copy(l.end);

    return this;
  }
}
