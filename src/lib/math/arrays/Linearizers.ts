import { color3ToArray } from '../Color3.Functions.js';
import { Color3 } from '../Color3.js';
import { color4ToArray } from '../Color4.Functions.js';
import { Color4 } from '../Color4.js';
import { mat3ToArray } from '../Mat3.Functions.js';
import { Mat3 } from '../Mat3.js';
import { mat4ToArray } from '../Mat4.Functions.js';
import { Mat4 } from '../Mat4.js';
import { quatToArray } from '../Quat.Functions.js';
import { Quat } from '../Quat.js';
import { vec2ToArray } from '../Vec2.Functions.js';
import { Vec2 } from '../Vec2.js';
import { vec3ToArray } from '../Vec3.Functions.js';
import { Vec3 } from '../Vec3.js';
import { vec4ToArray } from '../Vec4.Functions.js';
import { Vec4 } from '../Vec4.js';

export function numberArrayToInt32Array(array: number[]): Int32Array {
  const result = new Int32Array(array.length);
  for (let i = 0; i < array.length; i++) {
    result[i] = array[i];
  }
  return result;
}

// TODO: Convert to generics.

export function numberArrayToFloat32Array(array: number[]): Float32Array {
  const result = new Float32Array(array.length);
  for (let i = 0; i < array.length; i++) {
    result[i] = array[i];
  }
  return result;
}

export function color3ArrayToFloat32Array(array: Color3[]): Float32Array {
  const stride = Color3.NUM_COMPONENTS;
  const result = new Float32Array(array.length * stride);
  for (let i = 0, offset = 0; i < array.length; i++, offset += stride) {
    color3ToArray(array[i], result, offset);
  }
  return result;
}

export function float32ArrayToColor3Array(array: Float32Array): Color3[] {
  const stride = Color3.NUM_COMPONENTS;
  const result = new Array<Color3>(array.length / stride);
  for (let i = 0, offset = 0; i < array.length; i++, offset += stride) {
    result[i] = new Color3(array[offset], array[offset + 1], array[offset + 2]);
  }
  return result;
}

export function color4ArrayToFloat32Array(array: Color4[]): Float32Array {
  const stride = Color4.NUM_COMPONENTS;
  const result = new Float32Array(array.length * stride);
  for (let i = 0, offset = 0; i < array.length; i++, offset += stride) {
    color4ToArray(array[i], result, offset);
  }
  return result;
}

export function float32ArrayToColor4Array(array: Float32Array): Color4[] {
  const stride = Color4.NUM_COMPONENTS;
  const result = new Array<Color4>(array.length / stride);
  for (let i = 0, offset = 0; i < array.length; i++, offset += stride) {
    result[i] = new Color4(array[offset], array[offset + 1], array[offset + 2]);
  }
  return result;
}

export function vec2ArrayToFloat32Array(array: Vec2[]): Float32Array {
  const stride = Vec2.NUM_COMPONENTS;
  const result = new Float32Array(array.length * stride);
  for (let i = 0, offset = 0; i < array.length; i++, offset += stride) {
    vec2ToArray(array[i], result, offset);
  }
  return result;
}

export function float32ArrayToVec2Array(array: Float32Array): Vec2[] {
  const stride = Vec2.NUM_COMPONENTS;
  const result = new Array<Vec2>(array.length / stride);
  for (let i = 0, offset = 0; i < array.length; i++, offset += stride) {
    result[i] = new Vec2(array[offset], array[offset + 1]);
  }
  return result;
}

export function vec3ArrayToFloat32Array(array: Vec3[]): Float32Array {
  const stride = Vec3.NUM_COMPONENTS;
  const result = new Float32Array(array.length * stride);
  for (let i = 0, offset = 0; i < array.length; i++, offset += stride) {
    vec3ToArray(array[i], result, offset);
  }
  return result;
}

export function float32ArrayToVec3Array(array: Float32Array): Vec3[] {
  const stride = Vec3.NUM_COMPONENTS;
  const result = new Array<Vec3>(array.length / stride);
  for (let i = 0, offset = 0; i < array.length; i++, offset += stride) {
    result[i] = new Vec3(array[offset], array[offset + 1], array[offset + 2]);
  }
  return result;
}

export function vec4ArrayToFloat32Array(array: Vec4[]): Float32Array {
  const stride = Vec4.NUM_COMPONENTS;
  const result = new Float32Array(array.length * stride);
  for (let i = 0, offset = 0; i < array.length; i++, offset += stride) {
    vec4ToArray(array[i], result, offset);
  }
  return result;
}

export function float32ArrayToVec4Array(array: Float32Array): Vec4[] {
  const stride = Vec4.NUM_COMPONENTS;
  const result = new Array<Vec4>(array.length / stride);
  for (let i = 0, offset = 0; i < array.length; i++, offset += stride) {
    result[i] = new Vec4(
      array[offset],
      array[offset + 1],
      array[offset + 2],
      array[offset + 3]
    );
  }
  return result;
}

export function quatArrayToFloat32Array(array: Quat[]): Float32Array {
  const stride = Quat.NUM_COMPONENTS;
  const result = new Float32Array(array.length * stride);
  for (let i = 0, offset = 0; i < array.length; i++, offset += stride) {
    quatToArray(array[i], result, offset);
  }
  return result;
}

export function float32ArrayToQuatArray(array: Float32Array): Quat[] {
  const stride = Quat.NUM_COMPONENTS;
  const result = new Array<Quat>(array.length / stride);
  for (let i = 0, offset = 0; i < array.length; i++, offset += stride) {
    result[i] = new Quat(
      array[offset],
      array[offset + 1],
      array[offset + 2],
      array[offset + 3]
    );
  }
  return result;
}

export function mat3ArrayToFloat32Array(array: Mat3[]): Float32Array {
  const stride = Mat3.NUM_COMPONENTS;
  const result = new Float32Array(array.length * stride);
  for (let i = 0, offset = 0; i < array.length; i++, offset += stride) {
    mat3ToArray(array[i], result, offset);
  }
  return result;
}

export function float32ArrayToMat3Array(array: Float32Array): Mat3[] {
  const stride = Mat3.NUM_COMPONENTS;
  const result = new Array<Mat3>(array.length / stride);
  for (let i = 0, offset = 0; i < array.length; i++, offset += stride) {
    result[i] = new Mat3([
      array[offset],
      array[offset + 1],
      array[offset + 2],
      array[offset + 3],
      array[offset + 4],
      array[offset + 5],
      array[offset + 6],
      array[offset + 7],
      array[offset + 8]
    ]);
  }
  return result;
}

export function mat4ArrayToFloat32Array(array: Mat4[]): Float32Array {
  const stride = Mat4.NUM_COMPONENTS;
  const result = new Float32Array(array.length * stride);
  for (let i = 0, offset = 0; i < array.length; i++, offset += stride) {
    mat4ToArray(array[i], result, offset);
  }
  return result;
}

export function float32ArrayToMat4Array(array: Float32Array): Mat4[] {
  const stride = Mat4.NUM_COMPONENTS;
  const result = new Array<Mat4>(array.length / stride);
  for (let i = 0, offset = 0; i < array.length; i++, offset += stride) {
    result[i] = new Mat4([
      array[offset],
      array[offset + 1],
      array[offset + 2],
      array[offset + 3],
      array[offset + 4],
      array[offset + 5],
      array[offset + 6],
      array[offset + 7],
      array[offset + 8],
      array[offset + 9],
      array[offset + 10],
      array[offset + 11],
      array[offset + 12],
      array[offset + 13],
      array[offset + 14],
      array[offset + 15]
    ]);
  }
  return result;
}
