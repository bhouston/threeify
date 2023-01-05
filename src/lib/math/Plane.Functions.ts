import { Plane } from './Plane.js';
import { Sphere } from './Sphere.js';
import { Triangle3 } from './Triangle3.js';
import { crossFromCoplanarPoints } from './Vector3.Functions.js';
import { Vector3 } from './Vector3.js';

export function makePlaneFromCoplanarPoints(
  a: Vector3,
  b: Vector3,
  c: Vector3,
  result = new Plane()
): Plane {
  crossFromCoplanarPoints(a, b, c, result.normal);
  result.normal.normalize();
  return makePlaneFromNormalAndCoplanarPoint(result.normal, a, result);
}

export function makePlaneFromTriangle(
  t: Triangle3,
  result = new Plane()
): Plane {
  return makePlaneFromCoplanarPoints(t.a, t.b, t.c, result);
}

export function makePlaneFromNormalAndCoplanarPoint(
  normal: Vector3,
  point: Vector3,
  result: Plane = new Plane()
): Plane {
  result.normal.copy(normal);
  result.constant = -point.dot(normal);
  return result;
}

export function planePointDistance(plane: Plane, point: Vector3): number {
  return plane.normal.dot(point) + plane.constant;
}

// TODO: organize the function naming always in alphabetical if equivalent
export function planeSphereDistance(plane: Plane, sphere: Sphere): number {
  return planePointDistance(plane, sphere.center) - sphere.radius;
}

export function projectPointOntoPlane(
  point: Vector3,
  plane: Plane,
  result: Vector3 = new Vector3()
): Vector3 {
  // TODO: Determine if this is even correct
  const v = point.clone();
  return result
    .copy(plane.normal)
    .multiplyByScalar(-planePointDistance(plane, v))
    .add(v);
}
