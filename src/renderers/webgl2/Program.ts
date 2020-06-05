//
// basic shader material
//
// Authors:
// * @bhouston
//

import { ShaderCodeMaterial } from '../../materials/ShaderCodeMaterial.js';
import { ShaderType } from '../../materials/ShaderType.js';
import { IDisposable } from '../../model/interfaces.js';
import { Pool } from '../Pool.js';
import { ProgramAttribute } from './ProgramAttribute.js';
import { numTextureUnits, ProgramUniform } from './ProgramUniform.js';
import { RenderingContext } from './RenderingContext.js';
import { Shader } from './Shader.js';

export class Program implements IDisposable {
	disposed: boolean = false;
	context: RenderingContext;
	vertexShader: Shader;
	fragmentShader: Shader;
	glProgram: WebGLProgram;
	uniforms: Array<ProgramUniform> = []; // TODO replace with a map for faster access
	attributes: Array<ProgramAttribute> = []; // TODO replace with a map for faster access

	// attributes (required attribute buffers)
	// varying (per instance parameters)

	constructor(context: RenderingContext, shaderCodeMaterial: ShaderCodeMaterial) {
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
			let glProgram = gl.createProgram();
			if (!glProgram) throw new Error('createProgram failed');

			this.glProgram = glProgram;
		}

		// attach the shaders.
		gl.attachShader(this.glProgram, this.vertexShader.glShader);
		gl.attachShader(this.glProgram, this.fragmentShader.glShader);

		// link the program.
		gl.linkProgram(this.glProgram);

		// Check if it linked.
		let success = gl.getProgramParameter(this.glProgram, gl.LINK_STATUS);
		if (!success) {
			// something went wrong with the link
			let infoLog = gl.getProgramInfoLog(this.glProgram);
			throw new Error(`program filed to link: ${infoLog}`);
		}

		let textureUnitCount = 0;

		let numActiveUniforms = gl.getProgramParameter(
			this.glProgram,
			gl.ACTIVE_UNIFORMS,
		);
		for (let i = 0; i < numActiveUniforms; ++i) {
			let uniform = new ProgramUniform(this, i);
			if (numTextureUnits(uniform.uniformType) > 0) {
				uniform.textureUnit = textureUnitCount;
				textureUnitCount++;
			}
			this.uniforms.push(uniform);
		}

		let numActiveAttributes = gl.getProgramParameter(
			this.glProgram,
			gl.ACTIVE_ATTRIBUTES,
		);
		for (let i = 0; i < numActiveAttributes; ++i) {
			this.attributes.push(new ProgramAttribute(this, i));
		}
	}

	setUniformValues(uniformValues: any, uniformNames: string[] | null = null) {
		this.context.program = this;
		if (!uniformNames) {
			uniformNames = Object.keys(uniformValues) as string[];
		}
		uniformNames.forEach((uniformName) => {
			// TODO replace this.uniforms with a map for faster access
			let programUniform = this.uniforms.find(
				(uniform) => uniform.name == uniformName,
			);
			if (programUniform) {
				programUniform.set(uniformValues[uniformName]);
			}
		});
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
	constructor(context: RenderingContext) {
		super(
			context,
			(
				context: RenderingContext,
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
