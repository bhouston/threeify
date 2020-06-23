//
// based on Color from Three.js
//
// Authors:
// * @bhouston
//

import { hashFloat3 } from "../core/hash";
import { IPrimitive } from "./IPrimitive";

export class Color implements IPrimitive<Color> {
  constructor(public r = 0, public g = 0, public b = 0) {}

  getHashCode(): number {
    return hashFloat3(this.r, this.g, this.b);
  }

  clone(): Color {
    return new Color().copy(this);
  }
  set(r: number, g: number, b: number): this {
    this.r = r;
    this.g = g;
    this.b = b;
    return this;
  }

  copy(c: Color): this {
    return this.set(c.r, c.g, c.b);
  }

  add(c: Color): this {
    this.r += c.r;
    this.g += c.g;
    this.b += c.b;

    return this;
  }

  multiplyByScalar(s: number): Color {
    this.r *= s;
    this.g *= s;
    this.b *= s;

    return this;
  }

  getComponent(index: number): number {
    if (index === 0) {
      return this.r;
    } else if (index === 1) {
      return this.g;
    } else if (index === 2) {
      return this.b;
    } else {
      throw new Error(`index of our range: ${index}`);
    }
  }

  setComponent(index: number, value: number): this {
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

  toHex(): number {
    return ((this.r * 255) << 16) ^ ((this.g * 255) << 8) ^ ((this.b * 255) << 0);
  }

  toHexString(): string {
    return ("000000" + this.toHex().toString(16)).slice(-6);
  }

  equals(c: Color): boolean {
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
