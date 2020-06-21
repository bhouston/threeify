//
// based on Vector3 from Three.js
//
// Authors:
// * @bhouston
//

import { hashFloat3 } from "../core/hash";
import { IPrimitive } from "./IPrimitive";

export class Vector3 implements IPrimitive<Vector3> {
  constructor(public x = 0, public y = 0, public z = 0) {}

  get width(): number {
    return this.x;
  }
  set width(width: number) {
    this.x = width;
  }

  get height(): number {
    return this.y;
  }
  set height(height: number) {
    this.y = height;
  }

  get depth(): number {
    return this.z;
  }
  set depth(depth: number) {
    this.z = depth;
  }

  getHashCode(): number {
    return hashFloat3(this.x, this.y, this.z);
  }

  set(x: number, y: number, z: number): this {
    this.x = x;
    this.y = y;
    this.z = z;

    return this;
  }

  clone(): Vector3 {
    return new Vector3().copy(this);
  }

  copy(v: Vector3): this {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;

    return this;
  }

  add(v: Vector3): this {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;

    return this;
  }

  sub(v: Vector3): this {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;

    return this;
  }

  multiplyByScalar(s: number): this {
    this.x *= s;
    this.y *= s;
    this.z *= s;

    return this;
  }

  lerp(v: Vector3, alpha: number): this {
    this.x += (v.x - this.x) * alpha;
    this.y += (v.y - this.y) * alpha;
    this.z += (v.z - this.z) * alpha;

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
      default:
        throw new Error(`index of our range: ${index}`);
    }

    return this;
  }

  numComponents(): 3 {
    return 3;
  }

  dot(v: Vector3): number {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  cross(v: Vector3): this {
    const ax = this.x,
      ay = this.y,
      az = this.z;
    const bx = v.x,
      by = v.y,
      bz = v.z;

    this.x = ay * bz - az * by;
    this.y = az * bx - ax * bz;
    this.z = ax * by - ay * bx;

    return this;
  }

  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  equals(v: Vector3): boolean {
    return v.x === this.x && v.y === this.y && v.z === this.z;
  }

  setFromArray(floatArray: Float32Array, offset: number): void {
    this.x = floatArray[offset + 0];
    this.y = floatArray[offset + 1];
    this.z = floatArray[offset + 2];
  }

  toArray(floatArray: Float32Array, offset: number): void {
    floatArray[offset + 0] = this.x;
    floatArray[offset + 1] = this.y;
    floatArray[offset + 2] = this.z;
  }
}
