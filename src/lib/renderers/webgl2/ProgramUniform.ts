import { Program } from './Program.js';
import { Context } from './Context.js';
import { Vector2 } from '../../math/Vector2.js';
import { Vector3 } from '../../math/Vector3.js';
import { Matrix4 } from '../../math/Matrix4.js';
import { Color } from '../../math/Color.js';

const GL2 = WebGL2RenderingContext;

export enum UniformType {
	Bool = GL2.BOOL,
	BoolVec2 = GL2.BOOL_VEC2,
	BoolVec3 = GL2.BOOL_VEC3,
	BoolVec4 = GL2.BOOL_VEC4,

	Int = GL2.INT,
	IntVec2 = GL2.INT_VEC2,
	IntVec3 = GL2.INT_VEC3,
	IntVec4 = GL2.INT_VEC4,

	Float = GL2.FLOAT,
	FloatVec2 = GL2.FLOAT_VEC2,
	FloatVec3 = GL2.FLOAT_VEC3,
	FloatVec4 = GL2.FLOAT_VEC4,

	FloatMat2 = GL2.FLOAT_MAT2,
	FloatMat2x3 = GL2.FLOAT_MAT2x3,
	FloatMat2x4 = GL2.FLOAT_MAT2x4,

	FloatMat3x2 = GL2.FLOAT_MAT3x2,
	FloatMat3 = GL2.FLOAT_MAT3,
	FloatMat3x4 = GL2.FLOAT_MAT3x4,

	FloatMat4x2 = GL2.FLOAT_MAT4x3,
	FloatMat4x3 = GL2.FLOAT_MAT4x3,
	FloatMat4 = GL2.FLOAT_MAT4,
}

export class ProgramUniform {
	context: Context;
	program: Program;
	index: number;
	name: string;
	size: number;
	uniformType: UniformType;
	glLocation: WebGLUniformLocation;

	constructor(program: Program, index: number) {
		this.context = program.context;
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
			this.uniformType = activeInfo.type as UniformType;

			let glLocation = gl.getUniformLocation(program.glProgram, this.name);
			if (!glLocation) {
				throw new Error('Can not find uniform named: ' + this.name);
			}
			this.glLocation = glLocation;
		}
	}

	set(value: Matrix4): ProgramUniform;
	set(value: Color): ProgramUniform;
	set(value: Vector3): ProgramUniform;
	set(value: Vector2): ProgramUniform;
	set(value: number): ProgramUniform;
	set(value: any): ProgramUniform {
		let gl = this.context.gl;
		switch (this.uniformType) {
			//case UniformType.Bool:
			//case UniformType.BoolVec2:
			//case UniformType.BoolVec3:
			//case UniformType.BoolVec4:
			//case UniformType.Int:
			//case UniformType.IntVec2:
			//case UniformType.IntVec3:
			//case UniformType.IntVec4:
			case UniformType.Float: {
				let n = value as number;
				gl.uniform1f(this.glLocation, n);
				return this;
			}
			case UniformType.FloatVec2: {
				let v = value as Vector2;
				gl.uniform2f(this.glLocation, v.x, v.y);
				return this;
			}
			case UniformType.FloatVec3: {
				if (value instanceof Vector3) {
					let v = value as Vector3;
					gl.uniform3f(this.glLocation, v.x, v.y, v.z);
					return this;
				} else if (value instanceof Color) {
					let c = value as Color;
					gl.uniform3f(this.glLocation, c.r, c.g, c.b);
					return this;
				}
				break;
			}
			//case UniformType.FloatVec4:
			//case UniformType.FloatMat2:
			//case UniformType.FloatMat2x3:
			//case UniformType.FloatMat2x4:
			//case UniformType.FloatMat3x2:
			//case UniformType.FloatMat3:
			//case UniformType.FloatMat3x4:
			//case UniformType.FloatMat4x2:
			//case UniformType.FloatMat4x3:
			case UniformType.FloatMat4: {
				let m = value as Matrix4;
				gl.uniformMatrix4fv(this.glLocation, false, m.elements);
				return this;
			}
		}
		throw new Error('unsupported uniform type');
	}
}
