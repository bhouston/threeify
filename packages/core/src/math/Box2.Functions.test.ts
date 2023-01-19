import { Box2 } from './Box2';
import {
  box2Center,
  box2ContainsBox2,
  box2ContainsVec2,
  box2DistanceToVec2,
  box2Empty,
  box2Equals,
  box2ExpandByBox,
  box2ExpandByPoint,
  box2IntersectsBox2,
  box2IsEmpty,
  box2Scale,
  box2Size,
  box2Translate,
  vec2ClampToBox2
} from './Box2.Functions';
import { Vec2 } from './Vec2';
import { vec2Equals } from './Vec2.Functions';

const unit = new Box2(new Vec2(0, 0), new Vec2(1, 1));
const empty = new Box2();

describe('Box2 Functions', () => {
  test('box2Equals', () => {
    expect(box2Equals(unit, unit)).toBe(true);
    expect(box2Equals(unit, empty)).toBe(false);
  });

  test('box2Empty', () => {
    expect(box2Equals(box2Empty(), empty)).toBe(false);
  });

  test('box2IsEmpty', () => {
    console.log('unit', unit);
    expect(box2IsEmpty(unit)).toBe(false);
    console.log('empty', empty);
    expect(box2IsEmpty(empty)).toBe(true);
  });

  test('box2Translate', () => {
    expect(
      box2Equals(
        box2Translate(unit, new Vec2(1, 1)),
        new Box2(new Vec2(1, 1), new Vec2(2, 2))
      )
    ).toBe(true);
  });

  test('box2Scale', () => {
    expect(
      box2Equals(
        box2Scale(unit, new Vec2(2, 2)),
        new Box2(new Vec2(0, 0), new Vec2(2, 2))
      )
    ).toBe(true);
  });

  test('box2Center', () => {
    expect(vec2Equals(box2Center(unit), new Vec2(0.5, 0.5))).toBe(true);
  });

  test('box2Size', () => {
    expect(vec2Equals(box2Size(unit), new Vec2(1, 1))).toBe(true);
  });

  test('box2ExpandByPoint', () => {
    expect(
      box2Equals(
        box2ExpandByPoint(unit, new Vec2(2, 2)),
        new Box2(new Vec2(0, 0), new Vec2(2, 2))
      )
    ).toBe(true);
  });

  test('box2ExpandByBox', () => {
    expect(
      box2Equals(
        box2ExpandByBox(unit, new Box2(new Vec2(2, 2), new Vec2(3, 3))),
        new Box2(new Vec2(0, 0), new Vec2(3, 3))
      )
    ).toBe(true);
    expect(box2Equals(box2ExpandByBox(unit, empty), unit)).toBe(true);
    expect(box2Equals(box2ExpandByBox(empty, unit), unit)).toBe(true);
  });

  test('box2ContainsVec2', () => {
    expect(box2ContainsVec2(unit, new Vec2(0.5, 0.5))).toBe(true);
    expect(box2ContainsVec2(unit, new Vec2(1.5, 0.5))).toBe(false);
  });

  test('box2ContainsBox2', () => {
    expect(
      box2ContainsBox2(unit, new Box2(new Vec2(0.5, 0.5), new Vec2(0.6, 0.6)))
    ).toBe(true);
    expect(
      box2ContainsBox2(unit, new Box2(new Vec2(0.5, 0.5), new Vec2(1.6, 0.6)))
    ).toBe(false);
  });

  test('vec2ClampToBox2', () => {
    expect(
      vec2Equals(vec2ClampToBox2(new Vec2(0.5, 0.5), unit), new Vec2(0.5, 0.5))
    ).toBe(true);
  });

  test('box2DistanceToVec2', () => {
    expect(box2DistanceToVec2(unit, new Vec2(0.5, 0.5))).toBe(0);
    expect(box2DistanceToVec2(unit, new Vec2(1.5, 0.5))).toBe(0.5);
  });

  test('box2IntersectionBox2', () => {
    expect(
      box2IntersectsBox2(unit, new Box2(new Vec2(0.5, 0.5), new Vec2(1.5, 1.5)))
    ).toBe(true);
  });
});
