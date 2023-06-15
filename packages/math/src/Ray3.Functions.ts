import { Mat4 } from './Mat4';
import { planePointDistance } from './Plane.Functions';
import { Plane } from './Plane';
import { Ray3 } from './Ray3';
import {
  mat4TransformNormal3,
  mat4TransformVec3,
  vec3Add,
  vec3Dot,
  vec3Equals,
  vec3MultiplyByScalar,
  vec3Normalize,
  vec3Subtract
} from './Vec3.Functions';
import { Vec3 } from './Vec3';

export function ray3Equals(a: Ray3, b: Ray3): boolean {
  return vec3Equals(a.origin, b.origin) && vec3Equals(a.direction, b.direction);
}

export function ray3At(r: Ray3, t: number, result = new Vec3()): Vec3 {
  return vec3Add(
    vec3MultiplyByScalar(r.direction.clone(result), t, result),
    r.origin,
    result
  );
}

export function ray3LookAt(r: Ray3, v: Vec3, result = new Ray3()): Ray3 {
  result.origin.copy(r.origin);
  vec3Normalize(
    vec3Subtract(v.clone(result.direction), r.origin, result.direction),
    result.direction
  );

  return result;
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

export function ray3Negate(r: Ray3, result = new Ray3()): Ray3 {
  result.origin.copy(r.origin);
  vec3MultiplyByScalar(r.direction, -1, result.direction);
  return result;
}

export function ray3IntersectPlane(
  ray: Ray3,
  plane: Plane,
  result = new Vec3()
): Vec3 {
  const t = ray3DistanceToPlane(ray, plane);
  return ray3At(ray, t, result);
}

export function mat4TransformRay3(m: Mat4, r: Ray3, result = new Ray3()): Ray3 {
  mat4TransformVec3(m, r.origin, result.origin);
  mat4TransformNormal3(m, r.direction, result.direction);
  return result;
}
