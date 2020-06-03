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
import { BlendState } from './Blend.js';
import { DepthTestState } from './DepthTest.js';
import { ClearState } from './Clear.js';
import { MaskState } from './Mask.js';

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
		return this.cachedBlendState;
	}
	set blendState(blendState: BlendState) {
		if (blendState.enabled) {
			this.gl.enable(GL.BLEND);
		} else {
			this.gl.disable(GL.BLEND);
		}
		this.gl.blendEquation(blendState.equation);
		this.gl.blendFunc(blendState.sourceFactor, blendState.destFactor);
		this.cachedBlendState = blendState;
	}

	private cachedDepthTestState: DepthTestState = new DepthTestState();
	get depthTestState(): DepthTestState {
		return this.cachedDepthTestState;
	}
	set depthTestState(depthTestState: DepthTestState) {
		if (depthTestState.enabled) {
			this.gl.enable(GL.DEPTH_TEST);
		} else {
			this.gl.disable(GL.DEPTH_TEST);
		}
		this.gl.depthFunc(depthTestState.func);
		this.cachedDepthTestState = depthTestState;
	}

	private cachedClearState: ClearState = new ClearState();
	get clearState(): ClearState {
		return this.cachedClearState;
	}
	set clearState(clearState: ClearState) {
		this.gl.clearColor(
			clearState.color.r,
			clearState.color.g,
			clearState.color.b,
			clearState.alpha,
		);
		this.gl.clearDepth(clearState.depth);
		this.gl.clearStencil(clearState.stencil);
		this.cachedClearState = clearState;
	}

	private cachedMaskState: MaskState = new MaskState();
	get maskState(): MaskState {
		return this.cachedMaskState;
	}
	set maskState(maskState: MaskState) {
		this.gl.colorMask(
			maskState.red,
			maskState.green,
			maskState.blue,
			maskState.alpha,
		);
		this.gl.depthMask(maskState.depth);
		this.gl.stencilMask(maskState.stencil);
		this.cachedMaskState = maskState;
	}

	// gl.colorMask(true, true, true, false);
	//void gl.depthMask(flag); // boolean
	//gl.stencilMask(mask);
}
