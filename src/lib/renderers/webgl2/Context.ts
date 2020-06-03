//
// basic context
//
// Authors:
// * @bhouston
//

import { Box2 } from '../../math/Box2.js';
import { BlendState } from './BlendState.js';
import { BufferPool } from './Buffer.js';
import { ClearState } from './ClearState.js';
import { DepthTestState } from './DepthTestState.js';
import { Framebuffer } from './Framebuffer.js';
import { MaskState } from './MaskState.js';
import { Program, ProgramPool } from './Program.js';
import { TexImage2DPool } from './TexImage2D.js';

const GL = WebGLRenderingContext;
const GL2 = WebGL2RenderingContext;

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

	private cachedBlendState: BlendState = new BlendState();
	get blendState(): BlendState {
		return this.cachedBlendState; // this is a bug if it is modified after read.
	}
	set blendState(blendState: BlendState) {
		if (this.cachedBlendState !== blendState) {
			if (blendState.enabled) {
				this.gl.enable(GL.BLEND);
			} else {
				this.gl.disable(GL.BLEND);
			}
			this.cachedBlendState = blendState;
		}
		if (this.cachedBlendState.equation !== blendState.equation) {
			this.gl.blendEquation(blendState.equation);
			this.cachedBlendState.equation = blendState.equation;
		}
		if (this.cachedBlendState.sourceFactor !== blendState.sourceFactor || this.cachedBlendState.destFactor !== blendState.destFactor) {
			this.gl.blendFunc(blendState.sourceFactor, blendState.destFactor);
			this.cachedBlendState.sourceFactor = blendState.sourceFactor;
			this.cachedBlendState.destFactor = blendState.destFactor;
		}
	}

	private cachedDepthTestState: DepthTestState = new DepthTestState();
	get depthTestState(): DepthTestState {
		return this.cachedDepthTestState;
	}
	set depthTestState(depthTestState: DepthTestState) {
		if (this.cachedDepthTestState.enabled !== depthTestState.enabled) {
			if (depthTestState.enabled) {
				this.gl.enable(GL.DEPTH_TEST);
			} else {
				this.gl.disable(GL.DEPTH_TEST);
			}
			this.cachedDepthTestState.enabled = depthTestState.enabled;
		}
		if (this.cachedDepthTestState.func !== depthTestState.func) {
			this.gl.depthFunc(depthTestState.func);
			this.cachedDepthTestState.func = depthTestState.func;
		}
	}

	private cachedClearState: ClearState = new ClearState();
	get clearState(): ClearState {
		return this.cachedClearState;
	}
	set clearState(clearState: ClearState) {
		if (!this.cachedClearState.color.equals(clearState.color) || this.cachedClearState.alpha !== clearState.alpha) {
			this.gl.clearColor(
				clearState.color.r,
				clearState.color.g,
				clearState.color.b,
				clearState.alpha,
			);
			this.cachedClearState.color.copy(clearState.color);
			this.cachedClearState.alpha = clearState.alpha;
		}
		if (this.cachedClearState.depth !== clearState.depth) {
			this.gl.clearDepth(clearState.depth);
			this.cachedClearState.depth = clearState.depth;
		}
		if (this.cachedClearState.stencil !== clearState.stencil) {
			this.gl.clearStencil(clearState.stencil);
			this.cachedClearState.stencil = clearState.stencil;
		}
	}

	private cachedMaskState: MaskState = new MaskState();
	get maskState(): MaskState {
		return this.cachedMaskState;
	}
	set maskState(maskState: MaskState) {
		if (this.cachedMaskState.red !== maskState.red || this.cachedMaskState.green !== maskState.green || this.cachedMaskState.blue !== maskState.blue || this.cachedMaskState.alpha !== maskState.alpha) {
			this.gl.colorMask(
				maskState.red,
				maskState.green,
				maskState.blue,
				maskState.alpha,
			);
			this.cachedMaskState.red = maskState.red;
			this.cachedMaskState.green = maskState.green;
			this.cachedMaskState.blue = maskState.blue;
			this.cachedMaskState.alpha = maskState.alpha;
		}
		if (this.cachedMaskState.depth !== maskState.depth) {
			this.gl.depthMask(maskState.depth);
		}
		if (this.cachedMaskState.stencil !== maskState.stencil) {
			this.gl.stencilMask(maskState.stencil);
		}
	}

	// gl.colorMask(true, true, true, false);
	//void gl.depthMask(flag); // boolean
	//gl.stencilMask(mask);
}
