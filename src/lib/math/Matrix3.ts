//
// based on Matrix4 from Three.js
//
// Authors:
// * @bhouston
//

import { hashFloatArray } from "../core/hash";
import { IPrimitive } from "./IPrimitive";

//
// NOTE: This is a homogeneous matrix, it is not a 3x3 rotation only.
//
export class Matrix3 implements IPrimitive<Matrix3> {
  elements: number[] = [1, 0, 0, 0, 1, 0, 0, 0, 1];

  getHashCode(): number {
    return hashFloatArray(this.elements);
  }

  set(
    n11: number,
    n12: number,
    n13: number,
    n21: number,
    n22: number,
    n23: number,
    n31: number,
    n32: number,
    n33: number,
  ): this {
    const te = this.elements;

    te[0] = n11;
    te[1] = n21;
    te[2] = n31;
    te[3] = n12;
    te[4] = n22;
    te[5] = n32;
    te[6] = n13;
    te[7] = n23;
    te[8] = n33;

    return this;
  }

  clone(): Matrix3 {
    return new Matrix3().copy(this);
  }

  copy(m: Matrix3): this {
    const te = this.elements;
    const me = m.elements;

    te[0] = me[0];
    te[1] = me[1];
    te[2] = me[2];
    te[3] = me[3];
    te[4] = me[4];
    te[5] = me[5];
    te[6] = me[6];
    te[7] = me[7];
    te[8] = me[8];

    return this;
  }

  getComponent(index: number): number {
    return this.elements[index];
  }

  setComponent(index: number, value: number): this {
    this.elements[index] = value;

    return this;
  }

  numComponents(): 9 {
    return 9;
  }

  multiplyByScalar(s: number): this {
    const te = this.elements;

    te[0] *= s;
    te[3] *= s;
    te[6] *= s;
    te[1] *= s;
    te[4] *= s;
    te[7] *= s;
    te[2] *= s;
    te[5] *= s;
    te[8] *= s;

    return this;
  }

  makeIdentity(): this {
    this.set(1, 0, 0, 0, 1, 0, 0, 0, 1);

    return this;
  }

  multiply(b: Matrix3): this {
    const ae = this.elements;
    const be = b.elements;
    const te = this.elements;

    const a11 = ae[0],
      a12 = ae[3],
      a13 = ae[6];
    const a21 = ae[1],
      a22 = ae[4],
      a23 = ae[7];
    const a31 = ae[2],
      a32 = ae[5],
      a33 = ae[8];

    const b11 = be[0],
      b12 = be[3],
      b13 = be[6];
    const b21 = be[1],
      b22 = be[4],
      b23 = be[7];
    const b31 = be[2],
      b32 = be[5],
      b33 = be[8];

    te[0] = a11 * b11 + a12 * b21 + a13 * b31;
    te[3] = a11 * b12 + a12 * b22 + a13 * b32;
    te[6] = a11 * b13 + a12 * b23 + a13 * b33;

    te[1] = a21 * b11 + a22 * b21 + a23 * b31;
    te[4] = a21 * b12 + a22 * b22 + a23 * b32;
    te[7] = a21 * b13 + a22 * b23 + a23 * b33;

    te[2] = a31 * b11 + a32 * b21 + a33 * b31;
    te[5] = a31 * b12 + a32 * b22 + a33 * b32;
    te[8] = a31 * b13 + a32 * b23 + a33 * b33;

    return this;
  }

  equals(m: Matrix3): boolean {
    for (let i = 0; i < 16; i++) {
      if (m.elements[i] !== this.elements[i]) {
        return false;
      }
    }

    return true;
  }

  setFromArray(floatArray: Float32Array, offset: number): void {
    for (let i = 0; i < this.elements.length; i++) {
      this.elements[i] = floatArray[offset + i];
    }
  }

  toArray(floatArray: Float32Array, offset: number): void {
    for (let i = 0; i < this.elements.length; i++) {
      floatArray[offset + i] = this.elements[i];
    }
  }
}
