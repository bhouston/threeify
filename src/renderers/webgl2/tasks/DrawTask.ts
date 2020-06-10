//
// render task
//
// Authors:
// * @bhouston
//

import { PrimitiveType } from "../PrimitiveType";
import { Program } from "../Program";
import { RenderingContext } from "../RenderingContext";
import { VertexArrayObject } from "../VertexArrayObject";
import { ITask } from "./ITask";

export class DrawTask implements ITask {
  constructor(
    public program: Program,
    public vertexArrayObject: VertexArrayObject,
    public uniformValues: any,
    public primitiveType: PrimitiveType,
    public offset = 0,
    public count = 0,
  ) {}

  execute(context: RenderingContext): void {
    const gl = context.gl;

    context.program = this.program;

    // set attributes
    gl.bindVertexArray(this.vertexArrayObject.glVertexArrayObject);

    // set uniforms
    this.program.setUniformValues(this.uniformValues);

    // draw primitives
    // if( this.indexed ) {
    //   TODO: Support indexed geometry draws
    //   gl.drawElements(this.primitiveType, this.count, this.elementType, this.offset);
    // }
    gl.drawArrays(this.primitiveType, this.offset, this.count);
  }
}
