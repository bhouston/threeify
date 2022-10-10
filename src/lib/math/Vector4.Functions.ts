import { clamp } from './Functions.js';
import { Vector4 } from './Vector4.js';

export function rgbeToLinear(source: Vector4, result = new Vector4()): Vector4 {
  const s = 2 ** (source.a * 255 - 128);
  return result.set(source.r * s, source.g * s, source.b * s, 1);
}

export function linearToRgbd(
  source: Vector4,
  maxRange: number,
  result = new Vector4()
): Vector4 {
  const maxRGB = Math.max(source.r, source.g, source.b);
  const realD = Math.max(maxRange / maxRGB, 1);
  const normalizedD = clamp(Math.floor(realD) / 255, 0, 1);
  const s = normalizedD * (255 / maxRange);
  return result.set(source.r * s, source.g * s, source.b * s, normalizedD);
}

export function linearToRgbd16(
  source: Vector4,
  result = new Vector4()
): Vector4 {
  return linearToRgbd(source, 16, result);
}

// TODO: Convert these to generics that take a encoding function of type (V4,V4)=>V4
//  encodeArray<T>( sourceArray: Float32Array, result: Float32Array | undefined = undefined ): Float32Array {}

export function rgbeToLinearArray(
  sourceArray: Float32Array,
  result: Float32Array | undefined = undefined
): Float32Array {
  const sourceColor = new Vector4();
  const destColor = new Vector4();
  if (result === undefined) {
    result = new Float32Array(sourceArray.length);
  }
  for (let i = 0; i < sourceArray.length; i += 4) {
    sourceColor.setFromArray(sourceArray, i);
    rgbeToLinear(sourceColor, destColor);
    destColor.toArray(result, i);
  }
  return result;
}

export function linearToRgbdArray(
  sourceArray: Float32Array,
  maxRange: number,
  result: Float32Array | undefined = undefined
): Float32Array {
  const sourceColor = new Vector4();
  const destColor = new Vector4();
  if (result === undefined) {
    result = new Float32Array(sourceArray.length);
  }
  for (let i = 0; i < sourceArray.length; i += 4) {
    sourceColor.setFromArray(sourceArray, i);
    linearToRgbd(sourceColor, maxRange, destColor);
    destColor.toArray(result, i);
  }
  return result;
}
