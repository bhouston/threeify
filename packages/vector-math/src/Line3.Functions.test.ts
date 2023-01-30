import { Line3 } from './Line3';
import {
  line3At,
  line3ClosestPoint,
  line3Delta,
  line3Invert,
  line3Length,
  line3LengthSq,
  line3Midpoint,
  mat4TransformLine3
} from './Line3.Functions';
import { Mat4 } from './Mat4';
import { Vec3 } from './Vec3';

describe('Line3 Functions', () => {
  test('line3Delta', () => {
    const a = new Line3(new Vec3(1, 2, 3), new Vec3(4, 5, 6));
    const b = new Line3(new Vec3(7, 8, 9), new Vec3(10, 11, 12));
    expect(line3Delta(a, b)).toBeCloseTo(36);
  });

  test('line3Length', () => {
    const a = new Line3(new Vec3(1, 2, 3), new Vec3(4, 5, 6));
    expect(line3Length(a)).toBeCloseTo(5.1961524227);
  });

  test('line3LengthSq', () => {
    const a = new Line3(new Vec3(1, 2, 3), new Vec3(4, 5, 6));
    expect(line3LengthSq(a)).toBeCloseTo(27);
  });

  test('line3Midpoint', () => {
    const a = new Line3(new Vec3(1, 2, 3), new Vec3(4, 5, 6));
    const b = line3Midpoint(a);
    expect(b.x).toBeCloseTo(2.5);
    expect(b.y).toBeCloseTo(3.5);
    expect(b.z).toBeCloseTo(4.5);
  });

  test('line3At', () => {
    const a = new Line3(new Vec3(1, 2, 3), new Vec3(4, 5, 6));
    const b = line3At(a, 0.5);
    expect(b.x).toBeCloseTo(2.5);
    expect(b.y).toBeCloseTo(3.5);
    expect(b.z).toBeCloseTo(4.5);
  });

  test('line3Invert', () => {
    const a = new Line3(new Vec3(1, 2, 3), new Vec3(4, 5, 6));
    const b = line3Invert(a);
    expect(b.start.x).toBeCloseTo(4);
    expect(b.start.y).toBeCloseTo(5);
    expect(b.start.z).toBeCloseTo(6);
    expect(b.end.x).toBeCloseTo(1);
    expect(b.end.y).toBeCloseTo(2);
    expect(b.end.z).toBeCloseTo(3);
  });

  test('line3ClosestPoint', () => {
    const a = new Line3(new Vec3(0, 0, 0), new Vec3(1, 0, 0));
    const b = new Vec3(7, 8, 9);
    const c = line3ClosestPoint(a, b, true);
    expect(c.x).toBeCloseTo(1);
    expect(c.y).toBeCloseTo(0);
    expect(c.z).toBeCloseTo(0);
    const d = line3ClosestPoint(a, b, false);
    expect(d.x).toBeCloseTo(7);
    expect(d.y).toBeCloseTo(0);
    expect(d.z).toBeCloseTo(0);
  });

  test('mat4TransformLine3', () => {
    const a = new Mat4();
    const b = new Line3(new Vec3(1, 2, 3), new Vec3(4, 5, 6));
    const c = mat4TransformLine3(a, b);
    expect(c.start.x).toBeCloseTo(1);
    expect(c.start.y).toBeCloseTo(2);
    expect(c.start.z).toBeCloseTo(3);
    expect(c.end.x).toBeCloseTo(4);
    expect(c.end.y).toBeCloseTo(5);
    expect(c.end.z).toBeCloseTo(6);
  });
});
