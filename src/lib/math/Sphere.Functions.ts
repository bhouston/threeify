import { Box3 } from "./Box3";
import { makeBox3FromPoints } from "./Box3.Functions";
import { Matrix4 } from "./Matrix4";
import { getMaxScaleOnAxis } from "./Matrix4.Functions";
import { Sphere } from "./Sphere";
import { Vector3 } from "./Vector3";
import { transformPoint } from "./Vector3Matrix4.Functions";

// TODO: Standardize constructor parameters to make it clear where the result it.  Often it is last and called result.
export function makeSphereThatContainsBox(sphere: Sphere, box: Box3): Sphere {
  box.getCenter(sphere.center);
  sphere.radius = box.min.distanceTo(box.max) * 0.5;
  return sphere;
}

export function makeSphereFromPoints(
  points: Vector3[],
  optionalCenter: Vector3 | undefined,
  result = new Sphere(),
): Sphere {
  if (optionalCenter !== undefined) {
    result.center.copy(optionalCenter);
  } else {
    makeBox3FromPoints(new Box3(), points).getCenter(result.center);
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

export function transformSphere(matrix: Matrix4, sphere: Sphere): Sphere {
  transformPoint(matrix, sphere.center);
  sphere.radius *= getMaxScaleOnAxis(matrix);
  return sphere;
}

export function translateSphere(sphere: Sphere, offset: Vector3): Sphere {
  sphere.center.add(offset);
  return sphere;
}

export function scaleSphere(sphere: Sphere, scale: number): Sphere {
  sphere.radius *= scale;
  return sphere;
}
