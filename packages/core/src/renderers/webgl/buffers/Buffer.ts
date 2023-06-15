import { generateUUID } from '../../../core/generateUuid';
import { IResource } from '../IResource';
import { RenderingContext } from '../RenderingContext';
import { BufferTarget } from './BufferTarget';
import { BufferUsage } from './BufferUsage';

export class Buffer implements IResource {
  public readonly id = generateUUID();
  public disposed = false;
  public version = 0;
  public glBuffer: WebGLBuffer;
  public byteLength = -1;

  constructor(
    public context: RenderingContext,
    arrayBuffer: ArrayBuffer,
    public target: BufferTarget = BufferTarget.Array,
    public usage: BufferUsage = BufferUsage.StaticDraw
  ) {
    const { gl, resources } = context;
    // Create a buffer and put three 2d clip space points in it
    {
      const glBuffer = gl.createBuffer();
      if (glBuffer === null) {
        throw new Error('createBuffer failed');
      }

      this.glBuffer = glBuffer;
    }

    resources.register(this);

    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    this.write(arrayBuffer);
  }

  write(arrayBuffer: ArrayBuffer): void {
    const { gl } = this.context;

    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(this.target, this.glBuffer);

    // load data
    gl.bufferData(this.target, arrayBuffer, this.usage);
    this.byteLength = arrayBuffer.byteLength;
  }

  writeSubData(
    arrayBufferView: ArrayBufferView,
    writeOffsetInBytes: number,
    readOffsetInElements = 0,
    sizeInElements: number
  ): void {
    const { gl } = this.context;
    // Bind the buffer to tell WebGL we are working on this buffer
    gl.bindBuffer(this.target, this.glBuffer);

    // Write data into the buffer
    gl.bufferSubData(
      gl.UNIFORM_BUFFER,
      writeOffsetInBytes,
      arrayBufferView,
      readOffsetInElements,
      sizeInElements
    );
  }

  dispose(): void {
    if (this.disposed) return;

    const { gl, resources } = this.context;
    gl.deleteBuffer(this.glBuffer);
    resources.unregister(this);
    this.disposed = true;
  }
}
