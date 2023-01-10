import { Color3 } from '../Color3.js';
import { Mat3 } from '../Mat3.js';
import { Mat4 } from '../Mat4.js';
import { Quat } from '../Quat.js';
import { Vec2 } from '../Vec2.js';
import { Vec3 } from '../Vec3.js';

export function linearizeNumberInt32Array(array: number[]): Int32Array {
  const result = new Int32Array(array.length);
  for (let i = 0; i < array.length; i++) {
    result[i] = array[i];
  }
  return result;
}

// TODO: Convert to generics.

export function linearizeNumberFloatArray(array: number[]): Float32Array {
  const result = new Float32Array(array.length);
  for (let i = 0; i < array.length; i++) {
    result[i] = array[i];
  }
  return result;
}

export function linearizeColor3FloatArray(array: Color3[]): Float32Array {
  const result = new Float32Array(array.length * 3);
  for (let i = 0; i < array.length; i++) {
    array[i].toArray(result, i * 3);
  }
  return result;
}

export function linearizeVec2FloatArray(array: Vec2[]): Float32Array {
  const result = new Float32Array(array.length * 2);
  for (let i = 0; i < array.length; i++) {
    array[i].toArray(result, i * 2);
  }
  return result;
}

export function linearizeVec3FloatArray(array: Vec3[]): Float32Array {
  const result = new Float32Array(array.length * 3);
  for (let i = 0; i < array.length; i++) {
    array[i].toArray(result, i * 3);
  }
  return result;
}

export function linearizeQuatFloatArray(
  array: Quat[]
): Float32Array {
  const result = new Float32Array(array.length * 4);
  for (let i = 0; i < array.length; i++) {
    array[i].toArray(result, i * 4);
  }
  return result;
}

export function linearizeMat3FloatArray(array: Mat3[]): Float32Array {
  const result = new Float32Array(array.length * 9);
  for (let i = 0; i < array.length; i++) {
    array[i].toArray(result, i * 9);
  }
  return result;
}

export function linearizeMat4FloatArray(array: Mat4[]): Float32Array {
  const result = new Float32Array(array.length * 16);
  for (let i = 0; i < array.length; i++) {
    array[i].toArray(result, i * 16);
  }
  return result;
}
