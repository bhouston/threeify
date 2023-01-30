// a set of ts-jest unit tests that ensure the correct functionality of the class Box2

import { Box2 } from './Box2.js';
import { Vec2 } from './Vec2.js';

describe('Box2', () => {
  test('constructor', () => {
    const box = new Box2();
    expect(box.min.x).toBe(Number.POSITIVE_INFINITY);
    expect(box.min.y).toBe(Number.POSITIVE_INFINITY);
    expect(box.max.x).toBe(Number.NEGATIVE_INFINITY);
    expect(box.max.y).toBe(Number.NEGATIVE_INFINITY);
  });
  test('constructor with values', () => {
    const box = new Box2(new Vec2(1, 2), new Vec2(3, 4));
    expect(box.min.x).toBe(1);
    expect(box.min.y).toBe(2);
    expect(box.max.x).toBe(3);
    expect(box.max.y).toBe(4);
  });
  test('clone', () => {
    const box = new Box2(new Vec2(1, 2), new Vec2(3, 4));
    const box2 = box.clone();
    expect(box2.min.x).toBe(1);
    expect(box2.min.y).toBe(2);
    expect(box2.max.x).toBe(3);
    expect(box2.max.y).toBe(4);
  });
  test('copy', () => {
    const box = new Box2(new Vec2(1, 2), new Vec2(3, 4));
    const box2 = new Box2();
    box2.copy(box);
    expect(box2.min.x).toBe(1);
    expect(box2.min.y).toBe(2);
    expect(box2.max.x).toBe(3);
    expect(box2.max.y).toBe(4);
  });
  test('x,y,width,height', () => {
    const box = new Box2(new Vec2(1, 2), new Vec2(4, 6));
    expect(box.x).toBe(1);
    expect(box.y).toBe(2);
    expect(box.width).toBe(3);
    expect(box.height).toBe(4);
  });
});
