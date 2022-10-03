import { Plane } from './Plane';
import { planePointDistance } from './Plane.Functions';
import { Ray3 } from './Ray3';

export function rayDistanceToPlane(ray: Ray3, plane: Plane): number {
  const denominator = plane.normal.dot(ray.direction);

  if (denominator === 0) {
    // line is coplanar, return origin
    if (planePointDistance(plane, ray.origin) === 0) {
      return 0;
    }
    return Number.NaN;
  }

  const t = -(ray.origin.dot(plane.normal) + plane.constant) / denominator;
  // Return if the ray never intersects the plane
  return t >= 0 ? t : Number.NaN;
}
