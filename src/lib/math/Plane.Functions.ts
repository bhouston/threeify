import { Plane } from "./Plane";
import { Sphere } from "./Sphere";
import { Vector3 } from "./Vector3";

export function makePlaneFromNormalAndCoplanarPoint(p: Plane, normal: Vector3, point: Vector3): Plane {
  p.normal.copy(normal);
  p.constant = -point.dot(p.normal);

  return p;
}

export function planePointDistance(plane: Plane, point: Vector3): number {
  return plane.normal.dot(point) + plane.constant;
}

export function planeSphereDistance(plane: Plane, sphere: Sphere): number {
  return planePointDistance(plane, sphere.center) - sphere.radius;
}

export function projectPointOntoPlane(point: Vector3, plane: Plane): Vector3 {
  const v = point.clone();
  return point.copy(plane.normal).multiplyByScalar(-planePointDistance(plane, v)).add(v);
}
