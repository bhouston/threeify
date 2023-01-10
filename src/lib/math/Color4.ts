import { hashFloat4 } from '../core/hash';

export class Color4 {
  constructor(
    public r: number = 0,
    public g: number = 0,
    public b: number = 0,
    public a: number = 0
  ) {}

  getHashCode(): number {
    return hashFloat4(this.r, this.g, this.b, this.a);
  }

  clone(result = new Color4()): Color4 {
    return result.set(this.r, this.g, this.b, this.a);
  }

  set(r: number, g: number, b: number, a: number): this {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
    return this;
  }
}
