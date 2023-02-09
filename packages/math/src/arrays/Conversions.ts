import { Color4 } from '../Color4';
import {
  arrayToColor4,
  color4ToArray,
  rgbeToLinear
} from '../Color4.Functions';
import { float32ToFloat16 } from '../utils/fp16';

export function normalizedByteToFloat32s(
  sourceArray: Uint8Array,
  result: Float32Array | undefined = undefined
): Float32Array {
  const scale = 1 / 255;
  if (result === undefined) {
    result = new Float32Array(sourceArray.length);
  }
  for (let i = 0; i < sourceArray.length; i++) {
    result[i] = sourceArray[i] * scale;
  }
  return result;
}
export function float32sToNormalizedBytes(
  sourceArray: Float32Array,
  result: Uint8Array | undefined = undefined
): Uint8Array {
  const scale = 255;
  if (result === undefined) {
    result = new Uint8Array(sourceArray.length);
  }
  for (let i = 0; i < sourceArray.length; i++) {
    result[i] = sourceArray[i] * scale;
  }
  return result;
}

export function normalizedByteToFloat16s(
  sourceArray: Uint8Array,
  result: Uint16Array | undefined = undefined
): Uint16Array {
  const scale = 1 / 255;
  if (result === undefined) {
    result = new Uint16Array(sourceArray.length);
  }
  for (let i = 0; i < sourceArray.length; i++) {
    result[i] = float32ToFloat16(sourceArray[i] * scale);
  }
  return result;
}

export function float32sToFloat16s(
  sourceArray: Float32Array,
  result: Uint16Array | undefined = undefined
): Uint16Array {
  if (result === undefined) {
    result = new Uint16Array(sourceArray.length);
  }
  for (let i = 0; i < sourceArray.length; i++) {
    result[i] = float32ToFloat16(sourceArray[i]);
  }
  return result;
}

export function float32RGBEToFloat32Linear(
  sourceArray: Float32Array,
  result: Float32Array | undefined = undefined
): Float32Array {
  if (result === undefined) {
    result = new Float32Array(sourceArray.length);
  }
  const color = new Color4();
  for (let i = 0; i < sourceArray.length; i += 4) {
    arrayToColor4(sourceArray, i, color);
    rgbeToLinear(color, color);
    color4ToArray(color, result, i);
  }
  return result;
}
