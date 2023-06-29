import { hashFloat3 } from './utils/hash.js';

export class Vec3 {
  static readonly NUM_COMPONENTS = 3;

  // using these functions instead of static properties to avoid
  // issues where people modify the constants.
  static get Zero() {
    return new Vec3(0, 0, 0);
  }

  constructor(public x = 0, public y = 0, public z = 0) {}

  getHashCode(): number {
    return hashFloat3(this.x, this.y, this.z);
  }

  clone(result = new Vec3()): Vec3 {
    return result.set(this.x, this.y, this.z);
  }

  copy(v: Vec3): this {
    return this.set(v.x, v.y, v.z);
  }

  set(x: number, y: number, z: number): this {
    this.x = x;
    this.y = y;
    this.z = z;
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
      default:
        throw new Error(`index is out of range: ${index}`);
    }
  }
}
