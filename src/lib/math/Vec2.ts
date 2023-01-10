import { hashFloat2 } from '../core/hash';

export class Vec2 {
  constructor(public x: number = 0, public y: number = 0) {}

  getHashCode(): number {
    return hashFloat2(this.x, this.y);
  }

  clone(result = new Vec2()): Vec2 {
    return result.set(this.x, this.y);
  }

  set(x: number, y: number): this {
    this.x = x;
    this.y = y;
    return this;
  }
}
