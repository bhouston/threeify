import { box3FromVec3s } from './Box3.Functions.js';
import { Box3 } from './Box3.js';
import { mat4ToMaxAxisScale } from './Mat4.Functions.js';
import { Mat4 } from './Mat4.js';
import { Sphere } from './Sphere.js';
import {
  vec3Add,
  vec3Distance,
  vec3DistanceSq,
  vec3Equals,
  vec3MultiplyByScalar,
  vec3Normalize,
  vec3Subtract
} from './Vec3.Functions.js';
import { Vec3 } from './Vec3.js';

export function sphereIsEmpty(s: Sphere): boolean {
  return s.radius < 0;
}

export function sphereEmpty(result = new Sphere()): Sphere {
  result.center.set(0, 0, 0);
  result.radius = -1;

  return result;
}

export function sphereEquals(a: Sphere, b: Sphere): boolean {
  return vec3Equals(a.center, b.center) && a.radius === b.radius;
}

// TODO: Standardize constructor parameters to make it clear where the result it.  Often it is last and called result.
export function box3ToSphere(box: Box3, result = new Sphere()): Sphere {
  box.getCenter(result.center);
  result.radius = vec3Distance(box.min, box.max) * 0.5;
  return result;
}

export function vec3ArrayToSphere(
  points: Vec3[],
  optionalCenter: Vec3 | undefined,
  result = new Sphere()
): Sphere {
  if (optionalCenter !== undefined) {
    optionalCenter.clone(result.center);
  } else {
    box3FromVec3s(points).getCenter(result.center);
  }
  let maxRadiusSq = 0;
  for (let i = 0, il = points.length; i < il; i++) {
    maxRadiusSq = Math.max(
      maxRadiusSq,
      vec3DistanceSq(result.center, points[i])
    );
  }
  result.radius = Math.sqrt(maxRadiusSq);

  return result;
}

export function sphereContainsPoint(sphere: Sphere, point: Vec3): boolean {
  return vec3DistanceSq(point, sphere.center) <= sphere.radius * sphere.radius;
}

export function sphereDistanceToPoint(sphere: Sphere, point: Vec3): number {
  return vec3Distance(point, sphere.center) - sphere.radius;
}

export function sphereClampPoint(
  sphere: Sphere,
  point: Vec3,
  result = new Vec3()
): Vec3 {
  const deltaLengthSq = vec3DistanceSq(sphere.center, point);

  point.clone(result);
  if (deltaLengthSq > sphere.radius * sphere.radius) {
    vec3Normalize(vec3Subtract(result, sphere.center, result), result);
    vec3Add(
      vec3MultiplyByScalar(result, sphere.radius, result),
      sphere.center,
      result
    );
  }

  return result;
}

export function sphereTransformMat3(
  s: Sphere,
  m: Mat4,
  result = new Sphere()
): Sphere {
  transformPoint3(s.center, m, result.center);
  result.radius = s.radius * mat4ToMaxAxisScale(m);
  return result;
}

export function sphereTranslate(
  s: Sphere,
  offset: Vec3,
  result = new Sphere()
): Sphere {
  s.clone(result);
  vec3Add(result.center, offset, result.center);
  return result;
}

export function sphereScale(
  s: Sphere,
  scale: number,
  result = new Sphere()
): Sphere {
  s.clone(result);
  result.radius *= scale;
  return result;
}
