import { Color3 } from '../../../math';
import {
  linearizeColor3FloatArray,
  linearizeMatrix3FloatArray,
  linearizeMatrix4FloatArray,
  linearizeVector2FloatArray,
  linearizeVector3FloatArray
} from '../../../math/arrays/Linearizers';
import { Matrix3 } from '../../../math/Matrix3';
import { Matrix4 } from '../../../math/Matrix4';
import { Vector2 } from '../../../math/Vector2';
import { Vector3 } from '../../../math/Vector3';
import { GL } from '../GL';
import { RenderingContext } from '../RenderingContext';
import { TexImage2D } from '../textures/TexImage2D';
import { Program } from './Program';
import { UniformType } from './UniformType';

export type UniformValue =
  | number
  | Vector2
  | Vector3
  | Color3
  | Matrix3
  | Matrix4
  | TexImage2D
  | number[]
  | Vector2[]
  | Vector3[]
  | Color3[]
  | Matrix4[];
export type UniformValueMap = { [key: string]: UniformValue };

const array1dRegexp = /^([a-zA-Z_0-9]+)\[[0-9]+\]$/;
// glsl v3+ only const array2dRegexp = /^[a-zA-Z_0-9]+\[[0-9]+,[0-9]+\]$/;

export class ProgramUniform {
  context: RenderingContext;
  name: string;
  size: number;
  dimensions: number;
  uniformType: UniformType;
  glLocation: WebGLUniformLocation;
  valueHashCode = 982345792759832448; // large random hashcode so to never get a hit
  textureUnit = -1;

  constructor(public program: Program, public index: number) {
    this.context = program.context;

    const { gl } = program.context;

    // look up uniform locations
    {
      const activeInfo = gl.getActiveUniform(program.glProgram, index);
      if (activeInfo === null) {
        throw new Error(`Can not find uniform with index: ${index}`);
      }

      const array1dMatch = activeInfo.name.match(array1dRegexp);
      if (array1dMatch !== null) {
        this.name = array1dMatch[1];
        this.dimensions = 1;
      } else {
        this.name = activeInfo.name;
        this.dimensions = 0;
      }
      this.size = activeInfo.size;
      this.uniformType = activeInfo.type as UniformType;

      const glLocation = gl.getUniformLocation(program.glProgram, this.name);
      if (glLocation === null) {
        throw new Error(`can not find uniform named: ${this.name}`);
      }

      this.glLocation = glLocation;
    }
  }

