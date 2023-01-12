import { hashFloat2 } from '../core/hash';

export class Vec2 {
  constructor(public x = 0, public y = 0) {}

  getHashCode(): number {
    return hashFloat2(this.x, this.y);
  }

  clone(result = new Vec2()): Vec2 {
    return result.set(this.x, this.y);
  }

  copy(v: Vec2): this {
    return this.set(v.x, v.y);
  }

  set(x: number, y: number): this {
    this.x = x;
    this.y = y;
    return this;
  }

  setComponent(index: number, value: number): this {
    switch (index) {
      case 0:
        this.x = value;
        break;
      case 1:
        this.y = value;
        break;
      default:
        throw new Error(`index is out of range: ${index}`);
    }
    return this;
  }

  getComponent(index: number): number {
    switch (index) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      default:
        throw new Error(`index is out of range: ${index}`);
    }
  }
}
