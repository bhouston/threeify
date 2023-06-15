//
// OpenGL-compatible component types for attribute buffers
//
// Authors:
// * @bhouston
//

import { GL } from '../GL';

export enum ComponentType {
  /**
   * signed 8-bit integer, with values in [-128, 127]
   */
  Byte = GL.BYTE,
  /**
   * unsigned 8-bit integer, with values in [0, 255]
   */
  UnsignedByte = GL.UNSIGNED_BYTE,
  /**
   * signed 16-bit integer, with values in [-32768, 32767]
   */
  Short = GL.SHORT,
  /**
   * unsigned 16-bit integer, with values in [0, 65535]
   */
  UnsignedShort = GL.UNSIGNED_SHORT,
  /**
   * unsigned 32-bit integer, with values in [0, ]
   */
  Int = GL.INT,
  /**
   * unsigned 32-bit integer, with values in [0, ]
   */
  UnsignedInt = GL.UNSIGNED_INT,
  /**
   * 32-bit IEEE floating point number
   */
  Float = GL.FLOAT
  /**
   * 16-bit IEEE floating point number
   */
  // HalfFloat = GL2.HALF_FLOAT,
}

export function componentTypeSizeOf(componentType: ComponentType): number {
  switch (componentType) {
    case ComponentType.Byte:
    case ComponentType.UnsignedByte:
      return 1;
    // case ComponentType.HalfFloat:
    case ComponentType.Short:
    case ComponentType.UnsignedShort:
      return 2;
    case ComponentType.Float:
    case ComponentType.Int:
    case ComponentType.UnsignedInt:
      return 4;
  }
  throw new Error(`unsupported component type: ${componentType}`);
}
