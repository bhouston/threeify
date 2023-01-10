import { Box2 } from './Box2.js';
import {
  vec2Add,
  vec2Clamp,
  vec2Distance,
  vec2Equals,
  vec2Max,
  vec2Min
} from './Vec2.Functions.js';
import { Vec2 } from './Vec2.js';

export function box2Center(box: Box2, result = new Vec2()): Vec2 {
  return result.set(
    (box.min.x + box.max.x) * 0.5,
    (box.min.y + box.max.y) * 0.5
  );
}

export function box2Empty(result = new Box2()): Box2 {
  result.min.x = result.min.y = Number.POSITIVE_INFINITY;
  result.max.x = result.max.y = Number.NEGATIVE_INFINITY;

  return result;
}

export function box2IsEmpty(box: Box2): boolean {
  return box.max.x < box.min.x || box.max.y < box.min.y;
}
export function box2Union(a: Box2, b: Box2, result = new Box2()): Box2 {
  vec2Min(a.min, b.min, result.min);
  vec2Max(a.max, b.max, result.max);
  return result;
}

export function box2Translate(
  b: Box2,
  offset: Vec2,
  result = new Box2()
): Box2 {
  vec2Add(b.min, offset, result.min);
  vec2Add(b.max, offset, result.max);
  return result;
}

export function box2Equals(a: Box2, b: Box2): boolean {
  return vec2Equals(a.min, b.min) && vec2Equals(a.max, b.max);
}

export function box2FromVec2Array(points: Vec2[], result = new Box2()): Box2 {
  box2Empty(result);

  points.forEach((point) => {
    box2ExpandByPoint(result, point);
  });

  return result;
}

export function box2ExpandByPoint(b: Box2, point: Vec2): Box2 {
  vec2Min(b.min, point, b.min);
  vec2Max(b.max, point, b.max);

  return b;
}

export function box2ContainsVec2(b: Box2, point: Vec2): boolean {
  return !(
    point.x < b.min.x ||
    point.x > b.max.x ||
    point.y < b.min.y ||
    point.y > b.max.y
  );
}

export function box2ContainsBox2(b: Box2, otherBox: Box2): boolean {
  return (
    b.min.x <= otherBox.min.x &&
    otherBox.max.x <= b.max.x &&
    b.min.y <= otherBox.min.y &&
    otherBox.max.y <= b.max.y
  );
}

export function vec2ClampToBox2(
  point: Vec2,
  b: Box2,
  result = new Vec2()
): Vec2 {
  return vec2Clamp(point, b.min, b.max, result);
}

export function box2DistanceToVec2(b: Box2, point: Vec2): number {
  const clampedPoint = vec2ClampToBox2(point, b);
  return vec2Distance(clampedPoint, point);
}
