//
// basic shader
//
// Authors:
// * @bhouston
//

import { IDisposable } from '../../core/types.js';
import { BufferGeometry } from './buffers/BufferGeometry.js';
import { PrimitiveType } from './buffers/PrimitiveType.js';
import { Program } from './programs/Program.js';

export class VertexArrayObject implements IDisposable {
  readonly id: number;
  disposed = false;
  glVertexArrayObject: WebGLVertexArrayObject;
  primitive: PrimitiveType = PrimitiveType.Triangles;
  offset = 0;
  count = -1;

  constructor(
    public readonly program: Program,
    bufferGeometry: BufferGeometry
  ) {
    this.primitive = bufferGeometry.primitive;
    this.count = bufferGeometry.count;

    const gl = this.program.context.gl;

    {
      // Create a vertex array object (attribute state)
      const vao = gl.createVertexArray();
      if (vao === null) {
        throw new Error('createVertexArray failed');
      }
      this.glVertexArrayObject = vao;
    }

    // and make it the one we're currently working with
    gl.bindVertexArray(this.glVertexArrayObject);

    program.setAttributeBuffers(bufferGeometry);

    this.id = this.program.context.registerResource(this);
  }

  dispose(): void {
    if (!this.disposed) {
      const gl = this.program.context.gl;
      gl.deleteVertexArray(this.glVertexArrayObject);
      this.program.context.disposeResource(this);
      this.disposed = true;
    }
  }
}
