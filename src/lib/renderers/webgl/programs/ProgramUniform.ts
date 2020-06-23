import { Color } from "../../../math/Color";
import { Matrix4 } from "../../../math/Matrix4";
import { Vector2 } from "../../../math/Vector2";
import { Vector3 } from "../../../math/Vector3";
import { GL } from "../GL";
import { RenderingContext } from "../RenderingContext";
import { TexImage2D } from "../textures/TexImage2D";
import { Program } from "./Program";
import { UniformType } from "./UniformType";

export type UniformValue = number | Vector2 | Vector3 | Color | Matrix4 | TexImage2D;
export type UniformValueMap = { [key: string]: UniformValue };

export class ProgramUniform {
  context: RenderingContext;
  name: string;
  size: number;
  uniformType: UniformType;
  glLocation: WebGLUniformLocation;
  valueHashCode = 0;
  textureUnit = -1;

  constructor(public program: Program, public index: number) {
    this.context = program.context;
    this.name = name;

    const gl = program.context.gl;

    // look up uniform locations
    {
      const activeInfo = gl.getActiveUniform(program.glProgram, index);
      if (activeInfo === null) {
        throw new Error(`Can not find uniform with index: ${index}`);
      }

      this.name = activeInfo.name;
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
    const gl = this.context.gl;
    switch (this.uniformType) {
      // case UniformType.Bool:
      // case UniformType.BoolVec2:
      // case UniformType.BoolVec3:
      // case UniformType.BoolVec4:
      case UniformType.Int:
        if (typeof value === "number") {
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
        if (typeof value === "number") {
          if (value !== this.valueHashCode) {
            gl.uniform1f(this.glLocation, value);
            this.valueHashCode = value;
          }
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
        break;
      case UniformType.FloatVec3:
        if (value instanceof Vector3) {
          const hashCode = value.getHashCode();
          if (hashCode !== this.valueHashCode) {
            gl.uniform3f(this.glLocation, value.x, value.y, value.z);
            this.valueHashCode = hashCode;
          }
          return this;
        } else if (value instanceof Color) {
          const hashCode = value.getHashCode();
          if (hashCode !== this.valueHashCode) {
            gl.uniform3f(this.glLocation, value.r, value.g, value.b);
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
      // case UniformType.FloatMat3:
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
    throw new Error(`unsupported uniform type: ${this.uniformType}`);
  }
}
