//
// maps onto void gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer
//
// Authors:
// * @bhouston
//

import { AttributeAccessor } from '../../core/AttributeAccessor.js';
import { ComponentType } from '../../core/ComponentType.js';
import { Buffer } from './Buffer.js';
import { Context } from './Context.js';

export class VertexAttribute {
	buffer: Buffer;
	componentType: ComponentType;
	componentsPerVertex: number;
	normalized: boolean;
	vertexStride: number;
	byteOffset: number;

	constructor(
		buffer: Buffer,
		componentType: ComponentType,
		componentsPerVertex: number,
		normalized: boolean,
		vertexStride: number,
		byteOffset: number,
	) {
		this.buffer = buffer;
		this.byteOffset = byteOffset;
		this.componentType = componentType;
		this.componentsPerVertex = componentsPerVertex;
		this.normalized = normalized;
		this.vertexStride = vertexStride;
		this.byteOffset = byteOffset;
	}

	static FromAttributeAccessor(
		context: Context,
		attributeAccessor: AttributeAccessor,
	) {
		let attributeView = attributeAccessor.attributeView;

		let buffer = new Buffer(
			context,
			attributeView.arrayBuffer,
			attributeView.target,
		);
		let vertexAttribute = new VertexAttribute(
			buffer,
			attributeAccessor.componentType,
			attributeAccessor.componentsPerVertex,
			false,
			attributeView.byteStride,
			attributeView.byteOffset + attributeAccessor.byteOffset,
		);

		return vertexAttribute;
	}
}
