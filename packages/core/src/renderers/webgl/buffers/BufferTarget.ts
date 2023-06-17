import { GL } from '../GL';

export enum BufferTarget {
  /**
   * Buffer containing vertex attributes, such as vertex coordinates, texture
   * coordinate data, or vertex color data.
   */
  Array = GL.ARRAY_BUFFER,
  /**
   * Buffer used for element indices.
   */
  ElementArray = GL.ELEMENT_ARRAY_BUFFER,
  /**
   * Buffer for copying from one buffer object to another.
   */
  // CopyRead = GL2.COPY_READ_BUFFER,
  /**
   * Buffer for copying from one buffer object to another.
   */
  // CopyWrite = GL2.COPY_WRITE_BUFFER,
  /**
   * Buffer for transform feedback operations.
   */
  // TransformFeedback = GL2.TRANSFORM_FEEDBACK_BUFFER,
  /**
   * Buffer used for storing uniform blocks.
   */
  Uniform = GL.UNIFORM_BUFFER
  /**
   * Buffer used for pixel transfer operations.
   */
  // PixelPack = GL2.PIXEL_PACK_BUFFER,
  /**
   * Buffer used for pixel transfer operations.
   */
  // PixelUnpack = GL2.PIXEL_UNPACK_BUFFER,
}
