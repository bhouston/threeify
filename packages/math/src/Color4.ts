import { hashFloat4 } from './utils/hash.js';

export class Color4 {
  static readonly NUM_COMPONENTS = 4;

  // using these functions instead of static properties to avoid
  // issues where people modify the constants.
  static get Transparent() {
    return new Color4(0, 0, 0, 0);
  }
  static get Black() {
    return new Color4(0, 0, 0, 1);
  }
  static get White() {
    return new Color4(1, 1, 1, 1);
  }
  static get Red() {
    return new Color4(1, 0, 0, 1);
  }
  static get Green() {
    return new Color4(0, 1, 0, 1);
  }
  static get Blue() {
    return new Color4(0, 0, 1, 1);
  }
  static get Yellow() {
    return new Color4(1, 1, 0, 1);
  }
  static get Magenta() {
    return new Color4(1, 0, 1, 1);
  }
  static get Cyan() {
    return new Color4(0, 1, 1, 1);
  }

  constructor(public r = 0, public g = 0, public b = 0, public a = 0) {}

  getHashCode(): number {
    return hashFloat4(this.r, this.g, this.b, this.a);
  }

  clone(result = new Color4()): Color4 {
    return result.set(this.r, this.g, this.b, this.a);
  }

  copy(v: Color4): this {
    return this.set(v.r, v.g, v.b, v.a);
  }

  set(r: number, g: number, b: number, a: number): this {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
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
      case 3:
        this.a = value;
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
      case 3:
        return this.a;
      default:
        throw new Error(`index is out of range: ${index}`);
    }
  }
}
