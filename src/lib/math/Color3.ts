import { hashFloat3 } from '../core/hash';

export class Color3 {
  constructor(public r = 0, public g = 0, public b = 0) {}

  getHashCode(): number {
    return hashFloat3(this.r, this.g, this.b);
  }

  clone(result = new Color3()): Color3 {
    return result.set(this.r, this.g, this.b);
  }
  copy(v: Color3): this {
    return this.set(v.r, v.g, v.b);
  }

  set(r: number, g: number, b: number): this {
    this.r = r;
    this.g = g;
    this.b = b;
    return this;
  }
}