  set(value: UniformValue): ProgramUniform {
    const { gl } = this.context;
    switch (this.uniformType) {
      // case UniformType.Bool:
      // case UniformType.BoolVec2:
      // case UniformType.BoolVec3:
      // case UniformType.BoolVec4:
      case UniformType.Int:
        if (typeof value === 'number') {
          if (value !== this.valueHashCode) {
            gl.uniform1i(this.glLocation, value);
            this.valueHashCode = value;
          }
          return this;
        }
        if (
          value instanceof Array &&
          value.length > 0 &&
          typeof value[0] === 'number'
        ) {
          // const array = linearizeNumberInt32Array(value as number[]);
          gl.uniform1iv(this.glLocation, value as number[]);
          this.valueHashCode = -1;
          return this;
        }
        break;
      // case UniformType.IntVec2:
      // case UniformType.IntVec3:
      // case UniformType.IntVec4:
      case UniformType.Float:
        if (typeof value === 'number') {
          if (value !== this.valueHashCode) {
            gl.uniform1f(this.glLocation, value);
            this.valueHashCode = value;
          }
          return this;
        }
        if (
          value instanceof Array &&
          value.length > 0 &&
          typeof value[0] === 'number'
        ) {
          // const array = linearizeNumberFloatArray(value as number[]);
          gl.uniform1fv(this.glLocation, value as number[]);
          this.valueHashCode = -1;
          return this;
        }
        break;
      case UniformType.FloatVec2:
        if (value instanceof Vector2) {
          const hashCode = value.getHashCode();
          if (hashCode !== this.valueHashCode) {
            gl.uniform2f(this.glLocation, value.x, value.y);
            this.valueHashCode = hashCode;
          }
          return this;
        }
        if (
          value instanceof Array &&
          value.length > 0 &&
          value[0] instanceof Vector2
        ) {
          const array = linearizeVector2FloatArray(value as Vector2[]);
          gl.uniform2fv(this.glLocation, array);
          this.valueHashCode = -1;
          return this;
        }
        break;
      case UniformType.FloatVec3:
        if (value instanceof Vector3) {
          const hashCode = value.getHashCode();
          if (hashCode !== this.valueHashCode) {
            gl.uniform3f(this.glLocation, value.x, value.y, value.z);
            this.valueHashCode = hashCode;
          }
          return this;
        }
        if (value instanceof Color3) {
          const hashCode = value.getHashCode();
          if (hashCode !== this.valueHashCode) {
            gl.uniform3f(this.glLocation, value.r, value.g, value.b);
            this.valueHashCode = hashCode;
          }
          return this;
        }
        if (
          value instanceof Array &&
          value.length > 0 &&
          value[0] instanceof Vector3
        ) {
          const array = linearizeVector3FloatArray(value as Vector3[]);
          gl.uniform3fv(this.glLocation, array);
          this.valueHashCode = -1;
          return this;
        }
        if (
          value instanceof Array &&
          value.length > 0 &&
          value[0] instanceof Color3
        ) {
          const array = linearizeColor3FloatArray(value as Color3[]);
          gl.uniform3fv(this.glLocation, array);
          this.valueHashCode = -1;
          return this;
        }
        break;
      // case UniformType.FloatVec4:
      // case UniformType.FloatMat2:
      // case UniformType.FloatMat2x3:
      // case UniformType.FloatMat2x4:
      // case UniformType.FloatMat3x2:
      case UniformType.FloatMat3:
        if (value instanceof Matrix3) {
          const hashCode = value.getHashCode();
          if (hashCode !== this.valueHashCode) {
            gl.uniformMatrix3fv(this.glLocation, false, value.elements);
            this.valueHashCode = hashCode;
          }
          return this;
        }
        if (
          value instanceof Array &&
          value.length > 0 &&
          value[0] instanceof Matrix4
        ) {
          const array = linearizeMatrix3FloatArray(value as Matrix3[]);
          gl.uniformMatrix4fv(this.glLocation, false, array);
          this.valueHashCode = -1;
          return this;
        }
        break;
      // case UniformType.FloatMat3x4:
      // case UniformType.FloatMat4x2:
      // case UniformType.FloatMat4x3:
      case UniformType.FloatMat4:
        if (value instanceof Matrix4) {
          const hashCode = value.getHashCode();
          if (hashCode !== this.valueHashCode) {
            gl.uniformMatrix4fv(this.glLocation, false, value.elements);
            this.valueHashCode = hashCode;
          }
          return this;
        }
        if (
          value instanceof Array &&
          value.length > 0 &&
          value[0] instanceof Matrix4
        ) {
          const array = linearizeMatrix4FloatArray(value as Matrix4[]);
          gl.uniformMatrix4fv(this.glLocation, false, array);
          this.valueHashCode = -1;
          return this;
        }
        break;
      case UniformType.Sampler2D:
        // case UniformType.IntSampler2D:
        // case UniformType.UnsignedIntSampler2D:
        // case UniformType.Sampler2DShadow:
        if (value instanceof TexImage2D) {
          gl.activeTexture(GL.TEXTURE0 + this.textureUnit);
          gl.bindTexture(GL.TEXTURE_2D, value.glTexture);
          gl.uniform1i(this.glLocation, this.textureUnit);
          return this;
        }
        break;
      case UniformType.SamplerCube:
        // case UniformType.SamplerCubeShadow:
        if (value instanceof TexImage2D) {
          gl.activeTexture(GL.TEXTURE0 + this.textureUnit);
          gl.bindTexture(GL.TEXTURE_CUBE_MAP, value.glTexture);
          gl.uniform1i(this.glLocation, this.textureUnit);
          return this;
        }
        break;
    }
    throw new Error(
      `unsupported uniform type - value mismatch: ${
        UniformType[this.uniformType]
      }(${this.uniformType}) on '${this.name}'`
    );
  }
}
