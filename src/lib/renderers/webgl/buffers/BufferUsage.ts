import { GL } from "../GL";

export enum BufferUsage {
  /**
   * The contents are intended to be specified once by the application, and
   * used many times as the source for WebGL drawing and image specification
   * commands.
   */
  StaticDraw = GL.STATIC_DRAW,
  /**
   * The contents are intended to be re-specified repeatedly by the
   * application, and used many times as the source for WebGL drawing and image
   * specification commands.
   */
  DynamicDraw = GL.DYNAMIC_DRAW,
  /**
   * The contents are intended to be specified once by the application, and
   * used at most a few times as the source for WebGL drawing and image
   * specification commands.
   */
  // StreamDraw = GL2.STREAM_DRAW,
  /**
   * The contents are intended to be specified once by reading data from WebGL,
   * and queried many times by the application.
   */
  // StaticRead = GL2.STATIC_READ,
  /**
   * The contents are intended to be re-specified repeatedly by reading data
   * from WebGL, and queried many times by the application.
   */
  // DynamicRead = GL2.DYNAMIC_READ,
  /**
   * The contents are intended to be specified once by reading data from WebGL,
   * and queried at most a few times by the application
   */
  // StreamRead = GL2.STREAM_READ,
  /**
   * The contents are intended to be specified once by reading data from WebGL,
   * and used many times as the source for WebGL drawing and image
   * specification commands.
   */
  // StaticCopy = GL2.STATIC_COPY,
  /**
   * The contents are intended to be re-specified repeatedly by reading data
   * from WebGL, and used many times as the source for WebGL drawing and image
   * specification commands.
   */
  // DynamicCopy = GL2.DYNAMIC_COPY,
  /**
   * The contents are intended to be specified once by reading data from WebGL,
   * and used at most a few times as the source for WebGL drawing and image
   * specification commands.
   */
  // StreamCopy = GL2.STREAM_COPY,
}
