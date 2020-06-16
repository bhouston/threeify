//
// basic shader
//
// Authors:
// * @bhouston
//

import { BufferGeometry } from "./buffers/BufferGeometry";
import { PrimitiveType } from "./buffers/PrimitiveType";
import { Program } from "./programs/Program";

export class VertexArrayObject {
  glVertexArrayObject: WebGLVertexArrayObject;
  primitive: PrimitiveType = PrimitiveType.Triangles;
  offset = 0;
  count = -1;

  constructor(public readonly program: Program, bufferGeometry: BufferGeometry) {
    this.primitive = bufferGeometry.primitive;
    this.count = bufferGeometry.count;

    const gl = this.program.context.gl;

    {
      // Create a vertex array object (attribute state)
      const vao = gl.createVertexArray();
      if (vao === null) {
        throw new Error("createVertexArray failed");
      }
      this.glVertexArrayObject = vao;
    }

    // and make it the one we're currently working with
    gl.bindVertexArray(this.glVertexArrayObject);

    program.setAttributeBuffers(bufferGeometry);
  }
}
