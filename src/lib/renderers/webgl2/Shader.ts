//
// basic shader
//
// Authors:
// * @bhouston
//

import { Context } from './Context.js';

export enum ShaderType {
	Vertex = WebGL2RenderingContext.VERTEX_SHADER,
	Fragment = WebGL2RenderingContext.FRAGMENT_SHADER,
}

export class Shader {
	context: Context;
	sourceCode: string;
	shaderType: ShaderType;
	glShader: WebGLShader;

	constructor(context: Context, sourceCode: string, shaderType: ShaderType) {
		this.context = context;
		this.sourceCode = sourceCode;
		this.shaderType = shaderType;

		let gl = this.context.gl;

		// Create the shader object
		{
			let glShader = gl.createShader(shaderType);
			if (!glShader) {
				throw new Error('could not create shader');
			}
			this.glShader = glShader;
		}

		// Set the shader source code.
		gl.shaderSource(this.glShader, sourceCode);

		// Compile the shader
		gl.compileShader(this.glShader);

		// Check if it compiled
		var success = gl.getShaderParameter(this.glShader, gl.COMPILE_STATUS);
		if (!success) {
			// Something went wrong during compilation; get the error
			throw new Error(
				'could not compile shader:' + gl.getShaderInfoLog(this.glShader),
			);
		}
	}
}
