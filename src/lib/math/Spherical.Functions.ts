import { Spherical } from './Spherical.js';
import { Vec3 } from './Vec3.js';

export function makeSphericalFromVec3(
  v: Vec3,
  result = new Spherical()
): Spherical {
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
