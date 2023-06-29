import { hashFloat3 } from './utils/hash.js';

export class ColorHSV {
  static readonly NUM_COMPONENTS = 3;

  constructor(public h = 0, public s = 0, public v = 0) {}

  getHashCode(): number {
    return hashFloat3(this.h, this.s, this.v);
  }

  clone(result = new ColorHSV()): ColorHSV {
    return result.set(this.h, this.s, this.v);
  }
  copy(v: ColorHSV): this {
    return this.set(v.h, v.s, v.v);
  }

  set(h: number, s: number, v: number): this {
    this.h = h;
    this.s = s;
    this.v = v;
    return this;
  }

  setComponent(index: number, value: number): this {
    switch (index) {
      case 0:
        this.h = value;
        break;
      case 1:
        this.s = value;
        break;
      case 2:
        this.v = value;
        break;
      default:
        throw new Error(`index is out of range: ${index}`);
    }
    return this;
  }

  getComponent(index: number): number {
    switch (index) {
      case 0:
        return this.h;
      case 1:
        return this.s;
      case 2:
        return this.v;
      default:
        throw new Error(`index is out of range: ${index}`);
    }
  }
}
