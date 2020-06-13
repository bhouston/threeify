import { Color } from "../../math/Color";
import { Matrix4 } from "../../math/Matrix4";
import { Vector2 } from "../../math/Vector2";
import { Vector3 } from "../../math/Vector3";
import { Program } from "./Program";
import { RenderingContext } from "./RenderingContext";
import { TexImage2D } from "./TexImage2D";
import { UniformType } from "./UniformType";

export const GL2 = WebGL2RenderingContext;

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
      if (!activeInfo) {
        throw new Error(`Can not find uniform with index: ${index}`);
      }

      this.name = activeInfo.name;
      this.size = activeInfo.size;
      this.uniformType = activeInfo.type as UniformType;

      const glLocation = gl.getUniformLocation(program.glProgram, this.name);
      if (!glLocation) {
        throw new Error(`can not find uniform named: ${this.name}`);
      }

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
    const gl = this.context.gl;
    switch (this.uniformType) {
      // case UniformType.Bool:
      // case UniformType.BoolVec2:
      // case UniformType.BoolVec3:
      // case UniformType.BoolVec4:
      case UniformType.Int: {
        let n = value as number;
        if (n !== this.valueHashCode) {
          gl.uniform1i(this.glLocation, n);
          n = this.valueHashCode;
        }
        return this;
      }
      // case UniformType.IntVec2:
      // case UniformType.IntVec3:
      // case UniformType.IntVec4:
      case UniformType.Float: {
        let n = value as number;
        if (n !== this.valueHashCode) {
          gl.uniform1f(this.glLocation, n);
          n = this.valueHashCode;
        }
        return this;
      }
      case UniformType.FloatVec2: {
        const v = value as Vector2;
        const hashCode = v.getHashCode();
        if (hashCode !== this.valueHashCode) {
          gl.uniform2f(this.glLocation, v.x, v.y);
          this.valueHashCode = hashCode;
        }
        return this;
      }
      case UniformType.FloatVec3: {
        if (value instanceof Vector3) {
          const v = value as Vector3;
          const hashCode = v.getHashCode();
          if (hashCode !== this.valueHashCode) {
            gl.uniform3f(this.glLocation, v.x, v.y, v.z);
            this.valueHashCode = hashCode;
          }
          return this;
        } else if (value instanceof Color) {
          const c = value as Color;
          const hashCode = c.getHashCode();
          if (hashCode !== this.valueHashCode) {
            gl.uniform3f(this.glLocation, c.r, c.g, c.b);
            this.valueHashCode = hashCode;
          }
          return this;
        }
        break;
      }
      // case UniformType.FloatVec4:
      // case UniformType.FloatMat2:
      // case UniformType.FloatMat2x3:
      // case UniformType.FloatMat2x4:
      // case UniformType.FloatMat3x2:
      // case UniformType.FloatMat3:
      // case UniformType.FloatMat3x4:
      // case UniformType.FloatMat4x2:
      // case UniformType.FloatMat4x3:
      case UniformType.FloatMat4: {
        const m = value as Matrix4;
        const hashCode = m.getHashCode();
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
        const t = value as TexImage2D;
        gl.uniform1i(this.glLocation, this.textureUnit);
        gl.activeTexture(GL2.TEXTURE0 + this.textureUnit);
        gl.bindTexture(GL2.TEXTURE_2D, t.glTexture);
        return this;
      }
    }
    throw new Error(`unsupported uniform type: ${this.uniformType}`);
  }
}
