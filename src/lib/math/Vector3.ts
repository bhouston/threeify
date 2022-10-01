//
// based on Vector3 from Three.js
//
// Authors:
// * @bhouston
//

import { hashFloat3 } from '../core/hash';
import { clamp } from './Functions';
import { IPrimitive } from './IPrimitive';

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

  get r(): number {
    return this.x;
  }

  set r(r: number) {
    this.x = r;
  }

  get g(): number {
    return this.y;
  }

  set g(g: number) {
    this.y = g;
  }

  get b(): number {
    return this.z;
  }

  set b(b: number) {
    this.z = b;
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
    return this.set(v.x, v.y, v.z);
  }

  add(v: Vector3): this {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;

    return this;
  }

  addScalar(s: number): this {
    this.x += s;
    this.y += s;
    this.z += s;

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

  negate(): this {
    this.x *= -1;
    this.y *= -1;
    this.z *= -1;

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
    if (index === 0) {
      return this.x;
    } if (index === 1) {
      return this.y;
    } if (index === 2) {
      return this.z;
    }
    throw new Error(`index of our range: ${index}`);
  }

  setComponent(index: number, value: number): this {
    if (index === 0) {
      this.x = value;
    } else if (index === 1) {
      this.y = value;
    } else if (index === 2) {
      this.z = value;
    } else {
      throw new Error(`index of our range: ${index}`);
    }

    return this;
  }

  dot(v: Vector3): number {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  cross(v: Vector3): this {
    const ax = this.x;
    const ay = this.y;
    const az = this.z;
    const bx = v.x;
    const by = v.y;
    const bz = v.z;

    this.x = ay * bz - az * by;
    this.y = az * bx - ax * bz;
    this.z = ax * by - ay * bx;

    return this;
  }

  length(): number {
    return Math.sqrt(this.lengthSquared());
  }

  lengthSquared(): number {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  distanceToSquared(v: Vector3): number {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    const dz = this.z - v.z;
    return dx * dx + dy * dy + dz * dz;
  }

  distanceTo(v: Vector3): number {
    return Math.sqrt(this.distanceToSquared(v));
  }

  min(v: Vector3): this {
    this.x = Math.min(this.x, v.x);
    this.y = Math.min(this.y, v.y);
    this.z = Math.min(this.z, v.z);

    return this;
  }

  max(v: Vector3): this {
    this.x = Math.max(this.x, v.x);
    this.y = Math.max(this.y, v.y);
    this.z = Math.max(this.z, v.z);

    return this;
  }

  clamp(min: Vector3, max: Vector3): this {
    this.x = clamp(this.x, min.x, max.x);
    this.y = clamp(this.y, min.y, max.y);
    this.z = clamp(this.z, min.z, max.z);

    return this;
  }

  equals(v: Vector3): boolean {
    return v.x === this.x && v.y === this.y && v.z === this.z;
  }

  setFromArray(array: Float32Array, offset: number): void {
    this.x = array[offset + 0];
    this.y = array[offset + 1];
    this.z = array[offset + 2];
  }

  toArray(array: Float32Array, offset: number): void {
    array[offset + 0] = this.x;
    array[offset + 1] = this.y;
    array[offset + 2] = this.z;
  }
}
