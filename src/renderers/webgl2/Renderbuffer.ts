import { RenderingContext } from './RenderingContext.js';
import { Vector2 } from '../../math/Vector2.js';
import { IDisposable } from '../../model/interfaces.js';
import { VertexArrayObject } from './VertexArrayObject.js';
import { Program } from './Program.js';
import { ProgramUniform } from './ProgramUniform.js';
import { Color } from '../../math/Color.js';

export class Renderbuffer implements IDisposable {
	disposed: boolean = false;
	context: RenderingContext;
	glRenderbuffer: WebGLRenderbuffer;

	constructor(context: RenderingContext) {
		this.context = context;

		let gl = this.context.gl;

		{
			let glRenderbuffer = gl.createRenderbuffer();
			if (!glRenderbuffer) throw new Error('createRenderbuffer failed');

			this.glRenderbuffer = glRenderbuffer;
		}
	}

	dispose() {
		if (!this.disposed) {
			let gl = this.context.gl;
			gl.deleteRenderbuffer(this.glRenderbuffer);
			this.disposed = true;
		}
	}
}
