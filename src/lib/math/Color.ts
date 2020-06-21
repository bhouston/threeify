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

  copy(c: Color): this {
    this.r = c.r;
    this.g = c.g;
    this.b = c.b;

    return this;
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
    switch (index) {
      case 0:
        return this.r;
      case 1:
        return this.g;
      case 2:
        return this.b;
      default:
        throw new Error(`index of our range: ${index}`);
    }
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

  setFromArray(floatArray: Float32Array, offset: number): void {
    this.r = floatArray[offset + 0];
    this.g = floatArray[offset + 1];
    this.b = floatArray[offset + 2];
  }

  toArray(floatArray: Float32Array, offset: number): void {
    floatArray[offset + 0] = this.r;
    floatArray[offset + 1] = this.g;
    floatArray[offset + 2] = this.b;
  }
}
