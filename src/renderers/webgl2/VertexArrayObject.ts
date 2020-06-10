//
// basic shader
//
// Authors:
// * @bhouston
//

import { Program } from "./Program";
import { BufferGeometry } from "./BufferGeometry";
import { PrimitiveType } from "./PrimitiveType";

export class VertexArrayObject {
  program: Program;
  glVertexArrayObject: WebGLVertexArrayObject;
  primitive: PrimitiveType = PrimitiveType.Triangles;
  offset = 0;
  count = -1;

  constructor(program: Program, vertexAttributeGeometry: BufferGeometry) {
    this.program = program;
    this.primitive = vertexAttributeGeometry.primitive;
    this.count = vertexAttributeGeometry.count;

    const gl = this.program.context.gl;

    {
      // Create a vertex array object (attribute state)
      const vao = gl.createVertexArray();
      if (!vao) {
        throw new Error("createVertexArray failed");
      }
      this.glVertexArrayObject = vao;
    }

    // and make it the one we're currently working with
    gl.bindVertexArray(this.glVertexArrayObject);

    vertexAttributeGeometry.namedVertexAttributes.forEach((namedVertexAttribute) => {
      const programAttribute = this.program.attributes.find(
        (attribute) => attribute.name === namedVertexAttribute.name,
      );
      if (!programAttribute) {
        // only bind the attributes that exist in the program.
        return;
      }

      gl.enableVertexAttribArray(programAttribute.glLocation);

      // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
      const buffer = namedVertexAttribute.vertexAttribute.buffer;
      gl.bindBuffer(buffer.target, buffer.glBuffer);

      // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
      const vertexAttribute = namedVertexAttribute.vertexAttribute;
      gl.vertexAttribPointer(
        programAttribute.glLocation,
        vertexAttribute.componentsPerVertex,
        vertexAttribute.componentType,
        vertexAttribute.normalized,
        vertexAttribute.vertexStride,
        vertexAttribute.byteOffset,
      );
    });
  }
}
