import { Color3 } from './Color3';
import {
  EPSILON,
  equalsTolerance,
  parseSafeFloats,
  saturate,
  toSafeString
} from './Functions';
import { Vec3 } from './Vec3';

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

export function color3Saturate(color: Color3, result = new Color3()): Color3 {
  return result.set(saturate(color.r), saturate(color.g), saturate(color.b));
}

// vec3 rgbToNormal(const vec3 rgb) {
//  return 2.0 * rgb.xyz - 1.0;
// }
export function color3ToNormal(color: Color3, result = new Vec3()): Vec3 {
  return result.set(2 * color.r - 1, 2 * color.g - 1, 2 * color.b - 1);
}

//vec3 normalToRgb(const vec3 normal) {
//  return normalize(normal) * 0.5 + 0.5;
//}
export function normalToColor3(normal: Vec3, result = new Color3()): Color3 {
  return result.set(
    0.5 * (normal.x + 1),
    0.5 * (normal.y + 1),
    0.5 * (normal.z + 1)
  );
}
