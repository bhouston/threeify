//
// based on Vector2 from Three.js
//
// Authors:
// * @bhouston
//

import { hashFloat2 } from "../core/hash";
import { IPrimitive } from "./IPrimitive";

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
    this.x = v.x;
    this.y = v.y;

    return this;
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
    switch (index) {
      case 0:
        return this.x;
      case 1:
        return this.y;
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
      default:
        throw new Error(`index of our range: ${index}`);
    }

    return this;
  }

  numComponents(): 2 {
    return 2;
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
    // assumes min < max, componentwise

    this.x = Math.max(min.x, Math.min(max.x, this.x));
    this.y = Math.max(min.y, Math.min(max.y, this.y));

    return this;
  }

  equals(v: Vector2): boolean {
    return v.x === this.x && v.y === this.y;
  }

  setFromArray(floatArray: Float32Array, offset: number): void {
    this.x = floatArray[offset + 0];
    this.y = floatArray[offset + 1];
  }

  toArray(floatArray: Float32Array, offset: number): void {
    floatArray[offset + 0] = this.x;
    floatArray[offset + 1] = this.y;
  }
}
