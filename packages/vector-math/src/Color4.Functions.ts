import { Color4 } from './Color4';
import {
  EPSILON,
  equalsTolerance,
  parseSafeFloats,
  toSafeString
} from './Functions';
import { clamp } from './Functions';

export function color4Equals(
  a: Color4,
  b: Color4,
  tolerance: number = EPSILON
): boolean {
  return (
    equalsTolerance(a.r, b.r, tolerance) &&
    equalsTolerance(a.g, b.g, tolerance) &&
    equalsTolerance(a.b, b.b, tolerance) &&
    equalsTolerance(a.a, b.a, tolerance)
  );
}
export function color4Add(a: Color4, b: Color4, result = new Color4()): Color4 {
  return result.set(a.r + b.r, a.g + b.g, a.b + b.b, a.a + b.a);
}
export function color4Subtract(
  a: Color4,
  b: Color4,
  result = new Color4()
): Color4 {
  return result.set(a.r - b.r, a.g - b.g, a.b - b.b, a.a - b.a);
}
export function color4MultiplyByScalar(
  a: Color4,
  b: number,
  result = new Color4()
): Color4 {
  return result.set(a.r * b, a.g * b, a.b * b, a.a * b);
}
export function color4Negate(a: Color4, result = new Color4()): Color4 {
  return result.set(-a.r, -a.g, -a.b, -a.a);
}
export function color4Length(a: Color4): number {
  return Math.sqrt(color4Dot(a, a));
}
export function color4Dot(a: Color4, b: Color4): number {
  return a.r * b.r + a.g * b.g + a.b * b.b + a.a * b.a;
}
export function color4Lerp(
  a: Color4,
  b: Color4,
  t: number,
  result = new Color4()
): Color4 {
  const s = 1 - t;
  return result.set(
    a.r * s + b.r * t,
    a.g * s + b.g * t,
    a.b * s + b.b * t,
    a.a * s + b.a * t
  );
}
export function arrayToColor4(
  array: Float32Array | number[],
  offset = 0,
  result = new Color4()
): Color4 {
  return result.set(
    array[offset + 0],
    array[offset + 1],
    array[offset + 2],
    array[offset + 3]
  );
}
export function color4ToArray(
  a: Color4,
  array: Float32Array | number[],
  offset = 0
): void {
  array[offset + 0] = a.r;
  array[offset + 1] = a.g;
  array[offset + 2] = a.b;
  array[offset + 3] = a.a;
}
export function color4ToString(a: Color4): string {
  return toSafeString([a.r, a.g, a.b, a.a]);
}
export function color4Parse(text: string, result = new Color4()): Color4 {
  return arrayToColor4(parseSafeFloats(text), 0, result);
}

export function rgbeToLinear(source: Color4, result = new Color4()): Color4 {
  const s = 2 ** (source.a * 255 - 128);
  return result.set(source.r * s, source.g * s, source.b * s, 1);
}

export function linearToRgbd(
  source: Color4,
  maxRange: number,
  result = new Color4()
): Color4 {
  const maxRGB = Math.max(source.r, source.g, source.b);
  const realD = Math.max(maxRange / maxRGB, 1);
  const normalizedD = clamp(Math.floor(realD) / 255, 0, 1);
  const s = normalizedD * (255 / maxRange);
  return result.set(source.r * s, source.g * s, source.b * s, normalizedD);
}

export function linearToRgbd16(source: Color4, result = new Color4()): Color4 {
  return linearToRgbd(source, 16, result);
}
