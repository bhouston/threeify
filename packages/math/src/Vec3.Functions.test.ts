import { Vec3 } from './Vec3';
import {
  vec3Add,
  vec3Delta,
  vec3Distance,
  vec3DistanceSq,
  vec3Dot,
  vec3Equals,
  vec3Length,
  vec3LengthSq,
  vec3Lerp,
  vec3Max,
  vec3Min,
  vec3MultiplyByScalar,
  vec3Negate,
  vec3Normalize,
  vec3Subtract
} from './Vec3.Functions';

describe('Vec3 Functions', () => {
  test('vec3Add', () => {
    const a = new Vec3(1, 2, 3);
    const b = new Vec3(4, 5, 6);
    const c = vec3Add(a, b);
    expect(c).toEqual(new Vec3(5, 7, 9));
  });
  test('vec3Delta', () => {
    const a = new Vec3(1, 2, 3);
    const b = new Vec3(4, 5, 6);
    const c = vec3Delta(a, b);
    expect(c).toEqual(9);
  });
  test('vec3Distance', () => {
    const a = new Vec3(1, 2, 3);
    const b = new Vec3(4, 5, 6);
    const c = vec3Distance(a, b);
    expect(c).toBeCloseTo(5.196152);
  });
  test('vec3DistanceSq', () => {
    const a = new Vec3(1, 2, 3);
    const b = new Vec3(4, 5, 6);
    const c = vec3DistanceSq(a, b);
    expect(c).toBeCloseTo(27);
  });
  test('vec3Dot', () => {
    const a = new Vec3(1, 2, 3);
    const b = new Vec3(4, 5, 6);
    const c = vec3Dot(a, b);
    expect(c).toBeCloseTo(32);
  });
  test('vec3Equals', () => {
    const a = new Vec3(1, 2, 3);
    const b = new Vec3(1, 2, 3);
    const c = vec3Equals(a, b);
    expect(c).toBe(true);
  });
  test('vec3Length', () => {
    const a = new Vec3(1, 2, 3);
    const c = vec3Length(a);
    expect(c).toBeCloseTo(3.741657);
  });
  test('vec3LengthSq', () => {
    const a = new Vec3(1, 2, 3);
    const c = vec3LengthSq(a);
    expect(c).toBeCloseTo(14);
  });
  test('vec3Lerp', () => {
    const a = new Vec3(1, 2, 3);
    const b = new Vec3(4, 5, 6);
    const c = vec3Lerp(a, b, 0.5);
    expect(c).toEqual(new Vec3(2.5, 3.5, 4.5));
  });
  test('vec3Max', () => {
    const a = new Vec3(1, 2, 3);
    const b = new Vec3(4, 5, 6);
    const c = vec3Max(a, b);
    expect(c).toEqual(new Vec3(4, 5, 6));
  });
  test('vec3Min', () => {
    const a = new Vec3(1, 2, 3);
    const b = new Vec3(4, 5, 6);
    const c = vec3Min(a, b);
    expect(c).toEqual(new Vec3(1, 2, 3));
  });
  test('vec3MultiplyByScalar', () => {
    const a = new Vec3(1, 2, 3);
    const c = vec3MultiplyByScalar(a, 2);
    expect(c).toEqual(new Vec3(2, 4, 6));
  });
  test('vec3Negate', () => {
    const a = new Vec3(1, 2, 3);
    const c = vec3Negate(a);
    expect(c).toEqual(new Vec3(-1, -2, -3));
  });
  test('vec3Normalize', () => {
    const a = new Vec3(1, 2, 3);
    const c = vec3Normalize(a);
    expect(c.x).toBeCloseTo(0.267261);
    expect(c.y).toBeCloseTo(0.534522);
    expect(c.z).toBeCloseTo(0.801784);
  });
  test('vec3Subtract', () => {
    const a = new Vec3(1, 2, 3);
    const b = new Vec3(4, 5, 6);
    const c = vec3Subtract(a, b);
    expect(c).toEqual(new Vec3(-3, -3, -3));
  });
});
