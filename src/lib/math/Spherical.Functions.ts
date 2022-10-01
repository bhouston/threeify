import { Spherical } from './Spherical';
import { Vector3 } from './Vector3';

export function makeSphericalFromVector3(v: Vector3, result = new Spherical()): Spherical {
  result.radius = v.length();

  if (result.radius === 0) {
    result.theta = 0;
    result.phi = 0;
  } else {
    result.theta = Math.atan2(v.x, v.z);
    result.phi = Math.acos(Math.min(Math.max(v.y / result.radius, -1), 1));
  }

  return result;
}
