import { IDisposable } from '../../../core/types.js';
import { RenderingContext } from '../RenderingContext.js';
import { BufferTarget } from './BufferTarget.js';
import { BufferUsage } from './BufferUsage.js';

export class Buffer implements IDisposable {
  readonly id: number;
  disposed = false;
  glBuffer: WebGLBuffer;

  constructor(
    public context: RenderingContext,
    arrayBuffer: ArrayBuffer,
    public target: BufferTarget = BufferTarget.Array,
    public usage: BufferUsage = BufferUsage.StaticDraw
  ) {
    const { gl } = context;
    // Create a buffer and put three 2d clip space points in it
    {
      const glBuffer = gl.createBuffer();
      if (glBuffer === null) {
        throw new Error('createBuffer failed');
      }

      this.glBuffer = glBuffer;
    }

    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    // console.log(`gl.bindBuffer(${this.target}, ${this.glBuffer})`);
    gl.bindBuffer(this.target, this.glBuffer);

    // load data
    // console.log(`gl.bufferData(${this.target}, ${arrayBuffer}, ${this.usage})`);
    gl.bufferData(this.target, arrayBuffer, this.usage);

    this.id = this.context.registerResource(this);
  }

  update(
    arrayBuffer: ArrayBuffer,
    target: BufferTarget = BufferTarget.Array,
    usage: BufferUsage = BufferUsage.StaticDraw
  ): void {
    this.target = target;
    this.usage = usage;

    const { gl } = this.context;

    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(this.target, this.glBuffer);

    // load data
    gl.bufferData(this.target, arrayBuffer, this.usage);
  }

  dispose(): void {
    if (!this.disposed) {
      this.context.gl.deleteBuffer(this.glBuffer);
      this.context.disposeResource(this);
      this.disposed = true;
    }
  }
}
