import { Spherical } from "./Spherical";
import { Vector3 } from "./Vector3";

export function makeSphericalFromVector3(s: Spherical, v: Vector3): Spherical {
  s.radius = v.length();

  if (s.radius === 0) {
    s.theta = 0;
    s.phi = 0;
  } else {
    s.theta = Math.atan2(v.x, v.z);
    s.phi = Math.acos(Math.min(Math.max(v.y / s.radius, -1), 1));
  }

  return s;
}
