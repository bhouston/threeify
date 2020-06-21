import { Plane } from "./Plane";
import { Vector3 } from "./Vector3";

export function makePlaneFromNormalAndCoplanarPoint(p: Plane, normal: Vector3, point: Vector3): Plane {
  p.normal.copy(normal);
  p.constant = -point.dot(p.normal);

  return p;
}
