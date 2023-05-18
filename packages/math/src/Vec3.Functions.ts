import {
  delta,
  EPSILON,
  equalsTolerance,
  parseSafeFloats,
  toSafeString
} from './Functions.js';
import { Mat4 } from './Mat4.js';
import { Spherical } from './Spherical.js';
import { Vec3 } from './Vec3.js';

export function vec3Delta(a: Vec3, b: Vec3): number {
  return delta(a.x, b.x) + delta(a.y, b.y) + delta(a.z, b.z);
}

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
export function vec3Reciprocal(a: Vec3, result = new Vec3()): Vec3 {
  return result.set(1 / a.x, 1 / a.y, 1 / a.z);
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

export function vec3Min(a: Vec3, b: Vec3, result = new Vec3()): Vec3 {
  return result.set(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.min(a.z, b.z));
}
export function vec3Max(a: Vec3, b: Vec3, result = new Vec3()): Vec3 {
  return result.set(Math.max(a.x, b.x), Math.max(a.y, b.y), Math.max(a.z, b.z));
}
export function vec3MaxComponent(a: Vec3): number {
  return Math.max(a.x, a.y, a.z);
}
export function vec3MinComponent(a: Vec3): number {
  return Math.min(a.x, a.y, a.z);
}
export function vec3Ceil(a: Vec3, result = new Vec3()): Vec3 {
  return result.set(Math.ceil(a.x), Math.ceil(a.y), Math.ceil(a.z));
}
export function vec3Floor(a: Vec3, result = new Vec3()): Vec3 {
  return result.set(Math.floor(a.x), Math.floor(a.y), Math.floor(a.z));
}
export function vec3Clamp(
  a: Vec3,
  min: Vec3,
  max: Vec3,
  result = new Vec3()
): Vec3 {
  return vec3Max(min, vec3Min(max, a, result), result);
}

export function vec3Normalize(a: Vec3, result = new Vec3()): Vec3 {
  const length = vec3Length(a);
  if (length === 0) {
    return result.set(0, 0, 0);
  }
  return vec3MultiplyByScalar(a, 1 / length, result);
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
export function vec3Lerp(
  a: Vec3,
  b: Vec3,
  t: number,
  result = new Vec3()
): Vec3 {
  const s = 1 - t;
  return result.set(a.x * s + b.x * t, a.y * s + b.y * t, a.z * s + b.z * t);
}
export function arrayToVec3(
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
export function stringToVec3(text: string, result = new Vec3()): Vec3 {
  return arrayToVec3(parseSafeFloats(text), 0, result);
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
export function pointToBarycoords(
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

export function mat4TransformPosition3(
  m: Mat4,
  v: Vec3,
  result = new Vec3()
): Vec3 {
  const { x, y, z } = v;
  const e = m.elements;

  const w = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);

  result.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * w;
  result.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * w;
  result.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * w;

  return result;
}

export function mat4TransformNormal3(
  m: Mat4,
  v: Vec3,
  result = new Vec3()
): Vec3 {
  const { x, y, z } = v;
  const e = m.elements;

  result.x = e[0] * x + e[4] * y + e[8] * z;
  result.y = e[1] * x + e[5] * y + e[9] * z;
  result.z = e[2] * x + e[6] * y + e[10] * z;

  return vec3Normalize(result, result);
}

export function vec3Reflect(
  incident: Vec3,
  normal: Vec3,
  result = new Vec3()
): Vec3 {
  return vec3Subtract(
    incident,
    vec3MultiplyByScalar(vec3Project(incident, normal, result), 2, result),
    result
  );
}

// project vector onto another vector
export function vec3Project(a: Vec3, target: Vec3, result = new Vec3()): Vec3 {
  const dot = vec3Dot(a, target);
  return vec3MultiplyByScalar(target, dot / vec3Dot(target, target), result);
}

// determine angle between two vectors
export function vec3Angle(a: Vec3, b: Vec3): number {
  const theta = vec3Dot(a, b) / (vec3Length(a) * vec3Length(b));
  // clamp, to handle numerical problems
  return Math.acos(Math.min(Math.max(theta, -1), 1));
}
