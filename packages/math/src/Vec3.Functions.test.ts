import { Vec3 } from './Vec3';
import {
  vec3Add,
  vec3Angle,
  vec3Clamp,
  vec3Cross,
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
  vec3Normalize,
  vec3Project,
  vec3Reflect,
  vec3Subtract
} from './Vec3.Functions';

describe('Vec3 Functions', () => {
  test('vec3Delta', () => {
    const a = new Vec3(1, 2, 3);
    const b = new Vec3(4, 5, 6);
    const c = vec3Delta(a, b);
    expect(c).toBe(9);
  });
  test('vec3Add', () => {
    const a = new Vec3(1, 2, 3);
    const b = new Vec3(4, 5, 6);
    const c = vec3Add(a, b);
    expect(c.x).toBe(5);
    expect(c.y).toBe(7);
    expect(c.z).toBe(9);
  });
  test('vec3Subtract', () => {
    const a = new Vec3(1, 2, 3);
    const b = new Vec3(4, 5, 6);
    const c = vec3Subtract(a, b);
    expect(c.x).toBe(-3);
    expect(c.y).toBe(-3);
    expect(c.z).toBe(-3);
  });
  test('vec3MultiplyByScalar', () => {
    const a = new Vec3(1, 2, 3);
    const b = vec3MultiplyByScalar(a, 2);
    expect(b.x).toBe(2);
    expect(b.y).toBe(4);
    expect(b.z).toBe(6);
  });
  test('vec3Dot', () => {
    const a = new Vec3(1, 2, 3);
    const b = new Vec3(4, 5, 6);
    const c = vec3Dot(a, b);
    expect(c).toBe(32);
  });
  test('vec3Length', () => {
    const a = new Vec3(1, 2, 3);
    const b = vec3Length(a);
    expect(b).toBe(Math.sqrt(14));
  });
  test('vec3LengthSq', () => {
    const a = new Vec3(1, 2, 3);
    const b = vec3LengthSq(a);
    expect(b).toBe(14);
  });
  test('vec3Normalize', () => {
    const a = new Vec3(1, 2, 3);
    const b = vec3Normalize(a);
    expect(b.x).toBe(1 / Math.sqrt(14));
    expect(b.y).toBe(2 / Math.sqrt(14));
    expect(b.z).toBe(3 / Math.sqrt(14));
  });
  test('vec3Cross', () => {
    const a = new Vec3(1, 2, 3);
    const b = new Vec3(4, 5, 6);
    const c = vec3Cross(a, b);
    expect(c.x).toBe(-3);
    expect(c.y).toBe(6);
    expect(c.z).toBe(-3);
  });
  test('vec3Project', () => {
    const a = new Vec3(1, 2, 3);
    const b = new Vec3(1, 0, 0);
    const c = vec3Project(a, b);
    expect(c.x).toBe(1);
    expect(c.y).toBe(0);
    expect(c.z).toBe(0);
  });
  test('vec3Reflect', () => {
    const a = new Vec3(0, 0, 1);
    const b = new Vec3(0, 0, -1);
    const c = vec3Reflect(b, a);
    expect(c.x).toBe(0);
    expect(c.y).toBe(0);
    expect(c.z).toBe(1);
  });
  test('vec3Angle', () => {
    const a = new Vec3(1, 2, 3);
    const b = new Vec3(4, 5, 6);
    const c = vec3Angle(a, b);
    expect(c).toBe(Math.acos(32 / (Math.sqrt(14) * Math.sqrt(77))));
  });
  test('vec3Distance', () => {
    const a = new Vec3(1, 2, 3);
    const b = new Vec3(4, 5, 6);
    const c = vec3Distance(a, b);
    expect(c).toBe(Math.sqrt(27));
  });
  test('vec3DistanceSq', () => {
    const a = new Vec3(1, 2, 3);
    const b = new Vec3(4, 5, 6);
    const c = vec3DistanceSq(a, b);
    expect(c).toBe(27);
  });
  test('vec3Lerp', () => {
    const a = new Vec3(1, 2, 3);
    const b = new Vec3(4, 5, 6);
    const c = vec3Lerp(a, b, 0.5);
    expect(c.x).toBe(2.5);
    expect(c.y).toBe(3.5);
    expect(c.z).toBe(4.5);
  });
  test('vec3Min', () => {
    const a = new Vec3(1, 2, 3);
    const b = new Vec3(4, 5, 6);
    const c = vec3Min(a, b);
    expect(c.x).toBe(1);
    expect(c.y).toBe(2);
    expect(c.z).toBe(3);
  });
  test('vec3Max', () => {
    const a = new Vec3(1, 2, 3);
    const b = new Vec3(4, 5, 6);
    const c = vec3Max(a, b);
    expect(c.x).toBe(4);
    expect(c.y).toBe(5);
    expect(c.z).toBe(6);
  });
  test('vec3Clamp', () => {
    const a = new Vec3(1, 2, 3);
    const b = new Vec3(4, 5, 6);
    const c = new Vec3(2, 3, 4);
    const d = vec3Clamp(c, a, b);
    expect(d.x).toBe(2);
    expect(d.y).toBe(3);
    expect(d.z).toBe(4);
  });
  test('vec3Equals', () => {
    const a = new Vec3(1, 2, 3);
    const b = new Vec3(4, 5, 6);
    const c = new Vec3(1, 2, 3);
    expect(vec3Equals(a, b)).toBe(false);
    expect(vec3Equals(a, c)).toBe(true);
  });
});
