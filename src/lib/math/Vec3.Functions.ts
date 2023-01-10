import {
  EPSILON,
  equalsTolerance,
  parseSafeFloats,
  toSafeString
} from './Common.js';
import { Spherical } from './Spherical.js';
import { Vec3 } from './Vec3.js';

export function vec3Equals(
  a: Vec3,
  b: Vec3,
  tolerance: number = EPSILON
): boolean {
  return (
    equalsTolerance(a.x, b.x, tolerance) &&
    equalsTolerance(a.y, b.y, tolerance) &&
    equalsTolerance(a.z, b.z, tolerance)
  );
}
export function vec3Add(a: Vec3, b: Vec3, result = new Vec3()): Vec3 {
  return result.set(a.x + b.x, a.y + b.y, a.z + b.z);
}
export function vec3Subtract(a: Vec3, b: Vec3, result = new Vec3()): Vec3 {
  return result.set(a.x - b.x, a.y - b.y, a.z - b.z);
}

export function vec3MultiplyByScalar(
  a: Vec3,
  b: number,
  result = new Vec3()
): Vec3 {
  return result.set(a.x * b, a.y * b, a.z * b);
}
export function vec3Negate(a: Vec3, result = new Vec3()): Vec3 {
  return result.set(-a.x, -a.y, -a.z);
}
export function vec3LengthSq(a: Vec3): number {
  return vec3Dot(a, a);
}
export function vec3Length(a: Vec3): number {
  return Math.sqrt(vec3Dot(a, a));
}

export function vec3Distance(a: Vec3, b: Vec3): number {
  // TODO: optimize this by breaking it apart
  return vec3Length(vec3Subtract(a, b));
}
export function vec3DistanceSq(a: Vec3, b: Vec3): number {
  // TODO: optimize this by breaking it apart
  return vec3LengthSq(vec3Subtract(a, b));
}

export function vec3Normalize(a: Vec3, result = new Vec3()): Vec3 {
  const invLength = 1 / vec3Length(a);
  return vec3MultiplyByScalar(a, invLength, result);
}
export function vec3Dot(a: Vec3, b: Vec3): number {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}
export function vec3Cross(a: Vec3, b: Vec3, result = new Vec3()): Vec3 {
  const ax = a.x;
  const ay = a.y;
  const az = a.z;
  const bx = b.x;
  const by = b.y;
  const bz = b.z;

  return result.set(ay * bz - az * by, az * bx - ax * bz, ax * by - ay * bx);
}
export function vec3Mix(
  a: Vec3,
  b: Vec3,
  t: number,
  result = new Vec3()
): Vec3 {
  const s = 1 - t;
  return result.set(a.x * s + b.x * t, a.y * s + b.y * t, a.z * s + b.z * t);
}
export function vec3FromArray(
  array: Float32Array | number[],
  offset = 0,
  result = new Vec3()
): Vec3 {
  return result.set(array[offset + 0], array[offset + 1], array[offset + 2]);
}
export function vec3ToArray(
  a: Vec3,
  array: Float32Array | number[],
  offset = 0
): void {
  array[offset + 0] = a.x;
  array[offset + 1] = a.y;
  array[offset + 2] = a.z;
}
export function vec3ToString(a: Vec3): string {
  return toSafeString([a.x, a.y, a.z]);
}
export function vec3Parse(text: string, result = new Vec3()): Vec3 {
  return vec3FromArray(parseSafeFloats(text), 0, result);
}

export function crossFromCoplanarPoints(
  a: Vec3,
  b: Vec3,
  c: Vec3,
  result = new Vec3()
): Vec3 {
  // TODO: replace with just number math, no classes?  Or just use temporary Vec3 objects
  vec3Subtract(c, b, result);
  const v = vec3Subtract(a, b);
  return vec3Cross(result, v, result);
}

export function sphericalToVec3(s: Spherical): Vec3 {
  return sphericalCoordToVec3(s.radius, s.phi, s.theta);
}

export function sphericalCoordToVec3(
  radius: number,
  phi: number,
  theta: number
): Vec3 {
  const sinPhiRadius = Math.sin(phi) * radius;

  return new Vec3(
    sinPhiRadius * Math.sin(theta),
    Math.cos(phi) * radius,
    sinPhiRadius * Math.cos(theta)
  );
}

// static/instance method to calculate barycentric coordinates
// based on: http://www.blackpawn.com/texts/pointinpoly/default.html
export function pointToBaryCoords(
  a: Vec3,
  b: Vec3,
  c: Vec3,
  point: Vec3,
  result = new Vec3()
): Vec3 {
  const v0 = vec3Subtract(c, b);
  const v1 = vec3Subtract(b, a);
  const v2 = vec3Subtract(point, a);

  const dot00 = vec3Dot(v0, v0);
  const dot01 = vec3Dot(v0, v1);
  const dot02 = vec3Dot(v0, v2);
  const dot11 = vec3Dot(v1, v1);
  const dot12 = vec3Dot(v1, v2);

  const denom = dot00 * dot11 - dot01 * dot01;

  // collinear or singular triangle
  if (denom === 0) {
    // arbitrary location outside of triangle?
    // not sure if this is the best idea, maybe should be returning undefined
    return result.set(-2, -1, -1);
  }

  const invDenom = 1 / denom;
  const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
  const v = (dot00 * dot12 - dot01 * dot02) * invDenom;

  // barycentric coordinates must always sum to 1
  return result.set(1 - u - v, v, u);
}

// replace with just a linear weight function
export function barycoordWeightsToVec3(
  baryCoord: Vec3,
  a: Vec3,
  b: Vec3,
  c: Vec3,
  result = new Vec3()
): Vec3 {
  const v = baryCoord;
  return result.set(
    a.x * v.x + b.x * v.y + c.x * v.z,
    a.y * v.x + b.y * v.y + c.y * v.z,
    a.z * v.x + b.z * v.y + c.z * v.z
  );
}
