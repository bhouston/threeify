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
} from '@threeify/math';

import { TexImage2D } from '../textures/TexImage2D.js';
import { UniformType } from './UniformType.js';
import { UniformPrimitiveValue, UniformValue } from './UniformValueMap.js';

export function uniformValueToArrayBuffer(
  type: UniformType,
  value: UniformValue,
  textureUnit = -1
): ArrayBufferView {
  if (value instanceof Array && value.length > 0) {
    return uniformValueArrayToArrayBuffer(
      type,
      value as UniformPrimitiveValue[]
    );
  }
  switch (type) {
    // case UniformType.Bool:
    // case UniformType.BoolVec2:
    // case UniformType.BoolVec3:
    // case UniformType.BoolVec4:
    case UniformType.Int:
      if (typeof value === 'number') {
        return new Int32Array([value]);
      }
      break;
    // case UniformType.IntVec2:
    // case UniformType.IntVec3:
    // case UniformType.IntVec4:
    case UniformType.Float:
      if (typeof value === 'number') {
        return new Float32Array([value]);
      }
      break;
    case UniformType.FloatVec2:
      if (value instanceof Vec2) {
        return new Float32Array([value.x, value.y]);
      }
      break;

    case UniformType.FloatVec3:
      if (value instanceof Vec3) {
        return new Float32Array([value.x, value.y, value.z]);
      }
      if (value instanceof Color3) {
        return new Float32Array([value.r, value.g, value.b]);
      }
      break;
    case UniformType.FloatVec4:
      if (value instanceof Vec4) {
        return new Float32Array([value.x, value.y, value.z, value.z]);
      }
      if (value instanceof Color4) {
        return new Float32Array([value.r, value.g, value.b, value.a]);
      }
      break;
    // case UniformType.FloatVec4:
    // case UniformType.FloatMat2:
    // case UniformType.FloatMat2x3:
    // case UniformType.FloatMat2x4:
    // case UniformType.FloatMat3x2:
    case UniformType.FloatMat3:
      if (value instanceof Mat3) {
        return new Float32Array(value.elements);
      }
      break;
    // case UniformType.FloatMat3x4:
    // case UniformType.FloatMat4x2:
    // case UniformType.FloatMat4x3:
    case UniformType.FloatMat4:
      if (value instanceof Mat4) {
        return new Float32Array(value.elements);
      }
      break;
    case UniformType.Sampler2D:
      // case UniformType.IntSampler2D:
      // case UniformType.UnsignedIntSampler2D:
      // case UniformType.Sampler2DShadow:
      if (value instanceof TexImage2D) {
        return new Int32Array([textureUnit as number]);
      } else {
        throw new TypeError(
          'expected number, did you forget to use a TextureBinding?'
        );
      }
      break;
    case UniformType.SamplerCube:
      // case UniformType.SamplerCubeShadow:
      if (value instanceof TexImage2D) {
        return new Int32Array([textureUnit as number]);
      } else {
        throw new TypeError(
          'expected number, did you forget to use a TextureBinding?'
        );
      }
      break;
  }
  throw new Error(
    `unsupported uniform type - value mismatch: ${UniformType[type]}(${type}) on '${name}'`
  );
}

export function uniformValueArrayToArrayBuffer(
  type: UniformType,
  value: UniformPrimitiveValue[]
): ArrayBufferView {
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
        return new Int32Array(value as number[]);
      }
      break;
    // case UniformType.IntVec2:
    // case UniformType.IntVec3:
    // case UniformType.IntVec4:
    case UniformType.Float:
      if (typeof firstElement === 'number') {
        return new Float32Array(value as number[]);
      }
      break;
    case UniformType.FloatVec2:
      if (firstElement instanceof Vec2) {
        return vec2ArrayToFloat32Array(value as Vec2[]);
      }
      break;
    case UniformType.FloatVec3:
      if (firstElement instanceof Vec3) {
        return vec3ArrayToFloat32Array(value as Vec3[]);
      }
      if (firstElement instanceof Color3) {
        return color3ArrayToFloat32Array(value as Color3[]);
      }
      break;
    case UniformType.FloatVec4:
      if (firstElement instanceof Vec4) {
        return vec4ArrayToFloat32Array(value as Vec4[]);
      }
      if (firstElement instanceof Color4) {
        return color4ArrayToFloat32Array(value as Color4[]);
      }
      break;
    // case UniformType.FloatVec4:
    // case UniformType.FloatMat2:
    // case UniformType.FloatMat2x3:
    // case UniformType.FloatMat2x4:
    // case UniformType.FloatMat3x2:
    case UniformType.FloatMat3:
      if (firstElement instanceof Mat3) {
        return mat3ArrayToFloat32Array(value as Mat3[]);
      }
      break;
    // case UniformType.FloatMat3x4:
    // case UniformType.FloatMat4x2:
    // case UniformType.FloatMat4x3:
    case UniformType.FloatMat4:
      if (firstElement instanceof Mat4) {
        return mat4ArrayToFloat32Array(value as Mat4[]);
      }
      break;
  }
  throw new Error(
    `unsupported uniform type - value mismatch: ${UniformType[type]}(${type})`
  );
}
