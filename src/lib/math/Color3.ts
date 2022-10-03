//
// based on Color3 from Three.js
//
// Authors:
// * @bhouston
//

import { hashFloat3 } from '../core/hash';
import { clamp } from './Functions';
import { IPrimitive } from './IPrimitive';

export class Color3 implements IPrimitive<Color3> {
  constructor(public r = 0, public g = 0, public b = 0) {}

  getHashCode(): number {
    return hashFloat3(this.r, this.g, this.b);
  }

  set(r: number, g: number, b: number): this {
    this.r = r;
    this.g = g;
    this.b = b;

    return this;
  }

  clone(): Color3 {
    return new Color3().copy(this);
  }

  copy(c: Color3): this {
    return this.set(c.r, c.g, c.b);
  }

  add(c: Color3): this {
    this.r += c.r;
    this.g += c.g;
    this.b += c.b;

    return this;
  }

  addScalar(s: number): this {
    this.r += s;
    this.g += s;
    this.b += s;

    return this;
  }

  sub(c: Color3): this {
    this.r -= c.r;
    this.g -= c.g;
    this.b -= c.b;

    return this;
  }

  multiplyByScalar(s: number): this {
    this.r *= s;
    this.g *= s;
    this.b *= s;

    return this;
  }

  lerp(c: Color3, alpha: number): this {
    this.r += (c.r - this.r) * alpha;
    this.g += (c.g - this.g) * alpha;
    this.b += (c.b - this.b) * alpha;

    return this;
  }

  getElement(index: number): number {
    if (index === 0) {
      return this.r;
    }
    if (index === 1) {
      return this.g;
    }
    if (index === 2) {
      return this.b;
    }
    throw new Error(`index of our range: ${index}`);
  }

  setElement(index: number, value: number): this {
    if (index === 0) {
      this.r = value;
    } else if (index === 1) {
      this.g = value;
    } else if (index === 2) {
      this.b = value;
    } else {
      throw new Error(`index of our range: ${index}`);
    }

    return this;
  }

  min(c: Color3): this {
    this.r = Math.min(this.r, c.r);
    this.g = Math.min(this.g, c.g);
    this.b = Math.min(this.b, c.b);

    return this;
  }

  max(c: Color3): this {
    this.r = Math.max(this.r, c.r);
    this.g = Math.max(this.g, c.g);
    this.b = Math.max(this.b, c.b);

    return this;
  }

  clamp(min: Color3, max: Color3): this {
    this.r = clamp(this.r, min.r, max.r);
    this.g = clamp(this.g, min.g, max.g);
    this.b = clamp(this.b, min.b, max.b);

    return this;
  }

  equals(c: Color3): boolean {
    return c.r === this.r && c.g === this.g && c.b === this.b;
  }

  setFromArray(array: Float32Array, offset: number): void {
    this.r = array[offset + 0];
    this.g = array[offset + 1];
    this.b = array[offset + 2];
  }

  toArray(array: Float32Array, offset: number): void {
    array[offset + 0] = this.r;
    array[offset + 1] = this.g;
    array[offset + 2] = this.b;
  }
}
