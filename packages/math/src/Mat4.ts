// uses OpenGL matrix layout where each column is specified subsequently in order from left to right.
// [ 0  4   8  12] x ( x, y, z, 1 ) = ( x', y', z', 1 )
// [ 1  5   9  13]
// [ 2  6  10  14]
// [ 3  7  11  15]
// where elements 12, 13, and 14 would be translation in 3D, as they would multiplied
// by the last virtual element of the 3D vector.

export type Mat4JSON = number[];

export class Mat4 {
  static readonly NUM_ROWS = 4;
  static readonly NUM_COLUMNS = 4;
  static readonly NUM_COMPONENTS = Mat4.NUM_ROWS * Mat4.NUM_COLUMNS;

  constructor(
    public readonly elements = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
  ) {
    if (elements.length !== Mat4.NUM_COMPONENTS) {
      throw new Error(
        `elements must have length ${Mat4.NUM_COMPONENTS}, got ${elements.length}`
      );
    }
  }

  clone(result = new Mat4()): Mat4 {
    return result.set(this.elements);
  }
  set(elements: number[]): this {
    if (elements.length !== Mat4.NUM_COMPONENTS) {
      throw new Error(
        `elements must have length ${Mat4.NUM_COMPONENTS}, got ${elements.length}`
      );
    }
    for (let i = 0; i < Mat4.NUM_COMPONENTS; i++) {
      this.elements[i] = elements[i];
    }
    return this;
  }

  copy(m: Mat4): this {
    return this.set(m.elements);
  }
}
