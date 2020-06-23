//
// basic shader
//
// Authors:
// * @bhouston
//

import { IDisposable } from "../../core/types";
import { BufferGeometry } from "./buffers/BufferGeometry";
import { PrimitiveType } from "./buffers/PrimitiveType";
import { Program } from "./programs/Program";

export class VertexArrayObject implements IDisposable {
  disposed = false;
  glVertexArrayObject: WebGLVertexArrayObject;
  primitive: PrimitiveType = PrimitiveType.Triangles;
  offset = 0;
  count = -1;

  constructor(public readonly program: Program, bufferGeometry: BufferGeometry) {
    this.primitive = bufferGeometry.primitive;
    this.count = bufferGeometry.count;

    const glxVAO = this.program.context.glx.OES_vertex_array_object;

    {
      // Create a vertex array object (attribute state)
      const vao = glxVAO.createVertexArrayOES();
      if (vao === null) {
        throw new Error("createVertexArray failed");
      }
      this.glVertexArrayObject = vao;
    }

    // and make it the one we're currently working with
    glxVAO.bindVertexArrayOES(this.glVertexArrayObject);

    program.setAttributeBuffers(bufferGeometry);
  }

  dispose(): void {
    if (!this.disposed) {
      const glxVAO = this.program.context.glx.OES_vertex_array_object;
      glxVAO.deleteVertexArrayOES(this.glVertexArrayObject);
      this.disposed = true;
    }
  }
}
