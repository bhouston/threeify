import { Triangle3 } from './Triangle3.js';
import {
  crossFromCoplanarPoints,
  pointToBaryCoords,
  vec3Length,
  vec3Normalize
} from './Vec3.Functions.js';
import { Vec3 } from './Vec3.js';

export function makeTriangleFromPointsAndIndices(
  points: Vec3[],
  i0: number,
  i1: number,
  i2: number,
  triangle: Triangle3 = new Triangle3()
): Triangle3 {
  triangle.set(points[i0], points[i1], points[i2]);
  return triangle;
}

export function triangleArea(t: Triangle3): number {
  // TODO: replace with just number math, no classes?  Or just use temporary Vec3 objects
  return vec3Length(crossFromCoplanarPoints(t.a, t.b, t.c)) * 0.5;
}

export function triangleMidpoint(t: Triangle3, result = new Vec3()): Vec3 {
  return result.set(
    (t.a.x + t.b.x + t.c.x) / 3,
    (t.a.y + t.b.y + t.c.y) / 3,
    (t.a.z + t.b.z + t.c.z) / 3
  );
}

export function triangleNormal(t: Triangle3, result = new Vec3()): Vec3 {
  // TODO: replace with just number math, no classes?  Or just use temporary Vec3 objects
  return vec3Normalize(crossFromCoplanarPoints(t.a, t.b, t.c, result));
}

export function trianglePointToBaryCoords(
  t: Triangle3,
  point: Vec3,
  result = new Vec3()
): Vec3 {
  return pointToBaryCoords(point, t.a, t.b, t.c, result);
}
