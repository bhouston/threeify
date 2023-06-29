import { hashFloat3 } from './utils/hash.js';

export class ColorHSL {
  static readonly NUM_COMPONENTS = 3;

  constructor(public h = 0, public s = 0, public l = 0) {}

  getHashCode(): number {
    return hashFloat3(this.h, this.s, this.l);
  }

  clone(result = new ColorHSL()): ColorHSL {
    return result.set(this.h, this.s, this.l);
  }
  copy(v: ColorHSL): this {
    return this.set(v.h, v.s, v.l);
  }

  set(h: number, s: number, l: number): this {
    this.h = h;
    this.s = s;
    this.l = l;
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
        this.l = value;
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
        return this.l;
      default:
        throw new Error(`index is out of range: ${index}`);
    }
  }
}
