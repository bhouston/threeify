import {
  color3ArrayToFloat32Array,
  color4ArrayToFloat32Array,
  mat3ArrayToFloat32Array,
  mat4ArrayToFloat32Array,
  vec2ArrayToFloat32Array,
  vec3ArrayToFloat32Array,
  vec4ArrayToFloat32Array
} from '../../../math/arrays/Linearizers.js';
import { Color3 } from '../../../math/Color3.js';
import { Color4 } from '../../../math/Color4.js';
import { Mat3 } from '../../../math/Mat3.js';
import { Mat4 } from '../../../math/Mat4.js';
import { Vec2 } from '../../../math/Vec2.js';
import { Vec3 } from '../../../math/Vec3.js';
import { Vec4 } from '../../../math/Vec4.js';
import { GL } from '../GL.js';
import { RenderingContext } from '../RenderingContext.js';
import { TexImage2D } from '../textures/TexImage2D.js';
import { Program } from './Program.js';
import { UniformType } from './UniformType.js';
import { UniformPrimitiveValue, UniformValue } from './UniformValueMap.js';

const array1dRegexp = /^(\w+([\d+])?)+\[\d+]$/;
// glsl v3+ only const array2dRegexp = /^[a-zA-Z_0-9]+\[[0-9]+,[0-9]+\]$/;

export class ProgramUniform {
  readonly context: RenderingContext;
  readonly fullName: string;
  readonly name: string;
  readonly size: number;
  readonly dimensions: number;
  readonly uniformType: UniformType;
  readonly glLocation: WebGLUniformLocation | undefined = undefined;
  valueHashCode = 982345792759832448; // large random hashcode so to never get a hit
  textureUnit = -1;

  constructor(
    public readonly program: Program,
    public readonly index: number,
    public readonly blockIndex: number = -1,
    public readonly blockOffset: number = -1
  ) {
    this.context = program.context;

    const { gl } = program.context;

    // look up uniform locations
    {
      const activeInfo = gl.getActiveUniform(program.glProgram, index);
      if (activeInfo === null) {
        throw new Error(`Can not find uniform with index: ${index}`);
      }

      this.fullName = activeInfo.name;
      const array1dMatch = this.fullName.match(array1dRegexp);
      if (array1dMatch !== null) {
        this.name = array1dMatch[1];
        this.dimensions = 1;
      } else {
        this.name = activeInfo.name;
        this.dimensions = 0;
      }
      this.size = activeInfo.size;
      this.uniformType = activeInfo.type as UniformType;

      console.log(
        `uniform: ${this.fullName} ${this.name} ${this.uniformType} ${this.size} ${this.dimensions} ${this.blockIndex} ${this.blockOffset}}`
      );

      if (this.blockIndex === -1) {
        const glLocation = gl.getUniformLocation(program.glProgram, this.name);
        if (glLocation === null) {
          throw new Error(`can not find uniform named: ${this.name}`);
        }
        this.glLocation = glLocation;
      }
    }
  }

