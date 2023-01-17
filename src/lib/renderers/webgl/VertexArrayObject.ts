//
// basic shader
//
// Authors:
// * @bhouston
//

import { generateUUID } from '../../core/generateUuid.js';
import { BufferGeometry } from './buffers/BufferGeometry.js';
import { PrimitiveType } from './buffers/PrimitiveType.js';
import { IResource } from './IResource.js';
import { Program } from './programs/Program.js';

export class VertexArrayObject implements IResource {
  public readonly id = generateUUID();
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

    const { gl, resources } = this.program.context;

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

    resources.register(this);
  }

  dispose(): void {
    if (!this.disposed) {
      const { gl, resources } = this.program.context;
      gl.deleteVertexArray(this.glVertexArrayObject);
      resources.unregister(this);
      this.disposed = true;
    }
  }
}
