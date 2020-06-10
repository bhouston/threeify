//
// OpenGL-compatible texture constants
//
// Authors:
// * @bhouston
//

const GL = WebGLRenderingContext;
const GL2 = WebGL2RenderingContext;

export enum BufferTarget {
  Array = GL.ARRAY_BUFFER, // Buffer containing vertex attributes, such as vertex coordinates, texture coordinate data, or vertex color data.
  ElementArray = GL.ARRAY_BUFFER, // Buffer used for element indices.
  CopyRead = GL2.COPY_READ_BUFFER, // Buffer for copying from one buffer object to another.
  CopyWrite = GL2.COPY_WRITE_BUFFER, // Buffer for copying from one buffer object to another.
  TransformFeedback = GL2.TRANSFORM_FEEDBACK_BUFFER, // Buffer for transform feedback operations.
  Uniform = GL2.UNIFORM_BUFFER, // Buffer used for storing uniform blocks.
  PixelPack = GL2.PIXEL_PACK_BUFFER, // Buffer used for pixel transfer operations.
  PixelUnpack = GL2.PIXEL_UNPACK_BUFFER, // Buffer used for pixel transfer operations.
}
