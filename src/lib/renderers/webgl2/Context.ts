//
// basic context
//
// Authors:
// * @bhouston
//

import { BufferPool } from './Buffer.js';
import { ProgramPool, Program } from './Program.js';
import { TexImage2DPool } from './TexImage2D.js';
import { Framebuffer } from './Framebuffer.js';
import { Box2 } from '../../math/Box2.js';
import { Vector3 } from '../../math/Vector3.js';
import { Vector2 } from '../../math/Vector2.js';

export class Context {
	canvas: HTMLCanvasElement;
	gl: WebGL2RenderingContext;
	TexImage2DPool: TexImage2DPool = new TexImage2DPool(this);
	programPool: ProgramPool = new ProgramPool(this);
	bufferPool: BufferPool = new BufferPool(this);

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		{
			let gl = canvas.getContext('webgl2');
			if (!gl) {
				throw new Error('webgl2 not supported');
			}
			this.gl = gl;
		}
	}

	private cachedActiveProgram: Program | null = null;
	set program(program: Program | null) {
		if (this.cachedActiveProgram !== program) {
			if (program) {
				this.gl.useProgram(program.glProgram);
			} else {
				this.gl.useProgram(null);
			}
			this.cachedActiveProgram = program;
		}
	}
	get program(): Program | null {
		return this.cachedActiveProgram;
	}

	private cachedFramebuffer: Framebuffer | null = null;
	set framebuffer(framebuffer: Framebuffer | null) {
		if (this.cachedFramebuffer !== framebuffer) {
			if (framebuffer) {
				this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, framebuffer.glFramebuffer);
			} else {
				this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
			}
			this.cachedFramebuffer = framebuffer;
		}
	}
	get framebuffer(): Framebuffer | null {
		return this.cachedFramebuffer;
	}

	private cachedScissor: Box2 = new Box2();
	get scissor(): Box2 {
		return this.cachedScissor;
	}
	set scissor(scissor: Box2) {
		if (!this.cachedScissor.equals(scissor)) {
			this.gl.scissor(scissor.x, scissor.y, scissor.width, scissor.height);
			this.cachedScissor.copy(scissor);
		}
	}

	private cachedViewport: Box2 = new Box2();
	get viewport(): Box2 {
		return this.cachedViewport;
	}
	set viewport(viewport: Box2) {
		if (!this.cachedViewport.equals(viewport)) {
			this.gl.scissor(viewport.x, viewport.y, viewport.width, viewport.height);
			this.cachedViewport.copy(viewport);
		}
	}
}
