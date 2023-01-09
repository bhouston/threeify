import { Spherical } from './Spherical.js';
import { Vec3 } from './Vec3.js';

export function crossFromCoplanarPoints(
  a: Vec3,
  b: Vec3,
  c: Vec3,
  result = new Vec3()
): Vec3 {
  // TODO: replace with just number math, no classes?  Or just use temporary Vec3 objects
  result.copy(c).sub(b);
  const v = a.clone().sub(b);
  return result.cross(v);
}

export function makeVec3FromDelta(
  a: Vec3,
  b: Vec3,
  result = new Vec3()
): Vec3 {
  return result.copy(a).sub(b);
}

export function makeVec3FromSpherical(s: Spherical): Vec3 {
  return makeVec3FromSphericalCoords(s.radius, s.phi, s.theta);
}

export function makeVec3FromSphericalCoords(
  radius: number,
  phi: number,
  theta: number
): Vec3 {
  const sinPhiRadius = Math.sin(phi) * radius;

  return new Vec3(
    sinPhiRadius * Math.sin(theta),
    Math.cos(phi) * radius,
    sinPhiRadius * Math.cos(theta)
  );
}

// static/instance method to calculate barycentric coordinates
// based on: http://www.blackpawn.com/texts/pointinpoly/default.html
export function pointToBaryCoords(
  a: Vec3,
  b: Vec3,
  c: Vec3,
  point: Vec3,
  result = new Vec3()
): Vec3 {
  const v0 = makeVec3FromDelta(c, b);
  const v1 = makeVec3FromDelta(b, a);
  const v2 = makeVec3FromDelta(point, a);

  const dot00 = v0.dot(v0);
  const dot01 = v0.dot(v1);
  const dot02 = v0.dot(v2);
  const dot11 = v1.dot(v1);
  const dot12 = v1.dot(v2);

  const denom = dot00 * dot11 - dot01 * dot01;

  // collinear or singular triangle
  if (denom === 0) {
    // arbitrary location outside of triangle?
    // not sure if this is the best idea, maybe should be returning undefined
    return result.set(-2, -1, -1);
  }

  const invDenom = 1 / denom;
  const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
  const v = (dot00 * dot12 - dot01 * dot02) * invDenom;

  // barycentric coordinates must always sum to 1
  return result.set(1 - u - v, v, u);
}

export function makeVec3FromBaryCoordWeights(
  baryCoord: Vec3,
  a: Vec3,
  b: Vec3,
  c: Vec3,
  result = new Vec3()
): Vec3 {
  const v = baryCoord;
  return result.set(
    a.x * v.x + b.x * v.y + c.x * v.z,
    a.y * v.x + b.y * v.y + c.y * v.z,
    a.z * v.x + b.z * v.y + c.z * v.z
  );
}
