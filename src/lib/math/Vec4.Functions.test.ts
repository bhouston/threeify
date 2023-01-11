import { Vec4 } from './Vec4';
import {
  vec4Add,
  vec4Delta,
  vec4Distance,
  vec4DistanceSq,
  vec4Dot,
  vec4Equals,
  vec4Length,
  vec4LengthSq,
  vec4Lerp,
  vec4Max,
  vec4Min,
  vec4MultiplyByScalar,
  vec4Negate,
  vec4Normalize,
  vec4Subtract
} from './Vec4.Functions';

describe('Vec4 Functions', () => {
  test('vec4Delta', () => {
    const a = new Vec4(1, 2, 3, 4);
    const b = new Vec4(4, 5, 6, 7);
    const c = vec4Delta(a, b);
    expect(c).toBe(12);
  });

  test('vec4Distance', () => {
    const a = new Vec4(1, 2, 3, 4);
    const b = new Vec4(4, 5, 6, 7);
    const c = vec4Distance(a, b);
    expect(c).toBeCloseTo(Math.sqrt(4 * 9));
  });

  test('vec4Dot', () => {
    const a = new Vec4(1, 2, 3, 4);
    const b = new Vec4(4, 5, 6, 7);
    const c = vec4Dot(a, b);
    expect(c).toBe(60);
  });

  test('vec4Length', () => {
    const a = new Vec4(1, 2, 3, 4);
    const b = vec4Length(a);
    expect(b).toBeCloseTo(5.477225575051661);
  });

  test('vec4Lerp', () => {
    const a = new Vec4(1, 2, 3, 4);
    const b = new Vec4(4, 5, 6, 7);
    const c = vec4Lerp(a, b, 0.5);
    expect(c.x).toBe(2.5);
    expect(c.y).toBe(3.5);
    expect(c.z).toBe(4.5);
    expect(c.w).toBe(5.5);
  });

  test('vec4Max', () => {
    const a = new Vec4(1, 2, 3, 4);
    const b = new Vec4(4, 5, 6, 7);
    const c = vec4Max(a, b);
    expect(c.x).toBe(4);
    expect(c.y).toBe(5);
    expect(c.z).toBe(6);
    expect(c.w).toBe(7);
  });
  test('vec4Min', () => {
    const a = new Vec4(1, 2, 3, 4);
    const b = new Vec4(4, 5, 6, 7);
    const c = vec4Min(a, b);
    expect(c.x).toBe(1);
    expect(c.y).toBe(2);
    expect(c.z).toBe(3);
    expect(c.w).toBe(4);
  });
  test('vec4Normalize', () => {
    const a = new Vec4(1, 2, 3, 4);
    const b = vec4Normalize(a);
    expect(b.x).toBeCloseTo(0.18257418583505536);
    expect(b.y).toBeCloseTo(0.3651483716701107);
    expect(b.z).toBeCloseTo(0.5477225575051661);
    expect(b.w).toBeCloseTo(0.7302967433402214);
  });

  test('vec4MultiplyByScalar', () => {
    const a = new Vec4(1, 2, 3, 4);
    const b = vec4MultiplyByScalar(a, 2);
    expect(b.x).toBe(2);
    expect(b.y).toBe(4);
    expect(b.z).toBe(6);
    expect(b.w).toBe(8);
  });

  test('vec4Length', () => {
    const a = new Vec4(1, 2, 3, 4);
    const b = vec4Length(a);
    expect(b).toBeCloseTo(5.477225575051661);
  });

  test('vec4LengthSq', () => {
    const a = new Vec4(1, 2, 3, 4);
    const b = vec4LengthSq(a);
    expect(b).toBe(30);
  });

  test('vec4DistanceSq', () => {
    const a = new Vec4(1, 2, 3, 4);
    const b = new Vec4(4, 5, 6, 7);
    const c = vec4DistanceSq(a, b);
    expect(c).toBe(4 * 9);
  });

  test('vec4Add', () => {
    const a = new Vec4(1, 2, 3, 4);
    const b = new Vec4(4, 5, 6, 7);
    const c = vec4Add(a, b);
    expect(c.x).toBe(5);
    expect(c.y).toBe(7);
    expect(c.z).toBe(9);
    expect(c.w).toBe(11);
  });

  test('vec4Subtract', () => {
    const a = new Vec4(1, 2, 3, 4);
    const b = new Vec4(4, 5, 6, 7);
    const c = vec4Subtract(a, b);
    expect(c.x).toBe(-3);
    expect(c.y).toBe(-3);
    expect(c.z).toBe(-3);
    expect(c.w).toBe(-3);
  });

  test('vec4Negate', () => {
    const a = new Vec4(1, 2, 3, 4);
    const b = vec4Negate(a);
    expect(b.x).toBe(-1);
    expect(b.y).toBe(-2);
    expect(b.z).toBe(-3);
    expect(b.w).toBe(-4);
  });

  test('vec4Equals', () => {
    const a = new Vec4(1, 2, 3, 4);
    const b = new Vec4(4, 5, 6, 7);
    const c = new Vec4(1, 2, 3, 4);
    expect(vec4Equals(a, b)).toBe(false);
    expect(vec4Equals(a, c)).toBe(true);
  });
});
