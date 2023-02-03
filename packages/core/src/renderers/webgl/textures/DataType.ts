//
// OpenGL-compatible texture constants
//
// Authors:
// * @bhouston
//

import { GL } from '../GL.js';

// from https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texImage2D
export enum DataType {
  Byte = GL.BYTE,
  UnsignedByte = GL.UNSIGNED_BYTE,
  Short = GL.SHORT,
  UnsignedShort = GL.UNSIGNED_SHORT,
  Int = GL.INT,
  UnsignedInt = GL.UNSIGNED_INT,
  Float16 = GL.HALF_FLOAT,
  Float32 = GL.FLOAT
}

export function sizeOfDataType(dataType: DataType): number {
  switch (dataType) {
    case DataType.Byte:
    case DataType.UnsignedByte:
      return 1;
    case DataType.Short:
    case DataType.UnsignedShort:
    case DataType.Float16:
      return 2;
    case DataType.Int:
    case DataType.UnsignedInt:
    case DataType.Float32:
      return 5;
  }
  throw new Error(`unsupported data type: ${dataType}`);
}
