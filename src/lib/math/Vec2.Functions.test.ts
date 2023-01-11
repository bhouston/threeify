import { Vec2 } from './Vec2';
import {
  vec2Add,
  vec2Clamp,
  vec2Delta,
  vec2Distance,
  vec2DistanceSq,
  vec2Dot,
  vec2Equals,
  vec2Length,
  vec2LengthSq,
  vec2Lerp,
  vec2Max,
  vec2Min,
  vec2MultiplyByScalar,
  vec2Normalize,
  vec2Subtract
} from './Vec2.Functions';

describe('Vec2 Functions', () => {
  test('vec2Delta', () => {
    const a = new Vec2(1, 2);
    const b = new Vec2(4, 5);
    const c = vec2Delta(a, b);
    expect(c).toBe(6);
  });

  test('vec2Add', () => {
    const a = new Vec2(1, 2);
    const b = new Vec2(4, 5);
    const c = vec2Add(a, b);
    expect(c.x).toBe(5);
    expect(c.y).toBe(7);
  });

  test('vec2Subtract', () => {
    const a = new Vec2(1, 2);
    const b = new Vec2(4, 5);
    const c = vec2Subtract(a, b);
    expect(c.x).toBe(-3);
    expect(c.y).toBe(-3);
  });

  test('vec2MultiplyByScalar', () => {
    const a = new Vec2(1, 2);
    const b = vec2MultiplyByScalar(a, 2);
    expect(b.x).toBe(2);
    expect(b.y).toBe(4);
  });

  test('vec2Dot', () => {
    const a = new Vec2(1, 2);
    const b = new Vec2(4, 5);
    const c = vec2Dot(a, b);
    expect(c).toBe(14);
  });

  test('vec2Length', () => {
    const a = new Vec2(1, 2);
    const b = vec2Length(a);
    expect(b).toBe(Math.sqrt(5));
  });

  test('vec2LengthSq', () => {
    const a = new Vec2(1, 2);
    const b = vec2LengthSq(a);
    expect(b).toBe(5);
  });

  test('vec2Normalize', () => {
    const a = new Vec2(1, 2);
    const b = vec2Normalize(a);
    expect(b.x).toBe(1 / Math.sqrt(5));
    expect(b.y).toBe(2 / Math.sqrt(5));
  });

  test('vec2Distance', () => {
    const a = new Vec2(1, 2);
    const b = new Vec2(4, 5);
    const c = vec2Distance(a, b);
    expect(c).toBe(Math.sqrt(18));
  });

  test('vec2DistanceSq', () => {
    const a = new Vec2(1, 2);
    const b = new Vec2(4, 5);
    const c = vec2DistanceSq(a, b);
    expect(c).toBe(18);
  });

  test('vec2Equals', () => {
    const a = new Vec2(1, 2);
    const b = new Vec2(4, 5);
    const c = new Vec2(1, 2);
    expect(vec2Equals(a, b)).toBe(false);
    expect(vec2Equals(a, c)).toBe(true);
  });

  test('vec2Lerp', () => {
    const a = new Vec2(1, 2);
    const b = new Vec2(4, 5);
    const c = vec2Lerp(a, b, 0.5);
    expect(c.x).toBe(2.5);
    expect(c.y).toBe(3.5);
  });

  test('vec2Max', () => {
    const a = new Vec2(1, 2);
    const b = new Vec2(4, 5);
    const c = vec2Max(a, b);
    expect(c.x).toBe(4);
    expect(c.y).toBe(5);
  });

  test('vec2Min', () => {
    const a = new Vec2(1, 2);
    const b = new Vec2(4, 5);
    const c = vec2Min(a, b);
    expect(c.x).toBe(1);
    expect(c.y).toBe(2);
  });

  test('vec2Clamp', () => {
    const a = new Vec2(1, 2);
    const b = new Vec2(4, 5);
    const c = new Vec2(0, 9);
    const d = vec2Clamp(c, a, b);
    expect(d.x).toBe(1);
    expect(d.y).toBe(5);
  });

  test('vec2Normalize', () => {
    const a = new Vec2(1, 2);
    const b = vec2Normalize(a);
    expect(b.x).toBe(1 / Math.sqrt(5));
    expect(b.y).toBe(2 / Math.sqrt(5));
  });
});
