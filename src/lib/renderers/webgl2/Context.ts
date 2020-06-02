//
// basic context
//
// Authors:
// * @bhouston
//

import { Pool } from "../Pool.js";
import { Texture } from "../../textures/Texture.js";
import { TextureImage2D, TextureImage2DPool } from "./TextureImage2D.js";
import { AttributeView } from "../../core/AttributeView.js";
import { Buffer, BufferPool } from "./Buffer.js";
import { Program, ProgramPool } from "./Program.js";

export class Context {
	canvas: HTMLCanvasElement;
	gl: WebGL2RenderingContext;
	textureImage2DPool: TextureImage2DPool = new TextureImage2DPool( this );
	programPool: ProgramPool = new ProgramPool( this );
	bufferPool: BufferPool = new BufferPool( this );

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
}
