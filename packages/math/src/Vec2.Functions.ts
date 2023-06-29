import {
  clamp,
  delta,
  EPSILON,
  equalsTolerance,
  parseSafeFloats,
  toSafeString
} from './Functions.js';
import { Mat3 } from './Mat3.js';
import { Vec2 } from './Vec2.js';

export function vec2Delta(a: Vec2, b: Vec2): number {
  return delta(a.x, b.x) + delta(a.y, b.y);
}

export function vec2Equals(
  a: Vec2,
  b: Vec2,
  tolerance: number = EPSILON
): boolean {
  return (
    equalsTolerance(a.x, b.x, tolerance) && equalsTolerance(a.y, b.y, tolerance)
  );
}
export function vec2Add(a: Vec2, b: Vec2, result: Vec2 = new Vec2()): Vec2 {
  return result.set(a.x + b.x, a.y + b.y);
}
export function vec2Subtract(
  a: Vec2,
  b: Vec2,
  result: Vec2 = new Vec2()
): Vec2 {
  return result.set(a.x - b.x, a.y - b.y);
}
export function vec2MultiplyByScalar(
  a: Vec2,
  b: number,
  result: Vec2 = new Vec2()
): Vec2 {
  return result.set(a.x * b, a.y * b);
}
export function vec2Negate(a: Vec2, result: Vec2 = new Vec2()): Vec2 {
  return result.set(-a.x, -a.y);
}
export function vec2LengthSq(a: Vec2): number {
  return vec2Dot(a, a);
}
export function vec2Length(a: Vec2): number {
  return Math.sqrt(vec2Dot(a, a));
}

export function vec2Min(a: Vec2, b: Vec2, result: Vec2 = new Vec2()): Vec2 {
  return result.set(Math.min(a.x, b.x), Math.min(a.y, b.y));
}

export function vec2Max(a: Vec2, b: Vec2, result: Vec2 = new Vec2()): Vec2 {
  return result.set(Math.max(a.x, b.x), Math.max(a.y, b.y));
}
export function vec2Ceil(a: Vec2, result: Vec2 = new Vec2()): Vec2 {
  return result.set(Math.ceil(a.x), Math.ceil(a.y));
}
export function vec2Floor(a: Vec2, result: Vec2 = new Vec2()): Vec2 {
  return result.set(Math.floor(a.x), Math.floor(a.y));
}
export function vec2Clamp(
  a: Vec2,
  min: Vec2,
  max: Vec2,
  result: Vec2 = new Vec2()
): Vec2 {
  return result.set(clamp(a.x, min.x, max.x), clamp(a.y, min.y, max.y));
}

export function vec2Distance(a: Vec2, b: Vec2): number {
  // TODO: optimize this by breaking it apart
  return vec2Length(vec2Subtract(a, b));
}
export function vec2DistanceSq(a: Vec2, b: Vec2): number {
  // TODO: optimize this by breaking it apart
  return vec2LengthSq(vec2Subtract(a, b));
}

export function vec2Normalize(a: Vec2, result = new Vec2()): Vec2 {
  const length = vec2Length(a);
  if (length === 0) {
    return result.set(0, 0);
  }
  return vec2MultiplyByScalar(a, 1 / length, result);
}
export function vec2Dot(a: Vec2, b: Vec2): number {
  return a.x * b.x + a.y * b.y;
}
export function vec2Lerp(
  a: Vec2,
  b: Vec2,
  t: number,
  result = new Vec2()
): Vec2 {
  const s = 1 - t;
  return result.set(a.x * s + b.x * t, a.y * s + b.y * t);
}
export function arrayToVec2(
  array: Float32Array | number[],
  offset = 0,
  result: Vec2 = new Vec2()
): Vec2 {
  return result.set(array[offset + 0], array[offset + 1]);
}
export function vec2ToArray(
  a: Vec2,
  array: Float32Array | number[],
  offset = 0
): void {
  array[offset + 0] = a.x;
  array[offset + 1] = a.y;
}

export function vec2ToString(a: Vec2): string {
  return toSafeString([a.x, a.y]);
}
export function stringToVec2(text: string, result = new Vec2()): Vec2 {
  return arrayToVec2(parseSafeFloats(text), 0, result);
}

export function vec2TransformPoint(
  v: Vec2,
  m: Mat3,
  result = new Vec2()
): Vec2 {
  const { x } = v;
  const { y } = v;
  const e = m.elements;

  const w = 1 / (e[2] * x + e[5] * y + e[8]);

  result.x = (e[0] * x + e[3] * y + e[6]) * w;
  result.y = (e[1] * x + e[4] * y + e[7]) * w;

  return result;
}

export function vec2TransformDirection(
  v: Vec2,
  m: Mat3,
  result = new Vec2()
): Vec2 {
  const { x } = v;
  const { y } = v;
  const e = m.elements;

  result.x = e[0] * x + e[3] * y;
  result.y = e[1] * x + e[4] * y;

  return vec2Normalize(result, result);
}

export function makeVec2Fit(
  frame: Vec2,
  target: Vec2,
  result = new Vec2()
): Vec2 {
  const fitScale = Math.min(frame.x / target.x, frame.y / target.y);
  return vec2MultiplyByScalar(target, fitScale, result);
}

export function makeVec2FillHeight(
  frame: Vec2,
  target: Vec2,
  result = new Vec2()
): Vec2 {
  const fitScale = frame.y / target.y;
  return vec2MultiplyByScalar(target, fitScale, result);
}

export function makeVec2Fill(
  frame: Vec2,
  target: Vec2,
  result = new Vec2()
): Vec2 {
  const fitScale = Math.max(frame.x / target.x, frame.y / target.y);
  return vec2MultiplyByScalar(target, fitScale, result);
}
