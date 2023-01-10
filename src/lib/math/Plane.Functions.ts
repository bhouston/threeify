import { Plane } from './Plane.js';
import { Sphere } from './Sphere.js';
import { Triangle3 } from './Triangle3.js';
import {
  crossFromCoplanarPoints as vec3CrossFromCoplanarPoints,
  vec3Add,
  vec3Dot,
  vec3Equals,
  vec3Length,
  vec3MultiplyByScalar,
  vec3Negate,
  vec3Normalize
} from './Vec3.Functions.js';
import { Vec3 } from './Vec3.js';

export function planeNormalize(p: Plane, result = new Plane()): Plane {
  // Note: will lead to a divide by zero if the plane is invalid.
  const inverseNormalLength = 1 / vec3Length(p.normal);
  vec3MultiplyByScalar(p.normal, inverseNormalLength, result.normal);
  result.constant = p.constant * inverseNormalLength;

  return result;
}
export function planeInvert(p: Plane, result = new Plane()): Plane {
  result.constant = p.constant * -1;
  vec3Negate(p.normal, result.normal);

  return result;
}

export function planeEquals(a: Plane, b: Plane): boolean {
  return vec3Equals(a.normal, b.normal) && a.constant === b.constant;
}

export function coplanarPointsToPlane(
  a: Vec3,
  b: Vec3,
  c: Vec3,
  result = new Plane()
): Plane {
  vec3CrossFromCoplanarPoints(a, b, c, result.normal);
  vec3Normalize(result.normal, result.normal);
  return normalAndCoplanarPointToPlane(result.normal, a, result);
}

export function triangleToPlane(t: Triangle3, result = new Plane()): Plane {
  return coplanarPointsToPlane(t.a, t.b, t.c, result);
}

export function normalAndCoplanarPointToPlane(
  normal: Vec3,
  point: Vec3,
  result: Plane = new Plane()
): Plane {
  normal.clone(result.normal);
  result.constant = -vec3Dot(point, normal);
  return result;
}

export function planePointDistance(plane: Plane, point: Vec3): number {
  return vec3Dot(plane.normal, point) + plane.constant;
}

// TODO: organize the function naming always in alphabetical if equivalent
export function planeSphereDistance(plane: Plane, sphere: Sphere): number {
  return planePointDistance(plane, sphere.center) - sphere.radius;
}

export function projectPointOntoPlane(
  point: Vec3,
  plane: Plane,
  result: Vec3 = new Vec3()
): Vec3 {
  // TODO: Determine if this is even correct
  const v = point.clone();
  plane.normal.clone(result);
  const delta = -planePointDistance(plane, v);
  vec3MultiplyByScalar(result, delta, result);
  vec3Add(v, result, result);
  return result;
}
