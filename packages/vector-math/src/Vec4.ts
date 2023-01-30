import { hashFloat4 } from './utils/hash';

export class Vec4 {
  static readonly NUM_COMPONENTS = 4;

  constructor(public x = 0, public y = 0, public z = 0, public w = 0) {}
  getHashCode(): number {
    return hashFloat4(this.x, this.y, this.z, this.w);
  }

  clone(result = new Vec4()): Vec4 {
    return result.set(this.x, this.y, this.z, this.w);
  }

  copy(v: Vec4): this {
    return this.set(v.x, v.y, v.z, v.w);
  }

  set(x: number, y: number, z: number, w: number): this {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
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
      case 2:
        this.z = value;
        break;
      case 3:
        this.w = value;
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
      case 2:
        return this.z;
      case 3:
        return this.w;
      default:
        throw new Error(`index is out of range: ${index}`);
    }
  }
}
