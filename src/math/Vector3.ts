//
// based on Vector3 from Three.js
//
// Authors:
// * @bhouston
//

import { hashFloat3 } from "../core/hash";
import { IPrimitive } from "./IPrimitive";
import { Matrix4 } from "./Matrix4";

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

  clone(): Vector3 {
    return new Vector3().copy(this);
  }

  copy(v: Vector3): this {
    this.x = v.x;
    this.y = v.y;
    this.z = v.x;

    return this;
  }

  add(v: Vector3): this {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;

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

  // TODO: think about moving this to a helper function -- it may allow for better code shaking...
  // homogeneous coordinate projection
  transformMatrix4(m: Matrix4): this {
    const x = this.x,
      y = this.y,
      z = this.z;
    const e = m.elements;

    const w = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);

    this.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * w;
    this.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * w;
    this.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * w;

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
