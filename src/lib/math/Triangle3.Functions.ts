import { Triangle3 } from './Triangle3.js';
import {
  crossFromCoplanarPoints,
  pointToBaryCoords
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
  return crossFromCoplanarPoints(t.a, t.b, t.c).length() * 0.5;
}

export function triangleMidpoint(
  t: Triangle3,
  result = new Vec3()
): Vec3 {
  return result
    .copy(t.a)
    .add(t.b)
    .add(t.c)
    .multiplyByScalar(1 / 3);
}

export function triangleNormal(t: Triangle3, result = new Vec3()): Vec3 {
  // TODO: replace with just number math, no classes?  Or just use temporary Vec3 objects
  return crossFromCoplanarPoints(t.a, t.b, t.c, result).normalize();
}

export function trianglePointToBaryCoords(
  t: Triangle3,
  point: Vec3,
  result = new Vec3()
): Vec3 {
  return pointToBaryCoords(point, t.a, t.b, t.c, result);
}
