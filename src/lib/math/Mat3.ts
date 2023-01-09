//
// based on Mat4 from Three.js
//
// Authors:
// * @bhouston
//

import { hashFloatArray } from '../core/hash.js';
import { IPrimitive } from './IPrimitive.js';

//
// NOTE: This is a homogeneous matrix, it is not a 3x3 rotation only.
//
export class Mat3 implements IPrimitive<Mat3> {
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
    n33: number
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

  clone(): Mat3 {
    return new Mat3().copy(this);
  }

  copy(m: Mat3): this {
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

  equals(m: Mat3): boolean {
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
