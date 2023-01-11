import { Line3 } from './Line3';
import { Vec3 } from './Vec3';
import {
  vec3Delta,
  vec3Distance,
  vec3DistanceSq,
  vec3Dot,
  vec3Equals,
  vec3Lerp,
  vec3Subtract
} from './Vec3.Functions';

export function line3Delta(a: Line3, b: Line3): number {
  return vec3Delta(a.start, b.start) + vec3Delta(a.end, b.end);
}

export function line3Equals(a: Line3, b: Line3, tolerance = 0): boolean {
  return (
    vec3Equals(a.start, b.start, tolerance) &&
    vec3Equals(a.end, b.end, tolerance)
  );
}

export function line3Length(a: Line3): number {
  return vec3Distance(a.start, a.end);
}
export function line3LengthSq(a: Line3): number {
  return vec3DistanceSq(a.start, a.end);
}

export function line3At(a: Line3, t: number, result = new Vec3()): Vec3 {
  return vec3Lerp(a.start, a.end, t, result);
}

export function line3Midpoint(a: Line3, result = new Vec3()): Vec3 {
  return vec3Lerp(a.start, a.end, 0.5, result);
}

export function line3Invert(a: Line3, result = new Line3()): Line3 {
  return result.set(a.end, a.start);
}

export function line3ClosestPoint(
  a: Line3,
  b: Vec3,
  result = new Vec3()
): Vec3 {
  const ab = vec3Subtract(b, a.start);
  const ac = vec3Subtract(b, a.end);
  const ab2 = vec3Dot(ab, ab);
  if (ab2 === 0) {
    return result.copy(a.start);
  }
  const t = vec3Dot(ac, ab) / ab2;
  return line3At(a, t, result);
}
