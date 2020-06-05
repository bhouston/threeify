import { AttributeView } from '../../core/AttributeView.js';
import { BufferTarget } from '../../core/BufferTarget.js';
import { IDisposable } from '../../model/interfaces.js';
import { Pool } from '../Pool.js';
import { BufferUsage } from './BufferUsage.js';
import { Context } from './Context.js';

export class Buffer implements IDisposable {
	disposed: boolean = false;
	context: Context;
	glBuffer: WebGLBuffer;
	target: BufferTarget = BufferTarget.Array;
	usage: BufferUsage = BufferUsage.StaticDraw;

	constructor(
		context: Context,
		arrayBuffer: ArrayBuffer,
		target: BufferTarget = BufferTarget.Array,
		usage: BufferUsage = BufferUsage.StaticDraw,
	) {
		this.context = context;
		this.target = target;
		this.usage = usage;

		let gl = context.gl;
		// Create a buffer and put three 2d clip space points in it
		{
			let glBuffer = gl.createBuffer();
			if (!glBuffer)
				throw new Error('createBuffer failed');
			
			this.glBuffer = glBuffer;
		}

		// Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
		gl.bindBuffer(this.target, this.glBuffer);

		// load data
		gl.bufferData(this.target, arrayBuffer, this.usage);
	}

	update(
		arrayBuffer: ArrayBuffer,
		target: BufferTarget = BufferTarget.Array,
		usage: BufferUsage = BufferUsage.StaticDraw,
	) {
		this.target = target;
		this.usage = usage;

		let gl = this.context.gl;

		// Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
		gl.bindBuffer(this.target, this.glBuffer);

		// load data
		gl.bufferData(this.target, arrayBuffer, this.usage);
	}

	dispose() {
		if (!this.disposed) {
			this.context.gl.deleteBuffer(this.glBuffer);
			this.disposed = true;
		}
	}
}

export class BufferPool extends Pool<AttributeView, Buffer> {
	constructor(context: Context) {
		super(
			context,
			(
				context: Context,
				attributeView: AttributeView,
				buffer: Buffer | null,
			) => {
				if (!buffer) {
					return new Buffer(
						context,
						attributeView.arrayBuffer,
						attributeView.target,
					);
				}
				buffer.update(attributeView.arrayBuffer, attributeView.target);
				return buffer;
			},
		);
	}
}
