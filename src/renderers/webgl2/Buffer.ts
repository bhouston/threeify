import { AttributeView } from "../../core/AttributeView";
import { BufferTarget } from "../../core/BufferTarget";
import { IDisposable } from "../../types/types";
import { Pool } from "../Pool";
import { RenderingContext } from "./RenderingContext";

const GL = WebGLRenderingContext;
const GL2 = WebGL2RenderingContext;

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
  StreamDraw = GL2.STREAM_DRAW,
  /**
   * The contents are intended to be specified once by reading data from WebGL,
   * and queried many times by the application.
   */
  StaticRead = GL2.STATIC_READ,
  /**
   * The contents are intended to be re-specified repeatedly by reading data
   * from WebGL, and queried many times by the application.
   */
  DynamicRead = GL2.DYNAMIC_READ,
  /**
   * The contents are intended to be specified once by reading data from WebGL,
   * and queried at most a few times by the application
   */
  StreamRead = GL2.STREAM_READ,
  /**
   * The contents are intended to be specified once by reading data from WebGL,
   * and used many times as the source for WebGL drawing and image
   * specification commands.
   */
  StaticCopy = GL2.STATIC_COPY,
  /**
   * The contents are intended to be re-specified repeatedly by reading data
   * from WebGL, and used many times as the source for WebGL drawing and image
   * specification commands.
   */
  DynamicCopy = GL2.DYNAMIC_COPY,
  /**
   * The contents are intended to be specified once by reading data from WebGL,
   * and used at most a few times as the source for WebGL drawing and image
   * specification commands.
   */
  StreamCopy = GL2.STREAM_COPY,
}

export class Buffer implements IDisposable {
  disposed = false;
  glBuffer: WebGLBuffer;

  constructor(
    public context: RenderingContext,
    arrayBuffer: ArrayBuffer,
    public target: BufferTarget = BufferTarget.Array,
    public usage: BufferUsage = BufferUsage.StaticDraw,
  ) {
    const gl = context.gl;
    // Create a buffer and put three 2d clip space points in it
    {
      const glBuffer = gl.createBuffer();
      if (!glBuffer) {
        throw new Error("createBuffer failed");
      }

      this.glBuffer = glBuffer;
    }

    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(this.target, this.glBuffer);

    // load data
    gl.bufferData(this.target, arrayBuffer, this.usage);
  }

  update(
    arrayBuffer: ArrayBuffer,
    target: BufferTarget = BufferTarget.Array,
    usage: BufferUsage = BufferUsage.StaticDraw,
  ): void {
    this.target = target;
    this.usage = usage;

    const gl = this.context.gl;

    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(this.target, this.glBuffer);

    // load data
    gl.bufferData(this.target, arrayBuffer, this.usage);
  }

  dispose(): void {
    if (!this.disposed) {
      this.context.gl.deleteBuffer(this.glBuffer);
      this.disposed = true;
    }
  }
}

export class BufferPool extends Pool<AttributeView, Buffer> {
  constructor(context: RenderingContext) {
    super(context, (context: RenderingContext, attributeView: AttributeView, buffer: Buffer | null) => {
      if (!buffer) {
        return new Buffer(context, attributeView.arrayBuffer, attributeView.target);
      }
      buffer.update(attributeView.arrayBuffer, attributeView.target);
      return buffer;
    });
  }
}
