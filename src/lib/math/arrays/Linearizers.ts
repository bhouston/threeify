import { Matrix3 } from '../Matrix3';
import { Matrix4 } from '../Matrix4';
import { Quaternion } from '../Quaternion';
import { Vector2 } from '../Vector2';
import { Vector3 } from '../Vector3';

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

export function linearizeVector2FloatArray(array: Vector2[]): Float32Array {
  const result = new Float32Array(array.length * 2);
  for (let i = 0; i < array.length; i++) {
    array[i].toArray(result, i * 2);
  }
  return result;
}

export function linearizeVector3FloatArray(array: Vector3[]): Float32Array {
  const result = new Float32Array(array.length * 3);
  for (let i = 0; i < array.length; i++) {
    array[i].toArray(result, i * 3);
  }
  return result;
}

export function linearizeQuaternionFloatArray(
  array: Quaternion[]
): Float32Array {
  const result = new Float32Array(array.length * 4);
  for (let i = 0; i < array.length; i++) {
    array[i].toArray(result, i * 4);
  }
  return result;
}

export function linearizeMatrix3FloatArray(array: Matrix3[]): Float32Array {
  const result = new Float32Array(array.length * 9);
  for (let i = 0; i < array.length; i++) {
    array[i].toArray(result, i * 9);
  }
  return result;
}

export function linearizeMatrix4FloatArray(array: Matrix4[]): Float32Array {
  const result = new Float32Array(array.length * 16);
  for (let i = 0; i < array.length; i++) {
    array[i].toArray(result, i * 16);
  }
  return result;
}
