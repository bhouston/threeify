import { clamp } from "./Functions";
import { Vector4 } from "./Vector4";

export function rgbeToLinear(source: Vector4, result = new Vector4()): Vector4 {
  const scale = Math.pow(2.0, source.a * 255.0 - 128.0);
  return result.set(scale * source.r, scale * source.g, scale * source.b, 1.0);
}

export function linearToRgbd(source: Vector4, maxRange: number, result = new Vector4()): Vector4 {
  const maxRGB = Math.max(source.r, source.g, source.b);
  const realD = Math.max(maxRange / maxRGB, 1.0);
  const normalizedD = clamp(Math.floor(realD) / 255.0, 0.0, 1.0);
  const dFactor = normalizedD * (255.0 / maxRange);
  return result.set(source.r * dFactor, source.g * dFactor, source.b * dFactor, normalizedD);
}

export function linearToRgbd16(source: Vector4, result = new Vector4()): Vector4 {
  return linearToRgbd(source, 16, result);
}

// TODO: Convert these to generics that take a encoding function of type (V4,V4)=>V4
export function rgbeToLinearArray(
  sourceArray: Float32Array,
  result: Float32Array | undefined = undefined,
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
  result: Float32Array | undefined = undefined,
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
