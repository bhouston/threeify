//
// based on Matrix4 from Three.js
//
// Authors:
// * @bhouston
//

import { hashFloatArray } from '../core/hash';
import { IPrimitive } from './IPrimitive';

export class Matrix4 implements IPrimitive<Matrix4> {
  elements: number[] = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

  getHashCode(): number {
    return hashFloatArray(this.elements);
  }

  set(
    n11: number,
    n12: number,
    n13: number,
    n14: number,
    n21: number,
    n22: number,
    n23: number,
    n24: number,
    n31: number,
    n32: number,
    n33: number,
    n34: number,
    n41: number,
    n42: number,
    n43: number,
    n44: number,
  ): this {
    const te = this.elements;

    te[0] = n11;
    te[4] = n12;
    te[8] = n13;
    te[12] = n14;
    te[1] = n21;
    te[5] = n22;
    te[9] = n23;
    te[13] = n24;
    te[2] = n31;
    te[6] = n32;
    te[10] = n33;
    te[14] = n34;
    te[3] = n41;
    te[7] = n42;
    te[11] = n43;
    te[15] = n44;

    return this;
  }

  clone(): Matrix4 {
    return new Matrix4().copy(this);
  }

  copy(m: Matrix4): this {
    const me = m.elements;
    return this.set(
      me[0],
      me[4],
      me[8],
      me[12],
      me[1],
      me[5],
      me[9],
      me[13],
      me[2],
      me[6],
      me[10],
      me[14],
      me[3],
      me[7],
      me[11],
      me[15],
    );
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
    te[4] *= s;
    te[8] *= s;
    te[12] *= s;
    te[1] *= s;
    te[5] *= s;
    te[9] *= s;
    te[13] *= s;
    te[2] *= s;
    te[6] *= s;
    te[10] *= s;
    te[14] *= s;
    te[3] *= s;
    te[7] *= s;
    te[11] *= s;
    te[15] *= s;

    return this;
  }

  makeIdentity(): this {
    return this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  }

  equals(m: Matrix4): boolean {
    for (let i = 0; i < 16; i++) {
      if (m.elements[i] !== this.elements[i]) {
        return false;
      }
    }

    return true;
  }

  setFromArray(array: Float32Array, offset: number): void {
    for (let i = 0; i < this.elements.length; i++) {
      this.elements[i] = array[offset + i];
    }
  }

  toArray(array: Float32Array, offset: number): void {
    for (let i = 0; i < this.elements.length; i++) {
      array[offset + i] = this.elements[i];
    }
  }
}
