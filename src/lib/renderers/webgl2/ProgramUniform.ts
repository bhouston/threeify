//
// program uniform from introspection
//
// Authors:
// * @bhouston
//

import { Program } from './Program.js';

export class ProgramUniform {
	program: Program;
	index: number;
	name: string;
	size: number;
	type: number;
	glLocation: WebGLUniformLocation;

	constructor(program: Program, index: number) {
		this.program = program;
		this.index = index;
		this.name = name;

		let gl = program.context.gl;

		// look up uniform locations
		{
			let activeInfo = gl.getActiveUniform(program.glProgram, index);
			if (!activeInfo) {
				throw new Error('Can not find uniform with index: ' + index);
			}

			this.name = activeInfo.name;
			this.size = activeInfo.size;
			this.type = activeInfo.type;

			var glLocation = gl.getUniformLocation(program.glProgram, this.name);
			if (!glLocation) {
				throw new Error('Can not find uniform named: ' + this.name);
			}
			this.glLocation = glLocation;
		}
	}
}
