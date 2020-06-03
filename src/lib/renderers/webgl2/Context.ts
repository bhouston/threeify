//
// basic context
//
// Authors:
// * @bhouston
//

import { BufferPool } from './Buffer.js';
import { ProgramPool, Program } from './Program.js';
import { TextureImage2DPool } from './TextureImage2D.js';

export class Context {
	canvas: HTMLCanvasElement;
	gl: WebGL2RenderingContext;
	textureImage2DPool: TextureImage2DPool = new TextureImage2DPool(this);
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
	set activeProgram( program: Program | null ) {
		if( this.cachedActiveProgram !== program ) {
			if( program ) {
				program.reset();
				this.gl.useProgram(program.glProgram);
			}
			else {
				this.gl.useProgram(null);
			}
			this.cachedActiveProgram = program;
		}
	}
	get activeProgram(): Program | null {
		return this.cachedActiveProgram;
	}

}
