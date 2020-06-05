import { Program } from "./Program.js";
import { Context } from "./Context.js";
import { Vector2 } from "../../math/Vector2.js";
import { Vector3 } from "../../math/Vector3.js";
import { Matrix4 } from "../../math/Matrix4.js";
import { Color } from "../../math/Color.js";
import { TexImage2D } from "./TexImage2D.js";

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

  // setValueT1;
  Sampler2D = GL2.SAMPLER_2D,
  IntSampler2D = GL2.INT_SAMPLER_2D,
  UnsignedIntSampler2D = GL2.UNSIGNED_INT_SAMPLER_2D,
  Sampler2DShadow = GL2.SAMPLER_2D_SHADOW,

  // setValueT3D1;
  Sampler3D = GL2.SAMPLER_3D,
  IntSampler3D = GL2.INT_SAMPLER_3D,
  UnsignedIntSampler3D = GL2.UNSIGNED_INT_SAMPLER_3D,

  // setValueT6
  SamplerCube = GL2.SAMPLER_CUBE,
  IntSamplerCube = GL2.INT_SAMPLER_CUBE,
  UnsignedIntSamplerCube = GL2.UNSIGNED_INT_SAMPLER_CUBE,
  SamplerCubeShadow = GL2.SAMPLER_CUBE_SHADOW,

  // setValueT2DArray1
  Sampler2DArray = GL2.SAMPLER_2D_ARRAY,
  IntSampler2DArray = GL2.INT_SAMPLER_2D_ARRAY,
  UnsignedIntSampler2DArray = GL2.UNSIGNED_INT_SAMPLER_2D_ARRAY,
  Sampler2DArrayShadow = GL2.SAMPLER_2D_ARRAY_SHADOW,
}

export function numTextureUnits(uniformType: UniformType) {
  switch (uniformType) {
    case UniformType.Sampler2D:
    case UniformType.IntSampler2D:
    case UniformType.UnsignedIntSampler2D:
    case UniformType.Sampler2DShadow:
      return 1;

    case UniformType.Sampler3D:
    case UniformType.IntSampler3D:
    case UniformType.UnsignedIntSampler3D:
      return 1;

    case UniformType.SamplerCube:
    case UniformType.IntSamplerCube:
    case UniformType.UnsignedIntSamplerCube:
    case UniformType.SamplerCubeShadow:
      return 1; // cube textures only take one slot

    case UniformType.Sampler2DArray:
    case UniformType.IntSampler2DArray:
    case UniformType.UnsignedIntSampler2DArray:
    case UniformType.Sampler2DArrayShadow:
      return 1;

    default:
      return 0;
  }
}

export class ProgramUniform {
  context: Context;
  program: Program;
  index: number;
  name: string;
  size: number;
  uniformType: UniformType;
  glLocation: WebGLUniformLocation;
  valueHashCode: number = 0;
  textureUnit: number = -1;

  constructor(program: Program, index: number) {
    this.context = program.context;
    this.program = program;
    this.index = index;
    this.name = name;

    let gl = program.context.gl;

    // look up uniform locations
    {
      let activeInfo = gl.getActiveUniform(program.glProgram, index);
      if (!activeInfo)
        throw new Error(`Can not find uniform with index: ${index}`);

      this.name = activeInfo.name;
      this.size = activeInfo.size;
      this.uniformType = activeInfo.type as UniformType;

      let glLocation = gl.getUniformLocation(program.glProgram, this.name);
      if (!glLocation)
        throw new Error(`can not find uniform named: ${this.name}`);

      this.glLocation = glLocation;
    }
  }

  set(value: TexImage2D): ProgramUniform;
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
      case UniformType.Int: {
        let n = value as number;
        if (n !== this.valueHashCode) {
          gl.uniform1i(this.glLocation, n);
          n = this.valueHashCode;
        }
        return this;
      }
      //case UniformType.IntVec2:
      //case UniformType.IntVec3:
      //case UniformType.IntVec4:
      case UniformType.Float: {
        let n = value as number;
        if (n !== this.valueHashCode) {
          gl.uniform1f(this.glLocation, n);
          n = this.valueHashCode;
        }
        return this;
      }
      case UniformType.FloatVec2: {
        let v = value as Vector2;
        let hashCode = v.getHashCode();
        if (hashCode !== this.valueHashCode) {
          gl.uniform2f(this.glLocation, v.x, v.y);
          this.valueHashCode = hashCode;
        }
        return this;
      }
      case UniformType.FloatVec3: {
        if (value instanceof Vector3) {
          let v = value as Vector3;
          let hashCode = v.getHashCode();
          if (hashCode !== this.valueHashCode) {
            gl.uniform3f(this.glLocation, v.x, v.y, v.z);
            this.valueHashCode = hashCode;
          }
          return this;
        } else if (value instanceof Color) {
          let c = value as Color;
          let hashCode = c.getHashCode();
          if (hashCode !== this.valueHashCode) {
            gl.uniform3f(this.glLocation, c.r, c.g, c.b);
            this.valueHashCode = hashCode;
          }
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
        let hashCode = m.getHashCode();
        if (hashCode !== this.valueHashCode) {
          gl.uniformMatrix4fv(this.glLocation, false, m.elements);
          this.valueHashCode = hashCode;
        }
        return this;
      }
      case UniformType.Sampler2D:
      case UniformType.IntSampler2D:
      case UniformType.UnsignedIntSampler2D:
      case UniformType.Sampler2DShadow: {
		let t = value as TexImage2D;
		gl.uniform1i(this.glLocation, this.textureUnit);
		gl.activeTexture( GL2.TEXTURE0 + this.textureUnit );
		gl.bindTexture( GL2.TEXTURE_2D, t.glTexture );
		return this;
	  }
    }
    throw new Error(`unsupported uniform type: ${this.uniformType}`);
  }
}