  set(value: UniformValue): this {
    if (this.glLocation === undefined) {
      throw new Error('Can not set uniform value for a uniform block - yet');
    }
    if (value instanceof Array && value.length > 0) {
      return this.setArray(value as UniformPrimitiveValue[]);
    }
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
        break;
      case UniformType.FloatVec2:
        if (value instanceof Vec2) {
          const hashCode = value.getHashCode();
          if (hashCode !== this.valueHashCode) {
            gl.uniform2f(this.glLocation, value.x, value.y);
            this.valueHashCode = hashCode;
          }
          return this;
        }
        break;
      case UniformType.FloatVec3:
        if (value instanceof Vec3) {
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
        break;
      case UniformType.FloatVec4:
        if (value instanceof Vec4) {
          const hashCode = value.getHashCode();
          if (hashCode !== this.valueHashCode) {
            gl.uniform4f(this.glLocation, value.x, value.y, value.z, value.w);
            this.valueHashCode = hashCode;
          }
          return this;
        }
        if (value instanceof Color4) {
          const hashCode = value.getHashCode();
          if (hashCode !== this.valueHashCode) {
            gl.uniform4f(this.glLocation, value.r, value.g, value.b, value.a);
            this.valueHashCode = hashCode;
          }
          return this;
        }
        break;
      // case UniformType.FloatVec4:
      // case UniformType.FloatMat2:
      // case UniformType.FloatMat2x3:
      // case UniformType.FloatMat2x4:
      // case UniformType.FloatMat3x2:
      case UniformType.FloatMat3:
        if (value instanceof Mat3) {
          const hashCode = value.getHashCode();
          if (hashCode !== this.valueHashCode) {
            gl.uniformMatrix3fv(this.glLocation, false, value.elements);
            this.valueHashCode = hashCode;
          }
          return this;
        }
        break;
      // case UniformType.FloatMat3x4:
      // case UniformType.FloatMat4x2:
      // case UniformType.FloatMat4x3:
      case UniformType.FloatMat4:
        if (value instanceof Mat4) {
          const hashCode = value.getHashCode();
          if (hashCode !== this.valueHashCode) {
            gl.uniformMatrix4fv(this.glLocation, false, value.elements);
            this.valueHashCode = hashCode;
          }
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

  setArray(value: UniformPrimitiveValue[]): this {
    if (this.glLocation === undefined) {
      throw new Error('Can not set uniform value for a uniform block - yet');
    }
    if (value.length === 0) {
      return this;
    }
    const { gl } = this.context;
    const firstElement = value[0];
    switch (this.uniformType) {
      // case UniformType.Bool:
      // case UniformType.BoolVec2:
      // case UniformType.BoolVec3:
      // case UniformType.BoolVec4:
      case UniformType.Int:
        if (typeof firstElement === 'number') {
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
        if (typeof firstElement === 'number') {
          // const array = linearizeNumberFloatArray(value as number[]);
          gl.uniform1fv(this.glLocation, value as number[]);
          this.valueHashCode = -1;
          return this;
        }
        break;
      case UniformType.FloatVec2:
        if (firstElement instanceof Vec2) {
          const array = vec2ArrayToFloat32Array(value as Vec2[]);
          gl.uniform2fv(this.glLocation, array);
          this.valueHashCode = -1;
          return this;
        }
        break;
      case UniformType.FloatVec3:
        if (firstElement instanceof Vec3) {
          const array = vec3ArrayToFloat32Array(value as Vec3[]);
          gl.uniform3fv(this.glLocation, array);
          this.valueHashCode = -1;
          return this;
        }
        if (firstElement instanceof Color3) {
          const array = color3ArrayToFloat32Array(value as Color3[]);
          gl.uniform3fv(this.glLocation, array);
          this.valueHashCode = -1;
          return this;
        }
        break;
      case UniformType.FloatVec4:
        if (firstElement instanceof Vec4) {
          const array = vec4ArrayToFloat32Array(value as Vec4[]);
          gl.uniform4fv(this.glLocation, array);
          this.valueHashCode = -1;
          return this;
        }
        if (firstElement instanceof Color4) {
          const array = color4ArrayToFloat32Array(value as Color4[]);
          gl.uniform4fv(this.glLocation, array);
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
        if (firstElement instanceof Mat4) {
          const array = mat3ArrayToFloat32Array(value as Mat3[]);
          gl.uniformMatrix4fv(this.glLocation, false, array);
          this.valueHashCode = -1;
          return this;
        }
        break;
      // case UniformType.FloatMat3x4:
      // case UniformType.FloatMat4x2:
      // case UniformType.FloatMat4x3:
      case UniformType.FloatMat4:
        if (firstElement instanceof Mat4) {
          const array = mat4ArrayToFloat32Array(value as Mat4[]);
          gl.uniformMatrix4fv(this.glLocation, false, array);
          this.valueHashCode = -1;
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
