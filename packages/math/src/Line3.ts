//
// based on Line3 from Three.js
//
// Authors:
// * @bhouston
//

import { Vec3 } from './Vec3.js';

export class Line3 {
  static readonly NUM_COMPONENTS = 6;

  constructor(
    public readonly start = new Vec3(),
    public readonly end = new Vec3()
  ) {}

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
