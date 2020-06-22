import { Vector3 } from "./Vector3";

export function crossFromCoplanarPoints(a: Vector3, b: Vector3, c: Vector3, result = new Vector3()): Vector3 {
  // TODO: replace with just number math, no classes?  Or just use temporary Vector3 objects
  result.copy(c).sub(b);
  const v = a.clone().sub(b);
  return result.cross(v);
}

export function makeVector3FromDelta(a: Vector3, b: Vector3, result = new Vector3()): Vector3 {
  return result.copy(a).sub(b);
}

// static/instance method to calculate barycentric coordinates
// based on: http://www.blackpawn.com/texts/pointinpoly/default.html
export function pointToBaryCoords(a: Vector3, b: Vector3, c: Vector3, point: Vector3, result = new Vector3()): Vector3 {
  const v0 = makeVector3FromDelta(c, b);
  const v1 = makeVector3FromDelta(b, a);
  const v2 = makeVector3FromDelta(point, a);

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

export function makeVector3FromBaryCoordWeights(
  BaryCoord: Vector3,
  a: Vector3,
  b: Vector3,
  c: Vector3,
  result = new Vector3(),
): Vector3 {
  result.x = a.x * BaryCoord.x + b.x * BaryCoord.y + c.x * BaryCoord.z;
  result.y = a.y * BaryCoord.x + b.y * BaryCoord.y + c.y * BaryCoord.z;
  result.z = a.z * BaryCoord.x + b.z * BaryCoord.y + c.z * BaryCoord.z;
  return result;
}
