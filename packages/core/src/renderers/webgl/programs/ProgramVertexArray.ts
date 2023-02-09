//
// basic shader
//
// Authors:
// * @bhouston
//

import { generateUUID } from '../../../core/generateUuid.js';
import { BufferGeometry } from '../buffers/BufferGeometry.js';
import { PrimitiveType } from '../buffers/PrimitiveType.js';
import { IResource } from '../IResource.js';
import { Program } from './Program.js';

export class ProgramVertexArray implements IResource {
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
    console.log('creating verttex array object', bufferGeometry, program);
    program.setAttributeBuffers(bufferGeometry, true);

    gl.bindVertexArray(null);

    resources.register(this);
  }

  dispose(): void {
    if (this.disposed) return;

    const { gl, resources } = this.program.context;
    gl.deleteVertexArray(this.glVertexArrayObject);
    resources.unregister(this);
    this.disposed = true;
  }
}
