//
// based on Box3 from Three.js
//
// Authors:
// * @bhouston
//

import { hashFloat2 } from '../core/hash.js';
import { Vec3 } from './Vec3.js';

export class Box3 {
  constructor(
    public min = new Vec3(
      Number.POSITIVE_INFINITY,
      Number.POSITIVE_INFINITY,
      Number.POSITIVE_INFINITY
    ),
    public max = new Vec3(
      Number.NEGATIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
      Number.NEGATIVE_INFINITY
    )
  ) {}

  getHashCode(): number {
    return hashFloat2(this.min.getHashCode(), this.max.getHashCode());
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
