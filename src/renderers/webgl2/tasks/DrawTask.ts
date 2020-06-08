//
// render task
//
// Authors:
// * @bhouston
//

import { PrimitiveType } from '../PrimitiveType';
import { Program } from '../Program';
import { RenderingContext } from '../RenderingContext';
import { VertexArrayObject } from '../VertexArrayObject';
import { ITask } from './ITask';

export class DrawTask implements ITask {
	program: Program;
	vertexArrayObject: VertexArrayObject;
	uniformValues: any;
	primitiveType: PrimitiveType;
	offset: number = 0;
	count: number = 0;

	constructor(
		program: Program,
		vertexArrayObject: VertexArrayObject,
		uniformValues: any,
		primitiveType: PrimitiveType,
		offset: number,
		count: number,
	) {
		this.program = program;
		this.vertexArrayObject = vertexArrayObject;
		this.uniformValues = uniformValues;
		this.primitiveType = primitiveType;
		this.offset = offset;
		this.count = count;
	}

	execute(context: RenderingContext) {
		let gl = context.gl;

		context.program = this.program;

		// set attributes
		gl.bindVertexArray(this.vertexArrayObject.glVertexArrayObject);

		// set uniforms
		this.program.setUniformValues(this.uniformValues);

		// draw primitives
		//if( this.indexed ) {
		//    gl.drawElements( this.primitiveType, this.count, this.elementType, this.offset ); // TODO: Support indexed geometry draws
		//}
		gl.drawArrays(this.primitiveType, this.offset, this.count);
	}
}
