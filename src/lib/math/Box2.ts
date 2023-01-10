//
// based on Box2 from Three.js
//
// Authors:
// * @bhouston
//

import { hashFloat2 } from '../core/hash.js';
import { Vec2 } from './Vec2.js';

export class Box2 {
  constructor(
    public min = new Vec2(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY),
    public max = new Vec2(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY)
  ) {}

  get x(): number {
    return this.min.x;
  }
  get y(): number {
    return this.min.y;
  }
  get width(): number {
    return this.max.x - this.min.x;
  }
  get height(): number {
    return this.max.y - this.min.y;
  }

  getHashCode(): number {
    return hashFloat2(this.min.getHashCode(), this.max.getHashCode());
  }

  set(min: Vec2, max: Vec2): this {
    min.clone(this.min);
    max.clone(this.max);

    return this;
  }

  clone(result = new Box2()): Box2 {
    return result.copy(this);
  }

  copy(box: Box2): this {
    box.min.clone(this.min);
    box.max.clone(this.max);

    return this;
  }
}
