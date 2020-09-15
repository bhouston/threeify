import { Box3 } from "./Box3";
import { makeBox3FromPoints } from "./Box3.Functions";
import { Matrix4 } from "./Matrix4";
import { getMaxScaleOnAxis } from "./Matrix4.Functions";
import { Sphere } from "./Sphere";
import { Vector3 } from "./Vector3";
import { transformPoint3 } from "./Vector3Matrix4.Functions";

// TODO: Standardize constructor parameters to make it clear where the result it.  Often it is last and called result.
export function makeBoundingSphereFromBox(box: Box3, result = new Sphere()): Sphere {
  box.getCenter(result.center);
  result.radius = box.min.distanceTo(box.max) * 0.5;
  return result;
}

export function makeSphereFromPoints(
  points: Vector3[],
  optionalCenter: Vector3 | undefined,
  result = new Sphere(),
): Sphere {
  if (optionalCenter !== undefined) {
    result.center.copy(optionalCenter);
  } else {
    makeBox3FromPoints(points).getCenter(result.center);
  }
  let maxRadiusSq = 0;
  for (let i = 0, il = points.length; i < il; i++) {
    maxRadiusSq = Math.max(maxRadiusSq, result.center.distanceToSquared(points[i]));
  }
  result.radius = Math.sqrt(maxRadiusSq);

  return result;
}

export function sphereContainsPoint(sphere: Sphere, point: Vector3): boolean {
  return point.distanceToSquared(sphere.center) <= sphere.radius * sphere.radius;
}

export function sphereDistanceToPoint(sphere: Sphere, point: Vector3): number {
  return point.distanceTo(sphere.center) - sphere.radius;
}

export function clampPointToSphere(sphere: Sphere, point: Vector3): Vector3 {
  const deltaLengthSq = sphere.center.distanceToSquared(point);

  if (deltaLengthSq > sphere.radius * sphere.radius) {
    point.sub(sphere.center).normalize();
    point.multiplyByScalar(sphere.radius).add(sphere.center);
  }

  return point;
}

export function transformSphere(s: Sphere, m: Matrix4, result = new Sphere()): Sphere {
  transformPoint3(s.center, m, result.center);
  result.radius = s.radius * getMaxScaleOnAxis(m);
  return result;
}

export function translateSphere(s: Sphere, offset: Vector3, result = new Sphere()): Sphere {
  result.copy(s);
  result.center.add(offset);
  return result;
}

export function scaleSphere(s: Sphere, scale: number, result = new Sphere()): Sphere {
  result.copy(s);
  result.radius *= scale;
  return result;
}
