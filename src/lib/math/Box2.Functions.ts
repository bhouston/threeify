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

export function box2Equals(a: Box2, b: Box2): boolean {
  return vec2Equals(a.min, b.min) && vec2Equals(a.max, b.max);
}

export function box2Empty(result = new Box2()): Box2 {
  result.min.x = result.min.y = Number.POSITIVE_INFINITY;
  result.max.x = result.max.y = Number.NEGATIVE_INFINITY;

  return result;
}

export function box2IsEmpty(box: Box2): boolean {
  return box.max.x < box.min.x || box.max.y < box.min.y;
}
export function box2ExpandByBox(a: Box2, b: Box2, result = new Box2()): Box2 {
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

export function box2Scale(b: Box2, scale: Vec2, result = new Box2()): Box2 {
  result.min.x = b.min.x * scale.x;
  result.min.y = b.min.y * scale.y;
  result.max.x = b.max.x * scale.x;
  result.max.y = b.max.y * scale.y;
  return result;
}

export function box2Size(b: Box2, result = new Vec2()): Vec2 {
  return result.set(b.max.x - b.min.x, b.max.y - b.min.y);
}

export function box2Center(box: Box2, result = new Vec2()): Vec2 {
  return result.set(
    (box.min.x + box.max.x) * 0.5,
    (box.min.y + box.max.y) * 0.5
  );
}

export function box2FromVec2Array(points: Vec2[], result = new Box2()): Box2 {
  box2Empty(result);

  points.forEach((point) => {
    box2ExpandByPoint(result, point);
  });

  return result;
}

export function box2ExpandByPoint(
  b: Box2,
  point: Vec2,
  result = new Box2()
): Box2 {
  vec2Min(b.min, point, result.min);
  vec2Max(b.max, point, result.max);
  return result;
}

export function box2ExpandByScalar(
  b: Box2,
  scalar: number,
  result = new Box2()
): Box2 {
  result.min.x = b.min.x - scalar;
  result.min.y = b.min.y - scalar;
  result.max.x = b.max.x + scalar;
  result.max.y = b.max.y + scalar;
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
  console.log('point', point);
  console.log('b', b);
  const clampedPoint = vec2ClampToBox2(point, b);
  console.log('clampedPoint', clampedPoint);
  const distance = vec2Distance(clampedPoint, point);
  console.log('distance', distance);
  return distance;
}

export function box2IntersectsBox2(a: Box2, b: Box2): boolean {
  return (
    a.min.x <= b.max.x &&
    a.max.x >= b.min.x &&
    a.min.y <= b.max.y &&
    a.max.y >= b.min.y
  );
}

export function box2DistanceToBox2(a: Box2, b: Box2): number {
  const clampedPoint = vec2ClampToBox2(box2Center(a), b);
  return vec2Distance(clampedPoint, box2Center(a));
}
