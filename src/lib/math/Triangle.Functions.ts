import { Triangle } from './Triangle';
import { Vector3 } from './Vector3';
import { crossFromCoplanarPoints, pointToBaryCoords } from './Vector3.Functions';

export function makeTriangleFromPointsAndIndices(
  points: Vector3[],
  i0: number,
  i1: number,
  i2: number,
  triangle: Triangle = new Triangle(),
): Triangle {
  triangle.set(points[i0], points[i1], points[i2]);
  return triangle;
}

export function triangleArea(t: Triangle): number {
  // TODO: replace with just number math, no classes?  Or just use temporary Vector3 objects
  return crossFromCoplanarPoints(t.a, t.b, t.c).length() * 0.5;
}

export function triangleMidpoint(t: Triangle, result = new Vector3()): Vector3 {
  return result
    .copy(t.a)
    .add(t.b)
    .add(t.c)
    .multiplyByScalar(1 / 3);
}

export function triangleNormal(t: Triangle, result = new Vector3()): Vector3 {
  // TODO: replace with just number math, no classes?  Or just use temporary Vector3 objects
  return crossFromCoplanarPoints(t.a, t.b, t.c, result).normalize();
}

export function trianglePointToBaryCoords(t: Triangle, point: Vector3, result = new Vector3()): Vector3 {
  return pointToBaryCoords(point, t.a, t.b, t.c, result);
}
