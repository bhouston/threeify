import { hashFloat3 } from './utils/hash';

export class Color3 {
  static readonly NUM_COMPONENTS = 3;

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

  setComponent(index: number, value: number): this {
    switch (index) {
      case 0:
        this.r = value;
        break;
      case 1:
        this.g = value;
        break;
      case 2:
        this.b = value;
        break;
      default:
        throw new Error(`index is out of range: ${index}`);
    }
    return this;
  }

  getComponent(index: number): number {
    switch (index) {
      case 0:
        return this.r;
      case 1:
        return this.g;
      case 2:
        return this.b;
      default:
        throw new Error(`index is out of range: ${index}`);
    }
  }
}
