import { Context } from './Context.js';
import { BufferTarget } from '../../core/BufferTarget.js';
import { BufferUsage } from './BufferUsage.js';
import { IDisposable } from '../../interfaces/Standard.js';

export class Buffer implements IDisposable {
	context: Context;
	target: BufferTarget;
	usage: BufferUsage;
	glBuffer: WebGLBuffer;

	constructor(
		context: Context,
		arrayBuffer: ArrayBuffer,
		target: BufferTarget,
		usage: BufferUsage = BufferUsage.StaticDraw,
	) {
		this.context = context;
		this.target = target;
		this.usage = usage;

		let gl = context.gl;
		// Create a buffer and put three 2d clip space points in it
		{
			let glBuffer = gl.createBuffer();
			if (!glBuffer) {
				throw new Error('can not create buffer');
			}
			this.glBuffer = glBuffer;
		}

		// Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
		gl.bindBuffer(this.target, this.glBuffer);

		// load data
		gl.bufferData(this.target, arrayBuffer, this.usage);
	}

	dispose() {
		this.context.gl.deleteBuffer(this.glBuffer);
	}
}
