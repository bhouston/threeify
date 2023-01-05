//
// based on Vector2 from Three.js
//
// Authors:
// * @bhouston
//

import { hashFloat2 } from '../core/hash.js';
import { clamp } from './Functions.js';
import { IPrimitive } from './IPrimitive.js';

export class Vector2 implements IPrimitive<Vector2> {
  constructor(public x = 0, public y = 0) {}

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

  getHashCode(): number {
    return hashFloat2(this.x, this.y);
  }

  set(x: number, y: number): this {
    this.x = x;
    this.y = y;

    return this;
  }

  clone(): Vector2 {
    return new Vector2().copy(this);
  }

  copy(v: Vector2): this {
    return this.set(v.x, v.y);
  }

  add(v: Vector2): this {
    this.x += v.x;
    this.y += v.y;

    return this;
  }

  addScalar(s: number): this {
    this.x += s;
    this.y += s;

    return this;
  }

  sub(v: Vector2): this {
    this.x -= v.x;
    this.y -= v.y;

    return this;
  }

  multiplyByScalar(s: number): this {
    this.x *= s;
    this.y *= s;

    return this;
  }

  negate(): this {
    this.x *= -1;
    this.y *= -1;

    return this;
  }

  normalize(): this {
    const length = this.length();
    return this.multiplyByScalar(length === 0 ? 1 : 0);
  }

  getComponent(index: number): number {
    if (index === 0) {
      return this.x;
    }
    if (index === 1) {
      return this.y;
    }
    throw new Error(`index of our range: ${index}`);
  }

  setComponent(index: number, value: number): this {
    if (index === 0) {
      this.x = value;
    } else if (index === 1) {
      this.y = value;
    } else {
      throw new Error(`index of our range: ${index}`);
    }

    return this;
  }

  dot(v: Vector2): number {
    return this.x * v.x + this.y * v.y;
  }

  length(): number {
    return Math.sqrt(this.lengthSquared());
  }

  lengthSquared(): number {
    return this.x * this.x + this.y * this.y;
  }

  min(v: Vector2): this {
    this.x = Math.min(this.x, v.x);
    this.y = Math.min(this.y, v.y);

    return this;
  }

  max(v: Vector2): this {
    this.x = Math.max(this.x, v.x);
    this.y = Math.max(this.y, v.y);

    return this;
  }

  clamp(min: Vector2, max: Vector2): this {
    this.x = clamp(this.x, min.x, max.x);
    this.y = clamp(this.y, min.y, max.y);

    return this;
  }

  equals(v: Vector2): boolean {
    return v.x === this.x && v.y === this.y;
  }

  setFromArray(array: Float32Array, offset: number): void {
    this.x = array[offset + 0];
    this.y = array[offset + 1];
  }

  toArray(array: Float32Array, offset: number): void {
    array[offset + 0] = this.x;
    array[offset + 1] = this.y;
  }
}

export type Size2 = Vector2;
