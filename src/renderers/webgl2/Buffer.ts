import { AttributeView } from "../../core/AttributeView";
import { BufferTarget } from "../../core/BufferTarget";
import { IDisposable } from "../../types/types";
import { Pool } from "../Pool";
import { RenderingContext } from "./RenderingContext";
import { BufferUsage } from "./BufferUsage";

const GL = WebGLRenderingContext;
const GL2 = WebGL2RenderingContext;

export class Buffer implements IDisposable {
  disposed = false;
  context: RenderingContext;
  glBuffer: WebGLBuffer;
  target: BufferTarget = BufferTarget.Array;
  usage: BufferUsage = BufferUsage.StaticDraw;

  constructor(
    context: RenderingContext,
    arrayBuffer: ArrayBuffer,
    target: BufferTarget = BufferTarget.Array,
    usage: BufferUsage = BufferUsage.StaticDraw,
  ) {
    this.context = context;
    this.target = target;
    this.usage = usage;

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
