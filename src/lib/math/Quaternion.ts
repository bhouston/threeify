//
// based on Quaternion from Three.js
//
// Authors:
// * @bhouston
//

import { hashFloat4 } from "../core/hash";
import { IPrimitive } from "./IPrimitive";

export class Quaternion implements IPrimitive<Quaternion> {
  constructor(public x = 0, public y = 0, public z = 0, public w = 1) {}

  getHashCode(): number {
    return hashFloat4(this.x, this.y, this.z, this.w);
  }

  clone(): Quaternion {
    return new Quaternion().copy(this);
  }

  copy(q: Quaternion): this {
    this.x = q.x;
    this.y = q.y;
    this.z = q.x;
    this.w = q.w;

    return this;
  }

  add(q: Quaternion): this {
    this.x += q.x;
    this.y += q.y;
    this.z += q.z;
    this.w += q.w;

    return this;
  }

  sub(q: Quaternion): this {
    this.x -= q.x;
    this.y -= q.y;
    this.z -= q.z;
    this.w -= q.w;

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

  multiply(q: Quaternion): this {
    // from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm

    const qax = this.x,
      qay = this.y,
      qaz = this.z,
      qaw = this.w;
    const qbx = q.x,
      qby = q.y,
      qbz = q.z,
      qbw = q.w;

    this.x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
    this.y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
    this.z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
    this.w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

    return this;
  }

  angleTo(q: Quaternion): number {
    return 2 * Math.acos(Math.abs(Math.min(Math.max(this.dot(q), -1), 1)));
  }

  dot(q: Quaternion): number {
    return this.x * q.x + this.y * q.y + this.z * q.z + this.w * q.w;
  }

  conjugate(): this {
    this.x *= -1;
    this.y *= -1;
    this.z *= -1;

    return this;
  }

  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
  }

  normalize(): this {
    let l = this.length();

    if (l === 0) {
      this.x = 0;
      this.y = 0;
      this.z = 0;
      this.w = 1;
    } else {
      l = 1 / l;

      this.x *= l;
      this.y *= l;
      this.z *= l;
      this.w *= l;
    }

    return this;
  }

  slerp(qb: Quaternion, t: number): this {
    if (t === 0) {
      return this;
    }
    if (t === 1) {
      return this.copy(qb);
    }

    const x = this.x,
      y = this.y,
      z = this.z,
      w = this.w;

    // http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/
    // TODO, allocate x, y, z, w and only set this.* at the end.

    let cosHalfTheta = w * qb.w + x * qb.x + y * qb.y + z * qb.z;

    if (cosHalfTheta < 0) {
      this.w = -qb.w;
      this.x = -qb.x;
      this.y = -qb.y;
      this.z = -qb.z;

      cosHalfTheta = -cosHalfTheta;
    } else {
      this.copy(qb);
    }

    if (cosHalfTheta >= 1.0) {
      this.w = w;
      this.x = x;
      this.y = y;
      this.z = z;

      return this;
    }

    const sqrSinHalfTheta = 1.0 - cosHalfTheta * cosHalfTheta;

    if (sqrSinHalfTheta <= Number.EPSILON) {
      const s = 1 - t;
      this.w = s * w + t * this.w;
      this.x = s * x + t * this.x;
      this.y = s * y + t * this.y;
      this.z = s * z + t * this.z;

      this.normalize();

      return this;
    }

    const sinHalfTheta = Math.sqrt(sqrSinHalfTheta);
    const halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta);
    const ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta,
      ratioB = Math.sin(t * halfTheta) / sinHalfTheta;

    this.w = w * ratioA + this.w * ratioB;
    this.x = x * ratioA + this.x * ratioB;
    this.y = y * ratioA + this.y * ratioB;
    this.z = z * ratioA + this.z * ratioB;

    return this;
  }

  equals(q: Quaternion): boolean {
    return q.x === this.x && q.y === this.y && q.z === this.z && q.w === this.w;
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
