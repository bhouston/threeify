//
// based on Vector3 from Three.js
//
// Authors:
// * @bhouston
//

import { hashFloat4 } from "../core/hash";
import { IPrimitive } from "./IPrimitive";

export class Vector4 implements IPrimitive<Vector4> {
  constructor(public x = 0, public y = 0, public z = 0, public w = 0) {}

  getHashCode(): number {
    return hashFloat4(this.x, this.y, this.z, this.w);
  }

  set(x: number, y: number, z: number, w: number): this {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;

    return this;
  }

  clone(): Vector4 {
    return new Vector4().copy(this);
  }

  copy(v: Vector4): this {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    this.w = v.w;

    return this;
  }

  add(v: Vector4): this {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    this.w += v.w;

    return this;
  }

  sub(v: Vector4): this {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    this.w -= v.w;

    return this;
  }

  multiplyByScalar(s: number): this {
    this.x *= s;
    this.y *= s;
    this.z *= s;
    this.w *= s;

    return this;
  }

  lerp(v: Vector4, alpha: number): this {
    this.x += (v.x - this.x) * alpha;
    this.y += (v.y - this.y) * alpha;
    this.z += (v.z - this.z) * alpha;
    this.w += (v.w - this.w) * alpha;

    return this;
  }

  normalize(): this {
    const length = this.length();
    return this.multiplyByScalar(length === 0 ? 1 : 1 / length);
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
        throw new Error(`index of our range: ${index}`);
    }
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
        throw new Error(`index of our range: ${index}`);
    }

    return this;
  }

  numComponents(): 4 {
    return 4;
  }

  dot(v: Vector4): number {
    return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
  }

  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
  }

  equals(v: Vector4): boolean {
    return v.x === this.x && v.y === this.y && v.z === this.z && v.w === this.w;
  }

  setFromArray(floatArray: Float32Array, offset: number): void {
    this.x = floatArray[offset + 0];
    this.y = floatArray[offset + 1];
    this.z = floatArray[offset + 2];
    this.w = floatArray[offset + 3];
  }

  toArray(floatArray: Float32Array, offset: number): void {
    floatArray[offset + 0] = this.x;
    floatArray[offset + 1] = this.y;
    floatArray[offset + 2] = this.z;
    floatArray[offset + 3] = this.w;
  }
}
