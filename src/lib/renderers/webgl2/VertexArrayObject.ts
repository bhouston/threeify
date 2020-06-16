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

  constructor(public program: Program, bufferGeometry: BufferGeometry) {
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

    bufferGeometry.bufferAccessors.forEach((bufferAccessor, name) => {
      const attribute = this.program.attributes.get(name);
      if (attribute === null) {
        // only bind the attributes that exist in the program.
        return;
      }

      gl.enableVertexAttribArray(attribute.glLocation);

      // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
      const buffer = bufferAccessor.buffer;
      gl.bindBuffer(buffer.target, buffer.glBuffer);

      // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
      gl.vertexAttribPointer(
        attribute.glLocation,
        bufferAccessor.componentsPerVertex,
        bufferAccessor.componentType,
        bufferAccessor.normalized,
        bufferAccessor.vertexStride,
        bufferAccessor.byteOffset,
      );
    });
  }
}
