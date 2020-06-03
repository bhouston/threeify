//
// render task
//
// Authors:
// * @bhouston
//

import { Color } from '../../../math/Color';
import { AttachmentFlags, Framebuffer } from '../Framebuffer';
import { ITask } from './ITask';
import { Context } from '../Context';
import { Program } from '../Program';
import { VertexAttributeGeometry } from '../VertexAttributeGeometry';
import { VertexArrayObject } from '../VertexArrayObject';
import { UniformValue } from '../UniformValue';
import { PrimitiveType } from '../PrimitiveType';

export class DrawTask implements ITask {
	program: Program;
	vertexArrayObject: VertexArrayObject;
	uniformValues: Array<UniformValue>;
	primitiveType: PrimitiveType;
	offset: number = 0;
	count: number = 0;

	constructor(
		program: Program,
		vertexArrayObject: VertexArrayObject,
		uniformValues: Array<UniformValue>,
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

	execute(context: Context) {
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
