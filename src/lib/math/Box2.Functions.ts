import { Box2 } from "./Box2";
import { Vector2 } from "./Vector2";

export function makeBox2FromPoints(points: Vector2[], result = new Box2()): Box2 {
  result.makeEmpty();

  points.forEach((point) => {
    expandBox2ByPoint(result, point);
  });

  return result;
}

export function expandBox2ByPoint(b: Box2, point: Vector2): Box2 {
  b.min.min(point);
  b.max.max(point);

  return b;
}

export function box2ContainsVector2(b: Box2, point: Vector2): boolean {
  return !(point.x < b.min.x || point.x > b.max.x || point.y < b.min.y || point.y > b.max.y);
}

export function box2ContainsBox2(b: Box2, otherBox: Box2): boolean {
  return (
    b.min.x <= otherBox.min.x && otherBox.max.x <= b.max.x && b.min.y <= otherBox.min.y && otherBox.max.y <= b.max.y
  );
}

export function clampVector2ToBox2(b: Box2, point: Vector2): Vector2 {
  return new Vector2().copy(point).clamp(b.min, b.max);
}

export function distanceBox2ToVector2(b: Box2, point: Vector2): number {
  const clampedPoint = new Vector2().copy(point).clamp(b.min, b.max);
  return clampedPoint.sub(point).length();
}
