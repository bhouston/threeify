// uses OpenGL matrix layout where each column is specified subsequently in order from left to right.
// ( x, y, z, 1 ) x [ 0  4   8  12] = ( x', y', z', 1 )
//                  [ 1  5   9  13]
//                  [ 2  6  10  14]
//                  [ 3  7  11  15]
// where elements 3, 7, 11 would be translation in 3D, as they would multiplied
// by the last virtual element of the 3D vector.

import { hashFloatArray } from '../core/hash';

export type Mat4JSON = number[];

export class Mat4 {
  static readonly NUM_ROWS = 4;
  static readonly NUM_COLUMNS = 4;
  static readonly NUM_ELEMENTS = Mat4.NUM_ROWS * Mat4.NUM_COLUMNS;

  constructor(
    public elements: number[] = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
  ) {
    if (elements.length !== Mat4.NUM_ELEMENTS) {
      throw new Error(
        `elements must have length ${Mat4.NUM_ELEMENTS}, got ${elements.length}`
      );
    }
  }

  getHashCode(): number {
    return hashFloatArray(this.elements);
  }

  clone(result = new Mat4()): Mat4 {
    return result.set(this.elements);
  }
  set(elements: number[]): this {
    if (elements.length !== Mat4.NUM_ELEMENTS) {
      throw new Error(
        `elements must have length ${Mat4.NUM_ELEMENTS}, got ${elements.length}`
      );
    }
    for (let i = 0; i < Mat4.NUM_ELEMENTS; i++) {
      this.elements[i] = elements[i];
    }
    return this;
  }
}
