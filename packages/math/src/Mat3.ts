// uses OpenGL matrix layout where each column is specified subsequently in order from left to right.
// ( x, y, 1 ) x [ 0  3  6 ] = ( x', y', 1 )
//               [ 1  4  7 ]
//               [ 2  5  8 ]
// where elements 2 and 5 would be translation in 2D, as they would multiplied
// by the last virtual element of the 2D vector.

export type Mat3JSON = number[];

export class Mat3 {
  static readonly NUM_ROWS = 3;
  static readonly NUM_COLUMNS = 3;
  static readonly NUM_COMPONENTS = Mat3.NUM_ROWS * Mat3.NUM_COLUMNS;

  constructor(public readonly elements = [1, 0, 0, 0, 1, 0, 0, 0, 1]) {
    if (elements.length !== Mat3.NUM_COMPONENTS) {
      throw new Error(
        `elements must have length ${Mat3.NUM_COMPONENTS}, got ${elements.length}`
      );
    }
  }

  clone(result = new Mat3()): Mat3 {
    return result.set(this.elements);
  }
  set(elements: number[]): this {
    if (elements.length !== Mat3.NUM_COMPONENTS) {
      throw new Error(
        `elements must have length ${Mat3.NUM_COMPONENTS}, got ${elements.length}`
      );
    }
    for (let i = 0; i < Mat3.NUM_COMPONENTS; i++) {
      this.elements[i] = elements[i];
    }
    return this;
  }

  copy(m: Mat3): this {
    return this.set(m.elements);
  }
}
