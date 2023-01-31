import {
  Color3,
  color3ArrayToFloat32Array,
  Color4,
  color4ArrayToFloat32Array,
  Mat3,
  mat3ArrayToFloat32Array,
  Mat4,
  mat4ArrayToFloat32Array,
  Vec2,
  vec2ArrayToFloat32Array,
  Vec3,
  vec3ArrayToFloat32Array,
  Vec4,
  vec4ArrayToFloat32Array
} from '@threeify/vector-math';

import { Buffer } from '../buffers/Buffer.js';
import { RenderingContext } from '../RenderingContext.js';
import { Program } from './Program.js';
import { ProgramUniformBlock } from './ProgramUniformBlock.js';
import { UniformType, uniformTypeInfo } from './UniformType.js';
import { uniformValueToArrayBuffer } from './UniformValue.js';
import { UniformPrimitiveValue, UniformValue } from './UniformValueMap.js';

const regexUniformParser =
  /^((?<struct>\w+)(\[(?<structIndexer>\d+)])?\.)?(?<variable>\w+)(\[(?<variableIndexer>\d+)])?$/;

export class ProgramUniform {
  readonly context: RenderingContext;
  public readonly fullName: string;

  public readonly variableName: string;
  public readonly variableIndex: number = -1;

  public readonly structName: string | undefined;
  public readonly structIndex: number = -1;

  public readonly identifier: string;

  public readonly arrayLength: number;
  public readonly uniformType: UniformType;
  public readonly bytesPerElement: number;
  public readonly glLocation: WebGLUniformLocation | undefined = undefined;
  public readonly numElements: number;
  public readonly glType: number;
  public readonly sizeInBytes: number;
  valueHashCode = 982345792759832448; // large random hashcode so to never get a hit
  textureUnit = -1;

  constructor(
    public readonly program: Program,
    public readonly index: number,
    public readonly block?: ProgramUniformBlock,
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
      const match = this.fullName.match(regexUniformParser);
      if (match === null || match.groups === undefined) {
        throw new Error(`Can not parse uniform name: ${this.fullName}`);
      }

      if (match.groups.struct !== null) {
        this.structName = match.groups.struct;
        if (match.groups.structIndexer !== null) {
          this.structIndex = Number.parseInt(match.groups.structIndexer);
        }
      }
      this.variableName = match.groups.variable;
      if (match.groups.variableIndexer !== null) {
        this.variableIndex = Number.parseInt(match.groups.variableIndexer);
      }

      this.arrayLength = activeInfo.size;
      this.uniformType = activeInfo.type as UniformType;

      const typeInfo = uniformTypeInfo(this.uniformType);
      this.bytesPerElement = typeInfo.bytesPerElement;
      this.numElements = typeInfo.numElements * this.arrayLength;
      this.sizeInBytes = this.numElements * this.bytesPerElement;
      this.glType = typeInfo.glType;

      if (this.block === undefined) {
        const glLocation = gl.getUniformLocation(
          program.glProgram,
          this.fullName
        );
        if (glLocation === null) {
          throw new Error(`can not find uniform named: ${this.fullName}`);
        }
        this.glLocation = glLocation;
      }
    }

    let identifier = '';
    if (this.structName !== undefined) {
      identifier = this.structName;
      if (this.structIndex >= 0) {
        identifier += '[' + this.structIndex + ']';
      }
      identifier += '.';
    }
    identifier += this.variableName;
    if (this.variableIndex >= 0 && this.arrayLength == 1) {
      identifier += '[' + this.variableIndex + ']';
    }

    this.identifier = identifier;
  }

  setIntoBuffer(value: UniformValue, buffer: Buffer): this {
    if (this.block === undefined) {
      throw new Error(
        'Can not set uniform into buffer if uniform is not part of a block'
      );
    }

    const { blockOffset, uniformType, numElements, bytesPerElement } = this;

    const arrayBufferView = uniformValueToArrayBuffer(uniformType, value);
    //console.log('writing to buffer', arrayBufferView, blockOffset, numElements);
    buffer.writeSubData(
      arrayBufferView,
      blockOffset,
      0,
      arrayBufferView.byteLength / bytesPerElement
    );

    return this;
  }

  setIntoLocation(value: UniformValue): this {
    if (this.glLocation === undefined) {
      throw new Error('Can not set uniform value for a uniform block - yet');
    }
    if (value instanceof Array && value.length > 0) {
      return this.setArrayIntoLocation(value as UniformPrimitiveValue[]);
    }
    this.program.context.program = this.program;

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
        if (typeof value === 'number') {
          gl.uniform1i(this.glLocation, value);
          return this;
        } else {
          throw new TypeError(
            'expected number, did you forget to use a TextureBinding?'
          );
        }
        break;
      case UniformType.SamplerCube:
        // case UniformType.SamplerCubeShadow:
        if (typeof value === 'number') {
          gl.uniform1i(this.glLocation, value);
          return this;
        } else {
          throw new TypeError(
            'expected number, did you forget to use a TextureBinding?'
          );
        }
        break;
    }
    throw new Error(
      `unsupported uniform type - value mismatch: ${
        UniformType[this.uniformType]
      }(${this.uniformType}) on '${this.variableName}'`
    );
  }

  setArrayIntoLocation(value: UniformPrimitiveValue[]): this {
    if (this.glLocation === undefined) {
      throw new Error('Can not set uniform value for a uniform block - yet');
    }
    if (value.length === 0) {
      return this;
    }

    this.program.context.program = this.program;
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
        if (firstElement instanceof Mat3) {
          const array = mat3ArrayToFloat32Array(value as Mat3[]);
          gl.uniformMatrix3fv(this.glLocation, false, array);
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

      case UniformType.Sampler2D:
        // case UniformType.IntSampler2D:
        // case UniformType.UnsignedIntSampler2D:
        // case UniformType.Sampler2DShadow:
        if (typeof firstElement === 'number') {
          gl.uniform1iv(this.glLocation, value as number[]);
          return this;
        } else {
          throw new TypeError(
            'expected number, did you forget to use a TextureBinding?'
          );
        }
        break;
    }
    throw new Error(
      `unsupported uniform type - value mismatch: ${
        UniformType[this.uniformType]
      }(${this.uniformType}) on '${this.variableName}'`
    );
  }
}
