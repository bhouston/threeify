import { vec2ArrayToFloat32Array, vec3ArrayToFloat32Array, color3ArrayToFloat32Array, vec4ArrayToFloat32Array, color4ArrayToFloat32Array, mat3ArrayToFloat32Array, mat4ArrayToFloat32Array } from "../../../math/arrays/Linearizers";
import { Color3 } from "../../../math/Color3";
import { Color4 } from "../../../math/Color4";
import { Mat3 } from "../../../math/Mat3";
import { Mat4 } from "../../../math/Mat4";
import { Vec2 } from "../../../math/Vec2";
import { Vec3 } from "../../../math/Vec3";
import { Vec4 } from "../../../math/Vec4";
import { GL } from "../GL";
import { TexImage2D } from "../textures/TexImage2D";
import { UniformType } from "./UniformType";
import { UniformValue, UniformPrimitiveValue } from "./UniformValueMap";


export function uniformValueToArrayBuffer( type: UniformType, value: UniformValue, textureUnit: number = -1): ArrayBufferView {
    if (value instanceof Array && value.length > 0) {
      return uniformValueArrayToArrayBuffer(value as UniformPrimitiveValue[]);
    }
    switch (type) {
      // case UniformType.Bool:
      // case UniformType.BoolVec2:
      // case UniformType.BoolVec3:
      // case UniformType.BoolVec4:
      case UniformType.Int:
          if( typeof value === 'number' ) {
     return new Int32Array( [value as number] );
          }
          break;
      // case UniformType.IntVec2:
      // case UniformType.IntVec3:
      // case UniformType.IntVec4:
      case UniformType.Float:
        if( typeof value === 'number' ) {
            return new Float32Array( [value] );
        }
        break;
      case UniformType.FloatVec2:
        if (value instanceof Vec2) {
        return new Float32Array( [value.x, value.y] );
        }
        break;

      case UniformType.FloatVec3:
        if (value instanceof Vec3) {
        return new Float32Array( [value.x, value.y, value.z] );
        }
        if (value instanceof Color3) {
        return new Float32Array( [value.r, value.g, value.b] );
        }
        break;
      case UniformType.FloatVec4:
         if (value instanceof Vec4) {
        return new Float32Array( [value.x, value.y, value.z, value.z] );
        }
        if (value instanceof Color4) {
        return new Float32Array( [value.r, value.g, value.b, value.a] );
        }
        break;
      // case UniformType.FloatVec4:
      // case UniformType.FloatMat2:
      // case UniformType.FloatMat2x3:
      // case UniformType.FloatMat2x4:
      // case UniformType.FloatMat3x2:
      case UniformType.FloatMat3:
        if (value instanceof Mat3) {
           return new Float32Array( value.elements );
      
        }
        break;
      // case UniformType.FloatMat3x4:
      // case UniformType.FloatMat4x2:
      // case UniformType.FloatMat4x3:
      case UniformType.FloatMat4:
        if (value instanceof Mat4) {
             return new Float32Array( value.elements );
      
        }
        break;
      case UniformType.Sampler2D:
        // case UniformType.IntSampler2D:
        // case UniformType.UnsignedIntSampler2D:
        // case UniformType.Sampler2DShadow:
        if (value instanceof TexImage2D) {
          return new Int32Array( [textureUnit as number] );
  
        }
        break;
      case UniformType.SamplerCube:
        // case UniformType.SamplerCubeShadow:
        if (value instanceof TexImage2D) {
          return new Int32Array( [textureUnit as number] );
        }
        break;
    }
    throw new Error(
      `unsupported uniform type - value mismatch: ${
        UniformType[type]
      }(${type}) on '${name}'`
    );
  }

  export function uniformValueArrayToArrayBuffer( type: UniformType, value: UniformPrimitiveValue[]): ArrayBufferView {
    if (value.length === 0) {
      throw new Error(`uniform value array must not be empty`);
    }
    const firstElement = value[0];
    switch (type) {
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