import { Color3 } from './Color3.js';
import {
  EPSILON,
  equalsTolerance,
  parseSafeFloats,
  toSafeString
} from './Functions.js';

export function color3Equals(
  a: Color3,
  b: Color3,
  tolerance: number = EPSILON
): boolean {
  return (
    equalsTolerance(a.r, b.r, tolerance) &&
    equalsTolerance(a.g, b.g, tolerance) &&
    equalsTolerance(a.b, b.b, tolerance)
  );
}
export function color3Add(a: Color3, b: Color3, result = new Color3()): Color3 {
  return result.set(a.r + b.r, a.g + b.g, a.b + b.b);
}
export function color3Subtract(
  a: Color3,
  b: Color3,
  result = new Color3()
): Color3 {
  return result.set(a.r - b.r, a.g - b.g, a.b - b.b);
}
export function color3MultiplyByScalar(
  a: Color3,
  b: number,
  result = new Color3()
): Color3 {
  return result.set(a.r * b, a.g * b, a.b * b);
}
export function color3Negate(a: Color3, result = new Color3()): Color3 {
  return result.set(-a.r, -a.g, -a.b);
}
export function color3Length(a: Color3): number {
  return Math.sqrt(color3Dot(a, a));
}
export function color3Normalize(a: Color3, result = new Color3()): Color3 {
  const invLength = 1 / color3Length(a);
  return color3MultiplyByScalar(a, invLength, result);
}
export function color3Dot(a: Color3, b: Color3): number {
  return a.r * b.r + a.g * b.g + a.b * b.b;
}

export function color3Min(a: Color3, b: Color3, result = new Color3()): Color3 {
  return result.set(Math.min(a.r, b.r), Math.min(a.g, b.g), Math.min(a.b, b.b));
}
export function color3Max(a: Color3, b: Color3, result = new Color3()): Color3 {
  return result.set(Math.max(a.r, b.r), Math.max(a.g, b.g), Math.max(a.b, b.b));
}
export function color3MaxComponent(a: Color3): number {
  return Math.max(a.r, a.g, a.b);
}
export function color3MinComponent(a: Color3): number {
  return Math.min(a.r, a.g, a.b);
}

export function color3Lerp(
  a: Color3,
  b: Color3,
  t: number,
  result = new Color3()
): Color3 {
  const s = 1 - t;
  return result.set(a.r * s + b.r * t, a.g * s + b.g * t, a.b * s + b.b * t);
}
export function arrayToColor3(
  array: Float32Array | number[],
  offset = 0,
  result = new Color3()
): Color3 {
  return result.set(array[offset + 0], array[offset + 1], array[offset + 2]);
}
export function color3ToArray(
  a: Color3,
  array: Float32Array | number[],
  offset = 0
): void {
  array[offset + 0] = a.r;
  array[offset + 1] = a.g;
  array[offset + 2] = a.b;
}
export function color3ToString(a: Color3): string {
  return toSafeString([a.r, a.g, a.b]);
}
export function color3Parse(text: string, result = new Color3()): Color3 {
  return arrayToColor3(parseSafeFloats(text), 0, result);
}

export function hexToColor3(hex: number, result = new Color3()): Color3 {
  hex = Math.floor(hex);
  return result.set(
    ((hex >> 16) & 255) / 255,
    ((hex >> 8) & 255) / 255,
    (hex & 255) / 255
  );
}

export function color3ToHex(rgb: Color3): number {
  return ((rgb.r * 255) << 16) ^ ((rgb.g * 255) << 8) ^ ((rgb.b * 255) << 0);
}

export function color3ToHexString(rgb: Color3): string {
  return `${color3ToHex(rgb).toString(16)}`;
}

export function hexStringToColor3(hex: string, result = new Color3()): Color3 {
  return hexToColor3(Number.parseInt(hex.replace(/^#/, ''), 16), result);
}
