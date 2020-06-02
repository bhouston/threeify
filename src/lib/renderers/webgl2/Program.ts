//
// basic shader material
//
// Authors:
// * @bhouston
//

import { Shader } from './Shader.js';
import { Context } from './Context.js';
import { ProgramUniform } from './ProgramUniform.js';
import { ProgramAttribute } from './ProgramAttribute.js';
import { IDisposable } from '../../interfaces/Standard.js';
import { ShaderType } from '../../materials/ShaderType.js';
import { ShaderCodeMaterial } from '../../materials/ShaderCodeMaterial.js';
import { Pool } from '../Pool.js';
import { UniformValue } from './UniformValue.js';

export class Program implements IDisposable {
	disposed: boolean = false;
	context: Context;
	vertexShader: Shader;
	fragmentShader: Shader;
	glProgram: WebGLProgram;
	uniforms: Array<ProgramUniform> = [];
	attributes: Array<ProgramAttribute> = [];

	// attributes (required attribute buffers)
	// varying (per instance parameters)

	constructor(context: Context, shaderCodeMaterial: ShaderCodeMaterial) {
		this.context = context;
		this.vertexShader = new Shader(
			this.context,
			shaderCodeMaterial.vertexShaderCode,
			ShaderType.Vertex,
		);
		this.fragmentShader = new Shader(
			this.context,
			shaderCodeMaterial.fragmentShaderCode,
			ShaderType.Fragment,
		);

		let gl = this.context.gl;

		// create a program.
		{
			var glProgram = gl.createProgram();
			if (!glProgram) {
				throw new Error('could not create program');
			}
			this.glProgram = glProgram;
		}

		// attach the shaders.
		gl.attachShader(this.glProgram, this.vertexShader.glShader);
		gl.attachShader(this.glProgram, this.fragmentShader.glShader);

		// link the program.
		gl.linkProgram(this.glProgram);

		// Check if it linked.
		var success = gl.getProgramParameter(this.glProgram, gl.LINK_STATUS);
		if (!success) {
			// something went wrong with the link
			throw new Error(
				'program filed to link:' + gl.getProgramInfoLog(this.glProgram),
			);
		}

		var numActiveUniforms = gl.getProgramParameter(
			this.glProgram,
			gl.ACTIVE_UNIFORMS,
		);
		for (var i = 0; i < numActiveUniforms; ++i) {
			this.uniforms.push(new ProgramUniform(this, i));
		}

		var numActiveAttributes = gl.getProgramParameter(
			this.glProgram,
			gl.ACTIVE_ATTRIBUTES,
		);
		for (var i = 0; i < numActiveAttributes; ++i) {
			this.attributes.push(new ProgramAttribute(this, i));
		}
	}

	setUniformValues(uniformValues: Array<UniformValue>) {
		// https://github.com/greggman/twgl.js/blob/cf0767dbddb48015c8bb0300e308569aeee4f78a/src/programs.js
		throw new Error('not implemented');
	}

	dispose() {
		if (!this.disposed) {
			this.vertexShader.dispose();
			this.fragmentShader.dispose();

			this.context.gl.deleteProgram(this.glProgram);
			this.disposed = true;
		}
	}
}

export class ProgramPool extends Pool<ShaderCodeMaterial, Program> {
	constructor(context: Context) {
		super(
			context,
			(
				context: Context,
				shaderCodeMaterial: ShaderCodeMaterial,
				program: Program | null,
			) => {
				if (program) {
					program.dispose();
				}
				return new Program(context, shaderCodeMaterial);
			},
		);
	}
}
