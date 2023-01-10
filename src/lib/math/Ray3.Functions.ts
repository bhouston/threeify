import { planePointDistance } from './Plane.Functions.js';
import { Plane } from './Plane.js';
import { Ray3 } from './Ray3.js';
import {
  vec3Add,
  vec3Dot,
  vec3Equals,
  vec3MultiplyByScalar,
  vec3Normalize,
  vec3Subtract
} from './Vec3.Functions.js';
import { Vec3 } from './Vec3.js';

export function ray3At(r: Ray3, t: number, result = new Vec3()): Vec3 {
  return vec3Add(
    vec3MultiplyByScalar(r.direction.clone(result), t, result),
    r.origin,
    result
  );
}

export function ray3LookAt(r: Ray3, v: Vec3, result = new Ray3()): Ray3 {
  vec3Normalize(
    vec3Subtract(v.clone(result.direction), r.origin, result.direction),
    result.direction
  );

  return result;
}

export function ray3Equals(a: Ray3, b: Ray3): boolean {
  return vec3Equals(a.origin, b.origin) && vec3Equals(a.direction, b.direction);
}

export function ray3DistanceToPlane(ray: Ray3, plane: Plane): number {
  const denominator = vec3Dot(plane.normal, ray.direction);

  if (denominator === 0) {
    // line is coplanar, return origin
    if (planePointDistance(plane, ray.origin) === 0) {
      return 0;
    }
    return Number.NaN;
  }

  const t = -(vec3Dot(ray.origin, plane.normal) + plane.constant) / denominator;
  // Return if the ray never intersects the plane
  return t >= 0 ? t : Number.NaN;
}
