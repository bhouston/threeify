import {
  delta,
  EPSILON,
  equalsTolerance,
  parseSafeFloats,
  toSafeString
} from './Functions';
import { Vec4 } from './Vec4';

export function vec4Delta(a: Vec4, b: Vec4): number {
  return delta(a.x, b.x) + delta(a.y, b.y) + delta(a.z, b.z) + delta(a.w, b.w);
}

export function vec4Equals(
  a: Vec4,
  b: Vec4,
  tolerance: number = EPSILON
): boolean {
  return (
    equalsTolerance(a.x, b.x, tolerance) &&
    equalsTolerance(a.y, b.y, tolerance) &&
    equalsTolerance(a.z, b.z, tolerance) &&
    equalsTolerance(a.w, b.w, tolerance)
  );
}
export function vec4Add(a: Vec4, b: Vec4, result = new Vec4()): Vec4 {
  return result.set(a.x + b.x, a.y + b.y, a.z + b.z, a.w + b.w);
}
export function vec4Subtract(a: Vec4, b: Vec4, result = new Vec4()): Vec4 {
  return result.set(a.x - b.x, a.y - b.y, a.z - b.z, a.w - b.w);
}
export function vec4MultiplyByScalar(
  a: Vec4,
  b: number,
  result = new Vec4()
): Vec4 {
  return result.set(a.x * b, a.y * b, a.z * b, a.w * b);
}
export function vec4Negate(a: Vec4, result = new Vec4()): Vec4 {
  return result.set(-a.x, -a.y, -a.z, -a.w);
}
export function vec4LengthSq(a: Vec4): number {
  return vec4Dot(a, a);
}
export function vec4Length(a: Vec4): number {
  return Math.sqrt(vec4Dot(a, a));
}

export function vec4Distance(a: Vec4, b: Vec4): number {
  // TODO: optimize this by breaking it apart
  return vec4Length(vec4Subtract(a, b));
}
export function vec4DistanceSq(a: Vec4, b: Vec4): number {
  // TODO: optimize this by breaking it apart
  return vec4LengthSq(vec4Subtract(a, b));
}

export function vec4Normalize(a: Vec4, result = new Vec4()): Vec4 {
  const length = vec4Length(a);
  if (length === 0) {
    return result.set(0, 0, 0, 0);
  }
  return vec4MultiplyByScalar(a, 1 / length, result);
}

export function vec4Min(a: Vec4, b: Vec4, result = new Vec4()): Vec4 {
  return result.set(
    Math.min(a.x, b.x),
    Math.min(a.y, b.y),
    Math.min(a.z, b.z),
    Math.min(a.w, b.w)
  );
}
export function vec4Max(a: Vec4, b: Vec4, result = new Vec4()): Vec4 {
  return result.set(
    Math.max(a.x, b.x),
    Math.max(a.y, b.y),
    Math.max(a.z, b.z),
    Math.max(a.w, b.w)
  );
}
export function vec4Ceil(a: Vec4, result = new Vec4()): Vec4 {
  return result.set(Math.ceil(a.x), Math.ceil(a.y), Math.ceil(a.z), Math.ceil(a.w));
}
export function vec4Floor(a: Vec4, result = new Vec4()): Vec4 {
  return result.set(Math.floor(a.x), Math.floor(a.y), Math.floor(a.z), Math.floor(a.w));
}

export function vec4Dot(a: Vec4, b: Vec4): number {
  return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
}
export function vec4Lerp(
  a: Vec4,
  b: Vec4,
  t: number,
  result = new Vec4()
): Vec4 {
  const s = 1 - t;
  return result.set(
    a.x * s + b.x * t,
    a.y * s + b.y * t,
    a.z * s + b.z * t,
    a.w * s + b.w * t
  );
}
export function arrayToVec4(
  array: Float32Array | number[],
  offset = 0,
  result = new Vec4()
): Vec4 {
  return result.set(
    array[offset + 0],
    array[offset + 1],
    array[offset + 2],
    array[offset + 3]
  );
}
export function vec4ToArray(
  a: Vec4,
  array: Float32Array | number[],
  offset = 0
): void {
  array[offset + 0] = a.x;
  array[offset + 1] = a.y;
  array[offset + 2] = a.z;
  array[offset + 3] = a.w;
}
export function vec4ToString(a: Vec4): string {
  return toSafeString([a.x, a.y, a.z, a.w]);
}
export function stringToVec4(text: string, result = new Vec4()): Vec4 {
  return arrayToVec4(parseSafeFloats(text), 0, result);
}
